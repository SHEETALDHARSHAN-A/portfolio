import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata: Metadata = {
    title: "Phantom Companion | Hexoran",
    description: "Real-time intelligence delivery portal for Celato Phantom Mode",
    robots: "noindex, nofollow", // Keep companion portal private
};

export default function CompanionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
