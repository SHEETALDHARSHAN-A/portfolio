"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { hexoranSupabase } from '@/lib/hexoran';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
    User, Mail, Shield, Crown, Zap, Code2,
    Calendar, CreditCard, LogOut, Loader2,
    CheckCircle2, XCircle, LayoutGrid, Lock, ArrowRight, Sparkles
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';

// ... imports
import { format } from 'date-fns';
import Script from 'next/script';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';

// Define Plans (Matching Webhook & EnhancedSubscription Reference)
const PLANS = SUBSCRIPTION_PLANS;

// === TIER HIERARCHY (for vault-only purchase detection) ===
const TIER_PRIORITY: Record<string, number> = { 'free': 0, 'code': 1, 'live': 1, 'pro': 2 };
const isVaultOnlyPurchase = (currentTier: string, targetTier: string) =>
    TIER_PRIORITY[targetTier] < TIER_PRIORITY[currentTier];

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);

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

            // Fetch Profile
            const { data: profileData } = await hexoranSupabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            setProfile(profileData || {});

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

    const handleSignOut = async () => {
        await hexoranSupabase.auth.signOut();
        router.push('/');
    };

    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isSignOutOpen, setIsSignOutOpen] = useState(false);

    const handleUpdateProfile = async () => {
        if (!user || !profile) return;
        try {
            const { error } = await hexoranSupabase
                .from('profiles')
                .update({ full_name: profile.full_name })
                .eq('id', user.id);

            if (error) throw error;
            setIsEditProfileOpen(false);
            toast.success('Profile Updated Successfully');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-[#020202] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    // --- DERIVE PERMISSIONS (Aggregated) ---
    const subs = Array.isArray(subscription) ? subscription : (subscription ? [subscription] : []);

    // Check for ANY active subscription
    const activeSubs = subs.filter(s => s.status === 'active' || s.status === 'trialing');
    const isActive = activeSubs.length > 0;

    // Calculate aggregated features
    const hasCode = activeSubs.some(s => s.tier === 'code' || s.tier === 'pro');
    const hasLive = activeSubs.some(s => s.tier === 'live' || s.tier === 'pro');
    const hasPro = activeSubs.some(s => s.tier === 'pro');

    // Determine "Display Tier" (Highest available)
    let displayTier = 'free';
    if (hasPro) displayTier = 'pro';
    else if (hasCode && hasLive) displayTier = 'pro'; // Constructive Pro
    else if (hasCode) displayTier = 'code';
    else if (hasLive) displayTier = 'live';

    // Get latest expiry date from valid subs
    const latestSub = activeSubs.sort((a, b) => new Date(b.current_period_end).getTime() - new Date(a.current_period_end).getTime())[0];
    const expiryDate = latestSub?.current_period_end;
    const activePlanID = latestSub?.external_plan_id;
    const activeSubID = latestSub?.external_subscription_id;

    return (
        <div className="min-h-screen bg-[#020202] text-white selection:bg-primary/20 font-sans">
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="afterInteractive"
                onLoad={() => console.log('Razorpay SDK Loaded')}
            />
            <Navbar />

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full" />
            </div>

            <main className="max-w-7xl mx-auto px-4 py-20 md:px-6 relative z-10">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/5"
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">System Online</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-1">
                            Mission Control
                        </h1>
                        <p className="text-gray-400">Welcome back, <span className="text-white font-medium">{profile?.full_name || 'Commander'}</span>.</p>
                    </div>

                    <Dialog open={isSignOutOpen} onOpenChange={setIsSignOutOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="bg-white/5 border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all h-10"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0F0F0F] border border-white/10 text-white sm:max-w-[425px] rounded-2xl">
                            <DialogHeader>
                                <DialogTitle>Sign Out</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    Are you sure you want to end your session?
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-3 mt-4">
                                <Button variant="ghost" onClick={() => setIsSignOutOpen(false)} className="text-gray-400 hover:text-white hover:bg-white/5">
                                    Cancel
                                </Button>
                                <Button onClick={handleSignOut} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20">
                                    Confirm Sign Out
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* --- LEFT COLUMN: PROFILE CARD --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <Card className="bg-[#0F0F0F] border border-white/10 overflow-hidden relative group h-full">
                            {/* Premium gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent opacity-50" />

                            <div className="p-6 relative z-10">
                                {/* Avatar & ID */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 overflow-hidden relative shadow-xl">
                                            {user?.user_metadata?.avatar_url ? (
                                                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User className="w-9 h-9 text-white/40" />
                                                </div>
                                            )}
                                        </div>
                                        {/* Status indicator */}
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0F0F0F] flex items-center justify-center border-2 border-white/10">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-1">Hexoran ID</div>
                                        <div className="font-mono text-xs text-white/80 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                                            {user?.id?.substring(0, 8) || 'Unknown'}
                                        </div>
                                    </div>
                                </div>

                                {/* Name & Email */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white mb-1">{profile?.full_name || 'Anonymous User'}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <Mail className="w-3 h-3" />
                                        {user?.email}
                                    </p>
                                </div>

                                {/* Subscription Card */}
                                <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 p-4 rounded-2xl mb-4 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">Current Plan</span>
                                        <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                                            {isActive ? 'ACTIVE' : 'FREE'}
                                        </span>
                                    </div>
                                    <div className="text-2xl font-black text-white mb-1 tracking-tight">
                                        {displayTier === 'pro' ? 'Celato PRO' : displayTier === 'code' ? 'Celato CODE' : displayTier === 'live' ? 'Celato LIVE' : 'Celato FREE'}
                                    </div>

                                    {isActive && expiryDate && (
                                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>Renews: <span className="text-white font-medium">{format(new Date(expiryDate), 'PP')}</span></span>
                                        </div>
                                    )}
                                </div>

                                {/* Vault Display */}
                                {isActive && (
                                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 p-4 rounded-2xl mb-4 backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)] animate-pulse" />
                                                <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Vault</h3>
                                            </div>
                                            <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-500 font-mono">
                                                🔒 SAFE
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {(['live', 'code'] as const).map((tierKey) => {
                                                const days = subscription?.banked_plans?.[tierKey] || 0;
                                                const hasActiveDays = days > 0;

                                                const tierStyles = {
                                                    live: { active: 'text-purple-400 border-purple-500/30 bg-purple-500/10', inactive: 'text-gray-600 border-gray-700/30 bg-gray-800/20' },
                                                    code: { active: 'text-blue-400 border-blue-500/30 bg-blue-500/10', inactive: 'text-gray-600 border-gray-700/30 bg-gray-800/20' }
                                                };

                                                const style = hasActiveDays ? tierStyles[tierKey].active : tierStyles[tierKey].inactive;

                                                return (
                                                    <div key={tierKey} className={`flex items-center justify-between bg-black/30 p-2.5 rounded-xl border ${hasActiveDays ? 'border-white/10' : 'border-white/5'}`}>
                                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${style}`}>
                                                            {tierKey}
                                                        </span>
                                                        <span className={`text-sm font-mono ${hasActiveDays ? 'text-white font-bold' : 'text-gray-600'}`}>
                                                            +{days} <span className="text-xs text-gray-500">days</span>
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <p className="text-[9px] text-gray-500 mt-3 text-center leading-relaxed">
                                            {Object.values(subscription?.banked_plans || {}).some((d: any) => d > 0)
                                                ? "Highest tier auto-resumes when current plan ends."
                                                : "Purchase lower tiers to bank days here."}
                                        </p>
                                    </div>
                                )}

                                {/* Feature Pills */}
                                <div className="grid grid-cols-3 gap-2 mb-5">
                                    {/* CODE */}
                                    <div className={`p-3 rounded-xl border text-center transition-all ${hasCode ? 'bg-blue-500/10 border-blue-500/30 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-white/5 opacity-40'}`}>
                                        <Code2 className={`w-5 h-5 mx-auto mb-1.5 ${hasCode ? 'text-blue-400' : 'text-gray-600'}`} />
                                        <div className={`text-[9px] font-black uppercase ${hasCode ? 'text-blue-300' : 'text-gray-600'}`}>Code</div>
                                    </div>
                                    {/* LIVE */}
                                    <div className={`p-3 rounded-xl border text-center transition-all ${hasLive ? 'bg-purple-500/10 border-purple-500/30 shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]' : 'bg-white/5 border-white/5 opacity-40'}`}>
                                        <Zap className={`w-5 h-5 mx-auto mb-1.5 ${hasLive ? 'text-purple-400' : 'text-gray-600'}`} />
                                        <div className={`text-[9px] font-black uppercase ${hasLive ? 'text-purple-300' : 'text-gray-600'}`}>Live</div>
                                    </div>
                                    {/* PRO */}
                                    <div className={`p-3 rounded-xl border text-center transition-all ${hasPro ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]' : 'bg-white/5 border-white/5 opacity-40'}`}>
                                        <Crown className={`w-5 h-5 mx-auto mb-1.5 ${hasPro ? 'text-amber-400' : 'text-gray-600'}`} />
                                        <div className={`text-[9px] font-black uppercase ${hasPro ? 'text-amber-300' : 'text-gray-600'}`}>Pro</div>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setIsEditProfileOpen(true)}
                                    className="w-full bg-white/10 hover:bg-white/20 text-white font-bold h-11 border border-white/10 rounded-xl transition-all hover:scale-[1.02]"
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </div>
                        </Card>
                    </motion.div>


                    {/* --- RIGHT COLUMN: APPS & MODULES --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5"
                    >
                        {/* CELATO APP MODULE */}
                        <Card className="col-span-1 md:col-span-2 bg-[#0F0F0F] border border-white/10 overflow-hidden relative group hover:border-blue-500/30 transition-all duration-500 shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 opacity-30">
                                <Sparkles className="w-6 h-6 text-blue-400" />
                            </div>

                            <div className="grid md:grid-cols-2 h-full">
                                <div className="p-8 flex flex-col justify-between relative z-10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_30px_-10px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-transform duration-500">
                                                <Code2 className="w-7 h-7 text-blue-400" />
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-2">Celato</h3>

                                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                            {displayTier === 'code' && "Advanced coding assistance and generation unlocked."}
                                            {displayTier === 'live' && "Real-time interview intelligence unlocked."}
                                            {displayTier === 'pro' && "Full suite access: Code + Live Intelligence."}
                                            {displayTier === 'free' && "Basic access. Upgrade to unlock AI superpowers."}
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center gap-3">
                                        <Button
                                            onClick={() => {
                                                window.location.href = 'celato://resume';
                                                setTimeout(() => router.push('/celato/downloading'), 5000);
                                            }}
                                            className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
                                        >
                                            Launch App
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full sm:flex-1 border-white/10 hover:bg-white/10 text-gray-300 hover:text-white hover:border-white/20 h-11 font-medium"
                                            onClick={() => router.push('/dashboard/subscription')}
                                        >
                                            {isActive ? 'Manage Plan' : 'Upgrade to Pro'}
                                        </Button>
                                    </div>
                                </div>

                                {/* DIGITAL CARD RENDER */}
                                <div className="relative h-64 md:h-auto bg-[#050505] border-t md:border-t-0 md:border-l border-white/5 flex items-center justify-center overflow-hidden p-6">
                                    {/* Background Grid */}
                                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

                                    <div className={`
                                        relative w-full max-w-[280px] aspect-[1.58/1] rounded-2xl p-5 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl
                                        ${displayTier === 'pro' ? 'bg-gradient-to-br from-[#2a1a05] to-black border-2 border-amber-500/50 shadow-[0_0_50px_-10px_rgba(245,158,11,0.5)]' :
                                            displayTier === 'live' ? 'bg-gradient-to-br from-[#1a0b2e] to-black border-2 border-purple-500/50 shadow-[0_0_50px_-10px_rgba(168,85,247,0.5)]' :
                                                displayTier === 'code' ? 'bg-gradient-to-br from-[#0b1a2e] to-black border-2 border-blue-500/50 shadow-[0_0_50px_-10px_rgba(59,130,246,0.5)]' :
                                                    'bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-white/10 shadow-[0_0_20px_-5px_rgba(255,255,255,0.05)] grayscale'}
                                    `}>
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-50" />

                                        {/* Pro Badge */}
                                        {displayTier === 'pro' && (
                                            <div className="absolute top-0 right-0 p-3">
                                                <div className="bg-gradient-to-r from-amber-400 to-yellow-200 text-black text-[8px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-widest">
                                                    Elite
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center 
                                                ${displayTier === 'pro' ? 'bg-amber-500/20 text-amber-400' :
                                                        displayTier === 'live' ? 'bg-purple-500/20 text-purple-400' :
                                                            displayTier === 'code' ? 'bg-blue-500/20 text-blue-400' :
                                                                'bg-white/10 text-gray-400'}
                                            `}>
                                                    {displayTier === 'pro' ? <Crown className="w-4 h-4" /> :
                                                        displayTier === 'live' ? <Zap className="w-4 h-4" /> :
                                                            <Code2 className="w-4 h-4" />}
                                                </div>
                                                <span className={`text-[10px] font-mono tracking-widest uppercase font-bold
                                                ${displayTier === 'pro' ? 'text-amber-100' :
                                                        displayTier === 'live' ? 'text-purple-100' :
                                                            displayTier === 'code' ? 'text-blue-100' :
                                                                'text-gray-500'}
                                            `}>Hexoran</span>
                                            </div>
                                        </div>

                                        <div className="relative z-10 text-center py-2">
                                            <div className={`text-[10px] uppercase tracking-[0.2em] mb-1 font-bold
                                            ${displayTier === 'pro' ? 'text-amber-400' :
                                                    displayTier === 'live' ? 'text-purple-400' :
                                                        displayTier === 'code' ? 'text-blue-400' :
                                                            'text-gray-600'}
                                        `}>Access Tier</div>
                                            <div className={`text-2xl font-black tracking-tighter uppercase 
                                            ${displayTier === 'pro' ? 'text-white drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]' :
                                                    displayTier === 'live' ? 'text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]' :
                                                        displayTier === 'code' ? 'text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]' :
                                                            'text-gray-300'}
                                        `}>
                                                {displayTier === 'free' ? 'SCOUT' : displayTier.toUpperCase()}
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex justify-between items-center">
                                            <div className="text-[10px] text-white/50 font-mono">
                                                {activeSubID ? `SUB-${activeSubID.slice(-4)}` : 'NO-SUB'}
                                            </div>
                                            <div className="text-[10px] text-white/50 font-mono">
                                                EXP: {expiryDate ? format(new Date(expiryDate), 'MM/yy') : '--/--'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* SECURITY MODULE */}
                        <Card className="bg-[#0F0F0F] border border-white/10 p-6 hover:border-emerald-500/20 transition-all group">
                            <div className="flex items-center gap-2 mb-5">
                                <Shield className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm font-bold text-white uppercase tracking-wider">Security</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <div className="text-sm text-white font-medium">Password</div>
                                    </div>
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-full font-bold">
                                        Strong
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 opacity-50 cursor-not-allowed">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-500">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <div className="text-sm text-gray-400 font-medium">2FA Protection</div>
                                    </div>
                                    <span className="text-[10px] bg-white/5 text-gray-500 border border-white/5 px-2 py-1 rounded-full font-mono">
                                        Soon
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* STOOK APP MODULE */}
                        <Card className="bg-[#0F0F0F] border border-white/10 p-6 relative group opacity-70 hover:opacity-100 transition-all hover:border-amber-500/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                            <div className="flex justify-between items-start mb-5 relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                    <Crown className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] bg-white/5 border border-white/5 text-gray-500 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Waitlist</span>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">Stook Terminal</h3>
                                <p className="text-sm text-gray-500 mb-5 leading-relaxed">Institutional grade crypto & equity analytics. Real-time visualizations.</p>
                                <Button disabled className="w-full bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed h-10 font-medium">
                                    Access Denied
                                </Button>
                            </div>
                        </Card>

                    </motion.div>
                </div>

                {/* --- MODALS --- */}

                {/* EDIT PROFILE MODAL */}
                <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                    <DialogContent className="bg-[#0F0F0F] border border-white/10 text-white sm:max-w-[500px] p-8 shadow-2xl rounded-2xl">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-white/5 border border-white/10"><User className="w-5 h-5" /></div>
                                Edit Profile
                            </DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Update your personal command center details.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-2">
                            <div className="grid gap-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-300">
                                    Display Name
                                </label>
                                <Input
                                    id="name"
                                    defaultValue={profile?.full_name}
                                    className="h-12 bg-black/40 border-white/10 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-lg rounded-xl"
                                    placeholder="Enter your name"
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <Button variant="ghost" onClick={() => setIsEditProfileOpen(false)} className="text-gray-400 hover:text-white hover:bg-white/5">
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateProfile} className="bg-white text-black hover:bg-gray-200 font-bold px-8">
                                Save Changes
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>



            </main >
        </div >
    );
}
