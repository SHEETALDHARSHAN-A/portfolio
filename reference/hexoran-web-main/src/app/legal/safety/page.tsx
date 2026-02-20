
import React from 'react';

export const metadata = {
    title: 'Safety & Ethics - Hexoran',
    description: 'Our commitment to safety and ethical AI usage.',
};

export default function SafetyPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white mb-8">Safety & Ethics</h1>
            <div className="prose prose-invert max-w-none">
                <p className="text-lg text-gray-300 mb-6">
                    At Hexoran, we are dedicated to ensuring the safety and ethical use of our AI technologies.
                </p>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">Our Principles</h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-400">
                        <li>User data privacy and protection is paramount.</li>
                        <li>We implement strict content safety filters.</li>
                        <li>Transparent usage of AI models.</li>
                        <li>Continuous monitoring for misuse.</li>
                    </ul>
                </div>
                <p className="text-gray-400">
                    This is a placeholder for our full Safety & Ethics policy. Please check back soon for updates.
                </p>
            </div>
        </div>
    );
}
