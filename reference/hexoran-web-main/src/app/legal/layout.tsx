export default function LegalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#050510] text-gray-300 font-sans selection:bg-purple-500/30">
            <div className="max-w-4xl mx-auto px-6 py-20 md:py-32">
                <nav className="mb-12 flex gap-6 text-sm overflow-x-auto pb-2 border-b border-white/10">
                    <a href="/celato" className="text-white hover:text-purple-400 decoration-none font-bold">← Back to Celato</a>
                    <a href="/legal/terms" className="hover:text-white transition-colors">Terms</a>
                    <a href="/legal/privacy" className="hover:text-white transition-colors">Privacy</a>
                    <a href="/legal/eula" className="hover:text-white transition-colors">EULA</a>
                    <a href="/legal/acceptable-use" className="hover:text-white transition-colors">Acceptable Use</a>
                </nav>
                <div className="prose prose-invert prose-headings:text-white prose-a:text-purple-400 hover:prose-a:text-purple-300 max-w-none">
                    {children}
                </div>
            </div>
        </div>
    )
}
