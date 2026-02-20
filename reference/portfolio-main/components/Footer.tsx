"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, ArrowUpRight } from "lucide-react";
import GradientButton from "./ui/GradientButton";

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com", label: "X" },
];

const Footer = () => {
  return (
    <footer className="relative pt-24 pb-10 px-6 overflow-hidden">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to take{" "}
            <span className="font-cursive gradient-text">your</span> digital
            <br className="hidden md:block" />
            presence to the next level?
          </h2>
          <p className="text-white/40 text-lg mb-8 max-w-xl mx-auto">
            Reach out to me today and let&apos;s discuss how I can help you
            achieve your goals.
          </p>
          <GradientButton href="mailto:hello@dhiraj.dev">
            Let&apos;s get in touch
            <ArrowUpRight className="w-4 h-4" />
          </GradientButton>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Dhiraj. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:border-purple-500/30 transition-all"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-radial-bottom pointer-events-none" />
    </footer>
  );
};

export default Footer;
