
export default function EULAPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold mb-2">End User License Agreement (EULA)</h1>
                <p className="text-sm text-gray-500">Version 2.0 | Effective Date: December 26, 2025 | Last Updated: December 26, 2025</p>
            </div>

            <div className="p-6 border-2 border-red-500/50 bg-red-500/10 rounded-xl">
                <h3 className="text-xl font-bold text-red-500 mb-2">⚠️ CRITICAL NOTICE: EDUCATIONAL PURPOSE ONLY</h3>
                <p className="font-bold">
                    THIS SOFTWARE IS DESIGNED EXCLUSIVELY FOR EDUCATIONAL PURPOSES, LEARNING, AND SKILL DEVELOPMENT. IT IS NOT INTENDED FOR CHEATING, ACADEMIC DISHONESTY, OR INTERVIEW FRAUD. ANY MISUSE IS SOLELY YOUR RESPONSIBILITY. HEXORAN BEARS ZERO LIABILITY.
                </p>
            </div>

            <div className="p-4 border border-white/20 bg-white/5 rounded-lg">
                <p className="font-bold">THIS IS A LEGAL AGREEMENT BETWEEN YOU AND HEXORAN.</p>
                <p className="mt-2 text-sm">BY INSTALLING, CREATING AN ACCOUNT, OR USING THE SOFTWARE, YOU AGREE TO BE BOUND BY THIS EULA.</p>
            </div>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">1. Grant of License</h2>
                <p>Hexoran grants you a personal, non-exclusive, non-transferable license to install and use Celato for personal, non-commercial use (unless an enterprise license is purchased).</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">2. Data Collection</h2>
                <p>We collect the following to provide our services:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Email address, name, phone number, profile photo (account data)</li>
                    <li>Subscription status and payment transaction IDs</li>
                </ul>
                <p className="mt-4 font-bold text-green-400">We DO NOT collect: Screenshots, AI responses, API keys, or usage patterns.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">3. Subscription & No Refunds</h2>
                <div className="p-4 border-l-4 border-red-500 bg-red-500/10">
                    <p className="font-bold text-red-400 mb-2">ALL PAYMENTS ARE FINAL AND NON-REFUNDABLE.</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Subscriptions auto-renew. Cancel BEFORE renewal to avoid charges.</li>
                        <li>No refunds for any reason: dissatisfaction, partial use, forgetting to cancel.</li>
                        <li>Fraudulent chargebacks will result in permanent ban and legal action.</li>
                    </ul>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">4. Restrictions</h2>
                <p>You may NOT:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Reverse engineer, decompile, or disassemble the Software</li>
                    <li>Rent, lease, or lend the Software</li>
                    <li>Use the Software for any illegal purpose</li>
                    <li>Share your API keys or allow unauthorized access</li>
                    <li>Circumvent security features or restrictions</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">5. Voluntary Assumption of Risk</h2>
                <div className="p-6 bg-red-950/20 border border-red-500/20 rounded-xl">
                    <p className="font-bold text-red-400 mb-4">100% YOUR RESPONSIBILITY</p>
                    <p className="mb-4">IF YOU ARE BANNED, FIRED, EXPELLED, SUED, OR BLACKLISTED:</p>
                    <p className="text-xl font-bold text-red-400 mb-4">IT IS 100% YOUR FAULT.</p>
                    <p>HEXORAN HAS ZERO LIABILITY. We have no obligation to help recover accounts, jobs, reputation, or losses.</p>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">6. No Warranties &quot;AS IS&quot;</h2>
                <p className="uppercase text-sm">THE SOFTWARE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ANY LIABILITY FOR ACADEMIC OR PROFESSIONAL REPERCUSSIONS RESULTING FROM YOUR USE.</p>
                <p className="mt-4"><strong>Liability Cap:</strong> Maximum ₹5,000 INR (or $60 USD).</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">7. Indemnification</h2>
                <p>You agree to indemnify and hold harmless Hexoran from any claims arising from your use, violations, or misuse, including payment of all legal costs.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">8. Law Enforcement</h2>
                <p>Hexoran cooperates fully with law enforcement. We may disclose your information upon valid legal request.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">9. Governing Law</h2>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Governed by the laws of <strong>India</strong></li>
                    <li>Disputes resolved by binding arbitration in <strong>New Delhi, India</strong></li>
                    <li>You waive class action rights</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">10. Contact</h2>
                <ul className="list-none space-y-1 text-sm">
                    <li><strong>Legal:</strong> legal@hexoran.com</li>
                    <li><strong>Support:</strong> support@hexoran.com</li>
                    <li><strong>Privacy:</strong> privacy@hexoran.com</li>
                </ul>
            </section>

            <div className="pt-8 border-t border-white/10 text-sm text-gray-500">
                <p><strong>Hexoran - End User License Agreement</strong></p>
                <p>Version 2.0 | Effective Date: December 26, 2025</p>
                <p>Copyright © 2025 Hexoran. All Rights Reserved.</p>
            </div>
        </div>
    )
}
