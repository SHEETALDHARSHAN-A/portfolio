"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { hexoranSupabase } from '@/lib/hexoran';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';
import {
    X, Loader2, Mail, Lock, AlertCircle,
    CheckCircle2, Eye, EyeOff, KeyRound, AlertTriangle, Send
} from 'lucide-react';


interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (session: any) => void;
    triggerPlan: string | null;
}

type AuthMode = 'signin' | 'signup' | 'forgot_password' | 'update_password';

export function AuthModal({ isOpen, onClose, onSuccess, triggerPlan }: AuthModalProps) {
    const [mounted, setMounted] = useState(false);

    // Production redirect URL (always use hexoran.com for email flows)
    const PROD_AUTH_CALLBACK = 'https://www.hexoran.com/auth/callback'

    useEffect(() => {
        setMounted(true);
    }, []);

    // === STATE ===
    const [mode, setMode] = useState<AuthMode>('signin');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI State
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning', text: string } | null>(null);

    // Smart Auth
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [emailCheckComplete, setEmailCheckComplete] = useState(false);
    const emailCheckTimeout = useRef<NodeJS.Timeout | null>(null);

    // Validation
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmError, setConfirmError] = useState<string | null>(null);

    // Post-Action
    const [sent, setSent] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [resending, setResending] = useState(false);

    // === EFFECTS ===

    // Cooldown Timer
    useEffect(() => {
        if (resendTimer > 0) {
            const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [resendTimer]);

    // Smart Email Check Debounce
    useEffect(() => {
        setIsEmailVerified(false);
        setEmailCheckComplete(false);
        setEmailError(null);
        setMessage(null);

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

        if (emailCheckTimeout.current) clearTimeout(emailCheckTimeout.current);

        setIsCheckingEmail(true);
        emailCheckTimeout.current = setTimeout(async () => {
            await handleSmartEmailCheck();
        }, 800);

        return () => {
            if (emailCheckTimeout.current) clearTimeout(emailCheckTimeout.current);
        };
    }, [email]);

    // Password Match
    useEffect(() => {
        if (mode === 'signup' && confirmPassword) {
            setConfirmError(password !== confirmPassword ? "Passwords do not match" : null);
        }
    }, [password, confirmPassword, mode]);

    // === HANDLERS ===

    const handleSmartEmailCheck = async () => {
        try {
            // Attempt to check if email exists. 
            // NOTE: This RPC might not exist on all Supabase instances. 
            // Fallback: If error, just allow proceed.
            const { data: exists, error } = await hexoranSupabase.rpc('check_email_exists', { email_input: email });

            if (error) {
                // If RPC fails, disable smart switching and just verify email format
                console.warn("Smart Auth RPC failed, falling back to manual flow");
                setIsEmailVerified(true);
                setEmailCheckComplete(true);
                setIsCheckingEmail(false);
                return;
            }

            if (mode === 'signin' && !exists) {
                setMessage({ type: 'warning', text: "Account not found. Switching to Sign Up." });
                setMode('signup');
            } else if (mode === 'signup' && exists) {
                setMessage({ type: 'success', text: "Account found! Switching to Sign In." });
                setMode('signin');
            }

            setIsEmailVerified(true);
            setEmailCheckComplete(true);
        } catch (err) {
            console.error(err);
            setIsEmailVerified(true); // Allow to proceed on error
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
                if (data.session) onSuccess(data.session);
            }
            else if (mode === 'signup') {
                if (password !== confirmPassword) {
                    setConfirmError("Passwords do not match");
                    setLoading(false);
                    return;
                }
                const { error } = await hexoranSupabase.auth.signUp({
                    email, password,
                    options: {
                        emailRedirectTo: PROD_AUTH_CALLBACK,
                        data: { full_name: fullName }
                    }
                });
                if (error) throw error;
                console.log("Sign up successful, email sent");
                setSent(true);
            }
            else if (mode === 'forgot_password') {
                const { error } = await hexoranSupabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${PROD_AUTH_CALLBACK}?type=recovery`,
                });
                if (error) throw error;
                console.log("Recovery email sent");
                setSent(true);
            }
        } catch (err: any) {
            console.error("Auth Error:", err);
            setMessage({ type: 'error', text: err.message || "Authentication failed" });
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setResending(true);
        setMessage(null);
        try {
            const { error } = await hexoranSupabase.auth.resend({
                type: 'signup',
                email: email,
                options: { emailRedirectTo: PROD_AUTH_CALLBACK }
            });
            if (error) throw error;
            setMessage({ type: 'success', text: 'Verification email sent again!' });
            setResendTimer(60);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to resend' });
        } finally {
            setResending(false);
        }
    };

    const checkAuth = async () => {
        setCheckingAuth(true);
        try {
            // Refresh session to see if verified
            const { data } = await hexoranSupabase.auth.getSession();
            if (data.session) onSuccess(data.session);
            else setMessage({ type: 'warning', text: 'Not verified yet. Check your email.' });
        } finally {
            setCheckingAuth(false);
        }
    };

    // === RENDER ===

    if (!isOpen || !mounted) return null; // MOVED HERE

    if (sent) {
        return createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="w-full max-w-md bg-[#0F0F0F] border border-white/10 rounded-2xl p-8 text-center animate-in zoom-in-95 duration-200 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative group">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                        <Mail className="w-8 h-8 text-primary relative z-10" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Check your inbox</h2>
                    <p className="text-gray-400 text-sm mb-6">
                        We sent a verification link to <span className="text-white font-medium">{email}</span>
                    </p>

                    {message && message.type === 'success' && (
                        <div className="mb-4 p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                            {message.text}
                        </div>
                    )}

                    {message && message.type === 'error' && (
                        <div className="mb-4 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-3">
                        <Button onClick={checkAuth} disabled={checkingAuth} className="w-full bg-white text-black hover:bg-gray-200 font-bold h-12 rounded-xl">
                            {checkingAuth ? <Loader2 className="w-4 h-4 animate-spin" /> : "I have clicked the link"}
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={handleResend}
                            disabled={resendTimer > 0 || resending}
                            className="w-full h-10 text-gray-400 hover:text-white rounded-xl text-xs font-medium border border-transparent hover:border-white/5"
                        >
                            {resending ? (
                                <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Sending...</span>
                            ) : resendTimer > 0 ? (
                                <span className="flex items-center gap-2">Resend available in {resendTimer}s</span>
                            ) : (
                                <span className="flex items-center gap-2"><Send className="w-3 h-3" /> Resend Email</span>
                            )}
                        </Button>

                        <Button variant="ghost" onClick={() => setSent(false)} className="w-full text-gray-500 hover:text-white h-10">
                            Back
                        </Button>
                    </div>
                </div>
            </div>,
            document.body
        );
    }

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 py-6">
            <div
                className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto bg-[#0A0A0A] border border-white/5 rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200 group scrollbar-hide"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-50">
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50" />
                            <Logo className="w-12 h-12 relative z-10" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-2 tracking-tight text-white">
                        {mode === 'signin' ? 'Welcome' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {mode === 'signin' ? 'Enter your credentials to continue.' : 'Join Hexoran to get started.'}
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
                        {emailError && <p className="text-xs text-red-400 pl-1">{emailError}</p>}
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

                                        {/* Progress Bar */}
                                        <div className="flex gap-1 h-1">
                                            {[1, 2, 3, 4].map((step) => {
                                                let score = 0;
                                                if (password.length > 7) score++;
                                                if (/[A-Z]/.test(password)) score++;
                                                if (/[0-9]/.test(password)) score++;
                                                if (/[^A-Za-z0-9]/.test(password)) score++;

                                                let color = 'bg-white/10';
                                                if (score >= step) {
                                                    color = score < 2 ? 'bg-red-500' : score < 4 ? 'bg-yellow-500' : 'bg-green-500';
                                                }
                                                return <div key={step} className={`flex-1 rounded-full transition-all duration-300 ${color}`} />;
                                            })}
                                        </div>

                                        {/* Requirements List */}
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

                    {!isEmailVerified && !isCheckingEmail && email.length > 3 && (
                        <p className="text-center text-xs text-gray-500 animate-pulse">Verifying...</p>
                    )}
                </form>

                {mode === 'forgot_password' && (
                    <button onClick={() => setMode('signin')} className="w-full mt-4 text-sm text-gray-500 hover:text-white">
                        Back to Login
                    </button>
                )}

                <p className="text-center text-[10px] text-white/20 mt-6 font-medium tracking-wide uppercase">
                    Secured by Hexoran Cloud
                </p>
            </div>
        </div>,
        document.body
    );
}
