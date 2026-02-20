"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { hexoranSupabase } from '@/lib/hexoran';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';
import {
    Loader2, Mail, Lock, AlertCircle,
    CheckCircle2, Eye, EyeOff, KeyRound, AlertTriangle
} from 'lucide-react';
// // import { WindowControls } from '@/components/shared/WindowControls'; // Optional if used in web

interface AuthPageFormProps {
    initialMode: 'signin' | 'signup';
}

export function AuthPageForm({ initialMode }: AuthPageFormProps) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Production redirect URL to ensure emails point to hexoran.com
    const PROD_AUTH_CALLBACK = 'https://www.hexoran.com/auth/callback'

    useEffect(() => {
        setMounted(true);
    }, []);

    // === STATE ===
    const [mode, setMode] = useState<'signin' | 'signup' | 'forgot_password'>(initialMode);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning', text: string } | null>(null);

    // Smart Auth
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [emailCheckComplete, setEmailCheckComplete] = useState(false);
    const emailCheckTimeout = useRef<NodeJS.Timeout | null>(null);

    // Errors
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmError, setConfirmError] = useState<string | null>(null);

    // Post-Action
    const [sent, setSent] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    // Sync mode if prop changes (though usually distinct pages)
    useEffect(() => {
        if (initialMode) setMode(initialMode);
    }, [initialMode]);

    // Cooldown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(t => t - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Smart Email Check
    useEffect(() => {
        setIsEmailVerified(false);
        setEmailCheckComplete(false);
        setEmailError(null);
        setMessage(null);

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
        if (emailCheckTimeout.current) clearTimeout(emailCheckTimeout.current);

        setIsCheckingEmail(true);
        emailCheckTimeout.current = setTimeout(() => handleSmartEmailCheck(), 800);

        return () => { if (emailCheckTimeout.current) clearTimeout(emailCheckTimeout.current); };
    }, [email]);

    // Password Match
    useEffect(() => {
        if (mode === 'signup' && confirmPassword) {
            setConfirmError(password !== confirmPassword ? "Passwords do not match" : null);
        }
    }, [password, confirmPassword, mode]);

    const handleSmartEmailCheck = async () => {
        try {
            const { data: exists, error } = await hexoranSupabase.rpc('check_email_exists', { email_input: email });
            if (error) {
                console.warn("Smart Auth RPC failed, fallback manual");
                setIsEmailVerified(true);
                setEmailCheckComplete(true);
                setIsCheckingEmail(false);
                return;
            }

            if (mode === 'signin' && !exists) {
                // Silently switch to signup
                setMode('signup');
            } else if (mode === 'signup' && exists) {
                setMessage({ type: 'success', text: "Account found! Switching to Sign In." });
                setMode('signin');
            }

            setIsEmailVerified(true);
            setEmailCheckComplete(true);
        } catch (err) {
            setIsEmailVerified(true);
        } finally {
            setIsCheckingEmail(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (mode === 'signin') {
                const { data, error } = await hexoranSupabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                if (data.session) {
                    router.push('/dashboard');
                }
            }
            else if (mode === 'signup') {
                // Strict Validation
                const hasUpper = /[A-Z]/.test(password);
                const hasNumber = /[0-9]/.test(password);
                const hasSpecial = /[^A-Za-z0-9]/.test(password);
                if (password.length < 8 || !hasUpper || !hasNumber || !hasSpecial) {
                    throw new Error("Password must match security usage regulations.");
                }
                if (password !== confirmPassword) throw new Error("Passwords do not match.");

                const { error } = await hexoranSupabase.auth.signUp({
                    email, password,
                    options: {
                        emailRedirectTo: PROD_AUTH_CALLBACK,
                        data: { full_name: fullName }
                    }
                });
                if (error) throw error;
                setSent(true);
            }
            else if (mode === 'forgot_password') {
                const { error } = await hexoranSupabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${PROD_AUTH_CALLBACK}?type=recovery`,
                });
                if (error) throw error;
                setSent(true);
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "Authentication failed" });
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    if (sent) {
        return (
            <div className="w-full max-w-[480px] bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 text-center animate-in zoom-in-95 duration-200 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative group">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <Mail className="w-8 h-8 text-primary relative z-10" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Check your inbox</h2>
                <p className="text-gray-400 text-sm mb-6">
                    A link has been sent to <span className="text-white font-medium">{email}</span>
                </p>
                <div className="space-y-3">
                    <Button className="w-full bg-white text-black hover:bg-gray-200 font-bold h-12 rounded-xl" onClick={() => window.open('https://gmail.com', '_blank')}>
                        Open Email Client
                    </Button>
                    <Button variant="ghost" onClick={() => setSent(false)} className="w-full text-gray-500 hover:text-white">
                        Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[480px] bg-[#0A0A0A] border border-white/5 rounded-2xl shadow-2xl overflow-hidden p-8 animate-in zoom-in-95 duration-200 relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

            <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50" />
                        <Logo className="w-12 h-12 relative z-10" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold mb-2 tracking-tight text-white">
                    {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
                </h2>
                <p className="text-gray-400 text-sm">
                    {mode === 'signin' ? 'Enter credentials to access dashboard.' : 'Join Hexoran ecosystem today.'}
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
                {mode === 'signup' && (
                    <div className="space-y-1 animate-in slide-in-from-top-1">
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </div>
                            <Input
                                type="text"
                                placeholder="Full Name"
                                className="pl-12 pr-10 bg-black/20 border-white/10 text-white h-12 placeholder:text-gray-600 focus:ring-primary/20 transition-all focus:border-primary/50"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                    </div>
                )}
                <div className="space-y-1">
                    <div className="relative group">
                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${emailError ? 'text-red-400' : 'text-gray-500 group-focus-within:text-primary'}`} />
                        <Input
                            type="email"
                            placeholder="name@company.com"
                            className={`pl-12 pr-10 bg-black/20 border-white/10 text-white h-12 placeholder:text-gray-600 focus:ring-primary/20 transition-all ${emailError ? 'border-red-500/50' : 'focus:border-primary/50'}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {isCheckingEmail ? <Loader2 className="w-4 h-4 text-primary animate-spin" /> :
                                emailCheckComplete && <CheckCircle2 className="w-4 h-4 text-green-500 animate-in fade-in" />}
                        </div>
                    </div>
                </div>

                {(isEmailVerified || mode === 'forgot_password') && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
                        {mode !== 'forgot_password' && (
                            <div className="space-y-1">
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        className="pl-12 pr-12 bg-black/20 border-white/10 text-white h-12 placeholder:text-gray-600 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {mode === 'signin' && (
                                    <div className="flex justify-end">
                                        <button type="button" onClick={() => setMode('forgot_password')} className="text-xs text-gray-500 hover:text-primary transition-colors font-medium">
                                            Forgot password?
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {mode === 'signup' && (
                            <div className="space-y-4 animate-in slide-in-from-top-1">
                                <div className="space-y-1">
                                    <div className="relative group">
                                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm Password"
                                            className={`pl-12 pr-12 bg-black/20 border-white/10 text-white h-12 placeholder:text-gray-600 focus:ring-primary/20 transition-all ${!confirmError && confirmPassword ? 'border-green-500/50 focus:border-green-500/50' : 'focus:border-primary/50'}`}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {confirmPassword && (
                                        <p className={`text-[10px] pl-1 ${confirmError ? 'text-red-400' : 'text-green-400'}`}>
                                            {confirmError ? "Passwords do not match" : "Passwords match"}
                                        </p>
                                    )}
                                </div>

                                {/* Industry Standard Password Strength */}
                                <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Password Security</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${(() => {
                                            let score = 0;
                                            if (password.length > 7) score++;
                                            if (/[A-Z]/.test(password)) score++;
                                            if (/[0-9]/.test(password)) score++;
                                            if (/[^A-Za-z0-9]/.test(password)) score++;
                                            return score < 2 ? 'text-red-400' : score < 4 ? 'text-yellow-400' : 'text-green-400';
                                        })()
                                            }`}>
                                            {(() => {
                                                if (!password) return 'REQUIRED';
                                                let score = 0;
                                                if (password.length > 7) score++;
                                                if (/[A-Z]/.test(password)) score++;
                                                if (/[0-9]/.test(password)) score++;
                                                if (/[^A-Za-z0-9]/.test(password)) score++;
                                                return score < 2 ? 'WEAK' : score < 4 ? 'MEDIUM' : 'STRONG';
                                            })()}
                                        </span>
                                    </div>
                                    <div className="flex gap-1 h-1">
                                        {[1, 2, 3, 4].map((step) => {
                                            let score = 0;
                                            if (password.length > 7) score++;
                                            if (/[A-Z]/.test(password)) score++;
                                            if (/[0-9]/.test(password)) score++;
                                            if (/[^A-Za-z0-9]/.test(password)) score++;
                                            let color = 'bg-white/10';
                                            if (score >= step) color = score < 2 ? 'bg-red-500' : score < 4 ? 'bg-yellow-500' : 'bg-green-500';
                                            return <div key={step} className={`flex-1 rounded-full transition-all duration-300 ${color}`} />;
                                        })}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500">
                                        <div className={`flex items-center gap-1.5 ${password.length > 7 ? 'text-gray-300' : ''}`}>
                                            <div className={`w-1 h-1 rounded-full ${password.length > 7 ? 'bg-green-500' : 'bg-gray-600'}`} /> 8+ Characters
                                        </div>
                                        <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(password) ? 'text-gray-300' : ''}`}>
                                            <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-600'}`} /> Uppercase
                                        </div>
                                        <div className={`flex items-center gap-1.5 ${/[0-9]/.test(password) ? 'text-gray-300' : ''}`}>
                                            <div className={`w-1 h-1 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-600'}`} /> Number
                                        </div>
                                        <div className={`flex items-center gap-1.5 ${/[^A-Za-z0-9]/.test(password) ? 'text-gray-300' : ''}`}>
                                            <div className={`w-1 h-1 rounded-full ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-600'}`} /> Special Char
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {message && (
                    <div className={`p-4 rounded-xl text-sm flex gap-3 animate-in slide-in-from-top-2 ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {message.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
                        {message.type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0" />}
                        <p>{message.text}</p>
                    </div>
                )}

                {(isEmailVerified || mode === 'forgot_password') && (
                    <Button
                        type="submit"
                        disabled={loading || (mode === 'signup' && (!!confirmError || !password || password.length < 8))}
                        className="w-full h-12 bg-primary text-white hover:bg-primary/90 font-bold rounded-xl text-base shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)] transition-all animate-in fade-in slide-in-from-bottom-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> :
                            mode === 'signin' ? 'Sign In' :
                                mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                    </Button>
                )}

                <div className="flex items-center justify-center gap-2 mt-6">
                    <span className="text-gray-500 text-sm">
                        {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                    </span>
                    <Link
                        href={mode === 'signin' ? '/auth/signup' : '/auth/signin'}
                        className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                    >
                        {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                    </Link>
                </div>
            </form>
            <p className="text-center text-[10px] text-white/20 mt-6 font-medium tracking-wide uppercase">
                Secured by Hexoran Cloud
            </p>
        </div>
    );
}
