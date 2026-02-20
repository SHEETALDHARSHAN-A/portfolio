import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react";

const footerLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Work", href: "/work" },
    { name: "Blog", href: "/blog" },
    { name: "Hire Me", href: "/hire-me" },
    { name: "Book a Call", href: "/book-a-call" },
];

const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:hello@sheetal.dev", label: "Email" },
];

export const Footer = () => {
    return (
        <footer className="relative border-t border-white/5 bg-background">
            <div className="absolute inset-0 bg-radial-bottom pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white text-lg">Sheetal_Dharshan_</span>
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed max-w-xs">
                            Crafting digital experiences that push the boundaries of what&apos;s possible on the web.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4 font-mono">Navigation</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm text-text-muted hover:text-white transition-colors py-1 flex items-center gap-1 group"
                                >
                                    {link.name}
                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Socials */}
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4 font-mono">Connect</h3>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 hover:border-primary/30 transition-all"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-600 font-mono">
                        © {new Date().getFullYear()} Sheetal Dharshan. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-600 font-mono">
                        Built with Next.js, Tailwind CSS & Framer Motion
                    </p>
                </div>
            </div>
        </footer>
    );
};
