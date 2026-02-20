"use client";

import { cn } from "@/lib/utils";

const GradientButton = ({
  children,
  className,
  href,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}) => {
  const buttonClasses = cn(
    "relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm text-white",
    "bg-gradient-to-r from-blue-500 via-purple-500 to-violet-600",
    "hover:from-blue-400 hover:via-purple-400 hover:to-violet-500",
    "transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)]",
    "hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-105",
    className
  );

  if (href) {
    return (
      <a href={href} className={buttonClasses}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={buttonClasses}>
      {children}
    </button>
  );
};

export default GradientButton;
