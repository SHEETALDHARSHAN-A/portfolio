"use client";

import { motion } from "framer-motion";
import GlassCard from "./ui/GlassCard";
import SectionHeader from "./ui/SectionHeader";
import GridGlobe from "./ui/GridGlobe";

const techStack = [
  "React", "Next.js", "TypeScript", "Node.js", "MongoDB",
  "Tailwind", "PostgreSQL", "Docker", "AWS", "GraphQL",
  "Redis", "Git",
];

const Grid = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <SectionHeader title="What I" accent="bring to the table" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
        {/* Card 1: Globe / Time-Zone — spans 2 cols, 2 rows */}
        <GlassCard className="md:col-span-2 md:row-span-2 p-0 flex flex-col justify-between overflow-hidden relative" delay={0}>
          <div className="p-8 relative z-20">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Global Reach</p>
            <h3 className="text-2xl font-serif font-bold text-white max-w-xs">
              I prioritize client collaboration,{" "}
              <span className="text-white/60">fostering open communication</span>
            </h3>
          </div>
          
          {/* Globe Component Integration - Moved TOP */}
          <div className="absolute inset-0 top-0 left-0 w-full h-full z-10 opacity-70 pointer-events-none">
             <GridGlobe />
          </div>
          
          {/* Gradient Overlay for text readability */}
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#050505]/40 to-transparent z-10 pointer-events-none" />
        </GlassCard>

        {/* Card 2: Tech Stack — spans 2 cols */}
        <GlassCard className="md:col-span-2 md:row-span-1 p-6" delay={0.1}>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-3">My Tech Stack</p>
          <p className="text-white/60 text-sm mb-4">I constantly try to improve</p>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-purple-500/30 transition-all cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </GlassCard>

        {/* Card 3: Personal — 1 col, 2 rows */}
        <GlassCard className="md:col-span-1 md:row-span-2 p-0 overflow-hidden" delay={0.2}>
          <div className="relative w-full h-full min-h-[300px] bg-gradient-to-b from-purple-900/10 to-transparent flex flex-col justify-end p-6">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-widest text-purple-400 mb-2">Always</p>
              <h3 className="text-2xl font-serif font-bold text-white">
                Learning &<br />Building
              </h3>
            </div>
          </div>
        </GlassCard>

        {/* Card 4: Flexible schedule */}
        <GlassCard className="md:col-span-1 md:row-span-1 p-6 flex flex-col justify-center" delay={0.15}>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Availability</p>
          <h3 className="text-lg font-bold text-white">
            I&apos;m very flexible with time zone communications
          </h3>
        </GlassCard>

        {/* Card 5: Currently building */}
        <GlassCard className="md:col-span-1 md:row-span-1 p-6 flex flex-col justify-center" delay={0.2}>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-2">The Inside Scoop</p>
          <h3 className="text-base md:text-lg font-bold text-white">
            Currently building a{" "}
            <span className="gradient-text">JS Animation library</span>
          </h3>
        </GlassCard>

        {/* Card 6: CTA */}
        <GlassCard className="md:col-span-2 md:row-span-1 p-6 flex items-center justify-center" delay={0.25}>
          <div className="text-center">
            <h3 className="text-xl font-serif font-bold text-white mb-3">
              Do you want to start a project together?
            </h3>
            <button className="px-6 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 text-white/80 hover:text-white hover:border-purple-500/30 transition-all">
              Copy my email
            </button>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default Grid;
