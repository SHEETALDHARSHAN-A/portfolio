"use client";
import React from "react";
import { motion } from "framer-motion";

const text = `I am a passionate Full-Stack Developer & AI Enthusiast from India. I build intelligent systems, modern web applications, and crafting stunning digital experiences that users actually enjoy. My expertise spans React, Next.js, Node.js, Python, and AI/ML technologies. Currently focused on building innovative products that blend cutting-edge technology with beautiful design. Code is poetry, innovation is the canvas.`;

export const AboutSection = () => {
    const words = text.split(" ");

    return (
        <section className="ref-about" id="about">
            <div className="ref-about-content">
                <motion.h2
                    className="font-display flex flex-wrap items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    A<span className="ref-hat-h2">BOUT</span>
                    <span className="ref-do-h2 italic ml-3">ME</span>
                </motion.h2>
                <div className="mt-8 flex flex-wrap">
                    {words.map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.4,
                                delay: i * 0.03,
                            }}
                            className="mr-1.5 text-[18px] md:text-[24px] lg:text-[1.7vw] font-[300] leading-tight"
                        >
                            {word}
                        </motion.span>
                    ))}
                </div>
            </div>
        </section>
    );
};
