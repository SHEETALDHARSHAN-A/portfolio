'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
// 1. Import 'Variants' type to fix the build error
import { motion, Variants } from 'framer-motion'
import { Check, ArrowRight, Sparkles, Terminal, Zap, ShieldCheck, Code2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

// 2. Explicitly type the variants
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, y: 0,
    // TypeScript now knows "spring" is a valid animation type, not just a string
    transition: { type: "spring", stiffness: 120, damping: 15 }
  }
}

const ThankYouContent = () => {
    const searchParams = useSearchParams()
    
    const subscriptionId = searchParams.get('subscription_id')
    const urlTier = searchParams.get('tier')
    
    const [tier, setTier] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const resolveTier = async () => {
            if (subscriptionId) {
                try {
                    const { data } = await supabase.functions.invoke('get-subscription-status', {
                        body: { subscriptionId }
                    })
                    if (data?.tier) {
                        setTier(data.tier)
                        setLoading(false)
                        return
                    }
                } catch (e) {
                    console.error("Verification failed:", e)
                }
            }
            setTier(urlTier || 'pro')
            setLoading(false)
        }
        resolveTier()
    }, [subscriptionId, urlTier])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-white/50 text-xs font-mono tracking-[0.2em] uppercase">Initializing...</p>
            </div>
        )
    }

    const config = {
        code: {
            title: "Celato Code",
            subtitle: "Module Active",
            icon: Code2,
            color: "text-blue-400",
            gradient: "from-blue-500 to-cyan-500",
            features: ["Unlimited Screens", "Debug Mode"]
        },
        live: {
            title: "Celato Live",
            subtitle: "Audio Active",
            icon: Zap,
            color: "text-amber-400",
            gradient: "from-amber-500 to-orange-500",
            features: ["Live Audio", "Interview Copilot"]
        },
        pro: {
            title: "Celato Pro",
            subtitle: "Access Granted",
            icon: ShieldCheck,
            color: "text-primary",
            gradient: "from-primary to-violet-500",
            features: ["Full Access", "Priority Support"]
        }
    }[tier as 'code' | 'live' | 'pro'] || {
        title: "Celato Pro",
        subtitle: "Access Granted",
        icon: Sparkles,
        color: "text-primary",
        gradient: "from-primary to-violet-500",
        features: ["Premium Access"]
    }

    const Icon = config.icon

    return (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative bg-[#18181b]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden group w-full max-w-[420px]"
        >
          <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r ${config.gradient} opacity-50`} />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className={`absolute inset-0 bg-white/10 rounded-full z-0`}
              />
              <div className="relative z-10 w-20 h-20 bg-gradient-to-b from-[#1a1a1c] to-[#000] rounded-full flex items-center justify-center border border-white/10 shadow-2xl">
                <Icon className={`w-9 h-9 ${config.color} drop-shadow-lg`} />
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#09090b] border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xl z-20 whitespace-nowrap"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold tracking-wider text-white uppercase">
                    Active
                </span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tighter text-white">
              {config.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Ready</span>
            </h1>
            <p className="text-text-muted text-sm leading-relaxed font-medium">
              {config.subtitle}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-8">
             {config.features.map((feat, i) => (
                 <div key={i} className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center gap-2">
                    <Check className={`w-3 h-3 ${config.color}`} />
                    <span className="text-[11px] font-medium text-white/80">{feat}</span>
                 </div>
             ))}
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
             <Button 
                href="celato://resume"
                className={`group relative w-full h-12 bg-white text-black font-bold text-sm overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] border-0`}
             >
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] opacity-50" />
                 
                 <span className="relative z-10 flex items-center justify-center gap-2">
                     <Terminal className="w-4 h-4" />
                     Initialize Terminal
                     <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                 </span>
             </Button>

             <Button variant="ghost" href="/" className="w-full h-10 text-xs text-text-muted hover:text-white">
                Return to Operations
             </Button>
          </motion.div>
        </motion.div>
    )
}

const SecureFooter = () => {
    const [hexID, setHexID] = useState<string | null>(null);
    useEffect(() => { setHexID(Math.floor(Math.random() * 999999).toString()); }, []);
    
    return (
        <p className="relative z-10 text-center text-[10px] text-white/20 mt-8 uppercase tracking-[0.2em] font-mono">
            ID: {hexID || "---"}
        </p>
    );
};

export default function CelatoThankYouPage() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center relative overflow-hidden pt-20 pb-10 px-4">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-40" 
        />
      </div>

      <div className="relative z-10 w-full flex justify-center flex-col items-center">
        <Suspense fallback={<div className="text-white text-sm">Loading Signal...</div>}>
            <ThankYouContent />
        </Suspense>
        <SecureFooter />
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  )
}