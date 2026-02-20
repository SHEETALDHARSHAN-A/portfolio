"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Spotlight = ({ className, fill }: { className?: string; fill?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 3787 2842"
    fill="none"
  >
    <g filter="url(#filter)">
      <ellipse
        cx="1924.71"
        cy="273.501"
        rx="1924.71"
        ry="273.501"
        transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
        fill={fill || "white"}
        fillOpacity="0.21"
      ></ellipse>
    </g>
    <defs>
      <filter
        id="filter"
        x="0.860352"
        y="0.838989"
        width="3785.16"
        height="2840.26"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
        <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8"></feGaussianBlur>
      </filter>
    </defs>
  </svg>
);

export const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
      <div className="animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0 -top-40 left-0 md:left-60 md:-top-20">
        <Spotlight fill="white" />
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <Link href="/celato">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 cursor-pointer hover:border-primary/50 transition-colors"
          >
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-xs font-medium text-text-main">Celato AI 1.0 is now live</span>
            <ChevronRight className="w-3 h-3 text-text-muted" />
          </motion.div>
        </Link>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400 mb-8 tracking-tight"
        >
          Intelligence, <br /> Structured.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Hexoran builds the invisible layer of AI tools for the modern developer.
          Zero latency, privacy-first, and designed to disappear.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/celato">
            <Button icon={ArrowRight}>Explore Celato</Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" icon={Terminal}>Our Philosophy</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};