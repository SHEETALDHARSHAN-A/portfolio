"use client";

import Link from "next/link";

export function LegalFooter() {
    return (
        <footer className="border-t border-white/5 bg-background py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <p className="text-text-muted text-sm">
                        © {new Date().getFullYear()} Hexoran Technologies. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-xs text-text-muted/60">
                        <Link href="/legal/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="/legal/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/legal/safety" className="hover:text-primary transition-colors">Safety & Ethics</Link>
                    </div>
                </div>

                <div className="max-w-md text-center md:text-right">
                    <p className="text-[10px] text-text-muted/40 leading-tight">
                        Celato is a productivity and mentorship tool. Users are responsible for adhering to the academic integrity policies of their institutions or employers. Hexoran Technologies disclaims liability for misuse of this software for cheating or academic dishonesty.
                    </p>
                </div>
            </div>
        </footer>
    );
}
