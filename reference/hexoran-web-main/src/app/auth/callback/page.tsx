'use client'

import { useEffect, useState, Suspense } from 'react'
import { hexoranSupabase } from '@/lib/hexoran'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2, Mail, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

// 1. ISOLATE LOGIC: Move the main logic into a sub-component
function AuthCallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [email, setEmail] = useState<string | null>(null)
  const [deepLink, setDeepLink] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const [authType, setAuthType] = useState<string | null>(searchParams.get('type'))

  // Check hash for auth type (implicit flow support)
  useEffect(() => {
    if (!authType && typeof window !== 'undefined' && window.location.hash) {
      try {
        // Extract type from hash params (e.g. #access_token=...&type=recovery)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const typeFromHash = hashParams.get('type')
        if (typeFromHash) {
          setAuthType(typeFromHash)
        }
      } catch (e) {
        console.error('Error parsing hash:', e)
      }
    }
  }, [authType]) // Only run if authType is still potentially missing

  useEffect(() => {
    const handleSession = async () => {
      try {
        // Simple check for session
        const { data: { session }, error } = await hexoranSupabase.auth.getSession()

        if (error) throw error

        if (session) {
          handleSuccess(session)
        } else {
          // Listen for the initial session event
          const { data: { subscription } } = hexoranSupabase.auth.onAuthStateChange((event, session) => {
            if ((event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') && session) {
              handleSuccess(session)
            }
          })
          return () => subscription.unsubscribe()
        }
      } catch (err) {
        console.error('Verification failed:', err)
        setStatus('error')
      }
    }

    const handleSuccess = (session: any) => {
      setStatus('success')
      setEmail(session.user.email || null)

      // Use the current authType state
      let appLink = `celato://auth/callback#access_token=${session.access_token}&refresh_token=${session.refresh_token}`

      if (authType) {
        appLink += `&type=${authType}`
      }

      setDeepLink(appLink)

      // Attempt to open Desktop App
      // window.location.href = appLink; // user might prefer web for reset

      // Determine redirect destination
      let destination = '/dashboard'
      if (authType === 'recovery' || authType === 'invite') {
        destination = '/auth/update-password'
      }

      // Redirect
      setTimeout(() => {
        window.location.href = destination
      }, 1500)
    }

    handleSession()
  }, [authType])

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 relative overflow-hidden">

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-md w-full bg-[#18181b] border border-white/10 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-xl">

        {status === 'loading' && (
          <div className="flex flex-col items-center animate-pulse py-8">
            <div className="w-16 h-16 bg-white/5 rounded-full mb-6 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Verifying Identity...</h2>
            <p className="text-gray-400 text-sm">Securely exchanging tokens with Celato Cloud.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              {authType === 'recovery' ? 'Ready to Reset' : 'Email Verified'}
            </h1>

            {email && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6 max-w-full">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-sm font-mono text-gray-300 truncate max-w-[200px]">{email}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              </div>
            )}

            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              {authType === 'recovery'
                ? "We are redirecting you to set a new password..."
                : "Your account is active. Taking you back to the app..."}
            </p>

            <div className="space-y-3">
              {deepLink && (
                <Button
                  className="w-full bg-white text-black hover:bg-gray-200 font-bold"
                  onClick={() => window.location.href = deepLink}
                >
                  Open Celato App
                </Button>
              )}

              <Link href="/" className="inline-block text-xs text-gray-500 hover:text-gray-300 transition-colors pt-2">
                Stay on website
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="animate-in shake duration-300">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-red-400 mb-2">Link Expired</h1>
            <p className="text-gray-400 text-sm mb-6">
              This verification link is invalid or has already been used. Please try signing in again from the app.
            </p>
            <Link href="/" className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm text-white transition-colors border border-white/5">
              Go Home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}