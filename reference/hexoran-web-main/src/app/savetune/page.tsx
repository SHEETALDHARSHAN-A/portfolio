"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Download,
    FileMusic,
    Mic2,
    Heart,
    Shield,
    Zap,
    Check,
    Music,
    FolderOpen,
    Settings,
    Play,
    ListMusic,
    Disc3,
    Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SaveTuneLogo } from "@/components/logos";


const SHOWCASE_TABS = [
    { id: 'dashboard', label: 'Dashboard', image: '/images/savetune/homepage.png', icon: FolderOpen },
    { id: 'search', label: 'Smart Search', image: '/images/savetune/search.png', icon: Disc3 },
    { id: 'player', label: 'Music Player', image: '/images/savetune/music player.png', icon: Play },
    { id: 'lyrics', label: 'Lyrics', image: '/images/savetune/lyrics.png', icon: Mic2 },
    { id: 'downloads', label: 'Downloads', image: '/images/savetune/downloads.png', icon: Download },
    { id: 'active', label: 'Live Downloading', image: '/images/savetune/downloadwhileplaying.png', icon: Zap },
    { id: 'playlist', label: 'Collections', image: '/images/savetune/playlist.png', icon: ListMusic },
    { id: 'favorites', label: 'Favorites', image: '/images/savetune/favorites.png', icon: Heart },
    { id: 'mini', label: 'Mini Mode', image: '/images/savetune/miniplayer.png', icon: Disc3 },
];

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
    })
};

const AppShowcase = () => {
    const [page, setPage] = useState([0, 0]);
    const [index, direction] = page;
    const activeIndex = Math.abs(index % SHOWCASE_TABS.length);
    const activeTab = SHOWCASE_TABS[activeIndex];

    // Auto-rotate
    React.useEffect(() => {
        const timer = setInterval(() => {
            setPage([index + 1, 1]);
        }, 9000); // 9 seconds per slide
        return () => clearInterval(timer);
    }, [index]);

    const setSpecificTab = (newIndex: number) => {
        setPage([newIndex, newIndex > index ? 1 : -1]);
    };

    return (
        <div className="flex flex-col items-center">
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-10 bg-white/5 p-2 rounded-3xl border border-white/5 backdrop-blur-sm max-w-4xl">
                {SHOWCASE_TABS.map((tab, i) => {
                    const Icon = tab.icon;
                    const isActive = i === activeIndex;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setSpecificTab(i)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${isActive
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Image Container */}
            <div className="relative w-full max-w-5xl rounded-2xl p-2 bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl overflow-hidden aspect-[16/10]">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/50">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={index}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "tween", ease: "easeInOut", duration: 0.5 },
                                opacity: { duration: 0.2 }
                            }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <Image
                                src={activeTab.image}
                                alt={activeTab.label}
                                fill
                                className="object-contain"
                                quality={100}
                                priority
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Progress Bar for Auto-Play */}
                    <motion.div
                        key={index + "-progress"} // Resets on slide change
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 9, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-1 bg-blue-500 z-20"
                    />
                </div>
            </div>
        </div>
    );
};

const FEATURES = [
    {
        icon: FileMusic,
        title: "Lossless FLAC & MP3",
        description: "Download in pristine FLAC quality or optimized MP3 up to 320kbps. Your choice, your quality."
    },
    {
        icon: Mic2,
        title: "Synchronized Lyrics",
        description: "Automatically embed time-synced lyrics into your files. Karaoke-ready, always."
    },
    {
        icon: Download,
        title: "Automatic Metadata",
        description: "Album art, artist info, track numbers - everything tagged perfectly, automatically."
    },
    {
        icon: Zap,
        title: "Hi-Res Audio Support",
        description: "Support for up to 24-bit/192kHz audio. Experience music the way artists intended."
    }
];

const HIGHLIGHTS = [
    "Free forever, no subscriptions",
    "No ads, no tracking",
    "Works with Spotify URLs",
    "Batch download albums & playlists",
    "Built-in file manager",
    "Audio format converter"
];

const SHOWCASE_FEATURES = [
    {
        icon: Music,
        title: "Track Downloads",
        description: "Download individual tracks instantly with full metadata and album artwork embedded automatically."
    },
    {
        icon: Disc3,
        title: "Album Downloads",
        description: "Download complete albums with proper track ordering, disc numbers, and organized folder structure."
    },
    {
        icon: ListMusic,
        title: "Playlist Support",
        description: "Download entire playlists with all tracks organized in a single folder with sequential naming."
    },
    {
        icon: Headphones,
        title: "Hi-Res Audio",
        description: "Experience studio-quality sound with support for 24-bit/192kHz lossless audio formats."
    },
    {
        icon: FolderOpen,
        title: "File Manager",
        description: "Built-in file manager to browse, organize, and manage your downloaded music library."
    },
    {
        icon: Settings,
        title: "Audio Converter",
        description: "Convert between audio formats directly in the app. FLAC to MP3, WAV to FLAC, and more."
    }
];

export default function SavetunePage() {
    return (
        <main className="bg-background min-h-screen text-text-main">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden">
                {/* Background Glow - Blue */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase mb-8 border border-blue-500/20"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        A Hexoran Product
                    </motion.div>

                    {/* SaveTune Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-32 h-32 mx-auto mb-8 relative"
                    >
                        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                        <div className="relative z-10">
                            <SaveTuneLogo className="w-32 h-32" />
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                    >
                        SaveTune
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl md:text-2xl text-blue-400 font-medium mb-6"
                    >
                        Premium Lossless Music Downloader
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-text-muted max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Download high-quality FLAC and MP3 music with automatic metadata tagging,
                        synchronized lyrics embedding, and Hi-Res audio support up to 24-bit/192kHz.
                        Build your perfect music library with studio-quality audio files.
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/savetune/downloading">
                            <Button className="bg-blue-500 text-white hover:bg-blue-400 font-bold px-10 py-3 h-auto gap-2 shadow-lg shadow-blue-500/25">
                                <Download className="w-5 h-5" />
                                Download for Windows
                            </Button>
                        </Link>
                        <Link href="/docs">
                            <Button variant="outline" className="gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                                View Documentation
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap justify-center gap-3 mt-8"
                    >
                        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Heart className="w-3 h-3" />
                            Free Forever
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            <Shield className="w-3 h-3" />
                            No Ads
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                            <Zap className="w-3 h-3" />
                            Privacy First
                        </span>
                    </motion.div>
                </div>
            </section>

            {/* App Preview Section - Showcase */}
            <section className="py-20 px-6 bg-gradient-to-b from-blue-500/5 to-transparent border-y border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Designed for Collectors</h2>
                        <p className="text-xl text-text-muted max-w-2xl mx-auto">
                            Experience a premium, ad-free interface that puts your music first.
                        </p>
                    </div>

                    <AppShowcase />
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Core Features</h2>
                        <p className="text-text-muted">Everything you need for the perfect music library.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {FEATURES.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group p-6 rounded-2xl bg-surface/50 border border-white/5 hover:border-blue-500/30 transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                                        <Icon className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-text-muted text-sm leading-relaxed">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Showcase Features */}
            <section className="py-20 px-6 bg-surface/30 border-y border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Complete Music Toolkit</h2>
                        <p className="text-text-muted">More than just a downloader - a complete solution for music enthusiasts.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SHOWCASE_FEATURES.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-5 rounded-xl bg-surface/50 border border-white/5 hover:border-blue-500/20 transition-all"
                                >
                                    <Icon className="w-8 h-8 text-blue-400 mb-3" />
                                    <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-sm text-text-muted leading-relaxed">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Highlights */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Why SaveTune?</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {HIGHLIGHTS.map((item, index) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5"
                            >
                                <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <span className="text-sm text-white">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="p-12 rounded-3xl bg-gradient-to-b from-blue-500/10 to-transparent border border-blue-500/20">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to build your perfect library?
                        </h2>
                        <p className="text-text-muted mb-8">
                            Download SaveTune and start collecting lossless music today.
                        </p>
                        <Link href="/savetune/downloading">
                            <Button className="bg-blue-500 text-white hover:bg-blue-400 font-bold px-10 py-3 h-auto gap-2 shadow-lg shadow-blue-500/25">
                                <Download className="w-5 h-5" />
                                Download Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Disclaimer */}
            <section className="pb-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 mx-auto max-w-2xl">
                        <h4 className="text-white font-semibold mb-2 flex items-center justify-center gap-2">
                            <Shield className="w-4 h-4 text-blue-400" />
                            Disclaimer
                        </h4>
                        <p className="text-xs text-text-muted leading-relaxed">
                            SaveTune is intended for personal and educational use only. Users are responsible for complying with the terms of service of any third-party platforms they interact with. We do not encourage or condone copyright infringement or the distribution of copyrighted material. Please respect artists and support them by purchasing their official releases.
                        </p>
                    </div>
                </div>
            </section>

        </main>
    );
}
