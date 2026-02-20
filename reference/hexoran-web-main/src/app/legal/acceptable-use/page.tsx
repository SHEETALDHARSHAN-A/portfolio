
export default function AcceptableUsePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold mb-2">Acceptable Use Policy</h1>
                <p className="text-sm text-gray-500">Version 2.0 | Effective Date: December 26, 2025 | Last Updated: December 26, 2025</p>
            </div>

            <div className="p-4 border-l-4 border-red-500 bg-red-500/10">
                <p className="font-bold text-red-500">⚠️ WARNING</p>
                <p>Violation of this AUP may result in: immediate account termination, permanent ban, forfeiture of subscription fees (NO REFUNDS), liquidated damages of <strong>₹50,000 INR ($600 USD)</strong> per violation, cooperation with law enforcement, and civil/criminal prosecution.</p>
            </div>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">1. Permitted Uses ✅</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Interview preparation at home</li>
                            <li>Learning programming concepts</li>
                            <li>Skill development and practice</li>
                            <li>Academic research (with disclosure)</li>
                            <li>Personal projects</li>
                            <li>Teaching (with attribution)</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">2. Prohibited Uses ❌</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <h3 className="font-bold text-white mb-2">Academic & Professional Dishonesty</h3>
                        <ul className="list-disc pl-5 text-sm space-y-1 text-gray-400">
                            <li><strong>Cheating:</strong> Using during live interviews without disclosure</li>
                            <li><strong>Plagiarism:</strong> Submitting AI code as original work</li>
                            <li><strong>Exam violations:</strong> Using during timed examinations</li>
                            <li><strong>NDA Violations:</strong> Breaching confidentiality agreements</li>
                            <li><strong>Platform Terms Breach:</strong> Violating HackerRank, LeetCode, CodeSignal, etc.</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <h3 className="font-bold text-white mb-2">Illegal Activities</h3>
                        <ul className="list-disc pl-5 text-sm space-y-1 text-gray-400">
                            <li><strong>Fraud:</strong> Identity theft or deception</li>
                            <li><strong>Malware:</strong> Creating malicious code or exploits</li>
                            <li><strong>Cybercrime:</strong> Hacking or unauthorized access</li>
                            <li><strong>Harassment:</strong> Threatening or abusing others</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">3. User Responsibilities (SOLE LIABILITY)</h2>
                <div className="p-6 border border-white/10 bg-white/5 rounded-xl">
                    <p className="text-xl font-bold mb-4">YOU ARE 100% SOLELY RESPONSIBLE FOR:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm mb-4">
                        <li>Complying with interview platform terms</li>
                        <li>Following employer policies and NDAs</li>
                        <li>Adhering to academic honor codes</li>
                        <li>Complying with AI provider terms</li>
                        <li>All consequences of your use</li>
                    </ul>
                    <p className="text-2xl font-black text-white uppercase tracking-widest text-center">IGNORANCE IS NOT A DEFENSE.</p>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">4. Consequences of Violations</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-white/10">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="p-3 text-left border-b border-white/10">Consequence</th>
                                <th className="p-3 text-left border-b border-white/10">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td className="p-3 border-b border-white/10 font-bold text-red-400">Termination</td><td className="p-3 border-b border-white/10">Immediate and permanent ban</td></tr>
                            <tr><td className="p-3 border-b border-white/10 font-bold text-red-400">No Refund</td><td className="p-3 border-b border-white/10">Forfeiture of all fees paid</td></tr>
                            <tr><td className="p-3 border-b border-white/10 font-bold text-red-400">Liquidated Damages</td><td className="p-3 border-b border-white/10">₹50,000 INR ($600 USD) per violation</td></tr>
                            <tr><td className="p-3 border-b border-white/10 font-bold text-red-400">Legal Costs</td><td className="p-3 border-b border-white/10">Full recovery on solicitor-client basis</td></tr>
                            <tr><td className="p-3 font-bold text-red-400">Law Enforcement</td><td className="p-3">Full cooperation and reporting</td></tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-gray-400 mt-4">You acknowledge that AUP violations cause Hexoran significant reputational harm. The liquidated damages amount is a genuine pre-estimate of loss.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">5. Law Enforcement Cooperation</h2>
                <p>Hexoran fully cooperates with law enforcement in India and internationally. We may report illegal activities and disclose user information (email, account details, subscription history) upon valid legal request.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">6. Report Violations</h2>
                <p>Report violations to: <strong>abuse@hexoran.com</strong></p>
                <p className="text-sm text-gray-400">Response: Acknowledgment within 24-48 hours, investigation within 3-7 business days.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold">7. Summary</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <p className="font-bold text-green-400 mb-2">✅ DO</p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>Learn and practice honestly</li>
                            <li>Prepare for interviews at home</li>
                            <li>Verify all AI-generated code</li>
                            <li>Comply with all third-party terms</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                        <p className="font-bold text-red-400 mb-2">❌ DON&apos;T</p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>Cheat in interviews or exams</li>
                            <li>Submit AI code without understanding</li>
                            <li>Create harmful or illegal code</li>
                            <li>Violate platform/employer/school rules</li>
                        </ul>
                    </div>
                </div>
                <p className="text-center mt-4 font-bold">ALL CONSEQUENCES OF MISUSE ARE 100% YOUR RESPONSIBILITY.</p>
            </section>

            <div className="pt-8 border-t border-white/10 text-sm text-gray-500">
                <p><strong>Hexoran - Acceptable Use Policy</strong></p>
                <p>Version 2.0 | Effective Date: December 26, 2025</p>
                <p>For the latest version: https://hexoran.com/legal/acceptable-use</p>
            </div>
        </div>
    )
}
