import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AuthHashListener } from "@/components/auth/auth-hash-listener";


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
  metadataBase: new URL('https://www.hexoran.com'),
  title: "Hexoran | Intelligence, Structured",
  description: "Intelligence, Structured. Hexoran builds the invisible layer of AI tools for the modern developer. Zero latency, privacy-first, and designed to disappear.",
  alternates: {
    canonical: 'https://www.hexoran.com',
  },
  openGraph: {
    title: "Hexoran | Intelligence, Structured",
    description: "Intelligence, Structured. Hexoran builds the invisible layer of AI tools for the modern developer.",
    siteName: "Hexoran",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Hexoran - Intelligence, Structured',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hexoran | Intelligence, Structured",
    description: "Building the invisible intelligence behind the interface.",
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon.ico',
      },
    ],
  },
  manifest: '/manifest.json',
};



import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable} ${mono.variable} dark`}>
      <body className="antialiased font-sans bg-background text-text-main">
        <Navbar />
        <AuthHashListener />
        {children}
        <Toaster richColors position="bottom-right" theme="dark" />
        <Footer />
      </body>
    </html>
  );
}