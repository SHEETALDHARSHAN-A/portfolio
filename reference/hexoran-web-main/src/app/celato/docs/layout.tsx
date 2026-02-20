import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Documentation | Celato AI",
    description: "Complete guide to using Celato AI - keyboard shortcuts, Code Mode, Live Mode, Phantom Mode setup, and troubleshooting.",
};

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Hide global navbar and footer - docs has its own header */}
            <style>{`
                body > nav, 
                body > footer,
                nav[class*="fixed"],
                footer[class*="border-t"] { 
                    display: none !important; 
                }
            `}</style>
            {children}
        </>
    );
}
