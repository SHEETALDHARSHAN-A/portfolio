"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { GlobalSync } from "./GlobalSync";
import { BorderBeam } from "@/components/ui/border-beam";
import { Logo } from "@/components/ui/Logo";
import { LightRays } from "@/components/ui/light-rays";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { DotPattern } from "@/components/ui/dot-pattern";
import { useTheme } from "next-themes";

const leftList = ["JavaScript", "TypeScript", "Tailwind CSS"];
const rightList = ["React", "Next.js", "Node.js"];

const SkillBadge = ({ label, icon, className }: { label: string; icon: string; className?: string }) => (
    <div className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] md:text-xs font-medium text-foreground/80 hover:bg-white/10 hover:border-white/20 transition-all cursor-default shrink-0",
        className
    )}>
        <img src={icon} alt="" className="w-3.5 h-3.5 object-contain" />
        <span className="whitespace-nowrap">{label}</span>
    </div>
);

const MarqueeRow = ({ children, direction = "left", speed = 40 }: { children: React.ReactNode; direction?: "left" | "right"; speed?: number }) => (
    <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
        <motion.div
            animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
            transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
            className="flex gap-3 px-1.5 w-max"
        >
            {children}
            {children}
        </motion.div>
    </div>
);

export const BentoGridSection = () => {
    const [copied, setCopied] = useState(false);
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === "dark";

    const handleCopy = () => {
        navigator.clipboard.writeText("hello@sheetal.dev");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto relative">
            <SectionHeader
                title="What I"
                accent="bring to the table"
                subtitle="A blend of technical expertise, creative thinking, and dedication to quality"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-12 relative">
                {/* ───────── Card 1 — Globe (Clean) ───────── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="md:col-span-2 relative overflow-hidden rounded-3xl border border-foreground/[0.08] bg-background dark:bg-black min-h-[400px]"
                >

                    <div className="absolute inset-0 z-10">
                        <GlobalSync />
                    </div>

                    <LightRays
                        color={isDark ? "rgba(var(--primary), 0.15)" : "rgba(var(--primary), 0.08)"}
                        count={3}
                        speed={10}
                        blur={40}
                        className="opacity-50"
                    />
                </motion.div>

                {/* ───────── Card 2 — About Me: Dot Pattern (Purple) ───────── */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="md:row-span-2 relative overflow-hidden rounded-3xl border border-foreground/[0.08] bg-background dark:bg-black min-h-[400px]"
                >
                    <DotPattern
                        width={20}
                        height={20}
                        cx={2}
                        cy={2}
                        cr={1.2}
                        className={cn(
                            "[mask-image:radial-gradient(300px_circle_at_70%_80%,white,transparent)]",
                            isDark
                                ? "fill-purple-500/25"
                                : "fill-purple-400/15"
                        )}
                    />
                    <LightRays
                        color={isDark ? "rgba(168, 85, 247, 0.2)" : "rgba(168, 85, 247, 0.12)"}
                        count={4}
                        speed={14}
                        blur={22}
                    />
                    <div className="relative z-10 h-full flex flex-col justify-end p-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-6 border border-foreground/10 overflow-hidden">
                            <Logo className="w-14 h-14 p-1" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-foreground mb-2">Sheetal</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            A passionate Full-Stack Developer dedicated to building futuristic and innovative digital solutions that make an impact.
                        </p>
                    </div>
                    <BorderBeam size={250} duration={12} delay={3} colorFrom="#a855f7" colorTo="#06b6d4" />
                </motion.div>
                {/* ───────── Card 3 — Skills: Modern Tech Section ───────── */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="md:row-span-2 relative overflow-hidden rounded-3xl border border-white/[0.05] bg-black flex flex-col items-center pt-10"
                >
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-teal-500/15 rounded-full blur-[110px] pointer-events-none" />

                    <div className="relative z-10 w-full h-full px-6 flex flex-col items-center justify-between">
                        <div className="flex flex-col items-center w-full">
                            <h3 className="text-2xl md:text-3xl font-display font-bold text-white text-center mb-10 max-w-[280px] leading-tight tracking-tight">
                                Enthusiastic About Innovative and futuristic Tech
                            </h3>

                            {/* Tech Badges Rows - Marquee */}
                            <div className="flex flex-col gap-5 w-full items-center mb-12 overflow-hidden py-2">
                                {/* Row 1 */}
                                <MarqueeRow direction="left" speed={30}>
                                    <SkillBadge label="React" icon="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" />
                                    <SkillBadge label="Next.js" icon="https://cdn.simpleicons.org/nextdotjs/white" />
                                    <SkillBadge label="Tailwind CSS" icon="https://cdn.simpleicons.org/tailwindcss/06B6D4" />
                                    <SkillBadge label="TypeScript" icon="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" />
                                    <SkillBadge label="JavaScript" icon="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" />
                                </MarqueeRow>

                                {/* Row 2 */}
                                <MarqueeRow direction="right" speed={35}>
                                    <SkillBadge label="Node.js" icon="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" />
                                    <SkillBadge label="Express.js" icon="https://cdn.simpleicons.org/express/white" />
                                    <SkillBadge label="MongoDB" icon="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" />
                                    <SkillBadge label="Supabase" icon="https://cdn.simpleicons.org/supabase/3ECF8E" />
                                    <SkillBadge label="Postman" icon="https://cdn.simpleicons.org/postman/FF6C37" />
                                </MarqueeRow>

                                {/* Row 3 */}
                                <MarqueeRow direction="left" speed={40}>
                                    <SkillBadge label="Vercel" icon="https://cdn.simpleicons.org/vercel/white" />
                                    <SkillBadge label="Github" icon="https://cdn.simpleicons.org/github/white" />
                                    <SkillBadge label="Git" icon="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" />
                                    <SkillBadge label="Figma" icon="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" />
                                    <SkillBadge label="VS Code" icon="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" />
                                </MarqueeRow>
                            </div>
                        </div>

                        {/* Browser Mockup - sticks to the bottom now */}
                        <div className="w-full max-w-[320px] rounded-t-xl overflow-hidden shadow-2xl border-x border-t border-foreground/10 bg-[#0a0a0a]">
                            <div className="h-6 bg-teal-500/20 px-3 flex items-center gap-1.5 border-b border-foreground/10">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                                <div className="ml-auto flex gap-2">
                                    <div className="w-8 h-1 rounded-full bg-foreground/10" />
                                    <div className="w-8 h-1 rounded-full bg-foreground/10" />
                                </div>
                            </div>
                            <div className="p-4 space-y-4 h-[180px] md:h-[200px] bg-gradient-to-b from-teal-500/5 to-transparent">
                                <div className="w-3/4 h-3 rounded-full bg-foreground/10 mx-auto" />
                                <div className="w-1/2 h-2 rounded-full bg-foreground/5 mx-auto" />
                                <div className="w-1/4 h-8 rounded-lg bg-teal-500/10 mx-auto mt-6" />
                                <div className="flex gap-3 pt-6">
                                    <div className="flex-1 h-24 md:h-28 rounded-lg bg-foreground/[0.03]" />
                                    <div className="flex-1 h-24 md:h-28 rounded-lg bg-foreground/[0.03]" />
                                    <div className="flex-1 h-24 md:h-28 rounded-lg bg-foreground/[0.03]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ───────── Card 4 — Email: Dot Pattern (Gold) ───────── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="relative overflow-hidden rounded-3xl border border-foreground/[0.08] flex items-center justify-center bg-background dark:bg-black min-h-[300px]"
                >
                    <DotPattern
                        width={24}
                        height={24}
                        cx={1}
                        cy={1}
                        cr={1}
                        className={cn(
                            "[mask-image:radial-gradient(250px_circle_at_center,white,transparent)]",
                            isDark
                                ? "fill-amber-400/20"
                                : "fill-amber-500/10"
                        )}
                    />
                    <LightRays
                        color={isDark ? "rgba(234, 179, 8, 0.18)" : "rgba(234, 179, 8, 0.08)"}
                        count={3}
                        speed={10}
                        blur={20}
                    />
                    <div className="relative z-10 text-center p-8">
                        <h3 className="text-lg font-display font-bold text-foreground mb-6 leading-tight">
                            Want to start a project together?
                        </h3>
                        <button
                            onClick={handleCopy}
                            className={cn(
                                "relative z-20 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 border shadow-lg",
                                copied
                                    ? "bg-green-500/20 border-green-500/30 text-green-600 dark:text-green-400"
                                    : "bg-background dark:bg-[#161A31] border-foreground/10 text-foreground/80 hover:border-primary/50 hover:text-foreground"
                            )}
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Email Copied!" : "hello@sheetal.dev"}
                        </button>
                    </div>
                </motion.div>

                {/* ───────── Card 5 — Projects (Clean) ───────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="md:col-span-2 relative overflow-hidden rounded-3xl border border-foreground/[0.08] bg-background dark:bg-black min-h-[300px]"
                >
                    <LightRays
                        color={isDark ? "rgba(244, 63, 94, 0.2)" : "rgba(6, 182, 212, 0.12)"}
                        count={6}
                        speed={8}
                        blur={28}
                    />
                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                        <h3 className="text-2xl font-display font-bold text-foreground/90 leading-snug max-w-sm">
                            Real-world projects that demand excellence
                        </h3>
                        <p className="mt-4 text-sm text-muted-foreground">Click to explore my live portfolio</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

