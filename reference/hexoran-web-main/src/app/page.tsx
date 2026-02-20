import { Hero } from "@/components/home/hero";
import { CelatoScanner } from "@/components/home/celato-scanner";
import { ProductsGrid } from "@/components/home/products-grid";
import { Zap, Shield, Globe } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="group p-6 rounded-2xl bg-surface/50 border border-white/5 hover:border-primary/50 transition-all hover:-translate-y-1">
    <div className="mb-4 p-3 bg-white/5 rounded-lg w-fit group-hover:bg-primary/10 transition-colors">
      <Icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
  </div>
);

export default function Home() {
  return (
    <main>
      <Hero />

      {/* Scanner Section */}
      <section className="bg-black/50 border-y border-white/10">
        <CelatoScanner />
      </section>

      {/* Products Section */}
      <ProductsGrid />

      {/* Quick Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Why Hexoran?</h2>
          <p className="text-text-muted">Built different. Built better.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Zap}
            title="Lightning Fast"
            desc="Optimized at the kernel level. Our applications run with minimal overhead."
          />
          <FeatureCard
            icon={Shield}
            title="Privacy First"
            desc="Zero telemetry. Your data lives on your machine and only leaves when authorized."
          />
          <FeatureCard
            icon={Globe}
            title="Global Infrastructure"
            desc="Deployed on the edge. Wherever you are, Hexoran services respond in milliseconds."
          />
        </div>
      </section>
    </main>
  );
}