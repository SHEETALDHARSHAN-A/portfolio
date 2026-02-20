"use client";
import React from 'react';
import { cn } from '@/lib/utils';

export const Logo = ({ className = "w-8 h-8", ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      {...props}
    >
      {/* Left Bracket */}
      <path
        d="M35 20 H15 L5 50 L15 80 H35"
        stroke="#7c3aed"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Bracket */}
      <path
        d="M65 20 H85 L95 50 L85 80 H65"
        stroke="#7c3aed"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Dash */}
      <path
        d="M25 50 H75"
        stroke="#06b6d4"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
};