'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/navbar';
import confetti from 'canvas-confetti';

export default function SubscriptionSuccessPage() {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Trigger confetti
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    // Attempt to open app automatically
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = 'celato://resume';
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#030303] text-white selection:bg-primary/20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#030303] to-[#030303] font-sans overflow-hidden">
            <Navbar />

            <main className="min-h-screen flex flex-col items-center justify-center relative p-4 pt-32">
                {/* Background Glows */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none opacity-50" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[128px] pointer-events-none opacity-30" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 max-w-lg w-full bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl backdrop-blur-xl"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20 shadow-[0_0_40px_-10px_rgba(34,197,94,0.4)]"
                    >
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        You're In.
                    </h1>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Your subscription is active. Your account has been upgraded with <span className="text-primary font-medium">Superpowers</span>.
                    </p>

                    <div className="space-y-4">
                        <Button
                            onClick={() => window.location.href = 'celato://resume'}
                            className="w-full h-14 text-lg bg-white text-black hover:bg-gray-200 font-bold rounded-xl shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all hover:scale-[1.02]"
                        >
                            <Zap className="w-5 h-5 mr-2 fill-black/20" />
                            Launch Celato App
                        </Button>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                onClick={() => window.location.href = '/dashboard'}
                                className="h-12 border-white/10 hover:bg-white/5 text-gray-400 hover:text-white"
                            >
                                Go to Dashboard
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.location.href = '/celato/downloading'}
                                className="h-12 border-white/10 hover:bg-white/5 text-gray-400 hover:text-white"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download App
                            </Button>
                        </div>
                    </div>

                    <p className="text-gray-500 text-xs mt-8">
                        The app should open automatically. If not, click "Launch Celato App".
                    </p>
                </motion.div>
            </main>
        </div>
    );
}
