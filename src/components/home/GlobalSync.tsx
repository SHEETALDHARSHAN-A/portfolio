"use client";
import React, { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";

interface TeamMember {
    id: string;
    name: string;
    city: string;
    flag: string;
    status: string;
    avatar: string;
    position: { x: number; y: number };
}

const members: TeamMember[] = [
    { id: "1", name: "Alex", city: "London", flag: "🇬🇧", status: "Reviewing PR...", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", position: { x: 20, y: 25 } },
    { id: "2", name: "Sarah", city: "New York", flag: "🇺🇸", status: "Morning Sync...", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", position: { x: 80, y: 30 } },
    { id: "3", name: "Kenji", city: "Tokyo", flag: "🇯🇵", status: "Docs Handover...", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kenji", position: { x: 75, y: 75 } },
    { id: "4", name: "Maria", city: "Berlin", flag: "🇩🇪", status: "Testing API...", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", position: { x: 25, y: 75 } },
];

const Node = React.forwardRef<HTMLDivElement, { member: TeamMember }>(({ member }, ref) => (
    <div
        ref={ref}
        style={{ left: `${member.position.x}%`, top: `${member.position.y}%` }}
        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group"
    >
        {/* Status Bubble (Above Avatar) */}
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full whitespace-nowrap shadow-xl">
                <p className="text-[10px] font-medium text-white flex items-center gap-1.5">
                    <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {member.status}
                </p>
            </div>
            {/* Triangle tail */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/10 mx-auto" />
        </motion.div>

        {/* Avatar Circle */}
        <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-full border-2 border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden p-0.5 shadow-2xl relative z-20 group-hover:border-primary/50 transition-colors"
        >
            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-full" />
        </motion.div>

        <div className="flex items-center gap-1 mt-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/5">
            <span className="text-[9px] font-bold text-foreground/80">{member.flag} {member.city}</span>
        </div>
    </div>
));

Node.displayName = "Node";

export const GlobalSync = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const centerRef = useRef<HTMLDivElement>(null);
    const node1Ref = useRef<HTMLDivElement>(null);
    const node2Ref = useRef<HTMLDivElement>(null);
    const node3Ref = useRef<HTMLDivElement>(null);
    const node4Ref = useRef<HTMLDivElement>(null);

    const nodeRefs = [node1Ref, node2Ref, node3Ref, node4Ref];

    return (
        <div ref={containerRef} className="relative w-full h-full min-h-[400px] overflow-hidden flex items-center justify-center p-8">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(var(--primary),.1)_0%,_transparent_70%)] pointer-events-none" />

            {/* Central Node (Me) */}
            <div
                ref={centerRef}
                className="relative z-40 w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-primary/40 bg-black flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),.3)] overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20" />
                <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sheetal&hair=short&skinColor=ae5d29"
                    alt="Me"
                    className="w-[85%] h-[85%] object-contain relative z-10"
                />
            </div>

            {/* Team Nodes */}
            <Node ref={node1Ref} member={members[0]} />
            <Node ref={node2Ref} member={members[1]} />
            <Node ref={node3Ref} member={members[2]} />
            <Node ref={node4Ref} member={members[3]} />

            {/* Animated Beams */}
            {nodeRefs.map((nodeRef, idx) => (
                <AnimatedBeam
                    key={idx}
                    containerRef={containerRef}
                    fromRef={nodeRef}
                    toRef={centerRef}
                    curvature={idx % 2 === 0 ? 50 : -50}
                    pathColor="rgba(255,255,255,0.05)"
                    gradientStartColor="hsl(var(--primary))"
                    gradientStopColor="hsl(var(--accent))"
                    duration={4 + idx}
                    delay={idx * 0.5}
                />
            ))}

            <div className="absolute bottom-8 left-0 right-0 text-center px-12 z-50">
                <p className="text-base md:text-lg font-medium text-foreground/90 max-w-lg mx-auto leading-relaxed drop-shadow-sm">
                    "Your local partner, globally synced. I bridge the time-gap so your project never sleeps."
                </p>
                <div className="flex items-center justify-center gap-2 mt-3 overflow-hidden">
                    <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-primary/50" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">24/7 Availability</span>
                    <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-primary/50" />
                </div>
            </div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
            />
        </div>
    );
};
