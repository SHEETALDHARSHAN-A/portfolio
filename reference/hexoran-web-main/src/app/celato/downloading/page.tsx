"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, ShieldCheck, Zap, HelpCircle, Loader2, CheckCircle2, Monitor, Command, Terminal, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type OS = 'windows' | 'mac' | 'linux';

interface ReleaseAsset {
    name: string;
    browser_download_url: string;
}

interface ReleaseData {
    tag_name: string;
    assets: ReleaseAsset[];
}

export default function DownloadingPage() {
    const [os, setOs] = useState<OS>('windows');
    const [downloadUrl, setDownloadUrl] = useState<string>("");
    const [winUrl, setWinUrl] = useState<string>("");
    const [macUrl, setMacUrl] = useState<string>("");
    const [linuxUrl, setLinuxUrl] = useState<string>("");
    const [filename, setFilename] = useState<string>("");
    const [version, setVersion] = useState<string>("Latest");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const hasStarted = useRef(false);

    // 1. Detect OS & Fetch Release
    useEffect(() => {
        const detectOS = (): OS => {
            const ua = window.navigator.userAgent.toLowerCase();
            if (ua.includes('mac')) return 'mac';
            if (ua.includes('linux')) return 'linux';
            return 'windows';
        };

        const fetchRelease = async () => {
            try {
                const detectedOS = detectOS();
                setOs(detectedOS);

                let data: ReleaseData;

                // Try fetching 'latest' first
                let response = await fetch('https://api.github.com/repos/hexoran-org/releases/latest');

                if (response.ok) {
                    data = await response.json();
                } else {
                    // Fallback: Fetch all releases and take the first one (handles Pre-releases)
                    console.log("Latest release not found, trying release list...");
                    const listResponse = await fetch('https://api.github.com/repos/hexoran-org/releases/releases?per_page=1');
                    if (!listResponse.ok) throw new Error("Failed to fetch releases");
                    const listData = await listResponse.json();
                    if (listData.length === 0) throw new Error("No releases found");
                    data = listData[0];
                }

                setVersion(data.tag_name);

                // Find all assets
                const winAsset = data.assets.find(a => a.name.endsWith('.exe'));
                const macAsset = data.assets.find(a => a.name.endsWith('.dmg'));
                const linuxAsset = data.assets.find(a => a.name.endsWith('.tar.gz'));

                if (winAsset) setWinUrl(winAsset.browser_download_url);
                if (macAsset) setMacUrl(macAsset.browser_download_url);
                if (linuxAsset) setLinuxUrl(linuxAsset.browser_download_url);

                // Find asset based on OS
                let asset: ReleaseAsset | undefined;
                if (detectedOS === 'windows') asset = winAsset;
                else if (detectedOS === 'mac') asset = macAsset;
                else if (detectedOS === 'linux') asset = linuxAsset;

                if (asset) {
                    setDownloadUrl(asset.browser_download_url);
                    setFilename(asset.name);
                } else {
                    // Fallback to manual Github page if asset not found
                    setDownloadUrl(`https://github.com/hexoran-org/releases/releases/tag/${data.tag_name}`);
                    setFilename("GitHub Releases");
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Could not load latest release.");
                setDownloadUrl("https://github.com/hexoran-org/releases");
                setLoading(false);
            }
        };

        fetchRelease();
    }, []);

    // 2. Simulate Progress & Trigger Download
    useEffect(() => {
        if (loading || !downloadUrl || hasStarted.current) return;
        hasStarted.current = true;

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
    }, [loading, downloadUrl]);

    const triggerDownload = () => {
        if (!downloadUrl) return;
        try {
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', filename);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error("Auto-download failed", e);
        }
    };

    const getInstructions = () => {
        if (os === 'windows') {
            return (
                <>
                    <p className="text-xs font-semibold text-zinc-300">Windows Protected your PC?</p>
                    <p className="text-[10px] text-zinc-500">
                        We are currently updating our code signing certificate.
                        <br />Click <strong className="text-zinc-300">More Info</strong> → <strong className="text-zinc-300">Run Anyway</strong>.
                    </p>
                </>
            );
        } else if (os === 'mac') {
            return (
                <>
                    <p className="text-xs font-semibold text-zinc-300">"Unidentified Developer" Warning?</p>
                    <p className="text-[10px] text-zinc-500">
                        1. Open <strong>System Settings</strong> → <strong>Privacy & Security</strong>.
                        <br />2. Scroll down and click <strong className="text-zinc-300">Open Anyway</strong> next to Celato.
                    </p>
                </>
            );
        } else {
            return (
                <>
                    <p className="text-xs font-semibold text-zinc-300">Extract & Run</p>
                    <p className="text-[10px] text-zinc-500 font-mono">
                        tar -xzf {filename}
                        <br />./celato
                    </p>
                </>
            );
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#020202] text-white flex flex-col items-center relative overflow-hidden selection:bg-primary/30 font-sans">

            {/* --- Vibrant Background --- */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] rounded-full bg-gradient-to-tr from-violet-600/10 via-primary/5 to-cyan-500/10 blur-[100px] pointer-events-none"
            />

            <div className="container flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto px-6 relative z-10 pt-32 pb-12">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center w-full">

                    {/* LEFT COL: Brand & Value */}
                    <div className="hidden md:block space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-medium text-emerald-400 backdrop-blur-md"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                            </span>
                            {version} Stable Build
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-6xl lg:text-7xl font-bold tracking-tight text-white font-heading leading-[1.1]"
                        >
                            Your Edge <br />
                            <span className="bg-gradient-to-r from-primary via-violet-400 to-cyan-400 bg-clip-text text-transparent">Is Loading.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-gray-400 leading-relaxed max-w-md"
                        >
                            Celato is preparing to install for <strong className="text-white capitalize">{os}</strong>. Get ready to dominate your next technical interview.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="space-y-4 pt-4"
                        >
                            {[
                                { title: "VirusTotal Verified", desc: "0/70 Detections - Clean", icon: ShieldCheck, color: "text-emerald-400" },
                                { title: "Code Signed", desc: "Hexoran Technologies Authenticated", icon: CheckCircle2, color: "text-blue-400" },
                                { title: "Native Performance", desc: "C++ Core - Zero Bloat", icon: Zap, color: "text-amber-400" },
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
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none opacity-50 group-hover:opacity-70 transition-opacity" />

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
                                                <stop offset="0%" stopColor="#8b5cf6" />
                                                <stop offset="100%" stopColor="#06b6d4" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                                        {loading ? (
                                            <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
                                        ) : progress < 100 ? (
                                            <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
                                        ) : (
                                            <Download className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {loading ? "Checking System..." : progress < 100 ? `Downloading for ${os === 'windows' ? 'Windows' : os === 'mac' ? 'Mac' : 'Linux'}...` : "Download Ready"}
                                </h2>
                                <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto">
                                    {filename || "Fetching latest version..."}
                                </p>

                                <a href={downloadUrl} download={filename} className="w-full">
                                    <Button disabled={loading} className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-bold text-base rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                        {progress < 100 ? "Starting Automatically..." : "Click to Restart Download"}
                                    </Button>
                                    <div className="text-[10px] text-zinc-500 mt-2 font-mono uppercase">Version {version}</div>
                                </a>

                                {/* Integrated Help Box */}
                                <div className="mt-8 w-full bg-[#151515] rounded-xl border border-white/5 p-4 space-y-3">
                                    <div className="flex items-start gap-3 text-left">
                                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            {getInstructions()}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-4 justify-center text-xs text-zinc-500">
                                    {winUrl && <a href={winUrl} download className="hover:text-white flex items-center gap-1"><Monitor className="w-3 h-3" /> Windows (.exe)</a>}
                                    {macUrl && <a href={macUrl} download className="hover:text-white flex items-center gap-1"><Command className="w-3 h-3" /> Mac (.dmg)</a>}
                                    {linuxUrl && <a href={linuxUrl} download className="hover:text-white flex items-center gap-1"><Terminal className="w-3 h-3" /> Linux (.tar.gz)</a>}
                                </div>
                            </div>
                        </motion.div>

                        <div className="mt-8 text-center max-w-sm mx-auto">
                            <p className="text-[10px] text-zinc-600 leading-snug">
                                By installing, you agree to our <Link href="/legal/terms" className="underline hover:text-zinc-400">Terms</Link>.
                                This tool is for educational use. Hexoran is not liable for misuse.
                            </p>
                        </div>

                        <div className="mt-6 text-center">
                            <Link href="/celato" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                                <ArrowLeft className="w-3 h-3" /> Back to Website
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </div >
    );
}
