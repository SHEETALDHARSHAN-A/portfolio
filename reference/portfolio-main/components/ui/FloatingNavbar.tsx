"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const navLinks = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Work", link: "/work" },
  { name: "Blog", link: "/blog" },
  { name: "Hire Me", link: "/contact" },
];

export const FloatingNav = ({
  className,
}: {
  navItems?: any[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const { theme, setTheme } = useTheme();

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious()!;
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed top-0 inset-x-0 z-[5000] w-full px-6 md:px-12 py-5 flex justify-between items-center pointer-events-none",
          className
        )}
      >
        {/* Logo - Left */}
        <div className="flex items-center pointer-events-auto">
          <Link href="/" className="font-serif font-bold text-2xl text-white tracking-wide">
            DB
          </Link>
        </div>

        {/* Center Menu - Pill */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-black/50 backdrop-blur-xl px-2 py-2 shadow-lg pointer-events-auto"
          )}
        >
          {navLinks.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-medium transition-all duration-300",
                "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/contact"
            className={cn(
               "ml-2 px-5 py-2 rounded-full text-xs font-bold transition-all duration-300",
               "bg-white/10 border border-white/10 text-white hover:bg-white/20"
            )}
          >
             Book a Call
          </Link>
        </motion.nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4 pointer-events-auto">
          {/* Mobile Menu Toggle could go here */}
          
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
