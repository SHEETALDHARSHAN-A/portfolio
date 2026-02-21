"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Copy, Check, MapPin, User } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Globe } from "@/components/ui/Globe";
import { BorderBeam } from "@/components/ui/border-beam";
import { Logo } from "@/components/ui/Logo";

const leftList = ["JavaScript", "TypeScript", "Tailwind CSS"];
const rightList = ["React", "Next.js", "Node.js"];

export const BentoGridSection = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("hello@sheetal.dev");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto">
            <SectionHeader
                title="What I"
                accent="bring to the table"
                subtitle="A blend of technical expertise, creative thinking, and dedication to quality"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-12">
                {/* ───────── Card 1 — Globe (Top Left, Horizontal Span 2) ───────── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="md:col-span-2 relative overflow-hidden rounded-3xl border border-foreground/[0.08] bg-gradient-to-br from-background to-muted/50 dark:from-[#04071d] dark:to-[#0c0e23] min-h-[300px]"
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Globe />
                    </div>
                    <div className="absolute bottom-0 left-0 p-8 z-20">
                        <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Collaboration</p>
                        <h3 className="text-xl font-display font-bold text-foreground">Time-Zone Agnostic</h3>
                    </div>
                </motion.div>

                {/* ───────── Card 2 — About Me (Top Right, Vertical Span 2) ───────── */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="md:row-span-2 relative overflow-hidden rounded-3xl border border-foreground/[0.08] bg-gradient-to-br from-background to-muted/50 dark:from-[#04071d] dark:to-[#0c0e23] min-h-[400px]"
                >
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

                {/* ───────── Card 3 — Skills (Middle Left, Vertical Span 2) ───────── */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="md:row-span-2 relative overflow-hidden rounded-3xl border border-foreground/[0.08] bg-gradient-to-br from-background to-muted/50 dark:from-[#04071d] dark:to-[#0c0e23] min-h-[400px]"
                >
                    <div className="relative z-10 h-full flex flex-col justify-center p-8">
                        <p className="text-sm text-muted-foreground mb-1">Continuous improvement</p>
                        <h3 className="text-xl font-display font-bold text-foreground mb-6">Tech Stack</h3>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-3 flex-1">
                                {leftList.map((item) => (
                                    <span key={item} className="px-4 py-2.5 rounded-lg text-xs font-medium bg-muted dark:bg-[#10132E] border border-foreground/5 text-foreground/80 text-center">
                                        {item}
                                    </span>
                                ))}
                            </div>
                            <div className="flex flex-col gap-3 flex-1 pt-6">
                                {rightList.map((item) => (
                                    <span key={item} className="px-4 py-2.5 rounded-lg text-xs font-medium bg-muted dark:bg-[#10132E] border border-foreground/5 text-foreground/80 text-center">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ───────── Card 4 — Email Copy (The Center) ───────── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="relative overflow-hidden rounded-3xl border border-foreground/[0.08] flex items-center justify-center bg-gradient-to-br from-background to-muted/50 dark:from-[#04071d] dark:to-[#0c0e23] min-h-[300px]"
                >
                    <div className="relative z-10 text-center p-8">
                        <h3 className="text-lg font-display font-bold text-foreground mb-6 leading-tight">
                            Want to start a project together?
                        </h3>
                        <button
                            onClick={handleCopy}
                            className={cn(
                                "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 border shadow-lg",
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

                {/* ───────── Card 5 — Live Projects (Bottom Right, Horizontal Span 2) ───────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="md:col-span-2 relative overflow-hidden rounded-3xl border border-foreground/[0.08] bg-gradient-to-br from-muted/30 via-muted/10 to-background dark:from-[#28051e] dark:via-[#140a28] dark:to-[#04071d] min-h-[300px]"
                >
                    <div className="absolute inset-0 opacity-40"
                        style={{
                            background: "radial-gradient(circle at 30% 50%, rgba(234,179,8,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(6,182,212,0.1) 0%, transparent 50%)",
                        }}
                    />
                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                        <h3 className="text-2xl font-display italic text-foreground/90 leading-snug max-w-sm">
                            Real-world projects that demand excellence
                        </h3>
                        <p className="mt-4 text-sm text-muted-foreground">Click to explore my live portfolio</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
