import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-background pt-12 md:pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">

        {/* Brand Section: Spans full width on mobile for better readability */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Logo className="w-6 h-6 text-text-muted" />
            <span className="font-bold text-white text-xl font-mono">Hexoran_</span>
          </div>
          <p className="text-sm text-text-muted leading-relaxed max-w-sm">
            Intelligence, Structured. <br />
            Building the future of developer tools.
          </p>
        </div>

        {/* Product Links */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4">Products</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li><Link href="/celato" className="hover:text-primary transition-colors">Celato AI</Link></li>
            <li><Link href="/stook" className="hover:text-primary transition-colors">Stook</Link></li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
            <li><Link href="/legal/terms" className="hover:text-primary transition-colors">Legal</Link></li>
          </ul>
        </div>

        {/* Connect Links */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4">Connect</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li><Link href="#" className="hover:text-primary transition-colors">Twitter</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">GitHub</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Discord</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Stacked and centered on mobile, row on desktop */}
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4 md:gap-0">
        <p className="text-center md:text-left">&copy; 2025 Hexoran. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/legal/safety" className="hover:text-white transition-colors">Safety</Link>
        </div>
      </div>
    </footer>
  );
};