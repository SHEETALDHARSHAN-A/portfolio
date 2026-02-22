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


            <div className="ref-landing-container">
                {/* Name intro — Left Sidebar */}
                <div className="ref-landing-intro">
                    <h2>Hello! I'm</h2>
                    <h1 className="font-display">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {firstName}
                        </motion.div>
                        <motion.div
                            className="gradient-text italic"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {lastName}
                        </motion.div>
                    </h1>
                </div>

                {/* Role titles — Right Sidebar */}
                <motion.div
                    className="ref-landing-info"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <h3 className="text-inherit">An</h3>
                    <div className="ref-landing-role-accent">
                        Full-Stack Developer
                    </div>
                    <div className="ref-landing-role">
                        &amp; AI Enthusiast
                    </div>
                </motion.div>

                {/* ChatBot underneath — Mobile Only */}
                <div className="ref-landing-chatbot-mobile lg:hidden">
                    <ChatBot isHeroVariant={true} />
                </div>
            </div>
        </section>
    );
};
