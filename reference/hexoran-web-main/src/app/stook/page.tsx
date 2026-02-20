// "use client";
// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Mic, 
//   Sparkles, 
//   FileText, 
//   Zap, 
//   Check, 
//   Brain, 
//   Share2, 
//   Shield, 
//   ChevronDown, 
//   Minus, 
//   Plus 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// // --- Components ---

// const FeatureBlock = ({ icon: Icon, title, desc, align = "left" }: { icon: any, title: string, desc: string, align?: "left" | "right" }) => (
//   <div className={`flex gap-6 ${align === "right" ? "flex-row-reverse text-right" : "flex-row"}`}>
//     <div className="flex-shrink-0">
//       <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
//         <Icon className="w-6 h-6 text-gold" />
//       </div>
//     </div>
//     <div>
//       <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
//       <p className="text-text-muted leading-relaxed max-w-sm">{desc}</p>
//     </div>
//   </div>
// );

// const PricingCard = ({ 
//   tier, 
//   price, 
//   features, 
//   recommended = false 
// }: { 
//   tier: string, 
//   price: string, 
//   features: string[], 
//   recommended?: boolean 
// }) => (
//   <div className={`relative p-8 rounded-3xl border ${recommended ? 'border-gold bg-gold/5' : 'border-white/10 bg-surface'} flex flex-col h-full`}>
//     {recommended && (
//       <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-black text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-gold/20">
//         Most Popular
//       </div>
//     )}
//     <div className="mb-8">
//       <h3 className="text-lg font-medium text-text-muted uppercase tracking-wide mb-2">{tier}</h3>
//       <div className="flex items-baseline gap-1">
//         <span className="text-4xl font-bold text-white">{price}</span>
//         {price !== "Custom" && <span className="text-text-muted">/month</span>}
//       </div>
//     </div>
//     <ul className="space-y-4 mb-8 flex-1">
//       {features.map((feat, i) => (
//         <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
//           <Check className={`w-5 h-5 flex-shrink-0 ${recommended ? 'text-gold' : 'text-gray-500'}`} />
//           <span>{feat}</span>
//         </li>
//       ))}
//     </ul>
//     <Button 
//       className={`w-full ${recommended ? 'bg-gold text-black hover:bg-yellow-400' : 'bg-white/10 hover:bg-white/20'}`}
//     >
//       {recommended ? 'Start Free Trial' : 'Get Started'}
//     </Button>
//   </div>
// );

// const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   return (
//     <div className="border-b border-white/10">
//       <button 
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full py-6 flex items-center justify-between text-left hover:text-gold transition-colors"
//       >
//         <span className="text-lg font-medium text-white">{question}</span>
//         {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
//       </button>
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div 
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="overflow-hidden"
//           >
//             <p className="pb-6 text-text-muted leading-relaxed">{answer}</p>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // --- Main Page ---

// export default function StookPage() {
//   return (
//     <main className="bg-background min-h-screen text-text-main selection:bg-gold/30">
      
//       {/* 1. HERO SECTION */}
//       <section className="relative pt-40 pb-20 px-6 border-b border-white/10 overflow-hidden">
//         {/* Background Ambient Glow */}
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gold/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
//         <div className="max-w-7xl mx-auto text-center mb-20">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }} 
//             animate={{ opacity: 1, y: 0 }}
//             className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-bold uppercase mb-6 border border-gold/20"
//           >
//             <Sparkles className="w-3 h-3" />
//             Public Beta Live
//           </motion.div>
          
//           <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight font-heading">
//             Your Second Brain <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-gold">For Meetings.</span>
//           </h1>
          
//           <p className="text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
//             Stook doesn't just record; it understands. It listens to your meetings, extracts the action items, and syncs them to your workflow automatically.
//           </p>
          
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <Button className="bg-gold text-black hover:bg-yellow-400 font-bold px-8">Download Stook</Button>
//             <Button variant="outline" className="gap-2">
//               <Zap className="w-4 h-4 text-gold" /> View Live Demo
//             </Button>
//           </div>
//         </div>

//         {/* Hero Visual / Scanner */}
//         <div className="max-w-6xl mx-auto relative z-10">
//            <div className="bg-surface/50 border border-white/10 rounded-2xl p-2 backdrop-blur-sm">
//               <div className="bg-black/80 rounded-xl overflow-hidden aspect-[16/9] relative flex items-center justify-center border border-white/5">
//                  <div className="text-center space-y-4">
//                     <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
//                         <Mic className="w-10 h-10 text-gold" />
//                     </div>
//                     <p className="font-mono text-gold text-sm">Listening to "Q3 Product Roadmap"...</p>
//                     <div className="flex gap-1 justify-center h-8 items-end">
//                         {[40, 70, 30, 80, 50, 90, 40, 60].map((h, i) => (
//                             <motion.div 
//                                 key={i}
//                                 className="w-1 bg-gold rounded-full"
//                                 animate={{ height: [10, h, 10] }}
//                                 transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
//                             />
//                         ))}
//                     </div>
//                  </div>
//               </div>
//            </div>
//         </div>
//       </section>

//       {/* 2. HOW IT WORKS / FEATURES */}
//       <section className="py-32 px-6 max-w-7xl mx-auto">
//         <div className="mb-24 text-center">
//           <h2 className="text-4xl font-bold text-white mb-6">From Audio to Action in Seconds</h2>
//           <p className="text-text-muted max-w-2xl mx-auto">Stop worrying about taking notes. Focus on the conversation, and let Stook handle the documentation.</p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-20 items-center">
//           <div className="space-y-16">
//             <FeatureBlock 
//               icon={Mic} 
//               title="Active Listening Engine" 
//               desc="Stook records system audio and your microphone simultaneously, ensuring crystal clear transcripts even in noisy environments."
//             />
//             <FeatureBlock 
//               icon={Brain} 
//               title="Contextual Intelligence" 
//               desc="It doesn't just type what you say. It understands context, identifying decisions, blockers, and deadlines automatically."
//             />
//             <FeatureBlock 
//               icon={Share2} 
//               title="Workflow Sync" 
//               desc="One-click export to Notion, Linear, Slack, or Obsidian. Your notes land exactly where you work."
//             />
//           </div>
          
//           <div className="relative">
//             <div className="absolute inset-0 bg-gold/20 blur-[100px] rounded-full pointer-events-none" />
//             <div className="relative bg-surface border border-white/10 rounded-2xl p-8 shadow-2xl">
//               <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
//                 <FileText className="text-gold w-5 h-5" />
//                 <span className="font-bold text-white">Meeting Summary</span>
//                 <span className="ml-auto text-xs text-text-muted">Generated 2m ago</span>
//               </div>
//               <div className="space-y-4 font-mono text-sm">
//                 <div className="p-3 bg-white/5 rounded border-l-2 border-gold">
//                   <span className="text-gold font-bold block text-xs uppercase mb-1">Action Item</span>
//                   <p className="text-gray-300">@Team: Finalize the Q3 API Schema by Friday.</p>
//                 </div>
//                 <div className="p-3 bg-white/5 rounded border-l-2 border-blue-500">
//                   <span className="text-blue-500 font-bold block text-xs uppercase mb-1">Decision</span>
//                   <p className="text-gray-300">Switching from REST to GraphQL for the new dashboard.</p>
//                 </div>
//                 <div className="p-3 bg-white/5 rounded">
//                   <span className="text-gray-500 font-bold block text-xs uppercase mb-1">Summary</span>
//                   <p className="text-gray-400">Discussion focused on performance bottlenecks. The team agreed to refactor the legacy user controller.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 3. PRICING SECTION */}
//       <section className="py-32 px-6 bg-surface/30 border-y border-white/5" id="pricing">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-white mb-6">Simple, Transparent Pricing</h2>
//             <p className="text-text-muted">Start for free, upgrade when you need power.</p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//             <PricingCard 
//               tier="Starter"
//               price="$0"
//               features={[
//                 "5 Hours of recording/month",
//                 "Basic transcription",
//                 "Local storage only",
//                 "Markdown export"
//               ]}
//             />
//             <PricingCard 
//               tier="Pro"
//               price="$15"
//               recommended={true}
//               features={[
//                 "Unlimited recording",
//                 "Advanced AI summaries (GPT-4o)",
//                 "Notion & Linear integration",
//                 "Speaker identification",
//                 "Priority support"
//               ]}
//             />
//             <PricingCard 
//               tier="Team"
//               price="$30"
//               features={[
//                 "Everything in Pro",
//                 "Collaborative workspaces",
//                 "Centralized billing",
//                 "Admin controls",
//                 "Custom data retention"
//               ]}
//             />
//           </div>
//         </div>
//       </section>

//       {/* 4. FAQ SECTION */}
//       <section className="py-32 px-6 max-w-3xl mx-auto">
//         <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
//         <div className="space-y-2">
//           <FAQItem 
//             question="Is my audio data private?" 
//             answer="Yes. By default, Stook processes audio locally on your machine if you have a compatible GPU. If you choose cloud processing, data is encrypted in transit and deleted immediately after processing. We never train models on your data." 
//           />
//           <FAQItem 
//             question="Does it work with Zoom, Meet, and Teams?" 
//             answer="Stook records your system audio, so it works with literally anything—Zoom, Meet, Discord, Slack Huddles, or even a YouTube video." 
//           />
//           <FAQItem 
//             question="Can I export to my existing tools?" 
//             answer="Absolutely. We support direct integration with Notion, Obsidian, Linear, Trello, and Slack. You can also copy as Markdown to paste anywhere." 
//           />
//           <FAQItem 
//             question="What happens if I cancel my subscription?" 
//             answer="You keep all your existing notes and summaries forever. You will just revert to the Starter plan limits for future recordings." 
//           />
//         </div>
//       </section>

//       {/* 5. CTA FOOTER */}
//       <section className="py-24 px-6 text-center">
//         <div className="max-w-4xl mx-auto bg-gradient-to-b from-surface to-background border border-white/10 p-12 rounded-3xl relative overflow-hidden">
//           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-200 via-gold to-yellow-200"></div>
//           <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to reclaim your focus?</h2>
//           <p className="text-text-muted text-lg mb-10 max-w-2xl mx-auto">
//             Join thousands of engineers and product managers who trust Stook to remember the details.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//              <Button className="bg-gold text-black hover:bg-yellow-400 font-bold px-10 py-4 text-lg h-auto">Get Started for Free</Button>
//           </div>
//           <p className="mt-6 text-sm text-text-muted">No credit card required for Starter plan.</p>
//         </div>
//       </section>

//     </main>
//   );
// }
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StookPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // TODO: Connect to backend API for waitlist
    }
  };

  return (
    <main className="bg-background min-h-screen text-text-main flex flex-col items-center relative overflow-hidden px-6 pt-32 md:pt-48 pb-20">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse" />

      {/* Main Content */}
      <div className="max-w-3xl mx-auto text-center relative z-10">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-bold uppercase mb-8 border border-gold/20"
        >
          <Sparkles className="w-3 h-3" />
          Coming Soon
        </motion.div>
        
        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight font-heading"
        >
          The Future of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-gold to-yellow-200">
            Meeting Notes.
          </span>
        </motion.h1>
        
        {/* Description */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Stook listens, understands, and organizes your meetings automatically. 
          Stop typing and start collaborating. We are crafting the ultimate second brain for your workflow.
        </motion.p>
        
        {/* Waitlist Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-md mx-auto"
        >
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mic className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  placeholder="Enter your email address..." 
                  className="w-full bg-surface/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="bg-gold text-black hover:bg-yellow-400 font-bold px-6 py-3 h-auto rounded-xl flex items-center gap-2 group"
              >
                Join Waitlist
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gold/10 border border-gold/20 rounded-xl p-4 flex items-center justify-center gap-3 text-gold"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-bold">You're on the list! We'll be in touch.</span>
            </motion.div>
          )}
          <p className="text-xs text-text-muted mt-4">
            Be the first to know when we launch. No spam, ever.
          </p>
        </motion.div>
      </div>

      {/* Decorative Visuals */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
    </main>
  );
}