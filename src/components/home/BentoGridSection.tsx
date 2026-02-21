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

            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 gap-4 lg:gap-6">
                {/* ───────── Card 1 — Globe / Collaboration (3 col, 4 row) ───────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh] relative overflow-hidden rounded-3xl border border-foreground/[0.08] group bg-gradient-to-br from-background to-muted/50 dark:from-[#04071d] dark:to-[#0c0e23]"
                >
                    {/* Background Globe SVG */}
                    {/* Background Globe SVG replaced with 3D Globe */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Globe />
                    </div>

                    {/* Removed top masking gradient that was overriding the globe */}
                    {/* Bottom gradient */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background/80 dark:from-[#04071d]/60 to-transparent z-10 pointer-events-none" />


                    {/* Text */}
                    <div className="absolute bottom-0 left-0 p-8 z-20">
                        <p className="text-sm text-muted-foreground mb-2 max-w-[250px]">
                            Productive collaboration across global teams, without time barriers.
                        </p>
                        <h3 className="text-xl font-display font-bold text-foreground">Time-Zone Agnostic</h3>
                    </div>
                </motion.div>

                {/* ───────── Card 2 — Personal / Photo (2 col, 2 row) ───────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="lg:col-span-2 md:col-span-3 md:row-span-4 lg:min-h-[60vh] relative overflow-hidden rounded-3xl border border-foreground/[0.08] group bg-gradient-to-br from-background to-muted/50 dark:from-[#04071d] dark:to-[#0c0e23]"
                >
                    {/* Icon badge */}
                    <div className="absolute top-6 right-6 z-20 w-10 h-10 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-gold" />
                    </div>

                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-background/50" />

                    {/* Large text overlay */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <div className="text-right space-y-1 translate-x-8 md:translate-x-16">
                            <p className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground/[0.06] leading-none whitespace-nowrap">
                                Developer
                            </p>
                            <p className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground/[0.06] leading-none whitespace-nowrap">
                                Full Stack
                            </p>
                            <p className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground/[0.06] leading-none whitespace-nowrap">
                                Always Learning
                            </p>
                            <p className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground/[0.06] leading-none whitespace-nowrap">
                                Building
                            </p>
                        </div>
                    </div>

                    {/* Foreground content */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-8">
                        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-4 border border-foreground/10 overflow-hidden">
                            <Logo className="w-20 h-20 p-2" />
                        </div>
                        <h3 className="text-xl font-display font-bold text-foreground mb-1">Sheetal</h3>
                        <p className="text-sm text-muted-foreground">Full-Stack Developer & AI Enthusiast</p>
                    </div>
                    <BorderBeam size={250} duration={12} delay={3} colorFrom="#a855f7" colorTo="#06b6d4" />
                </motion.div>

                {/* ───────── Card 3 — Passion / Innovation (decorative serif) ───────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-2 md:col-span-3 md:row-span-2 relative overflow-hidden rounded-3xl border border-foreground/[0.08] p-8 flex flex-col justify-center bg-gradient-to-br from-background to-muted/80 dark:from-[#04071d] dark:to-[#140a28]"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-display italic text-foreground/90 leading-snug">
                            Enthusiastic About Innovative and Futuristic Tech
                        </h3>
                    </div>
                </motion.div>

                {/* ───────── Card 4 — CTA / Let&apos;s build (gradient background) ───────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="lg:col-span-3 md:col-span-3 md:row-span-2 relative overflow-hidden rounded-3xl border border-foreground/[0.08] bg-gradient-to-br from-muted/30 via-muted/10 to-background dark:from-[#28051e] dark:via-[#140a28] dark:to-[#04071d]"
                >
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 opacity-40"
                        style={{
                            background: "radial-gradient(circle at 30% 50%, rgba(234,179,8,0.2) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(6,182,212,0.1) 0%, transparent 50%)",
                        }}
                    />
                    {/* Stripe glow line at top */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                        <h3 className="text-2xl md:text-3xl font-display italic text-foreground/90 leading-snug max-w-sm">
                            Let&apos;s build your next product, the right way
                        </h3>
                    </div>
                </motion.div>

                {/* ───────── Card 5 — Tech Stack (floating pills) ───────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="lg:col-span-3 md:col-span-4 md:row-span-2 relative overflow-hidden rounded-3xl border border-foreground/[0.08] p-8 bg-gradient-to-br from-background to-muted/50 dark:from-[#04071d] dark:to-[#0c0e23]"
                >
                    <div className="relative z-10 h-full flex flex-col justify-center">
                        <p className="text-sm text-muted-foreground mb-1">I constantly try to improve</p>
                        <h3 className="text-lg lg:text-2xl font-display font-bold text-foreground mb-4">My Tech Stack</h3>

                        {/* Floating tech stack columns (like reference) */}
                        <div className="flex gap-3">
                            <div className="flex flex-col gap-3">
                                {leftList.map((item) => (
                                    <span key={item} className="px-4 py-2.5 rounded-lg text-xs lg:text-sm font-medium bg-muted dark:bg-[#10132E] border border-foreground/5 text-foreground/80 text-center">
                                        {item}
                                    </span>
                                ))}
                                <span className="px-4 py-4 rounded-lg bg-muted dark:bg-[#10132E] border border-foreground/5" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <span className="px-4 py-4 rounded-lg bg-muted dark:bg-[#10132E] border border-foreground/5" />
                                {rightList.map((item) => (
                                    <span key={item} className="px-4 py-2.5 rounded-lg text-xs lg:text-sm font-medium bg-muted dark:bg-[#10132E] border border-foreground/5 text-foreground/80 text-center">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ───────── Card 6 — Copy Email CTA ───────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="lg:col-span-2 md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl border border-foreground/[0.08] flex items-center justify-center bg-gradient-to-br from-background to-muted/50 dark:from-[#04071d] dark:to-[#0c0e23]"
                >
                    <div className="relative z-10 text-center p-8">
                        <h3 className="text-xl font-display font-bold text-foreground mb-5">
                            Do you want to start a project together?
                        </h3>
                        <button
                            onClick={handleCopy}
                            className={cn(
                                "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border",
                                copied
                                    ? "bg-green-500/20 border-green-500/30 text-green-600 dark:text-green-400"
                                    : "bg-muted dark:bg-[#161A31] border-foreground/10 text-foreground/80 hover:border-gold/30 hover:text-foreground"
                            )}
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Email Copied!" : "hello@sheetal.dev"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
