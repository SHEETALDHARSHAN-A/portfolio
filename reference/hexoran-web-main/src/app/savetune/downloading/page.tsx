"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, ShieldCheck, Zap, HelpCircle, Loader2, CheckCircle2, Monitor, Command, Terminal, AlertTriangle, Music } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SaveTuneDownloadingPage() {
    const [downloadUrl, setDownloadUrl] = useState<string>("https://github.com/hexoran-org/releases/releases/download/savetune-v1.0.0/Savetune.zip");
    const [filename, setFilename] = useState<string>("Savetune.zip");
    const [version, setVersion] = useState<string>("v1.0.0");
    const [progress, setProgress] = useState(0);

    // Simulate Progress & Trigger Download
    useEffect(() => {
        const duration = 1500;
        const startTime = Date.now();

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);
            setProgress(newProgress);

            if (newProgress >= 100) {
                clearInterval(timer);
                triggerDownload();
            }
        }, 50);

        return () => clearInterval(timer);
    }, []);

    const triggerDownload = () => {
        try {
            window.location.href = downloadUrl;
        } catch (e) {
            console.error("Auto-download failed", e);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#020202] text-white flex flex-col items-center relative overflow-hidden selection:bg-blue-500/30 font-sans">

            {/* --- Vibrant Background --- */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] rounded-full bg-gradient-to-tr from-blue-600/10 via-cyan-500/5 to-emerald-500/10 blur-[100px] pointer-events-none"
            />

            <div className="container flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto px-6 relative z-10 pt-32 pb-12">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center w-full">

                    {/* LEFT COL: Brand & Value */}
                    <div className="hidden md:block space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-medium text-blue-400 backdrop-blur-md"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
                            </span>
                            {version} Release
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-6xl lg:text-7xl font-bold tracking-tight text-white font-heading leading-[1.1]"
                        >
                            Your Music. <br />
                            <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Unleashed.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-gray-400 leading-relaxed max-w-md"
                        >
                            SaveTune is preparing to install. Get ready to download lossless audio from your favorite streaming services.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="space-y-4 pt-4"
                        >
                            {[
                                { title: "VirusTotal Verified", desc: "100% Clean Installation", icon: ShieldCheck, color: "text-emerald-400" },
                                { title: "Lossless Audio", desc: "FLAC & 320kbps MP3 Engine", icon: Music, color: "text-blue-400" },
                                { title: "Metadata Tagger", desc: "Automatic ID3 Tagging", icon: Zap, color: "text-cyan-400" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                                    <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${item.color}`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">{item.title}</div>
                                        <div className="text-xs text-gray-500">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* RIGHT COL: Download Card */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                            className="relative bg-[#0F0F0F]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 lg:p-10 shadow-2xl overflow-hidden group"
                        >
                            {/* Card Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none opacity-50 group-hover:opacity-70 transition-opacity" />

                            <div className="flex flex-col items-center text-center relative z-10">

                                {/* Progress Circular */}
                                <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="4" />
                                        <motion.circle
                                            cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round"
                                            strokeDasharray="283"
                                            strokeDashoffset={283 - (283 * progress) / 100}
                                            transition={{ duration: 0.1, ease: "linear" }}
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#06b6d4" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                                        {progress < 100 ? (
                                            <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
                                        ) : (
                                            <Download className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {progress < 100 ? `Downloading for Windows...` : "Download Ready"}
                                </h2>
                                <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto">
                                    {filename}
                                </p>

                                <a href={downloadUrl} download={filename} className="w-full">
                                    <Button className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-bold text-base rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                        {progress < 100 ? "Starting Automatically..." : "Click to Restart Download"}
                                    </Button>
                                    <div className="text-[10px] text-zinc-500 mt-2 font-mono uppercase">Version {version}</div>
                                </a>

                                {/* Integrated Help Box */}
                                <div className="mt-8 w-full bg-[#151515] rounded-xl border border-white/5 p-4 space-y-4 text-left">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-zinc-300">Format Changed to ZIP</p>
                                            <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                                                To avoid false virus detections, we are now distributing as a ZIP file.
                                                <br />
                                                <strong>1.</strong> Extract the ZIP file. <br />
                                                <strong>2.</strong> Run <strong>Savetune-Setup.exe</strong> to install.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 border-t border-white/5 pt-3">
                                        <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-zinc-300">Windows SmartScreen?</p>
                                            <p className="text-[10px] text-zinc-500 mt-1">
                                                Click <strong className="text-zinc-300">More Info</strong> → <strong className="text-zinc-300">Run Anyway</strong> to install.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </motion.div>

                        <div className="mt-8 text-center max-w-sm mx-auto">
                            <p className="text-[10px] text-zinc-600 leading-snug">
                                By installing, you agree to our <Link href="/legal/terms" className="underline hover:text-zinc-400">Terms</Link>.
                                Tool is for personal data backup only.
                            </p>
                        </div>

                        <div className="mt-6 text-center">
                            <Link href="/savetune" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                                <ArrowLeft className="w-3 h-3" /> Back to SaveTune
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </div >
    );
}
