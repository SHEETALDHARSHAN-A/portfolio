
export default function TermsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
                <p className="text-sm text-gray-500">Version 2.0 | Effective Date: December 26, 2025 | Last Updated: December 26, 2025</p>
            </div>

            <div className="p-6 border-2 border-red-500/50 bg-red-500/10 rounded-xl">
                <h3 className="text-xl font-bold text-red-500 mb-2">⚠️ CRITICAL NOTICE: EDUCATIONAL PURPOSE ONLY</h3>
                <p className="text-red-200 font-bold">
                    CELATO IS STRICTLY AN EDUCATIONAL AND PRODUCTIVITY TOOL. IT IS NOT DESIGNED, INTENDED, OR AUTHORIZED FOR USE IN CHEATING, ACADEMIC DISHONESTY, INTERVIEW FRAUD, OR ANY FORM OF DECEPTION. ANY SUCH MISUSE IS A MATERIAL BREACH AND MAY RESULT IN IMMEDIATE TERMINATION, PERMANENT BAN, AND LEGAL LIABILITY. ALL CONSEQUENCES ARE 100% YOUR RESPONSIBILITY.
                </p>
            </div>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
                <p>
                    Welcome to Celato by Hexoran. By clicking &quot;I Agree&quot;, creating an account, installing, or using Celato, you agree to be bound by these Terms. If you do not agree, you must not use the Software.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">2. Data We Collect</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-white/10">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="p-3 text-left border-b border-white/10">Data Type</th>
                                <th className="p-3 text-left border-b border-white/10">Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td className="p-3 border-b border-white/10">Email Address</td><td className="p-3 border-b border-white/10">Account, communication</td></tr>
                            <tr><td className="p-3 border-b border-white/10">Personal Details (name, phone)</td><td className="p-3 border-b border-white/10">Account personalization</td></tr>
                            <tr><td className="p-3 border-b border-white/10">Profile Photo</td><td className="p-3 border-b border-white/10">Account personalization</td></tr>
                            <tr><td className="p-3 border-b border-white/10">Subscription Status</td><td className="p-3 border-b border-white/10">Feature access</td></tr>
                            <tr><td className="p-3">Payment Records</td><td className="p-3">Billing management</td></tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-gray-400 mt-4"><strong>NOT collected:</strong> Screenshots, AI responses, API keys, usage patterns</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">3. Subscription & Payment</h2>
                <div className="p-6 border-2 border-red-500/20 bg-red-500/5 rounded-xl">
                    <h3 className="text-xl font-bold text-red-400 mb-4">⚠️ AUTOMATIC RENEWAL & NO REFUND POLICY</h3>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li><strong>Automatic Renewal:</strong> ALL subscriptions automatically renew. <strong>IT IS YOUR SOLE RESPONSIBILITY</strong> to cancel BEFORE the renewal date.</li>
                        <li><strong>NO REFUNDS:</strong> ALL payments are final and non-refundable under ANY circumstances, including dissatisfaction, partial use, or forgetting to cancel.</li>
                        <li><strong>Fraudulent Chargebacks:</strong> Will result in permanent ban, legal action, and recovery of all costs.</li>
                    </ul>
                    <p className="text-sm text-gray-400">By subscribing, you explicitly acknowledge and agree to this policy.</p>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">4. VOLUNTARY ASSUMPTION OF RISK</h2>
                <div className="p-6 bg-red-950/30 border border-red-500/30 rounded-xl">
                    <p className="font-bold mb-4 text-lg">BY USING CELATO, YOU VOLUNTARILY ASSUME ALL RISKS.</p>
                    <p className="mb-2">IF ANY OF THE FOLLOWING OCCUR:</p>
                    <ul className="list-disc pl-5 space-y-2 mb-4 font-semibold">
                        <li>BANNED from any platform (HackerRank, LeetCode, CodeSignal, etc.)</li>
                        <li>FIRED from your job or have an offer rescinded</li>
                        <li>EXPELLED or face academic disciplinary action</li>
                        <li>SUED or face legal action from any third party</li>
                        <li>BLACKLISTED from any industry or profession</li>
                    </ul>
                    <p className="text-2xl font-bold text-red-400 mb-4">IT IS 100% YOUR FAULT. NOT OURS.</p>
                    <p>HEXORAN SHALL HAVE <strong>ABSOLUTELY ZERO LIABILITY</strong> FOR THESE OUTCOMES. We have NO OBLIGATION to assist in recovering accounts, jobs, reputation, or monetary losses.</p>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">5. Third-Party Compliance</h2>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="font-bold text-white mb-2">YOU ARE 100% SOLELY RESPONSIBLE FOR:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Complying with interview platform terms (HackerRank, LeetCode, CodeSignal, etc.)</li>
                        <li>Following employer policies and NDAs</li>
                        <li>Adhering to academic honor codes</li>
                        <li>Complying with AI provider terms of service</li>
                    </ul>
                    <p className="text-xl font-black text-white uppercase tracking-widest mt-4 text-center">IGNORANCE IS NOT A DEFENSE.</p>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">6. Limitation of Liability</h2>
                <p className="uppercase text-sm">TO THE MAXIMUM EXTENT PERMITTED BY LAW, HEXORAN SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR REPUTATION.</p>
                <p className="mt-4"><strong>Liability Cap:</strong> Maximum ₹5,000 INR (or $60 USD) or amounts paid in the 12 months prior to the claim, whichever is greater.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">7. Indemnification</h2>
                <p>You agree to <strong>indemnify, defend, and hold harmless</strong> Hexoran from any claims, damages, losses, and expenses (including attorneys&apos; fees on a solicitor-client basis) arising from your use, violations, or misuse of the Service.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">8. Law Enforcement Cooperation</h2>
                <p>Hexoran fully cooperates with law enforcement in India and internationally. We may report illegal activities and disclose user information upon valid legal request.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">9. Dispute Resolution</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Governing Law:</strong> India</li>
                    <li><strong>Arbitration:</strong> Binding arbitration under the Arbitration and Conciliation Act, 1996, in <strong>New Delhi, India</strong></li>
                    <li><strong>Class Action Waiver:</strong> You waive the right to participate in class action lawsuits</li>
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
                <p><strong>Hexoran - Terms of Service</strong></p>
                <p>Version 2.0 | Effective Date: December 26, 2025</p>
                <p>For the latest version: https://hexoran.com/legal/terms</p>
            </div>
        </div>
    )
}
