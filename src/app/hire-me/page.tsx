"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { Code2, Palette, Cpu, Globe, Send, ArrowRight, CheckCircle2 } from "lucide-react";

const services = [
    {
        icon: Code2,
        title: "Web Development",
        description: "Custom web applications built with modern frameworks. From SPAs to full-stack platforms.",
        features: ["React / Next.js", "API Development", "Database Design", "Cloud Deployment"],
    },
    {
        icon: Palette,
        title: "UI/UX Design",
        description: "Beautiful, intuitive interfaces that delight users. Design systems and prototyping.",
        features: ["Responsive Design", "Design Systems", "Prototyping", "Animation"],
    },
    {
        icon: Cpu,
        title: "AI Integration",
        description: "Integrating AI and ML capabilities into your products. Smart automation and insights.",
        features: ["LLM Integration", "Computer Vision", "Data Analytics", "Chatbots"],
    },
    {
        icon: Globe,
        title: "Consulting",
        description: "Technical consulting and code reviews. Architecture planning and optimization.",
        features: ["Architecture Review", "Performance Audit", "Tech Stack Selection", "Team Training"],
    },
];

const processSteps = [
    { step: "01", title: "Discovery", description: "Understanding your goals, requirements, and vision." },
    { step: "02", title: "Design", description: "Creating wireframes, prototypes, and visual direction." },
    { step: "03", title: "Development", description: "Building with clean code, testing, and iteration." },
    { step: "04", title: "Delivery", description: "Launch, deployment, and ongoing support." },
];

export default function HireMePage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        project: "",
        budget: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <main className="min-h-screen pt-32 pb-20">
            {/* Hero */}
            <section className="px-6 max-w-5xl mx-auto mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-xs uppercase tracking-widest text-primary mb-4 font-mono">Hire Me</p>
                    <h1 className="text-4xl md:text-6xl font-bold text-white font-display mb-6">
                        Let&apos;s build something{" "}
                        <span className="gradient-text">incredible</span>
                    </h1>
                    <p className="text-text-muted text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        I help startups and businesses bring their ideas to life with
                        modern web technologies, clean code, and stunning design.
                    </p>
                </motion.div>
            </section>

            {/* Services */}
            <section className="px-6 max-w-7xl mx-auto mb-20">
                <SectionHeader title="What I" accent="Offer" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service, i) => (
                        <GlassCard key={service.title} delay={i * 0.1} className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/5 rounded-lg group-hover:bg-primary/10 transition-colors flex-shrink-0">
                                    <service.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                                    <p className="text-sm text-text-muted leading-relaxed mb-3">{service.description}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {service.features.map((f) => (
                                            <span key={f} className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium bg-white/5 text-white/50">
                                                <CheckCircle2 className="w-2.5 h-2.5 text-accent" />
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </section>

            {/* Process */}
            <section className="px-6 max-w-5xl mx-auto mb-20">
                <SectionHeader title="My" accent="Process" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {processSteps.map((step, i) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 text-center relative"
                        >
                            <span className="text-4xl font-display font-bold text-primary/20 block mb-2">{step.step}</span>
                            <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-sm text-text-muted">{step.description}</p>
                            {i < processSteps.length - 1 && (
                                <ArrowRight className="hidden md:block absolute top-1/2 -right-5 w-4 h-4 text-white/20 -translate-y-1/2" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Contact Form */}
            <section className="px-6 max-w-2xl mx-auto">
                <SectionHeader title="Get in" accent="Touch" />
                <GlassCard className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block font-mono">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block font-mono">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="you@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block font-mono">Project Type</label>
                                <select
                                    value={formData.project}
                                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                                >
                                    <option value="" className="bg-surface">Select type</option>
                                    <option value="web-app" className="bg-surface">Web Application</option>
                                    <option value="website" className="bg-surface">Website</option>
                                    <option value="ai-tool" className="bg-surface">AI Integration</option>
                                    <option value="consulting" className="bg-surface">Consulting</option>
                                    <option value="other" className="bg-surface">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block font-mono">Budget Range</label>
                                <select
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                                >
                                    <option value="" className="bg-surface">Select range</option>
                                    <option value="1k-5k" className="bg-surface">$1,000 - $5,000</option>
                                    <option value="5k-10k" className="bg-surface">$5,000 - $10,000</option>
                                    <option value="10k-25k" className="bg-surface">$10,000 - $25,000</option>
                                    <option value="25k+" className="bg-surface">$25,000+</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-white/40 uppercase tracking-wider mb-1 block font-mono">Message</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                                placeholder="Tell me about your project..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)] transition-all"
                        >
                            {submitted ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Message Sent!
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>
                </GlassCard>
            </section>
        </main>
    );
}
