import { Hero } from "@/components/home/Hero";
import { BentoGridSection } from "@/components/home/BentoGridSection";
import { SkillsMarquee } from "@/components/home/SkillsMarquee";
import GradientButton from "@/components/ui/GradientButton";
import { ArrowRight, Calendar } from "lucide-react";

export default function Home() {
  return (
    <main>
      <Hero />
      <BentoGridSection />
      <SkillsMarquee />

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-white/5 bg-radial-bottom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-display">
            Ready to build something{" "}
            <span className="gradient-text">amazing</span>?
          </h2>
          <p className="text-text-muted text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed">
            Whether you need a stunning website, a complex web application, or
            just want to chat about ideas — I&apos;m here to help bring your vision
            to life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <GradientButton href="/hire-me" className="px-8 py-3.5">
              Hire Me <ArrowRight className="w-4 h-4" />
            </GradientButton>
            <GradientButton href="/book-a-call" className="px-8 py-3.5 !bg-white/5 !from-white/5 !to-white/10 border-white/10">
              <Calendar className="w-4 h-4" /> Book a Call
            </GradientButton>
          </div>
        </div>
      </section>
    </main>
  );
}
