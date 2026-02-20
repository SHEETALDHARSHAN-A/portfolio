import Link from 'next/link';
import { ArrowLeft, ExternalLink, Key, Terminal } from 'lucide-react';
import Image from 'next/image';
import { CelatoLogo, GroqLogo } from '@/components/logos';

const steps = [
    {
        title: 'Sign Up / Login to Groq',
        description: 'First, head over to the Groq Console. If you don\'t have an account, sign up for free.',
        image: '/screenshots/groq/login.png',
        action: {
            label: 'Go to Groq Console',
            url: 'https://console.groq.com/keys'
        }
    },
    {
        title: 'Create an API Key',
        description: 'Once logged in, click on the "Create API Key" button in the dashboard.',
        image: '/screenshots/groq/create_api_key.png'
    },
    {
        title: 'Name Your Key',
        description: 'Give your key a name like "Celato App" to easily identify it later.',
        image: '/screenshots/groq/name_for_key.png'
    },
    {
        title: 'Copy & Save',
        description: 'Copy your new API key immediately. You won\'t be able to see it again!',
        image: '/screenshots/groq/copy_api_key.png',
        warning: 'Keep this key secret. Never share it publicly.'
    },
    {
        title: 'Paste into Celato',
        description: 'Open Celato Settings > General > Groq. Paste the key and click verify.',
        image: '/screenshots/groq/copy_api_key.png'
    }
];

export default function GroqSetupPage() {
    return (
        <main className="min-h-screen bg-background text-text-main">
            {/* Header */}
            <header className="border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/celato/docs" className="group flex items-center gap-2 text-text-muted hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Docs
                        </Link>
                        <div className="h-6 w-px bg-white/10" />
                        <div className="flex items-center gap-2.5">
                            <CelatoLogo className="w-6 h-6 text-primary" />
                            <span className="font-bold text-white tracking-tight">Setup Guide</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="pt-20 pb-20 container mx-auto px-4 max-w-4xl">
                {/* Hero */}
                <div className="text-center space-y-8 mb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-medium">
                        <Terminal className="w-3 h-3" /> Groq API Integration
                    </div>
                    <div className="flex items-center justify-center gap-6 mb-4">
                        <CelatoLogo className="w-16 h-16 text-primary" />
                        <span className="text-3xl text-white/10 font-thin">/</span>
                        <GroqLogo className="w-16 h-16 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                        Supercharge Celato with Groq
                    </h1>
                    <p className="text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
                        Generate a free API key to unlock lightning-fast inference for real-time interview assistance.
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-32 relative sm:before:absolute sm:before:inset-0 sm:before:ml-6 sm:before:-translate-x-px md:before:mx-auto md:before:translate-x-0 sm:before:h-full sm:before:w-0.5 sm:before:bg-gradient-to-b sm:before:from-transparent sm:before:via-white/10 sm:before:to-transparent">
                    {steps.map((step, index) => (
                        <div key={index} className="relative sm:flex gap-12 group items-center">
                            {/* Number Marker */}
                            <div className="absolute top-0 left-0 -ml-3 sm:ml-0 md:left-1/2 md:-translate-x-1/2 sm:static sm:flex-shrink-0 z-10">
                                <div className="w-12 h-12 rounded-xl bg-background border border-white/10 flex items-center justify-center shadow-xl group-hover:border-orange-500/50 group-hover:text-orange-400 group-hover:shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)] transition-all duration-300">
                                    <span className="font-mono font-bold text-lg">{index + 1}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className={`mt-8 sm:mt-0 flex-1 md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:order-last'}`}>
                                <div className={`flex flex-col gap-6 ${index % 2 === 0 ? 'md:items-end' : 'md:items-start'}`}>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-bold text-white group-hover:text-orange-200 transition-colors">{step.title}</h3>
                                        <p className="text-text-muted leading-relaxed max-w-sm">{step.description}</p>

                                        {step.action && (
                                            <a
                                                href={step.action.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium text-sm transition-colors mt-2"
                                            >
                                                {step.action.label} <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}

                                        {step.warning && (
                                            <div className="flex items-center gap-2 text-amber-400/90 text-xs font-medium bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20 w-fit mt-2">
                                                <Key className="w-3 h-3" /> {step.warning}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Image Side */}
                            <div className={`mt-6 sm:mt-0 flex-1 md:w-1/2 ${index % 2 === 0 ? 'md:order-last' : 'md:order-first md:text-right'}`}>
                                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-surface shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:border-white/20">
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        width={800}
                                        height={450}
                                        className="w-full h-auto object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="mt-40 text-center space-y-8 p-12 rounded-3xl bg-surface border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl font-bold text-white">All Set?</h2>
                        <p className="text-text-muted max-w-md mx-auto">
                            Head back to Celato and verify your key to start using the fastest AI engine available.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/celato/docs" className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-orange-500 hover:text-white transition-all duration-300">
                                Return to Documentation
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
