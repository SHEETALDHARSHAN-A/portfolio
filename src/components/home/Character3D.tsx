"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader, DRACOLoader, RGBELoader } from "three-stdlib";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { typingBoneNames, eyebrowBoneNames } from "@/data/boneData";

gsap.registerPlugin(ScrollTrigger);

// --- Decryption Utility ---
async function generateAESKey(password: string): Promise<CryptoKey> {
    const passwordBuffer = new TextEncoder().encode(password);
    const hashedPassword = await crypto.subtle.digest("SHA-256", passwordBuffer);
    return crypto.subtle.importKey("raw", hashedPassword.slice(0, 32), { name: "AES-CBC" }, false, ["encrypt", "decrypt"]);
}

async function decryptFile(url: string, password: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    const encryptedData = await response.arrayBuffer();
    const iv = new Uint8Array(encryptedData.slice(0, 16));
    const data = encryptedData.slice(16);
    const key = await generateAESKey(password);
    return crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data);
}

// --- Animation Filtering ---
const filterAnimationTracks = (clip: THREE.AnimationClip, boneNames: string[]): THREE.AnimationClip => {
    const filteredTracks = clip.tracks.filter((track) => boneNames.some((boneName) => track.name.includes(boneName)));
    return new THREE.AnimationClip(clip.name + "_filtered", clip.duration, filteredTracks);
};

const createBoneAction = (gltf: any, mixer: THREE.AnimationMixer, clipName: string, boneNames: string[]): THREE.AnimationAction | null => {
    const AnimationClip = THREE.AnimationClip.findByName(gltf.animations, clipName);
    if (!AnimationClip) return null;
    const filteredClip = filterAnimationTracks(AnimationClip, boneNames);
    return mixer.clipAction(filteredClip);
};

export const Character3D = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !wrapperRef.current) return;

        const wrapper = wrapperRef.current;
        const container = containerRef.current;

        // Use container dimensions for sizing
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Init Scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(14.5, width / height, 0.1, 1000);
        camera.position.set(0, 13.1, 24.7);
        camera.zoom = 1.1;
        camera.updateProjectionMatrix();

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;

        if (container.firstChild) container.removeChild(container.firstChild);
        container.appendChild(renderer.domElement);

        // Lighting
        const directionalLight = new THREE.DirectionalLight(0xc7a9ff, 0);
        directionalLight.position.set(-0.47, -0.32, -1);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xc2a4ff, 0, 100, 3);
        pointLight.position.set(3, 12, 4);
        scene.add(pointLight);

        new RGBELoader().setPath("/models/").load("char_enviorment.hdr", (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture;
            scene.environmentIntensity = 0;
            scene.environmentRotation.set(5.76, 85.85, 1);
        });

        // Setup Decryption & Loading
        let mixer: THREE.AnimationMixer;
        let headBone: THREE.Object3D | null = null;
        let neckBone: THREE.Object3D | null = null;
        let screenLight: any | null = null;
        let monitor: any = null;
        const clock = new THREE.Clock();

        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/draco/");
        loader.setDRACOLoader(dracoLoader);

        let intensity = 0;
        setInterval(() => { intensity = Math.random(); }, 200);

        const initCharacter = async () => {
            try {
                const encryptedBlob = await decryptFile("/models/character.enc", "Character3D#@");
                const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

                loader.load(blobUrl, (gltf) => {
                    const character = gltf.scene;
                    scene.add(character);

                    character.traverse((child: any) => {
                        if (child.isMesh) {
                            child.castShadow = false;
                            child.receiveShadow = false;
                            child.frustumCulled = true;
                            if (child.material && !Array.isArray(child.material)) {
                                (child.material as THREE.ShaderMaterial).precision = "mediump";
                            }
                        }
                    });

                    // Screen and monitor processing from reference
                    character.children.forEach((object: any) => {
                        if (object.name === "Plane004") {
                            object.children.forEach((child: any) => {
                                child.material.transparent = true;
                                child.material.opacity = 0;
                                if (child.material.name === "Material.027") {
                                    monitor = child;
                                    child.material.color.set("#FFFFFF");
                                }
                            });
                        }
                        if (object.name === "screenlight") {
                            object.material.transparent = true;
                            object.material.opacity = 0;
                            object.material.emissive.set("#C8BFFF");
                            gsap.timeline({ repeat: -1, repeatRefresh: true }).to(object.material, {
                                emissiveIntensity: () => intensity * 8,
                                duration: () => Math.random() * 0.6,
                                delay: () => Math.random() * 0.1,
                            });
                            screenLight = object;
                        }
                    });

                    // Feet positioning
                    const footR = character.getObjectByName("footR");
                    const footL = character.getObjectByName("footL");
                    if (footR) footR.position.y = 3.36;
                    if (footL) footL.position.y = 3.36;

                    headBone = character.getObjectByName("spine006") || null;
                    neckBone = character.getObjectByName("spine005") || null;

                    // Animations Setup
                    mixer = new THREE.AnimationMixer(character);
                    if (gltf.animations) {
                        const introClip = gltf.animations.find(c => c.name === "introAnimation");
                        if (introClip) {
                            const introAction = mixer.clipAction(introClip);
                            introAction.setLoop(THREE.LoopOnce, 1);
                            introAction.clampWhenFinished = true;
                            introAction.play();
                        }
                        ["key1", "key2", "key5", "key6"].forEach(name => {
                            const clip = THREE.AnimationClip.findByName(gltf.animations, name);
                            if (clip) {
                                const action = mixer.clipAction(clip);
                                action.play();
                                action.timeScale = 1.2;
                            }
                        });
                        const typingAction = createBoneAction(gltf, mixer, "typing", typingBoneNames);
                        if (typingAction) {
                            typingAction.enabled = true;
                            typingAction.play();
                            typingAction.timeScale = 1.2;
                        }

                        setTimeout(() => {
                            const blink = gltf.animations.find(c => c.name === "Blink");
                            if (blink) mixer.clipAction(blink).play().fadeIn(0.5);
                        }, 2500);
                    }

                    // Initial Lights
                    gsap.to(scene, { environmentIntensity: 0.64, duration: 2, ease: "power2.inOut" });
                    gsap.to(directionalLight, { intensity: 1, duration: 2, ease: "power2.inOut" });

                    // Setup ScrollTriggers EXACTLY as reference
                    const tl1 = gsap.timeline({
                        scrollTrigger: {
                            trigger: ".ref-landing",
                            start: "top top",
                            end: "bottom top",
                            scrub: true,
                            invalidateOnRefresh: true,
                        },
                    });
                    const tl2 = gsap.timeline({
                        scrollTrigger: {
                            trigger: ".ref-about",
                            start: "center 55%",
                            end: "bottom top",
                            scrub: true,
                            invalidateOnRefresh: true,
                        },
                    });
                    const tl3 = gsap.timeline({
                        scrollTrigger: {
                            trigger: ".ref-whatido",
                            start: "top top",
                            end: "bottom top",
                            scrub: true,
                            invalidateOnRefresh: true,
                        },
                    });

                    if (window.innerWidth > 1024) {
                        tl1
                            .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
                            .to(camera.position, { z: 22 }, 0)
                            .fromTo(wrapper, { x: 0 }, { x: "-25%", duration: 1 }, 0);

                        tl2
                            .to(camera.position, { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" }, 0)
                            .fromTo(wrapper, { pointerEvents: "inherit" }, { pointerEvents: "none", x: "-12%", delay: 2, duration: 5 }, 0)
                            .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0)
                            .to(neckBone!.rotation, { x: 0.6, delay: 2, duration: 3 }, 0)
                            .to(monitor!.material, { opacity: 1, duration: 0.8, delay: 3.2 }, 0)
                            .to(screenLight!.material, { opacity: 1, duration: 0.8, delay: 4.5 }, 0)
                            .fromTo(monitor!.position, { y: -10, z: 2 }, { y: 0, z: 0, delay: 1.5, duration: 3 }, 0)
                            .fromTo(".character-rim", { opacity: 1, scaleX: 1.4 }, { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 }, 0.3);

                        tl3
                            .fromTo(wrapper, { y: 0 }, { y: "-100%", duration: 4, ease: "none", delay: 1 }, 0)
                            .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);
                    }

                    dracoLoader.dispose();
                });
            } catch (err) {
                console.error("Failed to load character", err);
            }
        };

        if (document.querySelector(".ref-landing")) {
            initCharacter();
        }

        // Mouse tracking for head rotation
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener("mousemove", handleMouseMove);

        const handleResize = () => {
            if (!wrapperRef.current) return;
            const w = window.innerWidth;
            const h = window.innerHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", handleResize);

        // Rendering Loop
        let reqId: number;
        const animate = () => {
            reqId = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            if (mixer) mixer.update(delta);

            if (headBone && window.scrollY < 200) {
                const maxRotation = Math.PI / 6;
                targetY = THREE.MathUtils.lerp(targetY, mouseX * maxRotation, 0.1);
                headBone.rotation.y = targetY;

                let minRotationX = -0.3;
                let maxRotationX = 0.4;
                if (mouseY > minRotationX) {
                    if (mouseY < maxRotationX) {
                        targetX = THREE.MathUtils.lerp(targetX, -mouseY - 0.5 * maxRotation, 0.1);
                    } else {
                        targetX = THREE.MathUtils.lerp(targetX, -maxRotation - 0.5 * maxRotation, 0.1);
                    }
                } else {
                    targetX = THREE.MathUtils.lerp(targetX, -minRotationX - 0.5 * maxRotation, 0.1);
                }
                headBone.rotation.x = targetX;
            } else if (headBone && window.innerWidth > 1024) {
                headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, -0.4, 0.03);
                headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, -0.3, 0.03);
            }

            if (screenLight && screenLight.material) {
                if (screenLight.material.opacity > 0.9) {
                    pointLight.intensity = (screenLight.material.emissiveIntensity || 1) * 20;
                } else {
                    pointLight.intensity = 0;
                }
            }

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(reqId);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            if (container.firstChild) container.removeChild(container.firstChild);
            renderer.dispose();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <div
            ref={wrapperRef}
            className="fixed top-0 left-0 w-full h-[100vh] z-0 pointer-events-none hidden lg:block character-model"
        >
            <div className="absolute w-[400px] h-[400px] bg-[#f59bf8] rounded-full top-[60%] left-1/2 -translate-x-1/2 scale-x-[1.4] opacity-100 shadow-[inset_66px_35px_85px_0px_rgba(85,0,255,0.65)] blur-[50px] character-rim z-[-1]" />
            <div ref={containerRef} className="w-full h-full relative" />
        </div>
    );
};
