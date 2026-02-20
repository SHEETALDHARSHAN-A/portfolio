"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
    Terminal,
    Key,
    Database,
    Cpu,
    Shield,
    HelpCircle,
    AlertTriangle,
    ChevronRight,
    Sparkles,
    Music,
    Mic,
    Download,
    FileMusic,
    Settings,
    UserCheck,
    Check
} from 'lucide-react';
import { GeminiLogo, GroqLogo, CelatoLogo, SaveTuneLogo } from '@/components/logos';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type ProductTab = 'celato' | 'savetune' | 'stook';

const PRODUCTS = [
    {
        id: 'celato' as ProductTab,
        name: 'Celato',
        icon: CelatoLogo,
        color: 'text-violet-400',
        bgColor: 'bg-violet-500/10',
        borderColor: 'border-violet-500/20',
        hoverBorder: 'group-hover:border-violet-500/50',
        description: 'AI Interview Copilot',
        gradient: 'from-violet-500/20 to-cyan-500/20'
    },
    {
        id: 'savetune' as ProductTab,
        name: 'SaveTune',
        icon: SaveTuneLogo,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        hoverBorder: 'group-hover:border-blue-500/50',
        description: 'Lossless Music Downloader',
        gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
        id: 'stook' as ProductTab,
        name: 'Stook',
        icon: Mic, // Fallback icon until logo is ready
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/20',
        hoverBorder: 'group-hover:border-amber-500/50',
        description: 'AI Meeting Notes (Coming Soon)',
        gradient: 'from-amber-500/20 to-orange-500/20'
    },
];


export default function DocsPage() {
    const [activeTab, setActiveTab] = useState<ProductTab>('celato');

    return (
        <main className="min-h-screen bg-background text-text-main pt-32 pb-20 px-6">
            <div className="max-w-5xl mx-auto">

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Documentation</h1>
                    <p className="text-xl text-text-muted">Select a product to view its documentation</p>
                </motion.div>

                {/* Product Tabs - Optimized Design */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 px-4">
                    {PRODUCTS.map((product) => {
                        const Icon = product.icon;
                        const isActive = activeTab === product.id;
                        return (
                            <button
                                key={product.id}
                                onClick={() => setActiveTab(product.id)}
                                className={cn(
                                    "group relative flex flex-col items-center justify-center p-8 rounded-3xl border transition-all duration-300 h-64 overflow-hidden",
                                    isActive
                                        ? `bg-black/40 border-white/10 shadow-2xl`
                                        : "bg-surface/30 border-white/5 hover:bg-surface/50 hover:border-white/10"
                                )}
                            >
                                {/* Active State Glow Background */}
                                {isActive && (
                                    <div className={cn(
                                        "absolute inset-0 opacity-20 bg-gradient-to-br transition-opacity duration-500",
                                        product.gradient
                                    )} />
                                )}

                                {/* Hover Glow */}
                                <div className={cn(
                                    "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br",
                                    product.gradient
                                )} />

                                {/* Icon Container */}
                                <div className={cn(
                                    "relative w-24 h-24 mb-6 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-2xl",
                                    isActive ? "bg-white/5 shadow-white/5" : "bg-white/[0.02]"
                                )}>
                                    <Icon className={cn("w-12 h-12 transition-all duration-300",
                                        isActive ? "drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "opacity-70 group-hover:opacity-100"
                                    )} />
                                </div>

                                {/* Text Content */}
                                <div className="relative z-10 text-center space-y-2">
                                    <h3 className={cn(
                                        "text-xl font-bold transition-colors duration-300",
                                        isActive ? "text-white scale-105" : "text-white/70 group-hover:text-white"
                                    )}>
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-text-muted font-medium px-4">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Active Indicator Bar */}
                                <div className={cn(
                                    "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r transition-all duration-300 opacity-0 transform translate-y-2",
                                    product.gradient,
                                    isActive && "opacity-100 translate-y-0"
                                )} />
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'celato' && (
                        <motion.div
                            key="celato"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            {/* Celato Docs */}
                            <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-bold text-white">Getting Started with Celato</h2>
                                    <Link href="/celato/docs">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-colors text-sm font-medium cursor-pointer">
                                            View Full Documentation
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </Link>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-surface/50 border border-white/5 rounded-2xl">
                                        <Terminal className="w-8 h-8 text-violet-400 mb-4" />
                                        <h3 className="text-lg font-semibold text-white mb-2">Installation</h3>
                                        <p className="text-sm text-text-muted mb-4">Download from hexoran.com/celato</p>
                                        <ul className="text-sm text-text-muted space-y-1">
                                            <li>• Windows: .exe installer</li>
                                            <li>• macOS: .dmg file</li>
                                            <li>• Linux: .tar.gz archive</li>
                                        </ul>
                                    </div>
                                    <div className="p-6 bg-surface/50 border border-white/5 rounded-2xl">
                                        <Key className="w-8 h-8 text-cyan-400 mb-4" />
                                        <h3 className="text-lg font-semibold text-white mb-2">API Setup</h3>
                                        <p className="text-sm text-text-muted mb-4">Complete privacy with local processing. Bring your own keys.</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-300">Gemini 2.0</span>
                                            <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs font-medium text-orange-300">Groq (Llama 3)</span>
                                            <span className="px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-300">GPT-4o</span>
                                            <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs font-medium text-violet-300">Claude 3.7</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6 pt-8 border-t border-white/5">
                                <h2 className="text-2xl font-bold text-white">API Configuration</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-6 bg-violet-500/5 border border-violet-500/20 rounded-2xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 relative z-10">
                                            <GeminiLogo className="w-6 h-6" />
                                            Google Gemini
                                            <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full border border-violet-500/20">Recommended</span>
                                        </h3>
                                        <ol className="list-decimal pl-5 space-y-2 text-text-muted relative z-10 text-sm">
                                            <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-violet-400 hover:text-violet-300 hover:underline">Google AI Studio</a></li>
                                            <li>Sign in and click Create API Key</li>
                                            <li>Copy key starting with <code className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5">AIza...</code></li>
                                        </ol>
                                    </div>

                                    <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-2xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 relative z-10">
                                            <GroqLogo className="w-6 h-6 text-orange-500" />
                                            Groq API
                                            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/20">Fastest</span>
                                        </h3>
                                        <p className="text-sm text-text-muted mb-3 relative z-10">Get ultra-fast inference speeds with Llama 3 models on Groq.</p>
                                        <Link href="/docs/groq-setup" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-medium relative z-10 hover:underline">
                                            View Setup Guide <ChevronRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6 pt-8 border-t border-white/5">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <HelpCircle className="w-6 h-6 text-violet-400" />
                                    FAQ
                                </h2>
                                <div className="space-y-4">
                                    <div className="p-5 bg-surface/50 border border-white/5 rounded-xl">
                                        <h4 className="font-semibold text-white mb-2">Is Celato detectable?</h4>
                                        <p className="text-sm text-text-muted">Overlay is invisible to screen sharing. Phantom Mode processes locally.</p>
                                    </div>
                                    <div className="p-5 bg-surface/50 border border-white/5 rounded-xl">
                                        <h4 className="font-semibold text-white mb-2">Code vs Live Mode?</h4>
                                        <p className="text-sm text-text-muted">Code: Screenshot analysis. Live: Real-time speech transcription.</p>
                                    </div>
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'savetune' && (
                        <motion.div
                            key="savetune"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            {/* SaveTune Docs */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <SaveTuneLogo className="w-16 h-16 text-blue-500" />
                                    <div>
                                        <h2 className="text-3xl font-bold text-white">SaveTune Guide</h2>
                                        <p className="text-blue-400">Complete setup and usage guide</p>
                                    </div>
                                </div>

                                {/* Prerequisites - Spotify Key & FFMPEG */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                                <Key className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white">1. Get Spotify Keys</h3>
                                        </div>
                                        <p className="text-sm text-text-muted mb-4">You need free Spotify API credentials to fetch metadata.</p>
                                        <ol className="list-decimal pl-5 space-y-2 text-sm text-text-muted">
                                            <li>Log in to <a href="https://developer.spotify.com/dashboard" target="_blank" className="text-blue-400 hover:underline font-medium">Spotify Developer Dashboard</a></li>
                                            <li>Click <strong className="text-white">Create App</strong> and enter any name</li>
                                            <li>Go to Settings to find your <code className="bg-zinc-800 px-1 py-0.5 rounded text-white">Client ID</code> and <code className="bg-zinc-800 px-1 py-0.5 rounded text-white">Client Secret</code></li>
                                            <li>Copy these keys into SaveTune Settings</li>
                                        </ol>
                                    </div>

                                    <div className="p-6 bg-surface/50 border border-white/5 rounded-2xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                                <Cpu className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white">2. FFmpeg Setup</h3>
                                        </div>
                                        <p className="text-sm text-text-muted mb-4">Required for audio conversion and metadata tagging.</p>
                                        <ul className="space-y-2 text-sm text-text-muted">
                                            <li className="flex items-start gap-2">
                                                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                                <span>SaveTune handles FFmpeg automatically on first run</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                                <span>If prompted, click "Install FFmpeg" in Settings</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                                <span>Restart app after installation if needed</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6 pt-8 border-t border-white/5">
                                <h2 className="text-2xl font-bold text-white">How to Use</h2>
                                <div className="space-y-4">
                                    <div className="p-5 bg-surface/50 border border-white/5 rounded-xl flex gap-4 transition-all hover:border-blue-500/20">
                                        <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold flex-shrink-0">1</span>
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">Configure Settings</h4>
                                            <p className="text-sm text-text-muted mb-2">Open Settings <Settings className="w-3 h-3 inline mx-1" /> and paste your Spotify Client ID and Secret.</p>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-surface/50 border border-white/5 rounded-xl flex gap-4 transition-all hover:border-blue-500/20">
                                        <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold flex-shrink-0">2</span>
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">Select Quality</h4>
                                            <p className="text-sm text-text-muted">Choose your preferred format: <span className="text-white">FLAC (Lossless)</span> for best quality or <span className="text-white">MP3 320kbps</span> for smaller files.</p>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-surface/50 border border-white/5 rounded-xl flex gap-4 transition-all hover:border-blue-500/20">
                                        <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold flex-shrink-0">3</span>
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">Download Music</h4>
                                            <p className="text-sm text-text-muted">Copy any Spotify track/album/playlist URL, paste it into SaveTune, and hit Download.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6 pt-8 border-t border-white/5">
                                <h2 className="text-2xl font-bold text-white">Troubleshooting</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-surface/50 border border-white/5 rounded-xl">
                                        <h4 className="font-semibold text-white text-sm mb-2">Download Failed?</h4>
                                        <p className="text-xs text-text-muted">Check your internet connection and ensure Spotify API keys are valid. Rate limits may apply.</p>
                                    </div>
                                    <div className="p-4 bg-surface/50 border border-white/5 rounded-xl">
                                        <h4 className="font-semibold text-white text-sm mb-2">Metadata Missing?</h4>
                                        <p className="text-xs text-text-muted">Ensure FFmpeg is installed correctly. Go to Settings to verify installation status.</p>
                                    </div>
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'stook' && (
                        <motion.div
                            key="stook"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center py-20"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                                <Mic className="w-10 h-10 text-amber-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Stook Documentation</h2>
                            <p className="text-text-muted mb-8">Coming Soon</p>
                            <p className="text-sm text-text-muted max-w-md mx-auto">
                                Stook is currently in development. Join the waitlist to be notified when it launches.
                            </p>
                            <Link href="/stook" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-amber-500/10 text-amber-400 font-medium rounded-full border border-amber-500/30 hover:bg-amber-500/20 transition-colors">
                                Join Waitlist
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </main>
    );
}
