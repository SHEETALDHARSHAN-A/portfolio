"use client";
import React from "react";
import { motion } from "framer-motion";
import { ChatBot } from "./ChatBot";
import { ShootingStars } from "@/components/ui/ShootingStars";
import { StarsBackground } from "@/components/ui/StarsBackground";
import { Spotlight } from "@/components/ui/Spotlight";
import { MemojiAvatar } from "@/components/ui/MemojiAvatar";

export const Hero = () => {
    return (
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <StarsBackground />
                <ShootingStars />
            </div>

            {/* Spotlight */}
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center text-center w-full pt-20 pb-10 mt-12">
                    {/* Intro Horizontal Group */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8">
                        {/* Avatar Area */}
                        <MemojiAvatar className="mb-0 scale-75 md:scale-100" />

                        {/* Intro Heading Area */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="text-center md:text-left"
                        >
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold font-display text-white tracking-tighter">
                                Hi, I&apos;m <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent italic px-2">SheetalDharshan A</span>
                            </h1>
                        </motion.div>
                    </div>

                    {/* Large ChatBot Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="w-full max-w-5xl"
                    >
                        <ChatBot isHeroVariant={true} />
                    </motion.div>

                </div>
            </div>

            {/* Purple Planet Horizon Curve */}
            <div className="absolute bottom-0 left-0 w-full pointer-events-none z-[5]" style={{ height: "40vh" }}>
                <svg
                    viewBox="0 0 1440 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] md:w-[160%]"
                    preserveAspectRatio="none"
                    style={{ height: "100%" }}
                >
                    <defs>
                        <radialGradient id="curveGlow" cx="50%" cy="100%" r="60%" fx="50%" fy="100%">
                            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
                            <stop offset="30%" stopColor="#6d28d9" stopOpacity="0.3" />
                            <stop offset="60%" stopColor="#4c1d95" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="arcGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                            <stop offset="0%" stopColor="#09090b" stopOpacity="0" />
                            <stop offset="20%" stopColor="#7c3aed" stopOpacity="0.5" />
                            <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
                            <stop offset="80%" stopColor="#7c3aed" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <ellipse cx="720" cy="500" rx="900" ry="250" fill="url(#curveGlow)" />
                    <ellipse cx="720" cy="500" rx="800" ry="200" stroke="url(#arcGradient)" strokeWidth="2" fill="none" />
                    <ellipse cx="720" cy="510" rx="900" ry="250" fill="#09090b" />
                </svg>
            </div>
        </section>
    );
};
