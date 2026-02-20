"use client";

const skills = [
  "TypeScript", "React", "Next.js", "Tailwind CSS", "Node.js",
  "MongoDB", "PostgreSQL", "Docker", "AWS", "GraphQL",
  "Redis", "Prisma", "Git", "Figma", "Framer Motion",
  "Three.js",
];

const SkillsMarquee = () => {
  return (
    <section className="py-16 overflow-hidden">
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/30 font-mono">
          Technologies I work with
        </p>
      </div>

      {/* Marquee container */}
      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />

        {/* Row 1 - left to right */}
        <div className="flex mb-4" style={{ width: "max-content" }}>
          <div className="animate-marquee flex gap-4" style={{ ["--marquee-duration" as any]: "35s" }}>
            {[...skills, ...skills].map((skill, i) => (
              <div
                key={`r1-${i}`}
                className="px-6 py-3 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm text-white/60 text-sm font-medium whitespace-nowrap hover:text-white hover:border-purple-500/30 hover:bg-white/[0.06] transition-all"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - right to left */}
        <div className="flex" style={{ width: "max-content" }}>
          <div
            className="animate-marquee flex gap-4"
            style={{
              ["--marquee-duration" as any]: "40s",
              animationDirection: "reverse",
            }}
          >
            {[...skills.slice().reverse(), ...skills.slice().reverse()].map((skill, i) => (
              <div
                key={`r2-${i}`}
                className="px-6 py-3 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm text-white/60 text-sm font-medium whitespace-nowrap hover:text-white hover:border-purple-500/30 hover:bg-white/[0.06] transition-all"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsMarquee;
