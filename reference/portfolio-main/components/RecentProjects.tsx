"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "./ui/SectionHeader";
import GlassCard from "./ui/GlassCard";

const projects = [
  {
    id: 1,
    title: "3D Solar System Planets to Explore",
    description:
      "Explore the wonders of our solar system with this captivating 3D simulation using Three.js.",
    tags: ["React", "Three.js", "Tailwind", "TypeScript", "Framer Motion"],
    img: "/p1.svg",
    link: "#",
  },
  {
    id: 2,
    title: "Yoom - Video Conferencing App",
    description:
      "Simplify your video conferencing experience with Yoom. Seamlessly connect with colleagues and friends.",
    tags: ["Next.js", "Tailwind", "TypeScript", "Stream", "Clerk"],
    img: "/p2.svg",
    link: "#",
  },
  {
    id: 3,
    title: "AI Image SaaS - Canva Application",
    description:
      "A REAL Software-as-a-Service app with AI features and a payments and credits system.",
    tags: ["React", "Tailwind", "TypeScript", "Three.js", "Clerk"],
    img: "/p3.svg",
    link: "#",
  },
  {
    id: 4,
    title: "Animated Apple iPhone 3D Website",
    description:
      "Recreated the Apple iPhone 15 Pro website, combining GSAP animations and Three.js 3D effects.",
    tags: ["Next.js", "Tailwind", "TypeScript", "Three.js", "GSAP"],
    img: "/p4.svg",
    link: "#",
  },
];

const RecentProjects = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <SectionHeader
        title="A small selection of"
        accent="recent projects"
        subtitle="Each project represents a unique challenge and creative solution"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <GlassCard key={project.id} className="p-0 overflow-hidden" delay={i * 0.1}>
            {/* Project Image */}
            <div className="relative h-48 md:h-64 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${project.img})`,
                  backgroundColor: "#13162D",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Link overlay */}
              <a
                href={project.link}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
              >
                <ArrowUpRight className="w-5 h-5" />
              </a>
            </div>

            {/* Project Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2 font-serif">
                {project.title}
              </h3>
              <p className="text-white/50 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/10 text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
};

export default RecentProjects;
