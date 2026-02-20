"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  Code2,
  Zap,
  Heart,
  Eye,
  Globe,
  ArrowRight,
  Users,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CelatoLogo, SaveTuneLogo } from "@/components/logos";

const values = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "Zero telemetry. Your data lives on your machine. We never see your screenshots, code, or interview recordings."
  },
  {
    icon: Zap,
    title: "Performance Obsessed",
    description: "Optimized at every layer. Local transcription in <50ms, GPU acceleration, and minimal memory footprint."
  },
  {
    icon: Eye,
    title: "Invisible by Design",
    description: "Our tools disappear when you need them to. Click-through overlays, stealth modes, and seamless integration."
  },
  {
    icon: Heart,
    title: "Developer Experience",
    description: "We build tools we'd want to use ourselves. Clean UX, keyboard-first workflows, and honest pricing."
  }
];

const products = [
  {
    name: "Celato",
    tagline: "AI Interview Copilot",
    description: "Real-time AI assistance for technical interviews. Screenshot analysis, live transcription, and invisible overlays.",
    icon: CelatoLogo,
    href: "/celato",
    gradient: "from-violet-500 to-purple-600",
    features: ["Code Mode", "Live Mode", "Phantom Mode"],
    status: "live"
  },
  {
    name: "SaveTune",
    tagline: "Lossless Music Downloader",
    description: "Download high-quality FLAC and MP3 from Spotify. Automatic metadata, synchronized lyrics, and Hi-Res audio.",
    icon: SaveTuneLogo,
    href: "/savetune",
    gradient: "from-emerald-500 to-green-600",
    features: ["FLAC & MP3", "Auto Metadata", "Synced Lyrics"],
    status: "live"
  },
  {
    name: "Stook",
    tagline: "AI Meeting Notes",
    description: "Your second brain for meetings. Automatic transcription, action item detection, and seamless Notion sync.",
    icon: Sparkles,
    href: "/stook",
    gradient: "from-amber-500 to-yellow-600",
    features: ["Transcription", "Action Items", "Notion Sync"],
    status: "coming-soon"
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-text-main overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20"
          >
            <Sparkles className="w-4 h-4" />
            Based in India
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            We build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-primary">invisible layer</span> of intelligence.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Hexoran is a collective of engineers and designers. We believe powerful software should be invisible, intuitive, and respect your privacy.
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-6 border-y border-white/5 bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white">Our Story</h2>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-text-muted leading-relaxed text-lg">
              We started Hexoran because we were frustrated. Frustrated with bloated software that spies on you.
              Frustrated with tools that prioritize flashy features over core functionality. Frustrated with
              companies that treat privacy as an afterthought.
            </p>
            <p className="text-text-muted leading-relaxed text-lg">
              Our mission is simple: build tools that amplify human capability without compromising trust.
              Every product we ship processes data locally, respects your time, and gets out of your way
              when you don't need it.
            </p>
          </div>
        </div>
      </section>

      {/* Our Products */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white">Our Products</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link key={product.name} href={product.href}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group relative h-full p-6 rounded-2xl bg-surface border border-white/10 hover:border-primary/50 transition-all overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {product.status === "live" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Soon
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center mb-4`}>
                      <product.icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                    <p className="text-sm text-primary font-medium mb-3">{product.tagline}</p>
                    <p className="text-text-muted text-sm mb-4 leading-relaxed">{product.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {product.features.map((feat, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-gray-300 border border-white/5">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-6 bg-surface/20 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white">Our Values</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-surface border border-white/5 hover:border-primary/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-text-muted leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to experience the difference?</h2>
          <p className="text-text-muted mb-8">Try Celato and see what invisible intelligence feels like.</p>
          <Link href="/celato">
            <Button className="bg-primary text-white hover:bg-primary/90 font-bold px-8 py-3 h-auto">
              Get Started with Celato
            </Button>
          </Link>
        </div>
      </section>

    </main>
  );
}