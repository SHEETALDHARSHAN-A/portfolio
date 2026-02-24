"use client";
import React from "react";
import { motion } from "framer-motion";
import { Character3D } from "./Character3D";
import { ChatBot } from "./ChatBot";
import { LightRays } from "@/components/ui/light-rays";

export const LandingSection = () => {
    const firstName = "SHEETAL";
    const lastName = "DHARSHAN A";

    return (
        <section className="ref-landing" id="landingDiv">


            <div className="ref-landing-container flex lg:flex-row flex-col items-center justify-between w-full px-8 md:px-16 xl:px-28 2xl:px-32 relative z-10 min-h-screen">
                {/* Name area — Left */}
                <div className="ref-landing-intro lg:w-[42%] w-full lg:text-left text-center">
                    <h2 className="font-sans uppercase tracking-[0.3em] opacity-40 text-[9px] md:text-[10px] mb-4">Hello! I'm</h2>
                    <h1 className="flex flex-col items-center lg:items-start leading-tight">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="font-elnath tracking-[0.1em] text-3xl md:text-5xl xl:text-6xl z-20 relative uppercase opacity-90"
                        >
                            {firstName}
                        </motion.div>
                        <motion.div
                            className="gradient-text font-elnath font-bold text-3xl md:text-5xl xl:text-6xl mt-2 md:mt-3 z-10 relative uppercase tracking-wider opacity-90"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {lastName}
                        </motion.div>
                    </h1>
                </div>

                {/* Center Spacer for 3D Character (strictly hollow) */}
                <div className="hidden lg:block lg:w-[16%] xl:w-[20%]" aria-hidden="true" />

                {/* Role area — Left Aligned & Aggressively Nudged Right */}
                <motion.div
                    className="ref-landing-info lg:w-[35%] w-full text-left flex flex-col items-start lg:ml-24 xl:ml-40"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <h3 className="font-sans text-[11px] md:text-[13px] uppercase tracking-[0.2em] opacity-40 mb-6 md:mb-8">An</h3>
                    <div className="ref-landing-role-accent font-elnath font-bold tracking-[0.1em] text-3xl md:text-5xl xl:text-6xl mb-2 uppercase opacity-90 text-white">
                        Full-Stack <span className="text-sm md:text-base xl:text-lg opacity-60">&amp;</span>
                    </div>
                    <div className="ref-landing-role gradient-text font-elnath tracking-[0.1em] text-3xl md:text-5xl xl:text-6xl font-light opacity-80 uppercase">
                        &nbsp; AI Developer
                    </div>
                </motion.div>

                {/* ChatBot area — Mobile Only */}
                <div className="ref-landing-chatbot-mobile lg:hidden w-full mt-12 px-4">
                    <ChatBot isHeroVariant={true} />
                </div>
            </div>
        </section>
    );
};
