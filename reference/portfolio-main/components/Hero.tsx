"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Copy, Check } from "lucide-react";
import GradientButton from "./ui/GradientButton";
import { ShootingStars } from "./ui/ShootingStars";
import { StarsBackground } from "./ui/StarsBackground";

const rotatingWords = [
  "Digital Realities",
  "Web Experiences",
  "Creative Solutions",
  "Modern Interfaces",
];

const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("hello@dhiraj.dev");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <ShootingStars />
        <StarsBackground />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-32 pb-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6 cursor-pointer hover:bg-white/10 transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-xs font-medium text-white/70 tracking-wide">
            AVAILABLE FOR WORK
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl lg:text-7xl text-white tracking-tight leading-[1.1] mb-6"
        >
          Crafting digital journeys that
          <br className="hidden md:block" />
          spark innovation{" "}
          <span className="relative inline-block">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="font-cursive"
                style={{
                  background: "linear-gradient(to right, #60a5fa, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {rotatingWords[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-mono text-white/50 text-xs md:text-sm tracking-wider mb-8 max-w-xl mx-auto"
        >
          HELLO I&apos;M DHIRAJ | A FULL STACK DEVELOPER PASSIONATE ABOUT BUILDING
          IMMERSIVE WEB EXPERIENCES.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <GradientButton href="/work" className="text-xs px-8 py-3">
            View My Work
            <ArrowRight className="w-4 h-4" />
          </GradientButton>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer group text-xs font-medium"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 group-hover:text-purple-400 transition-colors" />
            )}
            <span className="font-mono">hello@dhiraj.dev</span>
          </button>
        </motion.div>
      </div>

      {/* ============================================= */}
      {/* PURPLE SPATIAL CURVE — Planet Horizon Effect   */}
      {/* ============================================= */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-[5]" style={{ height: '40vh' }}>
        <svg
          viewBox="0 0 1440 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] md:w-[160%]"
          preserveAspectRatio="none"
          style={{ height: '100%' }}
        >
          <defs>
            {/* Radial glow behind the curve */}
            <radialGradient id="curveGlow" cx="50%" cy="100%" r="60%" fx="50%" fy="100%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
              <stop offset="30%" stopColor="#6d28d9" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#4c1d95" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#050505" stopOpacity="0" />
            </radialGradient>
            {/* Gradient for the arc stroke */}
            <linearGradient id="arcGradient" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#050505" stopOpacity="0" />
              <stop offset="20%" stopColor="#7c3aed" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
              <stop offset="80%" stopColor="#7c3aed" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#050505" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Glow fill behind curve */}
          <ellipse cx="720" cy="500" rx="900" ry="250" fill="url(#curveGlow)" />

          {/* The visible bright arc line */}
          <ellipse
            cx="720"
            cy="500"
            rx="800"
            ry="200"
            stroke="url(#arcGradient)"
            strokeWidth="2"
            fill="none"
          />

          {/* Solid fill below curve for clean cutoff */}
          <ellipse cx="720" cy="510" rx="900" ry="250" fill="#050505" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
