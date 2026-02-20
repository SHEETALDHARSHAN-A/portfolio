"use client";
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Define props to accept both button and anchor attributes
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon?: React.ElementType;
  href?: string;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = 'primary', icon: Icon, href, asChild, children, ...props }, ref) => {

    const variants = {
      primary: "bg-primary text-white shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)] hover:shadow-[0_0_25px_-5px_rgba(124,58,237,0.7)] border border-primary/20",
      secondary: "bg-white text-black hover:bg-zinc-200",
      outline: "border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm",
      ghost: "text-text-muted hover:text-white hover:bg-white/5"
    };

    const commonClasses = cn(
      "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 active:scale-95 hover:scale-102",
      variants[variant],
      className
    );

    if (href) {
      return (
        <Link
          href={href}
          className={commonClasses}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
          {Icon && <Icon className="w-4 h-4" />}
        </Link>
      );
    }

    return (
      <button
        className={commonClasses}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...props}
      >
        {children}
        {Icon && <Icon className="w-4 h-4" />}
      </button>
    );
  }
);
Button.displayName = "Button";