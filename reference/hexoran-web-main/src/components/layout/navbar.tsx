"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight, LogOut, Code2, ChevronDown, Brain, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { hexoranSupabase } from '@/lib/hexoran';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Scroll handling for hide/show and glass effect
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 20);
  });

  useEffect(() => {
    // Check initial session
    hexoranSupabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = hexoranSupabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Celato', href: '/celato' },
    { name: 'SaveTune', href: '/savetune' },
    { name: 'Stook', href: '/stook' },
    { name: 'Pricing', href: '/celato#pricing' },
    { name: 'Docs', href: '/docs' },
    { name: 'About', href: '/about' },
  ];

  const getThemeColors = () => {
    if (pathname.includes('/stook')) {
      return {
        navBorder: "border-gold/30",
        navShadow: "shadow-gold/5",
        pillBorder: "border-gold/50",
        pillShadow: "shadow-[0_0_10px_-2px_rgba(234,179,8,0.5)]"
      };
    }
    if (pathname.includes('/celato')) {
      return {
        navBorder: "border-primary/30", // Violet for Celato
        navShadow: "shadow-primary/5",
        pillBorder: "border-primary/50",
        pillShadow: "shadow-[0_0_10px_-2px_rgba(124,58,237,0.5)]"
      };
    }
    if (pathname.includes('/savetune')) {
      return {
        navBorder: "border-blue-500/30", // Blue for SaveTune
        navShadow: "shadow-blue-500/5",
        pillBorder: "border-blue-500/50",
        pillShadow: "shadow-[0_0_10px_-2px_rgba(59,130,246,0.5)]"
      };
    }
    // Default (Home) -> Silver / White
    return {
      navBorder: "border-white/20",
      navShadow: "shadow-white/5",
      pillBorder: "border-white/30",
      pillShadow: "shadow-[0_0_10px_-2px_rgba(255,255,255,0.3)]"
    };
  };

  const theme = getThemeColors();

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: -100 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? `h-16 bg-black/50 backdrop-blur-xl border-b ${theme.navBorder} shadow-2xl ${theme.navShadow} supports-[backdrop-filter]:bg-black/20`
            : "h-24 bg-transparent border-b border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-2 group z-50 relative"
            onClick={() => setMobileOpen(false)}
          >
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Logo className="w-full h-full relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-180" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none text-white tracking-tight font-mono group-hover:text-primary/90 transition-colors">
                Hexoran_
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
            {navLinks.map((link) => {
              if (link.name === 'Pricing') {
                return (
                  <DropdownMenu key={link.name}>
                    <DropdownMenuTrigger
                      id="navbar-pricing-trigger"
                      className={cn(
                        "relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 outline-none group",
                        "text-gray-400 hover:text-white data-[state=open]:text-white data-[state=open]:bg-white/5"
                      )}
                    >
                      <span className="relative z-10">Pricing</span>
                      <ChevronDown className="w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      sideOffset={12}
                      align="center"
                      className="bg-[#050505]/95 backdrop-blur-3xl border border-white/10 p-2 rounded-2xl w-64 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] animate-in fade-in-0 zoom-in-95 slide-in-from-top-4 duration-300"
                    >
                      <Link href="/celato#pricing">
                        <DropdownMenuItem className="group/item focus:bg-white/5 focus:text-white text-gray-300 cursor-pointer rounded-xl p-3 mb-1 transition-all duration-300 border border-transparent hover:border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">
                              <Brain className="w-5 h-5 text-primary group-hover/item:scale-110 transition-transform" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-sm tracking-wide text-white group-hover/item:text-primary transition-colors">Celato</span>
                              <span className="text-[10px] text-gray-500 font-mono tracking-tight uppercase group-hover/item:text-gray-400">AI Coding Intelligence</span>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/stook#pricing">
                        <DropdownMenuItem className="group/item focus:bg-white/5 focus:text-white text-gray-300 cursor-pointer rounded-xl p-3 transition-all duration-300 border border-transparent hover:border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center group-hover/item:bg-gold/20 transition-colors">
                              <BarChart3 className="w-5 h-5 text-gold group-hover/item:scale-110 transition-transform" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-sm tracking-wide text-white group-hover/item:text-gold transition-colors">Stook</span>
                              <span className="text-[10px] text-gray-500 font-mono tracking-tight uppercase group-hover/item:text-gray-400">Financial Analytics</span>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className={cn(
                        "absolute inset-0 bg-white/10 rounded-full border transition-colors duration-300",
                        theme.pillBorder,
                        theme.pillShadow
                      )}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {!pathname.includes('/auth/update-password') && (
              user ? (
                <Button
                  href="/dashboard"
                  variant="ghost"
                  className="rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/5 gap-2 px-5 group"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Dashboard</span>
                </Button>
              ) : (
                <Button
                  href="/auth/signup"
                  className="rounded-full bg-primary hover:bg-blue-600 text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] border border-blue-400/20 px-6 group transition-all"
                >
                  <span className="mr-2">Get Started</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              )
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white p-2 -mr-2 focus:outline-none z-50 group"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-active:scale-95 transition-all">
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-24 px-6 md:hidden flex flex-col"
          >
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none opacity-30" />

            <div className="flex flex-col gap-4 relative z-10 flex-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-5 rounded-2xl transition-all border border-transparent",
                      pathname === link.href
                        ? "bg-white/10 text-white border-white/10 shadow-lg"
                        : "text-gray-400 hover:bg-white/5 hover:text-white hover:border-white/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon Logic just for flair */}
                      {link.href === '/celato' && <Code2 className="w-5 h-5 text-blue-400" />}
                      <span className="text-xl font-medium tracking-wide">{link.name}</span>
                    </div>
                    <ChevronRight className={cn(
                      "w-5 h-5 transition-transform",
                      pathname === link.href ? "text-primary translate-x-0" : "opacity-30 -translate-x-2"
                    )} />
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-10 space-y-4"
            >
              {!pathname.includes('/auth/update-password') && (
                user ? (
                  <Button
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="w-full h-14 rounded-xl bg-white text-black hover:bg-gray-200 font-bold text-lg shadow-xl"
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <Button
                    href="/auth/signup"
                    onClick={() => setMobileOpen(false)}
                    className="w-full h-14 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-lg shadow-xl shadow-primary/20"
                  >
                    Get Started
                  </Button>
                )
              )}

              <div className="flex justify-center pt-6 pb-2">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-mono">
                  Hexoran Intelligence Systems
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};