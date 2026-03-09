"use client";
import React from "react";
import { motion } from "framer-motion";
import { ChatBot } from "./ChatBot";

export const Hero = () => {
    return (
        <section className="ref-hero relative min-h-[72vh] md:min-h-[82vh] flex flex-col items-center justify-start overflow-hidden bg-transparent">


            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center justify-start">
                <div className="w-full pt-4 md:pt-8 pb-6">
                    <div className="flex flex-col gap-4 md:gap-6">
                        <motion.h2
                            className="font-display text-4xl md:text-6xl leading-[0.9] text-right"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            G<span className="ref-hat-h2">ET</span>
                            <div>
                                2<span className="ref-do-h2 italic"> KNOW ME</span>
                            </div>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="w-full px-0 md:px-1"
                        >
                            <ChatBot isHeroVariant={true} />
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Purple Planet Horizon Curve */}
            <div className="absolute bottom-0 left-0 w-full pointer-events-none z-[5] text-background" style={{ height: "40vh" }}>
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
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="arcGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                            <stop offset="20%" stopColor="#7c3aed" stopOpacity="0.5" />
                            <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
                            <stop offset="80%" stopColor="#7c3aed" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <ellipse cx="720" cy="500" rx="900" ry="250" fill="url(#curveGlow)" />
                    <ellipse cx="720" cy="500" rx="800" ry="200" stroke="url(#arcGradient)" strokeWidth="2" fill="none" />
                    <ellipse cx="720" cy="510" rx="900" ry="250" fill="currentColor" />
                </svg>
            </div>
        </section>
    );
};
