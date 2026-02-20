"use client";

import { motion } from "framer-motion";

const SectionHeader = ({
  title,
  accent,
  subtitle,
}: {
  title: string;
  accent: string;
  subtitle?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
        {title}{" "}
        <span className="font-cursive gradient-text">{accent}</span>
      </h2>
      {subtitle && (
        <p className="mt-4 text-white/50 text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
