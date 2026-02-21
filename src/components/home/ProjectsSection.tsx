"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SectionHeader from "@/components/ui/SectionHeader";
import { supabase } from "@/lib/supabase";
import { ExternalLink, Github as GithubIcon, Tag } from "lucide-react";
import Image from "next/image";

interface Project {
    id: string;
    title: string;
    description: string;
    image_url: string;
    tags: string[];
    link?: string;
    github_link?: string;
    featured: boolean;
    order: number;
}

export const ProjectsSection = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data, error } = await supabase
                    .from("projects")
                    .select("*")
                    .order("order", { ascending: true });

                if (error) throw error;
                if (data && data.length > 0) {
                    setProjects(data);
                } else {
                    // Fallback to mock data if no data in DB
                    setProjects(mockProjects);
                }
            } catch (err) {
                console.error("Error fetching projects:", err);
                setProjects(mockProjects);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) return null; // Or a skeleton

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto relative overflow-hidden">
            {/* Premium "Gaurdial" (Radial) Gradient background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50 animate-pulse-glow" />
            <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none opacity-30" />

            <div className="relative z-10">
                <SectionHeader
                    title="Selected"
                    accent="Works & Projects"
                    subtitle="A gallery of technical challenges solved through code and creativity."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                "group relative overflow-hidden rounded-[2rem] border border-foreground/[0.08] bg-background/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20",
                project.featured && "md:col-span-2 lg:col-span-2"
            )}
        >
            <div className="aspect-[16/9] lg:aspect-auto lg:h-[300px] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating Tags */}
                <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full text-[10px] font-mono bg-background/80 backdrop-blur-md border border-foreground/10 text-foreground">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-8">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-display font-bold text-foreground">
                        {project.title}
                    </h3>
                    <div className="flex gap-3">
                        {project.github_link && (
                            <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <GithubIcon className="w-5 h-5" />
                            </a>
                        )}
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {project.description}
                </p>

                <div className="flex items-center gap-2 group/link">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary group-hover/link:underline cursor-pointer">View Project</span>
                    <ExternalLink className="w-3 h-3 text-primary transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                </div>
            </div>

            {/* Hover Shine Effect */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </motion.div>
    );
};

const mockProjects: Project[] = [
    {
        id: "1",
        title: "AI Portfolio",
        description: "A high-performance portfolio website built with Next.js, featuring an integrated AI replica of myself to handle visitor inquiries. Optimized for SEO and accessibility.",
        image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
        tags: ["Next.js", "Tailwind", "Framer Motion", "Supabase"],
        featured: true,
        order: 1,
        github_link: "#",
        link: "#"
    },
    {
        id: "2",
        title: "Hexoran Web",
        description: "A futuristic web dashboard for infrastructure monitoring with real-time data visualization and geometric UI elements.",
        image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
        tags: ["React", "Three.js", "Node.js"],
        featured: false,
        order: 2,
        github_link: "#"
    },
    {
        id: "3",
        title: "Commerce Core",
        description: "A headless e-commerce engine focusing on speed and developer experience. Integrated with Stripe and many other services.",
        image_url: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800",
        tags: ["TypeScript", "PostgreSQL", "Stripe"],
        featured: false,
        order: 3,
        link: "#"
    }
];
