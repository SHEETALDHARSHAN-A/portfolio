"use client";
import React from "react";
import { motion } from "framer-motion";

const skillCategories = {
    develop: {
        title: "FULL-STACK",
        description: "Modern web development & scalable applications",
        details:
            "Building responsive and performant web applications using React, Next.js, Node.js, and databases. Creating seamless user experiences with modern UI/UX principles and cutting-edge frameworks.",
        tools: [
            "React",
            "Next.js",
            "Node.js",
            "TypeScript",
            "MongoDB",
            "PostgreSQL",
            "Tailwind CSS",
            "REST APIs",
            "Docker",
            "Git",
        ],
    },
    design: {
        title: "AI ENTHUSIAST",
        description: "Building intelligent systems & AI solutions",
        details:
            "Exploring AI-powered tools, machine learning models, and intelligent automation. Passionate about integrating AI capabilities into modern web applications to create smarter user experiences.",
        tools: [
            "Python",
            "TensorFlow",
            "OpenAI",
            "LangChain",
            "NLP",
            "Data Analysis",
            "Automation",
            "AI Agents",
            "FastAPI",
            "Supabase",
        ],
    },
};

export const WhatIDoSection = () => {
    return (
        <section className="ref-whatido" id="whatido">
            {/* Left: Title */}
            <div className="ref-what-box">
                <motion.h2
                    className="font-display"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    W<span className="ref-hat-h2">HAT</span>
                    <div>
                        &nbsp;I<span className="ref-do-h2 italic"> DO</span>
                    </div>
                </motion.h2>
            </div>

            {/* Right: Skill Cards */}
            <div className="ref-what-box">
                <div className="ref-what-box-in">
                    {/* Vertical dashed borders */}
                    <div className="ref-what-border2">
                        <svg width="100%">
                            <line
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="100%"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray="7,7"
                                opacity="0.15"
                            />
                            <line
                                x1="100%"
                                y1="0"
                                x2="100%"
                                y2="100%"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray="7,7"
                                opacity="0.15"
                            />
                        </svg>
                    </div>

                    {/* Card 1: Full-Stack */}
                    <motion.div
                        className="ref-what-content"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Horizontal dashed borders */}
                        <div className="ref-what-border1">
                            <svg height="100%">
                                <line
                                    x1="0"
                                    y1="0"
                                    x2="100%"
                                    y2="0"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeDasharray="6,6"
                                    opacity="0.15"
                                />
                                <line
                                    x1="0"
                                    y1="100%"
                                    x2="100%"
                                    y2="100%"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeDasharray="6,6"
                                    opacity="0.15"
                                />
                            </svg>
                        </div>
                        <div className="ref-what-corner" />

                        <div className="ref-what-content-in">
                            <h3>{skillCategories.develop.title}</h3>
                            <h4>{skillCategories.develop.description}</h4>
                            <p>{skillCategories.develop.details}</p>
                            <h5>Skillset &amp; tools</h5>
                            <div className="ref-what-content-flex">
                                {skillCategories.develop.tools.map((tool, index) => (
                                    <div key={index} className="ref-what-tags">
                                        {tool}
                                    </div>
                                ))}
                            </div>
                            <div className="ref-what-arrow" />
                        </div>
                    </motion.div>

                    {/* Card 2: AI Enthusiast */}
                    <motion.div
                        className="ref-what-content"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="ref-what-border1">
                            <svg height="100%">
                                <line
                                    x1="0"
                                    y1="100%"
                                    x2="100%"
                                    y2="100%"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeDasharray="6,6"
                                    opacity="0.15"
                                />
                            </svg>
                        </div>
                        <div className="ref-what-corner" />

                        <div className="ref-what-content-in">
                            <h3>{skillCategories.design.title}</h3>
                            <h4>{skillCategories.design.description}</h4>
                            <p>{skillCategories.design.details}</p>
                            <h5>Skillset &amp; tools</h5>
                            <div className="ref-what-content-flex">
                                {skillCategories.design.tools.map((tool, index) => (
                                    <div key={index} className="ref-what-tags">
                                        {tool}
                                    </div>
                                ))}
                            </div>
                            <div className="ref-what-arrow" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
