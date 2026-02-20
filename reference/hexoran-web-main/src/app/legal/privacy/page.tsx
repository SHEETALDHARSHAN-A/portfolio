
export default function PrivacyPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
                <p className="text-sm text-gray-500">Version 2.0 | Effective Date: December 26, 2025 | Last Updated: December 26, 2025</p>
            </div>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">1. Information We Collect</h2>
                <p>Hexoran collects the following information to provide our services:</p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-white/10">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="p-3 text-left border-b border-white/10">Data Type</th>
                                <th className="p-3 text-left border-b border-white/10">Purpose</th>
                                <th className="p-3 text-left border-b border-white/10">Required</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td className="p-3 border-b border-white/10">Email Address</td><td className="p-3 border-b border-white/10">Account identification, communication</td><td className="p-3 border-b border-white/10">Yes</td></tr>
                            <tr><td className="p-3 border-b border-white/10">Full Name</td><td className="p-3 border-b border-white/10">Personalization, support</td><td className="p-3 border-b border-white/10">Optional</td></tr>
                            <tr><td className="p-3 border-b border-white/10">Phone Number</td><td className="p-3 border-b border-white/10">Account recovery, support</td><td className="p-3 border-b border-white/10">Optional</td></tr>
                            <tr><td className="p-3 border-b border-white/10">Profile Photo</td><td className="p-3 border-b border-white/10">Account personalization</td><td className="p-3 border-b border-white/10">Optional</td></tr>
                            <tr><td className="p-3 border-b border-white/10">Subscription Status</td><td className="p-3 border-b border-white/10">Feature access, billing</td><td className="p-3 border-b border-white/10">Yes</td></tr>
                            <tr><td className="p-3">Payment Transaction IDs</td><td className="p-3">Payment verification</td><td className="p-3">Via Razorpay</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">2. Information We DO NOT Collect</h2>
                <p className="font-bold text-white">Hexoran does NOT have access to:</p>
                <ul className="list-disc pl-5 space-y-1 text-green-400">
                    <li>Your screenshots or images</li>
                    <li>AI-generated solutions or responses</li>
                    <li>Your coding problems or queries</li>
                    <li>Your API keys (stored locally on your device)</li>
                    <li>Usage patterns or analytics</li>
                    <li>Browsing history or device location</li>
                </ul>
                <p className="text-sm text-gray-400 mt-4">Everything happens locally on your device or is sent directly to the AI provider (OpenAI, Google, Anthropic) using YOUR API keys.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">3. Third-Party Data Processing</h2>
                <div className="p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-lg">
                    <p className="font-bold text-yellow-500 mb-2">⚠️ IMPORTANT</p>
                    <p className="text-sm">When you use AI features, your data is sent <strong>DIRECTLY</strong> to third-party AI providers (OpenAI, Google, Anthropic). Hexoran has <strong>ZERO CONTROL</strong> over how they handle your data.</p>
                </div>
                <p className="mt-4">Review their privacy policies:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>OpenAI: https://openai.com/policies/privacy-policy</li>
                    <li>Google: https://policies.google.com/privacy</li>
                    <li>Anthropic: https://www.anthropic.com/privacy</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">4. Data Security</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Encryption at Rest:</strong> AES-256 encryption for all stored data</li>
                    <li><strong>Encryption in Transit:</strong> TLS 1.3 for all communications</li>
                    <li><strong>API Key Protection:</strong> Stored locally using Windows Credential Manager (DPAPI)</li>
                    <li><strong>Payment Processing:</strong> Handled by Razorpay (PCI-DSS Level 1 compliant)</li>
                </ul>
                <p className="mt-4 text-sm text-gray-400"><strong>NO SYSTEM IS 100% SECURE.</strong> Use the service at your own risk.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">5. Law Enforcement Disclosure</h2>
                <div className="p-4 border-l-4 border-red-500 bg-red-500/10">
                    <p>Hexoran fully cooperates with law enforcement authorities in India and internationally. Upon valid legal request, we may disclose:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                        <li>Email address and personal details</li>
                        <li>Subscription and payment history</li>
                        <li>Support communication logs</li>
                        <li>Account information and available logs</li>
                    </ul>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Access:</strong> View your data</li>
                    <li><strong>Correction:</strong> Fix inaccurate data</li>
                    <li><strong>Deletion:</strong> Delete your account (email privacy@hexoran.com)</li>
                    <li><strong>Export:</strong> Get a copy of your data</li>
                </ul>
                <p className="mt-4 text-sm">Response time: Within 30 days.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">7. Contact</h2>
                <ul className="list-none space-y-1 text-sm">
                    <li><strong>Privacy inquiries:</strong> privacy@hexoran.com</li>
                    <li><strong>Data Protection Officer (EU):</strong> dpo@hexoran.com</li>
                    <li><strong>General support:</strong> support@hexoran.com</li>
                </ul>
            </section>

            <div className="pt-8 border-t border-white/10 text-sm text-gray-500">
                <p><strong>Hexoran - Privacy Policy</strong></p>
                <p>Version 2.0 | Effective Date: December 26, 2025</p>
                <p>For the latest version: https://hexoran.com/legal/privacy</p>
            </div>
        </div>
    )
}
