'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Listens for Supabase Auth hash fragments (access_token, etc.) on global routes
 * and redirects them to the dedicated auth callback page.
 * 
 * This is necessary because Supabase "Site URL" might handle the redirect to root '/'
 * instead of '/auth/callback' directly.
 */
export function AuthHashListener() {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Ensure we are in the browser
        if (typeof window === 'undefined') return

        const hash = window.location.hash

        // Check if hash contains Supabase auth parameters
        // access_token is the primary indicator of an implicit flow redirect
        if (hash && hash.includes('access_token=')) {

            // If we are NOT already on the callback page, redirect there
            if (pathname !== '/auth/callback') {
                console.log('[AuthHashListener] Detected auth hash on non-callback route. Redirecting to /auth/callback...')

                // We use router.push to navigate to the callback page
                // IMPORTANT: We must append the hash so the callback page can process it
                router.push(`/auth/callback${hash}`)
            }
        }
    }, [pathname, router])

    return null
}
