"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Book,
    Camera,
    Mic,
    EyeOff,
    Keyboard,
    HelpCircle,
    ChevronRight,
    Download,
    Settings,
    Zap,
    Play,
    Square,
    ArrowLeft,
    Monitor,
    Volume2,
    Brain,
    Shield,
    CheckCircle2,
    AlertCircle,
    Copy,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CelatoLogo, GeminiLogo, GroqLogo } from "@/components/logos";

type DocSection = "getting-started" | "code-mode" | "live-mode" | "phantom-mode" | "shortcuts" | "troubleshooting";

const sections = [
    { id: "getting-started" as DocSection, title: "Getting Started", icon: Download },
    { id: "code-mode" as DocSection, title: "Code Mode", icon: Camera },
    { id: "live-mode" as DocSection, title: "Live Mode", icon: Mic },
    { id: "phantom-mode" as DocSection, title: "Phantom Mode", icon: EyeOff },
    { id: "shortcuts" as DocSection, title: "Keyboard Shortcuts", icon: Keyboard },
    { id: "troubleshooting" as DocSection, title: "Troubleshooting", icon: HelpCircle },
];

const shortcuts = [
    { keys: "Ctrl + H", action: "Take Screenshot", description: "Capture your screen and add to queue" },
    { keys: "Ctrl + Enter", action: "Process / Answer", description: "Process screenshots OR trigger manual answer in Live Mode" },
    { keys: "Ctrl + R", action: "Reset", description: "Clear all queues, stop Live Mode, reset window position" },
    { keys: "Ctrl + B", action: "Toggle Visibility", description: "Show/hide the Celato window" },
    { keys: "Ctrl + L", action: "Delete Last", description: "Remove the last screenshot from queue" },
    { keys: "Ctrl + Q", action: "Quit", description: "Close Celato completely" },
    { keys: "Ctrl + [", action: "Decrease Opacity", description: "Make window more transparent" },
    { keys: "Ctrl + ]", action: "Increase Opacity", description: "Make window more visible" },
    { keys: "Ctrl + ←/→/↑/↓", action: "Move Window", description: "Reposition window on screen" },
    { keys: "Ctrl + -/+/0", action: "Zoom", description: "Zoom out / in / reset" },
];

function ShortcutRow({ keys, action, description }: { keys: string; action: string; description: string }) {
    return (
        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="py-3 px-4">
                <code className="px-2 py-1 bg-white/10 rounded text-primary font-mono text-sm">{keys}</code>
            </td>
            <td className="py-3 px-4 font-medium text-white">{action}</td>
            <td className="py-3 px-4 text-text-muted text-sm">{description}</td>
        </tr>
    );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
    return (
        <div className="flex gap-4 mb-6">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">
                {number}
            </div>
            <div className="flex-1">
                <h4 className="text-white font-medium mb-2">{title}</h4>
                <div className="text-text-muted text-sm leading-relaxed">{children}</div>
            </div>
        </div>
    );
}

function Tip({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20 my-4">
            <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">{children}</div>
        </div>
    );
}

function Warning({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 my-4">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">{children}</div>
        </div>
    );
}

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState<DocSection>("getting-started");

    return (
        <main className="min-h-screen bg-background text-text-main">
            {/* Header */}
            <header className="border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/celato" className="group flex items-center gap-2 text-text-muted hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back
                        </Link>
                        <div className="h-6 w-px bg-white/10" />
                        <div className="flex items-center gap-2.5">
                            <CelatoLogo className="w-6 h-6 text-primary" />
                            <span className="font-bold text-white tracking-tight">Celato Docs</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-12 flex items-start gap-12">
                {/* Sidebar */}
                <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-32">
                    <div className="mb-6 px-4">
                        <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Contents</h5>
                    </div>
                    <nav className="space-y-0.5">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group relative",
                                    activeSection === section.id
                                        ? "text-white bg-primary/10"
                                        : "text-text-muted hover:text-white hover:bg-white/5"
                                )}
                            >
                                {activeSection === section.id && (
                                    <motion.div
                                        layoutId="activeDocs"
                                        className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                                    />
                                )}
                                <section.icon className={cn(
                                    "w-5 h-5 transition-colors",
                                    activeSection === section.id ? "text-primary" : "text-gray-500 group-hover:text-gray-300"
                                )} />
                                <span className="text-sm font-medium">{section.title}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-20">
                    {/* Mobile Nav */}
                    <div className="lg:hidden mb-8 overflow-x-auto pb-4 scrollbar-hide">
                        <div className="flex gap-2">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all border",
                                        activeSection === section.id
                                            ? "bg-primary text-white border-primary"
                                            : "bg-surface border-white/10 text-text-muted hover:text-white hover:border-white/20"
                                    )}
                                >
                                    <section.icon className="w-4 h-4" />
                                    {section.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="prose prose-invert prose-headings:font-bold prose-a:text-primary max-w-none">
                        {activeSection === "getting-started" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="mb-10">
                                    <h1 className="text-4xl font-bold text-white mb-4">Getting Started</h1>
                                    <p className="text-xl text-text-muted">Follow these steps to set up Celato and start using it in your interviews.</p>
                                </div>

                                <div className="space-y-10">
                                    <div className="space-y-6">
                                        <h2 className="flex items-center gap-3 text-2xl text-white border-b border-white/10 pb-4">
                                            <div className="p-2 bg-primary/10 rounded-lg"><Download className="w-5 h-5 text-primary" /></div>
                                            Installation
                                        </h2>

                                        <div className="grid gap-6">
                                            <Step number={1} title="Download Celato">
                                                Visit <Link href="/celato/downloading" className="text-primary hover:text-primary/80 font-medium">hexoran.com/celato/downloading</Link> and download the installer for your operating system (Windows, macOS, or Linux).
                                            </Step>
                                            <Step number={2} title="Install the Application">
                                                Run the installer. On Windows, you may see a SmartScreen warning - click "More info" → "Run anyway". The app is completely safe.
                                            </Step>
                                            <Step number={3} title="Launch & Sign In">
                                                Open Celato. You'll be prompted to sign in with your Hexoran account to sync your subscription.
                                            </Step>
                                        </div>

                                        <div className="mt-8 grid md:grid-cols-2 gap-4">
                                            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1c1c1f] to-[#121214] border border-white/5 hover:border-violet-500/20 transition-all group">
                                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                                    <GeminiLogo className="w-5 h-5" /> Google Gemini
                                                </h3>
                                                <p className="text-sm text-text-muted mb-4">Recommended for good balance of speed and reasoning.</p>
                                                <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-xs font-bold text-violet-400 uppercase tracking-wider group-hover:underline">Get Key →</a>
                                            </div>

                                            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1c1c1f] to-[#121214] border border-white/5 hover:border-orange-500/20 transition-all group">
                                                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                                    <GroqLogo className="w-5 h-5 text-orange-500" /> Groq API
                                                </h3>
                                                <p className="text-sm text-text-muted mb-4">Fastest inference speed. Best for Live Mode.</p>
                                                <Link href="/docs/groq-setup" className="text-xs font-bold text-orange-400 uppercase tracking-wider group-hover:underline">Setup Guide →</Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-8">
                                        <h2 className="flex items-center gap-3 text-2xl text-white border-b border-white/10 pb-4">
                                            <div className="p-2 bg-primary/10 rounded-lg"><Play className="w-5 h-5 text-primary" /></div>
                                            First Use
                                        </h2>
                                        <div className="grid gap-4">
                                            <Step number={1} title="Position the Window">Drag Celato to a corner. Use Ctrl+Arrows for precision.</Step>
                                            <Step number={2} title="Capture (Ctrl+H)">Take a screenshot of code or question.</Step>
                                            <Step number={3} title="Process (Ctrl+Enter)">Get instant AI analysis and answers.</Step>
                                            <Step number={4} title="Reset (Ctrl+R)">Clear the context for the next problem.</Step>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Re-implementing other sections with enhanced styling as requested */}
                        {activeSection === "code-mode" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="mb-10">
                                    <h1 className="text-4xl font-bold text-white mb-4">Code Mode</h1>
                                    <p className="text-xl text-text-muted">Master coding assessments and technical screens.</p>
                                </div>
                                <div className="space-y-8">
                                    <div className="p-6 rounded-2xl bg-surface border border-white/5 shadow-2xl">
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                            <Camera className="w-6 h-6 text-blue-400" /> Screenshot Analysis
                                        </h3>
                                        <Step number={1} title="Capture">Press <Kbd>Ctrl</Kbd> + <Kbd>H</Kbd> to snap the problem statement.</Step>
                                        <Step number={2} title="Queue">Take multiple snaps for long problems.</Step>
                                        <Step number={3} title="Solve">Press <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd> for the optimal solution.</Step>

                                        <Tip>Set your preferred language in Settings → General to get code in Python, C++, Java, etc.</Tip>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="p-6 rounded-2xl bg-surface/50 border border-white/5">
                                            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-purple-400" /> Analyzing Code</h3>
                                            <p className="text-sm text-text-muted mb-4">Supported Languages: Python, Java, C++, JavaScript, Go, Rust, SQL, and more.</p>
                                            <Step number={1} title="Snap">Capture problem statement.</Step>
                                            <Step number={2} title="Action">Choose 'Simplify', 'Debug', or 'Solve'.</Step>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-surface/50 border border-white/5">
                                            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-gray-400" /> Smart Context</h3>
                                            <p className="text-sm text-text-muted mb-4">Upload your PDF resume in settings.</p>
                                            <div className="text-sm text-gray-300">Celato adapts answers to match your experience level (e.g., Senior vs Junior).</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === "live-mode" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="mb-10">
                                    <h1 className="text-4xl font-bold text-white mb-4">Live Mode</h1>
                                    <p className="text-xl text-text-muted">Real-time interview assistance for Zoom, Teams, and Meet.</p>
                                </div>

                                <div className="grid gap-8">
                                    <div className="p-8 rounded-3xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20">
                                        <div className="flex items-start gap-6">
                                            <div className="p-4 rounded-2xl bg-amber-500/20 text-amber-500"><Mic className="w-8 h-8" /></div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-2">Live Intelligence</h3>
                                                <p className="text-text-muted mb-6">Celato listens to system audio (Zoom/Teams) and reads your screen simultaneously.</p>
                                                <div className="space-y-4">
                                                    <Step number={1} title="Instant Transcription">Real-time captions using Groq or Local models.</Step>
                                                    <Step number={2} title="Analyze Screen">Click the 'Scan' button or press <Kbd>Ctrl</Kbd> + <Kbd>/</Kbd> to read shared content.</Step>
                                                    <Step number={3} title="Smart Answers">Celato combines audio + visual context to generate the perfect response.</Step>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="p-6 rounded-2xl bg-surface border border-white/5">
                                            <h3 className="font-bold text-white mb-2">Auto-Answer Mode</h3>
                                            <p className="text-sm text-text-muted mb-4">Hands-free operation.</p>
                                            <p className="text-sm text-gray-300">Enable in settings. Celato detects questions automatically and generates answers without key presses.</p>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-surface border border-white/5">
                                            <h3 className="font-bold text-white mb-2">Company Context</h3>
                                            <p className="text-sm text-text-muted mb-4">Tailored Answers.</p>
                                            <p className="text-sm text-gray-300">Enter the company name & URL in settings. Celato will research their tech stack and values to tailor your answers.</p>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-surface border border-white/5">
                                            <h3 className="font-bold text-white mb-2">Rich Actions</h3>
                                            <p className="text-sm text-text-muted mb-4">Beyond simple text.</p>
                                            <p className="text-sm text-gray-300">Use <strong>Simplify</strong> to explain complex topics like you're 5, or <strong>Fact Check</strong> to verify claims instantly.</p>
                                        </div>
                                    </div>

                                    <Warning>
                                        <strong>Use Responsibly:</strong> Use AI answers as bullet points to guide your speech. Do not read verbatim.
                                    </Warning>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === "phantom-mode" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="mb-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase mb-4 border border-purple-500/20">Pro Feature</div>
                                    <h1 className="text-4xl font-bold text-white mb-4">Phantom Mode</h1>
                                    <p className="text-xl text-text-muted">Invisible background surveillance with zero UI footprint.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="p-6 rounded-xl bg-purple-500/5 border border-purple-500/20">
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">How it works</h3>
                                        <p className="text-gray-300 mb-4">Celato disguises itself as <code className="text-purple-300">RuntimeBroker.exe</code> and runs in the background. It sends interview answers to your private Supabase database or Companion App.</p>
                                        <Warning>Requires Pro Plan + Your own Supabase Project (Free Tier).</Warning>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-white">Setup Guide</h3>
                                        <Step number={1} title="Configure Supabase">Enter your Project URL & Service Key in Settings → Phantom.</Step>
                                        <Step number={2} title="Run Auto-Setup">Click "Setup Phantom" to create database tables.</Step>
                                        <Step number={3} title="Activate">Click "Activate". Celato will vanish.</Step>
                                        <Step number={4} title="View Answers">Use the <Link href="/companion" className="text-purple-400 font-bold hover:underline">Companion App</Link> on your phone to see results.</Step>
                                    </div>

                                    <Tip>To exit Phantom Mode, simply run the Celato shortcut again.</Tip>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === "shortcuts" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <h1 className="text-3xl font-bold text-white mb-8">Keyboard Shortcuts</h1>
                                <div className="rounded-2xl border border-white/10 overflow-hidden bg-surface">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white/5 border-b border-white/10">
                                                <th className="p-4 font-bold text-white">Shortcut</th>
                                                <th className="p-4 font-bold text-white">Action</th>
                                                <th className="p-4 font-bold text-white hidden md:table-cell">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {shortcuts.map((s, i) => (
                                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4"><code className="px-2 py-1 bg-white/10 rounded text-primary font-mono text-sm font-bold">{s.keys}</code></td>
                                                    <td className="p-4 text-white font-medium">{s.action}</td>
                                                    <td className="p-4 text-text-muted text-sm hidden md:table-cell">{s.description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === "troubleshooting" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <h1 className="text-3xl font-bold text-white mb-8">Troubleshooting</h1>
                                <div className="grid gap-4">
                                    {[
                                        { q: "Screenshots black?", a: "Enable Screen Recording permissions in OS settings." },
                                        { q: "No Audio?", a: "Select 'System Audio' as source, not Microphone." },
                                        { q: "App Hidden?", a: "Press Ctrl+B to toggle visibility." },
                                        { q: "Slow Answers?", a: "Switch to Groq API for instant speed." }
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 rounded-2xl bg-surface border border-white/10 hover:border-white/20 transition-all">
                                            <h4 className="font-bold text-white mb-2 text-lg">{item.q}</h4>
                                            <p className="text-text-muted">{item.a}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 text-center p-8 rounded-2xl bg-white/5 border border-white/5">
                                    <p className="text-text-muted">Need more help?</p>
                                    <a href="mailto:support@hexoran.com" className="text-primary font-bold hover:underline">Contact Support</a>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

// Sub-components
function Kbd({ children }: { children: React.ReactNode }) {
    return <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded-md text-xs font-mono text-gray-300 mx-1">{children}</kbd>;
}
