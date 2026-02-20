"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Copy, Check, MapPin, User } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

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
                    className="lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh] relative overflow-hidden rounded-3xl border border-white/[0.08] group"
                    style={{
                        background: "linear-gradient(135deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                    }}
                >
                    {/* Background Globe SVG */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-60">
                        <svg width="500" height="500" viewBox="0 0 500 500" className="w-full h-auto max-h-full">
                            <defs>
                                <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
                                    <stop offset="70%" stopColor="#7c3aed" stopOpacity="0.05" />
                                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                                </radialGradient>
                            </defs>
                            <circle cx="250" cy="250" r="180" fill="url(#globe-glow)" />
                            <circle cx="250" cy="250" r="160" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="0.5" />
                            {/* Longitude lines */}
                            {[0, 30, 60, 90, 120, 150].map((angle) => (
                                <ellipse
                                    key={`lon-${angle}`}
                                    cx="250" cy="250" rx={160 * Math.cos((angle * Math.PI) / 180)} ry="160"
                                    fill="none" stroke="rgba(124,58,237,0.12)" strokeWidth="0.5"
                                    transform={`rotate(0, 250, 250)`}
                                />
                            ))}
                            {/* Latitude lines */}
                            {[-120, -80, -40, 0, 40, 80, 120].map((y) => (
                                <ellipse
                                    key={`lat-${y}`}
                                    cx="250" cy={250 + y * 0.8} rx={Math.sqrt(Math.max(0, 160 * 160 - y * y * 0.64))} ry={20}
                                    fill="none" stroke="rgba(124,58,237,0.1)" strokeWidth="0.5"
                                />
                            ))}
                            {/* Scatter dots for land masses */}
                            {Array.from({ length: 80 }).map((_, i) => {
                                const angle = (i * 137.508 * Math.PI) / 180;
                                const r = Math.sqrt(i / 80) * 140;
                                const x = 250 + r * Math.cos(angle);
                                const y = 250 + r * Math.sin(angle);
                                const dist = Math.sqrt((x - 250) ** 2 + (y - 250) ** 2);
                                if (dist > 155) return null;
                                return (
                                    <circle
                                        key={`dot-${i}`}
                                        cx={x} cy={y}
                                        r={1 + Math.random() * 1.5}
                                        fill={`rgba(124,58,237,${0.2 + Math.random() * 0.3})`}
                                        className="animate-pulse"
                                        style={{ animationDelay: `${Math.random() * 3}s` }}
                                    />
                                );
                            })}
                            {/* Location pin */}
                            <circle cx="300" cy="200" r="4" fill="#7c3aed" className="animate-ping" style={{ animationDuration: "2s" }} />
                            <circle cx="300" cy="200" r="3" fill="#a855f7" />
                        </svg>
                    </div>

                    {/* Top gradient */}
                    <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[rgb(4,7,29)] to-transparent z-10 pointer-events-none" />
                    {/* Bottom gradient */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[rgb(4,7,29)]/60 to-transparent z-10 pointer-events-none" />

                    {/* Icon badge */}
                    <div className="absolute top-6 left-6 z-20 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-primary" />
                    </div>

                    {/* Text */}
                    <div className="absolute bottom-0 left-0 p-8 z-20">
                        <p className="text-sm text-text-muted mb-2 max-w-[250px]">
                            Productive collaboration across global teams, without time barriers.
                        </p>
                        <h3 className="text-xl font-display font-bold text-white">Time-Zone Agnostic</h3>
                    </div>
                </motion.div>

                {/* ───────── Card 2 — Personal / Photo (2 col, 2 row) ───────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="lg:col-span-2 md:col-span-3 md:row-span-4 lg:min-h-[60vh] relative overflow-hidden rounded-3xl border border-white/[0.08] group"
                    style={{
                        background: "linear-gradient(135deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                    }}
                >
                    {/* Icon badge */}
                    <div className="absolute top-6 right-6 z-20 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                    </div>

                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-black/50" />

                    {/* Large text overlay */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <div className="text-right space-y-1 translate-x-8 md:translate-x-16">
                            <p className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white/[0.06] leading-none whitespace-nowrap">
                                Developer
                            </p>
                            <p className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white/[0.06] leading-none whitespace-nowrap">
                                Full Stack
                            </p>
                            <p className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white/[0.06] leading-none whitespace-nowrap">
                                Always Learning
                            </p>
                            <p className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white/[0.06] leading-none whitespace-nowrap">
                                Building
                            </p>
                        </div>
                    </div>

                    {/* Foreground content */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-8">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-4 border border-white/10">
                            <span className="text-3xl font-display font-bold text-white">S</span>
                        </div>
                        <h3 className="text-xl font-display font-bold text-white mb-1">Sheetal</h3>
                        <p className="text-sm text-text-muted">Full-Stack Developer & AI Enthusiast</p>
                    </div>
                </motion.div>

                {/* ───────── Card 3 — Passion / Innovation (decorative serif) ───────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-2 md:col-span-3 md:row-span-2 relative overflow-hidden rounded-3xl border border-white/[0.08] p-8 flex flex-col justify-center"
                    style={{
                        background: "linear-gradient(135deg, rgba(4,7,29,1) 0%, rgba(20,10,40,1) 100%)",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-display italic text-white/90 leading-snug">
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
                    className="lg:col-span-3 md:col-span-3 md:row-span-2 relative overflow-hidden rounded-3xl border border-white/[0.08]"
                    style={{
                        background: "linear-gradient(135deg, rgba(40,5,30,1) 0%, rgba(20,10,40,1) 50%, rgba(4,7,29,1) 100%)",
                    }}
                >
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 opacity-40"
                        style={{
                            background: "radial-gradient(circle at 30% 50%, rgba(124,58,237,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(236,72,153,0.2) 0%, transparent 50%)",
                        }}
                    />
                    {/* Stripe glow line at top */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                        <h3 className="text-2xl md:text-3xl font-display italic text-white/90 leading-snug max-w-sm">
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
                    className="lg:col-span-3 md:col-span-4 md:row-span-2 relative overflow-hidden rounded-3xl border border-white/[0.08] p-8"
                    style={{
                        background: "linear-gradient(135deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                    }}
                >
                    <div className="relative z-10 h-full flex flex-col justify-center">
                        <p className="text-sm text-text-muted mb-1">I constantly try to improve</p>
                        <h3 className="text-lg lg:text-2xl font-display font-bold text-white mb-4">My Tech Stack</h3>

                        {/* Floating tech stack columns (like reference) */}
                        <div className="flex gap-3">
                            <div className="flex flex-col gap-3">
                                {leftList.map((item) => (
                                    <span key={item} className="px-4 py-2.5 rounded-lg text-xs lg:text-sm font-medium bg-[#10132E] border border-white/5 text-white/80 text-center">
                                        {item}
                                    </span>
                                ))}
                                <span className="px-4 py-4 rounded-lg bg-[#10132E] border border-white/5" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <span className="px-4 py-4 rounded-lg bg-[#10132E] border border-white/5" />
                                {rightList.map((item) => (
                                    <span key={item} className="px-4 py-2.5 rounded-lg text-xs lg:text-sm font-medium bg-[#10132E] border border-white/5 text-white/80 text-center">
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
                    className="lg:col-span-2 md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl border border-white/[0.08] flex items-center justify-center"
                    style={{
                        background: "linear-gradient(135deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                    }}
                >
                    <div className="relative z-10 text-center p-8">
                        <h3 className="text-xl font-display font-bold text-white mb-5">
                            Do you want to start a project together?
                        </h3>
                        <button
                            onClick={handleCopy}
                            className={cn(
                                "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border",
                                copied
                                    ? "bg-green-500/20 border-green-500/30 text-green-400"
                                    : "bg-[#161A31] border-white/10 text-white/80 hover:border-primary/30 hover:text-white"
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
