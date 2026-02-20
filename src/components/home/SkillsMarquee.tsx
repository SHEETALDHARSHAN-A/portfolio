"use client";
import { motion } from "framer-motion";
import {
    Code2, Database, Cloud, Palette, Terminal, Cpu,
    Globe, Layers, Zap, Shield, GitBranch, Container,
} from "lucide-react";

const skills = [
    { name: "React", icon: Code2 },
    { name: "Next.js", icon: Layers },
    { name: "TypeScript", icon: Terminal },
    { name: "Node.js", icon: Cpu },
    { name: "Python", icon: Code2 },
    { name: "PostgreSQL", icon: Database },
    { name: "MongoDB", icon: Database },
    { name: "Docker", icon: Container },
    { name: "AWS", icon: Cloud },
    { name: "Tailwind", icon: Palette },
    { name: "Git", icon: GitBranch },
    { name: "Redis", icon: Zap },
    { name: "GraphQL", icon: Globe },
    { name: "Security", icon: Shield },
];

const SkillChip = ({ name, icon: Icon }: { name: string; icon: React.ElementType }) => (
    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] whitespace-nowrap flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-sm text-white/70 font-medium">{name}</span>
    </div>
);

export const SkillsMarquee = () => {
    return (
        <section className="py-20 overflow-hidden border-t border-white/5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <p className="text-xs uppercase tracking-widest text-white/40 mb-2 font-mono">Technologies</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white font-display">
                    Tools I <span className="gradient-text">Work With</span>
                </h2>
            </motion.div>

            {/* Row 1 - Left to Right */}
            <div className="relative mb-4">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
                <div className="flex animate-marquee gap-4" style={{ "--marquee-duration": "25s" } as React.CSSProperties}>
                    {[...skills, ...skills].map((skill, i) => (
                        <SkillChip key={`${skill.name}-${i}`} name={skill.name} icon={skill.icon} />
                    ))}
                </div>
            </div>

            {/* Row 2 - Right to Left */}
            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
                <div
                    className="flex animate-marquee gap-4"
                    style={{
                        "--marquee-duration": "30s",
                        animationDirection: "reverse",
                    } as React.CSSProperties}
                >
                    {[...skills.slice().reverse(), ...skills.slice().reverse()].map((skill, i) => (
                        <SkillChip key={`rev-${skill.name}-${i}`} name={skill.name} icon={skill.icon} />
                    ))}
                </div>
            </div>
        </section>
    );
};
