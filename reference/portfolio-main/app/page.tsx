"use client";

import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import AboutSection from "@/components/AboutSection";
import SkillsMarquee from "@/components/SkillsMarquee";
import RecentProjects from "@/components/RecentProjects";
import Footer from "@/components/Footer";
import { FloatingNav } from "@/components/ui/FloatingNavbar";

const Home = () => {
  return (
    <main className="relative bg-[#050505] overflow-hidden">
      <FloatingNav />
      <Hero />
      <Grid />
      <AboutSection />
      <SkillsMarquee />
      <RecentProjects />
      <Footer />
    </main>
  );
};

export default Home;
