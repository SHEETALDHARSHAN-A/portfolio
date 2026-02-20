import type { Metadata } from "next";

export const metadata: Metadata = {
    // UPDATED: Starts with "Celato AI" for maximum search visibility
    title: "Celato AI | The Interview Copilot & Assistant",
    description: "Dominate your technical interviews with Celato AI. Real-time coding analysis, live audio transcription, and intelligent answers for LeetCode, System Design, and Behavioral rounds.",
    keywords: ["Celato AI", "interview copilot", "ai coding assistant", "live interview helper", "celato download", "interview cheat sheet", "coding interview tool", "job interview ai"],
    openGraph: {
        title: "Celato AI | The Interview Copilot",
        description: "The invisible edge for your next technical interview. Download Celato AI for Windows, Mac, and Linux.",
        url: 'https://www.hexoran.com/celato',
        siteName: 'Hexoran',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Celato AI | The Interview Copilot",
        description: "The invisible edge for your next technical interview.",
    },
};

export default function CelatoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}