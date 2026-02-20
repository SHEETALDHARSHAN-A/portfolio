'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { hexoranSupabase } from '@/lib/hexoran'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import { Loader2, Lock, CheckCircle2, AlertCircle, Eye, EyeOff, KeyRound, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function UpdatePasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // UI States
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [confirmError, setConfirmError] = useState<string | null>(null)

    // Password matching effect
    useEffect(() => {
        if (confirmPassword) {
            setConfirmError(password !== confirmPassword ? "Passwords do not match" : null);
        }
    }, [password, confirmPassword]);

    // Validation Logic
    const validatePassword = (pwd: string) => {
        const hasUpper = /[A-Z]/.test(pwd);
        const hasNumber = /[0-9]/.test(pwd);
        const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
        return pwd.length >= 8 && hasUpper && hasNumber && hasSpecial;
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' })
            setLoading(false)
            return
        }

        if (!validatePassword(password)) {
            setMessage({ type: 'error', text: 'Password does not meet security requirements' })
            setLoading(false)
            return
        }

        try {
            const { error } = await hexoranSupabase.auth.updateUser({
                password: password
            })

            if (error) throw error

            // Refresh session to ensure everything is up to date
            await hexoranSupabase.auth.refreshSession() // Proactive refresh

            setMessage({ type: 'success', text: 'Password updated successfully! Redirecting...' })

            // Redirect to dashboard after short delay
            setTimeout(() => {
                router.push('/dashboard')
            }, 1500)

        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update password' })
        } finally {
            setLoading(false)
        }
    }

    // Calculate generic password score for meter
    const getPasswordScore = () => {
        let score = 0;
        if (password.length > 7) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }

    const score = getPasswordScore();

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 pt-32 relative overflow-hidden">

            {/* Background Effects (Matching SignIn) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

            {/* Main Card */}
            <div className="w-full max-w-[480px] bg-[#0A0A0A] border border-white/5 rounded-2xl shadow-2xl overflow-hidden p-8 animate-in zoom-in-95 duration-200 relative group z-10">

                {/* Top Gradient Strip */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50" />
                            <Logo className="w-12 h-12 relative z-10" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2 tracking-tight text-white">Set New Password</h1>
                    <p className="text-gray-400 text-sm">
                        Your identity has been verified. Secure your account now.
                    </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-6">

                    {/* New Password Field */}
                    <div className="space-y-1">
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                className="pl-12 pr-12 bg-black/20 border-white/10 text-white h-12 placeholder:text-gray-600 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
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

                    {/* Password Strength Meter */}
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Password Security</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${score < 2 ? 'text-red-400' : score < 4 ? 'text-yellow-400' : 'text-green-400'
                                }`}>
                                {!password ? 'REQUIRED' : score < 2 ? 'WEAK' : score < 4 ? 'MEDIUM' : 'STRONG'}
                            </span>
                        </div>
                        <div className="flex gap-1 h-1">
                            {[1, 2, 3, 4].map((step) => {
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

                    {/* Messages */}
                    {message && (
                        <div className={`p-4 rounded-xl text-sm flex gap-3 animate-in slide-in-from-top-2 ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                'bg-green-500/10 text-green-400 border border-green-500/20'
                            }`}>
                            {message.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                            <p>{message.text}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-12 bg-primary text-white hover:bg-primary/90 font-bold rounded-xl text-base shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || score < 4}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update Password'
                        )}
                    </Button>
                </form>

                <p className="text-center text-[10px] text-white/20 mt-6 font-medium tracking-wide uppercase">
                    Secured by Hexoran Cloud
                </p>

            </div>
        </div>
    )
}
