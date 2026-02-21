"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

export const Globe = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 800 * 2,
            height: 800 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [1, 0.8, 0], // Gold markers
            glowColor: [1, 0.8, 0.2], // Gold glow
            markers: [
                // India
                { location: [28.6139, 77.2090], size: 0.1 },
                // UK
                { location: [51.5074, -0.1278], size: 0.1 },
                // USA
                { location: [40.7128, -74.0060], size: 0.1 },
                // Extra global hubs
                { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
                { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
                { location: [-23.5505, -46.6333], size: 0.05 }, // Sao Paulo
            ],
            onRender: (state) => {
                state.phi = phi;
                phi += 0.005;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <div className="relative w-[150%] md:w-full max-w-[800px] aspect-square mx-auto translate-y-[15%] translate-x-[15%] lg:translate-y-[20%] lg:translate-x-[20%] scale-[0.85] md:scale-[0.95]">
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    contain: "layout paint opacity",
                }}
            />
        </div>
    );
};
