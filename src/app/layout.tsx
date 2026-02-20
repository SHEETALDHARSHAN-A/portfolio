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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable} ${mono.variable} dark`}>
      <body className="antialiased font-sans bg-background text-text-main">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
