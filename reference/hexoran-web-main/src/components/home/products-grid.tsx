"use client";
import React from "react";
import { motion } from "framer-motion";
import { Mic, ArrowRight, Heart, Shield, Zap } from "lucide-react";
import { CelatoLogo, SaveTuneLogo } from "@/components/logos";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Product {
    name: string;
    tagline: string;
    description: string;
    icon: React.ElementType;
    color: string;
    gradient: string;
    borderColor: string;
    features: string[];
    status: "live" | "coming-soon";
    href: string;
    external?: boolean;
}

const PRODUCTS: Product[] = [
    {
        name: "Celato",
        tagline: "AI Interview Copilot",
        description: "Real-time technical interview assistant. Screen analysis, live transcription, and code debugging. Undetectable stealth mode included.",
        icon: CelatoLogo,
        color: "text-violet-400",
        gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
        borderColor: "border-violet-500/30 hover:border-violet-500/60",
        features: ["Screenshot Analysis", "Live Transcription", "Phantom Mode", "Multi-Model AI"],
        status: "live",
        href: "/celato",
    },
    {
        name: "SaveTune",
        tagline: "Lossless Music Downloader",
        description: "Download high-quality FLAC and MP3 from Spotify. Automatic metadata, synchronized lyrics, and Hi-Res audio up to 24-bit/192kHz.",
        icon: SaveTuneLogo,
        color: "text-blue-400",
        gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
        borderColor: "border-blue-500/30 hover:border-blue-500/60",
        features: ["FLAC & MP3", "Auto Metadata", "Synced Lyrics", "Hi-Res Audio"],
        status: "live",
        href: "/savetune",
    },
    {
        name: "Stook",
        tagline: "AI Meeting Notes",
        description: "Your second brain for meetings. Automatic transcription, action item detection, and one-click export to Notion & Linear.",
        icon: Mic,
        color: "text-amber-400",
        gradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
        borderColor: "border-amber-500/30 hover:border-amber-500/60",
        features: ["Auto Transcription", "Action Items", "Meeting Summaries", "Notion Sync"],
        status: "coming-soon",
        href: "/stook",
    },
];

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
    const Icon = product.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
        >
            <Link href={product.href} className="block h-full">
                <div className={`group relative h-full p-8 rounded-3xl bg-surface/50 border ${product.borderColor} transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}>
                    {/* Status Badge */}
                    <div className="absolute top-6 right-6">
                        {product.status === "live" ? (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Live
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                Coming Soon
                            </span>
                        )}
                    </div>

                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.gradient} border border-white/10 flex items-center justify-center mb-6`}>
                        <Icon className={`w-7 h-7 ${product.color}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-1">{product.name}</h3>
                    <p className={`text-sm font-medium ${product.color} mb-4`}>{product.tagline}</p>
                    <p className="text-text-muted text-sm leading-relaxed mb-6">{product.description}</p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {product.features.map((feature, i) => (
                            <span
                                key={i}
                                className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/5"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className={`flex items-center gap-2 text-sm font-medium ${product.color} group-hover:gap-3 transition-all`}>
                        {product.status === "live" ? "Learn More" : "Join Waitlist"}
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export const ProductsGrid = () => {
    return (
        <section className="py-24 md:py-32 px-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Our Products
                    </h2>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        Free, privacy-first tools designed for creators, developers, and music lovers.
                        No ads, no tracking, no compromises.
                    </p>

                    {/* Value Props */}
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <span className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Heart className="w-4 h-4" />
                            Free Forever
                        </span>
                        <span className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Shield className="w-4 h-4" />
                            No Ads
                        </span>
                        <span className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            <Zap className="w-4 h-4" />
                            Privacy First
                        </span>
                    </div>
                </motion.div>

                {/* Products Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PRODUCTS.map((product, index) => (
                        <ProductCard key={product.name} product={product} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};
