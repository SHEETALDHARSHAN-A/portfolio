import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SheetalDharshan A | Portfolio",
  description: "Full-stack developer & AI Enthusiast crafting stunning digital experiences. View my work, hire me, or book a call.",
  openGraph: {
    title: "SheetalDharshan A | Portfolio",
    description: "Full-stack developer & AI Enthusiast crafting stunning digital experiences.",
    type: "website",
  },
};

import { ThemeProvider } from "@/components/theme-provider";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Ambient Background Pattern */}
          <div className="fixed inset-0 z-[-1] min-h-screen w-full bg-background overflow-hidden">
            <AnimatedGridPattern
              numSquares={30}
              maxOpacity={0.1}
              duration={3}
              repeatDelay={1}
              className={
                "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 fill-black/5 stroke-black/5 dark:fill-white/5 dark:stroke-white/5"
              }
            />
          </div>

          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
