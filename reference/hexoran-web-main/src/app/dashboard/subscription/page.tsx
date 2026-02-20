"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { hexoranSupabase } from '@/lib/hexoran';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Loader2, Check, Crown, Zap, Code2, Calendar, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import Script from 'next/script';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';
import { cn } from "@/lib/utils";

// Define Plans
const PLANS = SUBSCRIPTION_PLANS;

// === TIER HIERARCHY ===
const TIER_PRIORITY: Record<string, number> = { 'free': 0, 'code': 1, 'live': 1, 'pro': 2 };
const isVaultOnlyPurchase = (currentTier: string, targetTier: string) =>
    TIER_PRIORITY[targetTier] < TIER_PRIORITY[currentTier];

export default function SubscriptionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Detailed Subscription State
    const [subscription, setSubscription] = useState<any>(null);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const { data: { session } } = await hexoranSupabase.auth.getSession();
            if (!session) {
                router.push('/');
                return;
            }
            setUser(session.user);

            // FETCH FULL SUBSCRIPTION DETAILS
            const { data: subData } = await hexoranSupabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', session.user.id)
                .eq('product_id', 'celato')
                .maybeSingle();

            setSubscription(subData);
            setLoading(false);
        } catch (error) {
            console.error('Session check failed', error);
            router.push('/');
        }
    };

    // --- PAYMENT HANDLER STATE ---
    const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
    const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
    const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
    const [pendingExtensionPlan, setPendingExtensionPlan] = useState<any>(null);

    const handlePayment = async (planId: string) => {
        try {
            setProcessingPlanId(planId);
            console.log('Initiating payment for:', planId);

            // 1. Get Session
            const { data: { session } } = await hexoranSupabase.auth.getSession();
            if (!session) { toast.error('Please login first'); return; }

            // 2. Call Edge Function
            const { data, error } = await hexoranSupabase.functions.invoke('create-razorpay-subscription', {
                body: { planId }
            });

            if (data?.error || error) {
                console.error('Subscription Creation Failed:', data?.error || error);
                toast.error('Failed to initialize payment', { description: 'Please try again later.' });
                return;
            }

            const { subscription_id, key_id, is_upgrade, already_active, message } = data;

            // 3. Handle Already Active
            if (already_active) {
                toast.info(message || "Subscription already active");
                setProcessingPlanId(null);
                setPendingExtensionPlan(null);
                return;
            }

            const isVaultPurchase = data?.is_vault_only;

            // 4. Handle Upgrade/Update vs New Payment
            if (is_upgrade) {
                toast.success("Plan Update Successful!", {
                    description: "Your changes have been applied/scheduled."
                });
                setProcessingPlanId(null);
                setPendingExtensionPlan(null);
                await checkSession();
                router.refresh();
                return;
            }

            // 5. Open Razorpay Checkout
            if (!(window as any).Razorpay) {
                toast.error("Payment SDK not loaded", { description: "Refresh page and try again." });
                return;
            }

            // @ts-ignore
            const options = {
                key: key_id,
                subscription_id: subscription_id,
                name: "Hexoran",
                description: isVaultPurchase ? "Add Days to Vault" : "Celato Premium Access",
                handler: async function (response: any) {
                    console.log("Payment Success:", response);

                    if (isVaultPurchase) {
                        toast.success("🏦 Days Added to Vault!", {
                            description: `Purchased days banked successfully.`,
                            duration: 5000
                        });
                        setTimeout(async () => {
                            await checkSession();
                            router.refresh();
                        }, 2000);
                    } else {
                        toast.success("Payment Successful!", {
                            description: "Welcome to your new plan."
                        });
                        router.push('/subscription-success');
                    }
                },
                theme: { color: isVaultPurchase ? "#06b6d4" : "#3B82F6" }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                toast.error('Payment Failed', { description: response.error.description });
            });
            rzp.open();

        } catch (err: any) {
            console.error('Payment Error:', err);
            toast.error('Something went wrong', { description: err.message });
        } finally {
            setProcessingPlanId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        );
    }

    // --- DERIVE PERMISSIONS ---
    const subs = Array.isArray(subscription) ? subscription : (subscription ? [subscription] : []);
    const activeSubs = subs.filter(s => s.status === 'active' || s.status === 'trialing');

    // Aggregated Features
    const hasCode = activeSubs.some(s => s.tier === 'code' || s.tier === 'pro');
    const hasLive = activeSubs.some(s => s.tier === 'live' || s.tier === 'pro');
    const hasPro = activeSubs.some(s => s.tier === 'pro');

    // Display Tier
    let displayTier = 'free';
    if (hasPro) displayTier = 'pro';
    else if (hasCode && hasLive) displayTier = 'pro';
    else if (hasCode) displayTier = 'code';
    else if (hasLive) displayTier = 'live';

    // Expiry Info
    const latestSub = activeSubs.sort((a, b) => new Date(b.current_period_end).getTime() - new Date(a.current_period_end).getTime())[0];
    const expiryDate = latestSub?.current_period_end;
    const activePlanID = latestSub?.external_plan_id;

    // --- CARD DATA ---
    const TIERS = [
        {
            id: 'code',
            name: 'Celato Code',
            tagline: 'For Developers',
            icon: Code2,
            colors: {
                text: 'text-blue-400',
                bg: 'bg-blue-500/20',
                border: 'border-blue-500/30',
                glow: 'shadow-[0_0_50px_-10px_rgba(59,130,246,0.3)]',
                btn: 'bg-blue-600 hover:bg-blue-500',
                gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent'
            },
            features: ['Full Code Generation', 'Context Aware Chat', 'Refactoring Agent', 'IDE Integration']
        },
        {
            id: 'live',
            name: 'Celato Live',
            tagline: 'For Communication',
            icon: Zap,
            colors: {
                text: 'text-purple-400',
                bg: 'bg-purple-500/20',
                border: 'border-purple-500/30',
                glow: 'shadow-[0_0_50px_-10px_rgba(168,85,247,0.3)]',
                btn: 'bg-purple-600 hover:bg-purple-500',
                gradient: 'from-purple-600/30 via-violet-600/10 to-transparent'
            },
            features: ['Real-time Speech Rec', 'Interview Copilot', 'Hidden Overlay', 'Instant Answers']
        },
        {
            id: 'pro',
            name: 'Celato Pro',
            tagline: 'The Complete Suite',
            icon: Crown,
            colors: {
                text: 'text-amber-400',
                bg: 'bg-amber-500/20',
                border: 'border-amber-500/30',
                glow: 'shadow-[0_0_50px_-10px_rgba(245,158,11,0.3)]',
                btn: 'bg-amber-600 hover:bg-amber-500',
                gradient: 'from-amber-500/20 via-orange-500/10 to-transparent'
            },
            features: ['Everything in Code', 'Everything in Live', 'Priority Server Access', 'Early Access Features']
        }
    ];

    return (
        <div className="min-h-screen bg-[#020202] text-white selection:bg-purple-500/30 font-sans">
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="afterInteractive"
            />
            <Navbar />

            {/* Ambient Background Effect */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-primary/5 blur-[120px] rounded-full" />
            </div>

            <main className="max-w-7xl mx-auto px-4 pt-32 pb-20 md:px-6 relative z-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div>
                        <Button
                            onClick={() => router.push('/dashboard')}
                            variant="ghost"
                            className="text-gray-500 hover:text-white pl-0 gap-2 mb-6 h-auto p-0 hover:bg-transparent transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Button>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
                            Invest in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400">Your Career</span>
                        </h1>
                        <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
                            Choose the plan that suits your needs. Upgrade your arsenal with our specialized autonomous agents.
                        </p>
                    </div>

                    {/* Billing Toggle */}
                    <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-1.5 flex shadow-2xl">
                        {(['weekly', 'monthly', 'yearly'] as const).map((cycle) => (
                            <button
                                key={cycle}
                                onClick={() => setBillingCycle(cycle)}
                                className={cn(
                                    "px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative uppercase tracking-wider",
                                    billingCycle === cycle ? "text-white bg-white/10 shadow-lg" : "text-gray-500 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <span className="capitalize">{cycle}</span>
                                {cycle === 'yearly' && (
                                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-black text-[9px] font-black px-2 py-0.5 rounded-md leading-none shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                        -20%
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {TIERS.map((tierData) => {
                        const plan = PLANS.find(p => p.tier === tierData.id && p.name.toLowerCase().includes(billingCycle));
                        const isCurrent = activePlanID === plan?.id;
                        const hasTier = activeSubs.some(s => s.tier === tierData.id);
                        const isVaultOnly = isVaultOnlyPurchase(displayTier, tierData.id);

                        let buttonText = "Get Started";
                        if (hasTier) buttonText = "Extend Plan";
                        else if (isVaultOnly) buttonText = "Add to Vault";
                        else if (tierData.id === 'pro' && !hasTier) buttonText = "Upgrade to Pro";

                        const Icon = tierData.icon;
                        const isPopular = tierData.id === 'pro' && billingCycle === 'monthly';
                        const isBestValue = tierData.id === 'pro' && billingCycle === 'yearly';

                        return (
                            <motion.div
                                key={tierData.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: tierData.id === 'code' ? 0.1 : tierData.id === 'live' ? 0.2 : 0.3 }}
                                className={cn(
                                    "relative group rounded-3xl p-8 transition-all duration-300",
                                    isCurrent
                                        ? `border-2 ${tierData.colors.border} bg-[#0F0F0F] ${tierData.colors.glow}`
                                        : "border border-white/10 bg-[#0F0F0F] hover:border-white/20 hover:bg-white/5"
                                )}
                            >
                                {/* Background Gradient Layer */}
                                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                                    <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b", tierData.colors.gradient)} />
                                </div>

                                {/* Badges */}
                                {isBestValue && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 bg-gradient-to-r from-emerald-400 to-emerald-600 text-black text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_25px_rgba(16,185,129,0.5)] z-50 whitespace-nowrap">
                                        Best Value
                                    </div>
                                )}
                                {isPopular && !isBestValue && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-[0_0_25px_rgba(124,58,237,0.5)] z-50 whitespace-nowrap">
                                        Most Popular
                                    </div>
                                )}

                                {/* Card Content */}
                                <div className="relative z-10">
                                    {/* Icon & Title */}
                                    <div className="mb-8">
                                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border backdrop-blur-sm transition-all group-hover:scale-110", tierData.colors.bg, tierData.colors.border)}>
                                            <Icon className={cn("w-8 h-8", tierData.colors.text)} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{tierData.name}</h3>
                                        <p className={cn("text-xs font-bold uppercase tracking-widest mb-6", tierData.colors.text)}>{tierData.tagline}</p>

                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-extrabold text-white tracking-tighter">{plan?.price?.split('/')[0]}</span>
                                            <span className="text-gray-500 text-sm font-bold uppercase">/{billingCycle.replace('ly', '')}</span>
                                        </div>
                                        <div className={cn("mt-2 text-xs font-mono px-3 py-1.5 rounded-lg inline-block", tierData.colors.bg, tierData.colors.text)}>
                                            Only ₹{Math.round(parseInt(plan?.price?.replace(/[^0-9]/g, '') || '0') / (billingCycle === 'weekly' ? 7 : billingCycle === 'monthly' ? 30 : 365))}/day
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="mb-6">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3" /> Included Features
                                        </p>
                                        <ul className="space-y-3">
                                            {tierData.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-300">
                                                    <Check className={cn("w-4 h-4 shrink-0 mt-0.5", tierData.colors.text)} />
                                                    <span className="leading-tight">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        onClick={() => {
                                            if (hasTier) {
                                                setPendingExtensionPlan(plan);
                                                setIsExtensionModalOpen(true);
                                            } else {
                                                plan && handlePayment(plan.id);
                                            }
                                        }}
                                        disabled={!!processingPlanId}
                                        className={cn(
                                            "w-full h-14 font-bold transition-all rounded-xl text-sm uppercase tracking-widest shadow-lg",
                                            isCurrent
                                                ? `${tierData.colors.btn} text-white border-0`
                                                : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                                        )}
                                    >
                                        {processingPlanId === plan?.id ? (
                                            <Loader2 className="animate-spin w-5 h-5" />
                                        ) : buttonText}
                                    </Button>

                                    {isCurrent && (
                                        <div className={cn("mt-4 text-center text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2", tierData.colors.text)}>
                                            <div className="w-2 h-2 rounded-full bg-current animate-pulse shadow-[0_0_10px_currentColor]" />
                                            Active Subscription
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* --- EXTENSION MODAL --- */}
                <Dialog open={isExtensionModalOpen} onOpenChange={setIsExtensionModalOpen}>
                    <DialogContent className="bg-[#0F0F0F] border border-white/10 text-white sm:max-w-[450px] p-8 shadow-2xl rounded-2xl">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <Calendar className="w-5 h-5 text-primary" />
                                </div>
                                Extend Your Subscription
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-5 mb-8">
                            <p className="text-sm text-gray-400 leading-relaxed">
                                You are extending your <strong className="text-white">{pendingExtensionPlan?.name}</strong> subscription.
                            </p>

                            <div className="bg-white/5 rounded-xl p-5 flex gap-4 border border-white/5">
                                <ShieldCheck className="w-6 h-6 text-green-500 shrink-0" />
                                <div className="text-sm text-gray-300">
                                    <span className="font-bold text-white block mb-1">Seamless Continuity</span>
                                    Your new plan will be queued to start automatically after your current one expires. <strong className="text-white">No days lost.</strong>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => setIsExtensionModalOpen(false)}
                                className="h-12 text-sm hover:bg-white/5 hover:text-white border border-white/10"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsExtensionModalOpen(false);
                                    if (pendingExtensionPlan) handlePayment(pendingExtensionPlan.id);
                                }}
                                className="bg-primary hover:bg-primary/90 text-white font-bold h-12 text-sm shadow-lg shadow-primary/20"
                            >
                                Confirm & Pay
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Footer Notice */}
                <div className="mt-16 text-center border-t border-white/5 pt-10">
                    <p className="text-xs text-gray-600 uppercase tracking-widest font-bold">
                        Secure Payments via Razorpay • Cancel Anytime • No Refund Policy
                    </p>
                </div>

            </main>
        </div>
    );
}
