"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Download, ArrowUpRight } from "lucide-react";
import GradientButton from "./ui/GradientButton";

const socials = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com", label: "X" },
];

const AboutSection = () => {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-purple-400 mb-6 font-mono">
          About Me
        </p>

        <h2 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight mb-8">
          I&apos;m Dhiraj, an{" "}
          <span className="font-cursive gradient-text">Innovative Creator</span>
        </h2>

        <p className="text-white/50 text-lg leading-relaxed max-w-3xl mb-10">
          A passionate full-stack developer with a keen eye for design and a love for
          crafting seamless user experiences. I specialize in building modern web applications
          using cutting-edge technologies. With years of experience in both frontend and backend
          development, I bring ideas to life through clean code and creative problem-solving.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:border-purple-500/30 hover:bg-white/10 transition-all"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Download CV */}
          <GradientButton href="/cv.pdf">
            <Download className="w-4 h-4" />
            Download CV
          </GradientButton>

          {/* View More */}
          <a
            href="/about"
            className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors group"
          >
            Learn more about me
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
