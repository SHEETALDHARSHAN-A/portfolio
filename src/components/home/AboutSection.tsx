"use client";
import React from "react";
import { motion } from "framer-motion";

export const AboutSection = () => {
    return (
        <section className="ref-about" id="about">
            <motion.div
                className="ref-about-content"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
            >
                <h3 className="font-display">About <span className="gradient-text italic">Me</span></h3>
                <p>
                    I am a passionate Full-Stack Developer &amp; AI Enthusiast from India.
                    I build intelligent systems, modern web applications, and crafting
                    stunning digital experiences that users actually enjoy. My expertise
                    spans React, Next.js, Node.js, Python, and AI/ML technologies.
                    Currently focused on building innovative products that blend
                    cutting-edge technology with beautiful design. Code is poetry,
                    innovation is the canvas.
                </p>
            </motion.div>
        </section>
    );
};
