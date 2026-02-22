"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";

/**
 * MemojiSprite - Refined for perfect centering
 */
const MemojiSprite = ({ index, className }: { index: number; className?: string }) => {
    return (
        <div className={cn("flex items-center justify-center overflow-hidden rounded-full", className)}>
            <img
                src={`/members/member_${index}.png`}
                alt={`Member ${index}`}
                className="w-[130%] h-[130%] object-contain shrink-0 translate-y-[5%]"
            />
        </div>
    );
};

interface MemberIdentity {
    name: string;
    city: string;
    flag: string;
    status: string;
    spriteIdx: number;
}

const IDENTITY_POOL: MemberIdentity[] = [
    { name: "Alex", city: "London", flag: "🇬🇧", status: "Reviewing Code", spriteIdx: 0 },
    { name: "Sarah", city: "New York", flag: "🇺🇸", status: "In Meeting", spriteIdx: 1 },
    { name: "Kenji", city: "Tokyo", flag: "🇯🇵", status: "Refactoring API", spriteIdx: 2 },
    { name: "Maria", city: "Berlin", flag: "🇩🇪", status: "Testing Suite", spriteIdx: 6 },
    { name: "Liam", city: "Sydney", flag: "🇦🇺", status: "Updating Docs", spriteIdx: 3 },
    { name: "Chloe", city: "Paris", flag: "🇫🇷", status: "UI Design", spriteIdx: 4 },
    { name: "Raj", city: "Mumbai", flag: "🇮🇳", status: "Fixing Bugs", spriteIdx: 5 },
    { name: "Elena", city: "Madrid", flag: "🇪🇸", status: "In Session", spriteIdx: 7 },
    { name: "Yuki", city: "Osaka", flag: "🇯🇵", status: "Production", spriteIdx: 8 },
    { name: "Noah", city: "Toronto", flag: "🇨🇦", status: "Planning", spriteIdx: 9 },
];

const SyncNode = React.forwardRef<HTMLDivElement, {
    position: { x: number, y: number },
    poolIndices: number[],
    interval: number,
    delay: number
}>(({ position, poolIndices, interval, delay }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % poolIndices.length);
        }, interval);
        return () => clearInterval(timer);
    }, [poolIndices.length, interval]);

    const identity = IDENTITY_POOL[poolIndices[currentIndex]];
    const isRightSide = position.x > 50;

    return (
        <div
            ref={ref}
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center z-30 pointer-events-none"
        >
            <div className="flex flex-col items-center gap-2 relative">
                {/* Memoji Node */}
                <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300">
                    <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full" />
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={identity.spriteIdx}
                            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="w-full h-full flex items-center justify-center relative z-10"
                        >
                            <MemojiSprite index={identity.spriteIdx} className="w-full h-full" />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* City Label */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={identity.name}
                        initial={{ y: 5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -5, opacity: 0 }}
                        className="flex flex-col items-center"
                    >
                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/5 shadow-lg">
                            <span className="text-[7px] text-white/40 font-bold uppercase">{identity.flag}</span>
                            <span className="text-[8px] font-black text-white/80 uppercase tracking-widest">{identity.city}</span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Status Bubble - Robust positioning relative to node */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: isRightSide ? -10 : 10, y: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    transition={{ delay, duration: 1.2, type: "spring" }}
                    className={cn(
                        "absolute z-50 pointer-events-none whitespace-nowrap",
                        // Dynamic alignment based on side
                        "top-[-75px]", // Positioned above the node
                        isRightSide ? "right-[10%]" : "left-[10%]"
                    )}
                >
                    <div className="relative group overflow-hidden bg-black/40 backdrop-blur-2xl border border-white/[0.08] px-3.5 py-2.5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-3 min-w-[140px] md:min-w-[160px]">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                        <div className="relative flex items-center justify-center shrink-0">
                            <span className="absolute w-2 h-2 rounded-full bg-emerald-500/40 animate-ping" />
                            <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                        </div>

                        <div className="flex flex-col overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={identity.status}
                                    initial={{ opacity: 0, y: 3 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -3 }}
                                    className="flex flex-col"
                                >
                                    <p className="text-[9px] md:text-[10px] font-black text-white/90 tracking-wider uppercase truncate">
                                        {identity.status}
                                    </p>
                                    <span className="text-[7px] font-bold text-white/30 uppercase mt-0.5 tracking-[0.1em] truncate">
                                        LIVE SYNC • {identity.name}
                                    </span>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                    <div className="absolute inset-0 -z-10 bg-primary/5 blur-xl scale-125" />
                </motion.div>
            </div>
        </div>
    );
});
SyncNode.displayName = "SyncNode";

export const GlobalSync = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const centerRef = useRef<HTMLDivElement>(null);
    const node1Ref = useRef(null);
    const node2Ref = useRef(null);
    const node3Ref = useRef(null);
    const node4Ref = useRef(null);

    // Optimized positions for grid layout
    const positions = [
        { x: 18, y: 35 }, // Top Left
        { x: 82, y: 35 }, // Top Right
        { x: 75, y: 72 }, // Bottom Right
        { x: 25, y: 72 }  // Bottom Left
    ];

    return (
        <div ref={containerRef} className="relative w-full h-full min-h-[600px] overflow-hidden flex items-center justify-center p-8 bg-black/20 font-inter">
            {/* Premium Header */}
            <div className="absolute top-10 left-0 w-full flex flex-col items-center z-50 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-primary/40" />
                        <span className="text-[10px] font-black text-primary/80 uppercase tracking-[0.4em] blur-[0.3px]">Our Network</span>
                        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-primary/40" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-widest uppercase mb-1">
                        Global <span className="text-primary blur-[0.4px]">Presence</span>
                    </h2>
                    <p className="text-[8px] md:text-[9px] text-white/30 uppercase tracking-[0.3em] font-medium italic">
                        Real-time collaboration across boundaries
                    </p>
                </motion.div>
            </div>

            {/* Background Narrative */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(var(--primary),.08)_0%,_transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }}
            />

            {/* Central Node (Me - Borderless) */}
            <div
                ref={centerRef}
                className="relative z-40 w-24 h-24 md:w-28 md:h-28 flex items-center justify-center group pointer-events-none mt-12"
            >
                <div className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full opacity-60" />
                <img
                    src="/memoji.svg"
                    alt="Me"
                    className="w-[90%] h-[90%] object-contain relative z-10 transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-[ping_4s_infinite] opacity-20 pointer-events-none" />
            </div>

            {/* Team Nodes with Cycling Identities */}
            <SyncNode ref={node1Ref} position={positions[0]} poolIndices={[0, 4]} interval={7000} delay={1.5} />
            <SyncNode ref={node2Ref} position={positions[1]} poolIndices={[1, 5, 8]} interval={8500} delay={1.9} />
            <SyncNode ref={node3Ref} position={positions[2]} poolIndices={[2, 6, 9]} interval={6000} delay={2.3} />
            <SyncNode ref={node4Ref} position={positions[3]} poolIndices={[3, 7]} interval={9000} delay={2.7} />

            {/* Connection Beams */}
            {[node1Ref, node2Ref, node3Ref, node4Ref].map((nodeRef, idx) => (
                <AnimatedBeam
                    key={idx}
                    containerRef={containerRef}
                    fromRef={nodeRef}
                    toRef={centerRef}
                    curvature={idx % 2 === 0 ? 40 : -40}
                    pathColor="rgba(255, 255, 255, 0.03)"
                    gradientStartColor="#3b82f6"
                    gradientStopColor="#ec4899"
                    duration={3 + (idx * 0.5)}
                    delay={idx * 0.3}
                    pathWidth={1.5}
                />
            ))}

            {/* Tagline */}
            <div className="absolute bottom-12 text-center px-4 w-full">
                <p className="text-white/40 text-[9px] italic font-medium tracking-[0.2em] uppercase">
                    "Your local partner, <span className="text-white/80 font-black not-italic border-b border-primary/20 pb-0.5">globally synced.</span>"
                </p>
            </div>

            {/* Flying Background Text */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: -200, opacity: 1 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-1/3 left-full text-[60px] font-black text-white/[0.02] whitespace-nowrap pointer-events-none"
            >
                bridging time-gaps • seamless workflow • 24/7 collaboration •
            </motion.div>
        </div>
    );
};
