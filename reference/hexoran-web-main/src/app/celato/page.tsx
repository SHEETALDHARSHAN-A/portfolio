"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  EyeOff,
  Sparkles,
  Code2,
  Zap,
  Check,
  Brain,
  Keyboard,
  Shield,
  Minus,
  Plus,
  Bot,
  Layers,
  Cpu,
  Mic,
  MonitorCheck,
  FileQuestion,
  Activity,
  Crown,
  Rocket,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Monitor,    // Windows
  Command,    // Mac
  Terminal,   // Linux
  X,          // Close
  Copy,        // Copy
  Loader2,
  XCircle,
  RefreshCw,
  Layout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CelatoScanner } from "@/components/home/celato-scanner";
import { cn } from "@/lib/utils";
import { hexoranSupabase } from "@/lib/hexoran";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { GeminiLogo, GroqLogo, CelatoLogo } from "@/components/logos";
import { getLaunchVersion } from "../actions/getLaunchVersion";


// --- Data & Configuration ---

const PRODUCTS = {
  code: {
    name: "Celato Code",
    icon: Code2,
    color: "text-blue-400",
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    bg_hover: "hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.3)]",
    border: "border-blue-500/30",
    tagline: "For Developers",
    description: "Master technical interviews with real-time code analysis, debugging assistance, and algorithm optimization.",
    features: ["Unlimited Screenshot Analysis", "Code Debugging & Refactoring", "Resume Parser", "Universal MCQ Scanner"],
    plans: [
      { id: 'plan_RqPCH5fYA3pbs3', period: 'Weekly', price: '₹29', daily: '₹4', subtext: '7 Day Pass' },
      { id: 'plan_RqPCr4cCfetfOK', period: 'Monthly', price: '₹99', daily: '₹3', subtext: 'Billed Monthly' },
      { id: 'plan_RqPDHYivcbBeEc', period: 'Yearly', price: '₹999', daily: '₹2.7', subtext: 'Billed Yearly', best: true }
    ]
  },
  live: {
    name: "Celato Live",
    icon: Zap,
    color: "text-amber-400",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    bg_hover: "hover:shadow-[0_0_50px_-10px_rgba(245,158,11,0.3)]",
    border: "border-amber-500/30",
    tagline: "For Communication",
    description: "Ace behavioral and verbal rounds with real-time speech processing and intelligent answer suggestions.",
    features: ["Real-time Local Transcription", "Dual-Engine AI (Draft + Final)", "Voice Activity Detection", "Auto-Answer Mode"],
    plans: [
      { id: 'plan_RqPDvSh0yF1O9n', period: 'Weekly', price: '₹49', daily: '₹7', subtext: '7 Day Pass' },
      { id: 'plan_RqPEW9tnk3VXr1', period: 'Monthly', price: '₹149', daily: '₹5', subtext: 'Billed Monthly' },
      { id: 'plan_RqPFUqHlShWJzZ', period: 'Yearly', price: '₹1149', daily: '₹3', subtext: 'Billed Yearly', best: true }
    ]
  },
  pro: {
    name: "Celato Pro",
    icon: Crown,
    color: "text-purple-400",
    gradient: "from-purple-600/30 via-violet-600/10 to-transparent",
    bg_hover: "hover:shadow-[0_0_50px_-10px_rgba(124,58,237,0.4)]",
    border: "border-purple-500/50",
    tagline: "The Complete Suite",
    description: "The ultimate toolkit. Get full access to both Code and Live features, plus priority server capacity.",
    features: ["Everything in Code & Live", "Phantom Mode (Stealth)", "Local Transcription Models", "Priority Support"],
    plans: [
      { id: 'plan_RqPGD9x7zYGDe0', period: 'Weekly', price: '₹69', daily: '₹9.8', subtext: '7 Day Pass' },
      { id: 'plan_RqPHAOViYZTN8W', period: 'Monthly', price: '₹199', daily: '₹6.4', subtext: 'Most Popular', popular: true },
      { id: 'plan_RqPI5vRnNqT30X', period: 'Yearly', price: '₹1499', daily: '₹4.1', subtext: 'Best Value', best: true }
    ]
  }
};

// --- Components ---

const FeatureBlock = ({ icon: Icon, title, desc, align = "left" }: { icon: any, title: string, desc: string, align?: "left" | "right" }) => (
  <div className={`flex flex-col md:flex-row gap-6 ${align === "right" ? "md:flex-row-reverse md:text-right" : ""}`}>
    <div className={`flex-shrink-0 ${align === "right" ? "md:self-end" : "self-start"}`}>
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
    <div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-text-muted leading-relaxed max-w-sm">{desc}</p>
    </div>
  </div>
);

const DetailCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="p-6 rounded-2xl bg-surface border border-white/5 hover:border-primary/30 transition-all hover:bg-white/5 group">
    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
      <Icon className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
  </div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-primary transition-colors group"
      >
        <span className="text-base md:text-lg font-medium text-white group-hover:pl-2 transition-all">{question}</span>
        {isOpen ? <Minus className="w-5 h-5 flex-shrink-0" /> : <Plus className="w-5 h-5 flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm md:text-base text-text-muted leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Linux Modal Component ---
const LinuxModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const commands = `tar -xzf Celato-Latest.tar.gz\ncd Celato-linux-x64\n./celato`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(commands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Install on Linux</h3>
              <p className="text-xs text-text-muted">Portable Tarball (.tar.gz)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-gray-400 uppercase tracking-wider">
              <span>Terminal Commands</span>
              <button onClick={copyToClipboard} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <pre className="relative bg-black rounded-lg border border-white/10 p-4 font-mono text-sm text-green-400 overflow-x-auto">
                {commands}
              </pre>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/celato/downloading" className="flex-1" onClick={onClose}>
              <Button className="w-full bg-white text-black hover:bg-zinc-200 font-bold">
                <Monitor className="w-4 h-4 mr-2" /> Download .tar.gz
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Main Page ---

export default function CelatoPage() {
  const [activeTab, setActiveTab] = useState<'code' | 'live' | 'pro'>('pro');
  const [os, setOs] = useState<'windows' | 'mac' | 'linux'>('windows');
  const [showLinuxModal, setShowLinuxModal] = useState(false);
  const [version, setVersion] = useState("V1.0 Stable Release");

  useEffect(() => {
    getLaunchVersion().then(setVersion);
  }, []);

  // Auth & Payment State
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const router = useRouter();

  // Smart Sync & Status States (From Electron)
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null); // Track specific loading plan

  const currentProduct = PRODUCTS[activeTab];

  // --- GOOGLE STRUCTURED DATA (JSON-LD) ---
  // This tells Google Search about your Product, Price, and Brand.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Celato',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Windows, macOS, Linux',
    description: 'Real-time technical interview copilot for developers. Includes screen analysis, live coding assistance, and speech processing.',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '29',
      highPrice: '1499',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      offerCount: '9',
    },
    brand: {
      '@type': 'Brand',
      name: 'Hexoran',
    },
    image: 'https://www.hexoran.com/logo.svg',
  };

  // Robust Script Loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    })
  }

  useEffect(() => { loadRazorpayScript() }, []);

  const checkSubscriptionStatus = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const { data: { session } } = await hexoranSupabase.auth.getSession();
      if (!session) return;

      // Check Subscription (New 'subscriptions' table)
      const { data, error } = await hexoranSupabase
        .from('subscriptions')
        .select('status, tier')
        .eq('user_id', session.user.id)
        .eq('product_id', 'celato')
        .maybeSingle();

      if (data && (data.status === 'active' || data.status === 'trialing' || data.tier === 'pro')) {
        setPaymentSuccess(true);
        setIsVerifying(false);
        setStatusType('success');
        setStatusMessage("Payment confirmed! Redirecting to setup...");
        setTimeout(() => router.push('/celato/downloading'), 1500);
        return true;
      } else if (isManual) {
        setStatusType('info');
        setStatusMessage("No active subscription found yet. Please wait a moment.");
        setTimeout(() => setStatusMessage(null), 3000);
      }
      return false;
    } catch (e) { console.error(e); }
    finally { if (isManual) setIsRefreshing(false); }
  }

  // Handle Purchase Flow
  const handleJoin = async (planId: string) => {
    const { data: { session } } = await hexoranSupabase.auth.getSession();

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    startRazorpay(planId, session);
  };

  const startRazorpay = async (planId: string, session: any) => {
    setLoadingId(planId);
    setStatusMessage(null);

    // Ensure Script Loaded
    if (!(window as any).Razorpay) {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setStatusType('error');
        setStatusMessage("Connection failed. Check your internet.");
        setLoadingId(null);
        return;
      }
    }

    try {
      // 1. Create Order via Hexoran Functions
      const { data, error } = await hexoranSupabase.functions.invoke('create-razorpay-subscription', {
        body: { planId }
      });

      if (error || !data) {
        console.warn("Backend order creation failed:", error);
        // Fallback for dev/mock only if absolutely needed, but better to show error
        if (process.env.NODE_ENV === 'development') {
          alert("Dev Mode: Payment System Connected (Mock).");
          checkSubscriptionStatus(true);
          setLoadingId(null);
          return;
        }
        throw error || new Error('No data received');
      }

      // const data = await response.json(); // Handled by invoke

      // 2. Open Razorpay
      const options = {
        key: data.key_id,
        subscription_id: data.subscription_id,
        name: "Hexoran Celato",
        description: `${PRODUCTS[activeTab].name} Subscription`,

        handler: function (response: any) {
          setIsVerifying(true);
          setStatusType('success');
          setStatusMessage("Verifying secure payment...");

          // Poll for success
          let attempts = 0;
          const fastPoll = setInterval(async () => {
            const success = await checkSubscriptionStatus(false);
            attempts++;
            if (success || attempts > 20) clearInterval(fastPoll);
          }, 1000);
        },
        prefill: {
          email: session.user.email,
        },
        theme: { color: "#7c3aed" },
        modal: {
          ondismiss: function () {
            setLoadingId(null);
            if (!paymentSuccess && !isVerifying) {
              setStatusType('info');
              setStatusMessage("Payment cancelled.");
              setTimeout(() => setStatusMessage(null), 3000);
            }
          }
        }
      };

      // @ts-ignore
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response: any) {
        setStatusType('error');
        setStatusMessage("Payment Failed. Please try again.");
        setLoadingId(null);
      });
      rzp1.open();

    } catch (err) {
      console.error("Payment Error:", err);
      setStatusType('error');
      setStatusMessage("Could not initiate payment.");
      setLoadingId(null);
    }
  };

  // OS Detection
  React.useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.includes('mac')) setOs('mac');
    else if (ua.includes('linux')) setOs('linux');
    else setOs('windows');
  }, []);

  return (
    <main className="bg-background min-h-screen text-text-main selection:bg-purple-500/30 overflow-x-hidden">

      {/* Inject Google Structured Data for Rich Snippets 
         This makes your product show up with Price/Ratings in Search 
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase mb-8 border border-primary/20"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            A Hexoran Product
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-32 h-32 mx-auto mb-8 relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <CelatoLogo className="w-full h-full text-white relative z-10" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Celato
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-primary font-medium mb-6"
          >
            Your AI Interview Copilot
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-text-muted max-w-3xl mx-auto mb-10 leading-relaxed px-4"
          >
            Unlock superpowers for every interview. From Coding rounds to System Design and HR behaviorals, Celato analyzes your screen and audio in real-time to provide the winning edge.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Dynamic Download Button */}
            {os === 'linux' ? (
              <Button
                onClick={() => setShowLinuxModal(true)}
                className="bg-primary text-white hover:bg-primary/90 font-bold w-full sm:w-auto px-8 gap-2 shadow-lg shadow-primary/25 h-auto py-3"
              >
                <Terminal className="w-5 h-5" /> Install on Linux
              </Button>
            ) : (
              <Link href="/celato/downloading" passHref>
                <Button className="bg-primary text-white hover:bg-primary/90 font-bold w-full sm:w-auto px-8 gap-2 shadow-lg shadow-primary/25 h-auto py-3">
                  {os === 'mac' ? <Command className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                  Download for {os === 'mac' ? 'Mac' : 'Windows'}
                </Button>
              </Link>
            )}

            <Link href="/celato/docs">
              <Button variant="outline" className="gap-2 w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/10 h-auto py-3">
                <Zap className="w-4 h-4" /> View Documentation
              </Button>
            </Link>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Shield className="w-3 h-3" />
              Private & Secure
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              <Zap className="w-3 h-3" />
              Real-time AI
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Layout className="w-3 h-3" />
              Windows • Mac • Linux
            </span>
          </motion.div>
        </div>
      </section>

      {/* App Preview Section (Scanner) */}
      <section className="py-20 px-6 bg-gradient-to-b from-primary/5 to-transparent border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">See It In Action</h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Intelligent screen scanning and code generation at your fingertips.
            </p>
          </div>
          <div className="max-w-5xl mx-auto relative px-2 md:px-0">
            <div className="bg-surface/50 border border-white/10 rounded-2xl p-2 backdrop-blur-sm shadow-2xl">
              <CelatoScanner />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES SECTION */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">More Than Just Code</h2>
          <p className="text-text-muted max-w-2xl mx-auto">Celato adapts to the interview format. Whether it's a silent coding test or a live video call, we have you covered.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Feature List */}
          <div className="space-y-12 md:space-y-16">
            <FeatureBlock
              icon={Code2}
              title="Code Mode"
              desc="Perfect for OA (Online Assessments) and screen-sharing coding rounds. Includes the Universal Scanner to solve aptitude/MCQs instantly from any webpage and smart code explanation."
              align="left"
            />
            <FeatureBlock
              icon={Mic}
              title="Live Mode"
              desc="Real-time transcription using ultra-low latency speech models. Listens to system audio (Zoom/Teams/Meet) to generate instant captions. Includes 'Analyze Screen' to read shared content while listening."
              align="left"
            />
            <FeatureBlock
              icon={Crown}
              title="Pro Mode"
              desc="The ultimate stealth experience. Includes Phantom Mode - runs as an invisible background process with no windows or tray icons. Combines Code + Live with local transcription models and self-hosted data."
              align="left"
            />
          </div>

          {/* Visual Representation */}
          <div className="relative mt-8 md:mt-0">
            <div className="absolute inset-0 bg-primary/20 blur-[60px] md:blur-[100px] rounded-full pointer-events-none" />
            <div className="relative bg-surface border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <Activity className="text-primary w-5 h-5 animate-pulse" />
                <span className="font-bold text-white">Live Audio Analysis</span>
                <span className="ml-auto text-xs text-text-muted">Listening...</span>
              </div>
              <div className="space-y-4 font-mono text-sm">
                <div className="p-3 bg-white/5 rounded border-l-2 border-blue-500">
                  <span className="text-blue-500 font-bold block text-xs uppercase mb-1">Interviewer (Audio)</span>
                  <p className="text-gray-300">"How would you scale this database for 1 million concurrent users?"</p>
                </div>
                <div className="p-3 bg-white/5 rounded border-l-2 border-primary">
                  <span className="text-primary font-bold block text-xs uppercase mb-1">Celato Suggestion</span>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Discuss <strong>Sharding</strong> (Horizontal scaling).</li>
                    <li>Mention <strong>Read Replicas</strong> for query offloading.</li>
                    <li>Suggest <strong>Consistent Hashing</strong>.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CAPABILITIES GRID */}
      <section className="py-20 px-6 bg-surface/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white">Everything You Need to Pass</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DetailCard
              icon={Bot}
              title="Multi-Model Support"
              desc="Switch between GPT-4o, Claude 3.5 Sonnet, and Gemini 2.0 Flash instantly. Choose speed for live rounds or depth for complex coding."
            />
            <DetailCard
              icon={MonitorCheck}
              title="Aptitude & MCQs"
              desc="One click captures the question and options. Celato solves logical reasoning, probability, and verbal ability questions instantly."
            />
            <DetailCard
              icon={Cpu}
              title="Smart Screenshots"
              desc="Intelligent cropping automatically separates problem text from your code editor for better context processing."
            />
            <DetailCard
              icon={Code2}
              title="Real-time Debugging"
              desc="Stuck on a syntax error? Take a snap of the error message and Celato suggests immediate fixes without switching tabs."
            />
            <DetailCard
              icon={Shield}
              title="Local & Private"
              desc="Screenshots and API keys are stored locally. We have zero telemetry and cannot see your interview data."
            />
            <DetailCard
              icon={Layers}
              title="Window Management"
              desc="The overlay stays Always-On-Top but lets you click through it to type in your code editor seamlessly."
            />
            <DetailCard
              icon={Activity}
              title="Context-Aware Intelligence"
              desc="Upload your Resume and target Company URL. Celato personalizes every answer to your experience level and the specific role requirements."
            />
            <DetailCard
              icon={EyeOff}
              title="Phantom Mode"
              desc="Pro users can activate invisible background mode. No windows, no tray icon - just seamless assistance delivered to your private self-hosted dashboard."
            />
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION - TABBED */}
      <section className="py-20 md:py-32 px-6 relative" id="pricing">
        {/* Ambient Background for Pricing */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-primary/5 blur-[100px] -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Invest in Your Career</h2>
            <p className="text-text-muted">Choose the plan that suits your needs.</p>
          </div>

          <div className="flex flex-col items-center">

            {/* TABS */}
            <div className="relative p-1.5 bg-surface rounded-2xl mb-12 border border-white/10 shadow-2xl flex w-full max-w-md">
              {(['code', 'live', 'pro'] as const).map((tab) => {
                const isActive = activeTab === tab;
                const Item = PRODUCTS[tab];
                const Icon = Item.icon;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "relative flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 z-10",
                      isActive ? "text-white" : "text-white/40 hover:text-white/70"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className={cn("absolute inset-0 rounded-xl bg-white/10 border border-white/10 shadow-inner")}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className={cn("w-4 h-4 relative z-10", isActive && Item.color)} />
                    <span className="relative z-10">{Item.name}</span>
                  </button>
                )
              })}
            </div>

            {/* CONTENT AREA */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center"
              >
                {/* Details Header for Tab */}
                <div className="w-full max-w-5xl mb-10 text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-6 px-4">
                  <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/10", currentProduct.color)}>
                    <currentProduct.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{currentProduct.name}</h3>
                    <p className="text-primary text-sm font-bold tracking-wider uppercase mb-2">{currentProduct.tagline}</p>
                    <p className="text-text-muted max-w-xl">{currentProduct.description}</p>
                  </div>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
                  {currentProduct.plans.map((plan) => {
                    // @ts-ignore
                    const isPopular = plan.popular;
                    // @ts-ignore
                    const isBest = plan.best;

                    return (
                      <div
                        key={plan.id}
                        className={cn(
                          "relative p-8 rounded-3xl border flex flex-col h-full bg-surface transition-all duration-300",
                          isPopular ? "border-primary bg-primary/5" : "border-white/10",
                          "hover:border-primary/30 hover:bg-white/5"
                        )}
                      >
                        {isPopular && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">
                            Most Popular
                          </div>
                        )}
                        {isBest && !isPopular && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-black text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                            Best Value
                          </div>
                        )}

                        <div className="mb-8">
                          <h3 className="text-lg font-medium text-text-muted uppercase tracking-wide mb-2">{plan.period}</h3>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">{plan.price}</span>
                            <span className="text-text-muted text-sm">/ {plan.subtext}</span>
                          </div>
                          <div className="mt-2 text-xs text-primary font-mono bg-primary/10 inline-block px-2 py-1 rounded">
                            Only {plan.daily} / day
                          </div>
                        </div>

                        <div className="flex-1 mb-8">
                          <p className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <Rocket className="w-4 h-4 text-primary" /> Included Features:
                          </p>
                          <ul className="space-y-3">
                            {currentProduct.features.map((feat, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                <Check className={`w-4 h-4 flex-shrink-0 text-primary`} />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Link href="#" onClick={(e) => { e.preventDefault(); handleJoin(plan.id); }} passHref className="block w-full">
                          <Button
                            disabled={loadingId === plan.id}
                            className={`w-full font-bold ${isPopular ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white/10 hover:bg-white/20'}`}
                          >
                            {loadingId === plan.id ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Started"}
                          </Button>
                        </Link>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 text-center space-y-4">
                  <p className="text-[10px] text-zinc-600/60 uppercase tracking-widest font-bold">Strict No Refund Policy • Cancel Anytime Before Renewal</p>

                  <Button
                    variant="ghost"
                    onClick={() => checkSubscriptionStatus(true)}
                    disabled={isRefreshing || paymentSuccess}
                    className={cn(
                      "text-white/40 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-full px-6 h-8 gap-2 text-[10px] transition-all",
                      paymentSuccess && "bg-green-500/10 text-green-400 border-green-500/20"
                    )}
                  >
                    {paymentSuccess ? (
                      <> <CheckCircle2 className="w-3 h-3" /> Verified! </>
                    ) : (
                      <>
                        <RefreshCw className={cn("w-3 h-3", isRefreshing && "animate-spin")} />
                        {isRefreshing ? "Checking..." : "I've already paid (Check Status)"}
                      </>
                    )}
                  </Button>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </section>

      {/* 5. API KEY SETUP GUIDE */}
      <section className="py-20 px-6 bg-surface/30 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How to Get Your API Keys</h2>
            <p className="text-text-muted">Celato allows you to bring your own API keys for maximum privacy and control.</p>
          </div>

          <div className="grid gap-6">
            {/* Gemini */}
            <div className="p-6 rounded-2xl bg-surface border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <GeminiLogo className="w-8 h-8" />
                Google Gemini API <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">Free Tier Available</span>
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-300 text-sm md:text-base">
                <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-primary hover:underline">Google AI Studio</a>.</li>
                <li>Sign in with your Google account.</li>
                <li>Click on <strong>"Create API Key"</strong>.</li>
                <li>Select a project (or create new) and copy the key starting with <code>AIza...</code>.</li>
                <li>Paste it into Celato Settings {'>'} API Keys.</li>
              </ol>
            </div>

            {/* Groq */}
            <div className="p-6 rounded-2xl bg-surface border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <GroqLogo className="w-8 h-8 text-orange-500" />
                Groq API
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-300 text-sm md:text-base">
                <li>Visit <Link href="/docs/groq-setup" className="text-primary hover:underline font-bold">our Groq Setup Guide</Link>.</li>
                <li>Follow steps to get your ultra-fast inference key.</li>
                <li>Paste it into Celato Settings {'>'} General {'>'} Groq.</li>
              </ol>
            </div>

            {/* OpenAI */}
            <div className="p-6 rounded-2xl bg-surface border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">O</div>
                OpenAI API (GPT-4o)
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-300 text-sm md:text-base">
                <li>Visit the <a href="https://platform.openai.com/api-keys" target="_blank" className="text-primary hover:underline">OpenAI Platform</a>.</li>
                <li>Log in or Sign up. (*Note: You must add billing credits specifically for the API, ChatGPT Plus subscription does not cover this).</li>
                <li>Click <strong>"Create new secret key"</strong>.</li>
                <li>Name it "Celato" and copy the key (<code>sk-...</code>).</li>
              </ol>
            </div>

            {/* Anthropic */}
            <div className="p-6 rounded-2xl bg-surface border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">A</div>
                Anthropic API (Claude 3.5)
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-300 text-sm md:text-base">
                <li>Go to the <a href="https://console.anthropic.com/" target="_blank" className="text-primary hover:underline">Anthropic Console</a>.</li>
                <li>Add credits to your account (minimum $5 usually).</li>
                <li>Navigate to "API Keys" and click <strong>"Create Key"</strong>.</li>
                <li>Copy the key starting with <code>sk-ant...</code>.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-20 md:py-32 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-2">
          <FAQItem
            question="Does Live Mode record the call?"
            answer="No, Celato processes system audio in real-time to generate text transcripts. No audio is ever saved or uploaded to any server."
          />
          <FAQItem
            question="Can it solve non-technical questions?"
            answer="Yes! The 'Universal Scanner' works on any text on your screen. This includes aptitude tests, logical reasoning, and even general knowledge MCQs."
          />
          <FAQItem
            question="Is Celato undetectable?"
            answer="Celato uses advanced OS-level window layering techniques to remain invisible to most screen sharing software (Zoom, Google Meet, Teams). However, we always recommend testing it with a friend first."
          />
          <FAQItem
            question="Which AI models does it use?"
            answer="We support the latest models including GPT-4o, Claude 3.5 Sonnet, and Gemini Pro. You can switch between them in the settings based on your preference."
          />
          <FAQItem
            question="What is Phantom Mode?"
            answer="Phantom Mode is a Pro-exclusive feature that runs Celato as a completely invisible background process. It captures your screen and audio, processes them with AI, and sends results to your private self-hosted Supabase dashboard. There's no window, no tray icon, and it appears as 'RuntimeBroker' in Task Manager."
          />
          <FAQItem
            question="Is transcription done locally?"
            answer="You have the choice. Use Local Whisper for complete privacy (requires decent CPU/GPU) or Groq API for lightning-fast cloud transcription."
          />
          <FAQItem
            question="What hardware do I need for Live Mode?"
            answer="Celato is optimized for efficiency. For local processing, 8GB+ RAM is recommended. If you use cloud APIs (Groq/OpenAI), it runs smoothly on any modern laptop."
          />
        </div>
      </section>

      {/* 6. CTA FOOTER */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-surface to-background border border-white/10 p-8 md:p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-300 via-primary to-violet-300"></div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to secure the offer?</h2>
          <p className="text-text-muted text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of engineers using Celato to ace their technical interviews.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/celato/downloading" passHref>
              <Button className="bg-primary text-white hover:bg-primary/90 font-bold px-10 py-4 text-lg h-auto w-full sm:w-auto">Get Started</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. ETHICAL USE NOTICE & LEGAL LINKS */}
      <section className="py-12 px-6 border-t border-white/5 bg-red-950/10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl bg-red-500/5 border border-red-500/20">
          <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-sm font-bold text-red-400 mb-2 uppercase tracking-wide">Critical Liability Notice: Educational Use Only</h4>
            <p className="text-xs text-red-200/60 leading-relaxed mb-4">
              Celato is strictly an educational tool. Use for academic dishonesty, exams, or interview cheating is prohibited.
              <strong> By using this tool, you acknowledge that YOU assume 100% of the risk.</strong> If you are banned, fired, or sued, it is your fault. Hexoran bears zero liability.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-xs font-medium">
              <Link href="/legal/terms" className="text-red-400 hover:text-red-300 underline underline-offset-4">Terms of Service</Link>
              <Link href="/legal/privacy" className="text-red-400 hover:text-red-300 underline underline-offset-4">Privacy Policy</Link>
              <Link href="/legal/eula" className="text-red-400 hover:text-red-300 underline underline-offset-4">EULA</Link>
              <Link href="/legal/acceptable-use" className="text-red-400 hover:text-red-300 underline underline-offset-4">Acceptable Use</Link>
            </div>
          </div>
        </div>
      </section>
    </main >
  );
}