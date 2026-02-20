// Hexoran Mobile Companion Portal for Phantom Mode
// https://hexoran.com/companion

"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
    Sparkles, Clock, Volume2, History, Zap, ShieldCheck,
    Cpu, Copy, Loader2, Terminal
} from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CompanionPortal() {
    const [hwid, setHwid] = useState<string | null>(null);
    const [supabaseUrl, setSupabaseUrl] = useState<string>('');
    const [supabaseKey, setSupabaseKey] = useState<string>('');
    const [solutions, setSolutions] = useState<any[]>([]);
    const [isLive, setIsLive] = useState(false);
    const [autoSpeak, setAutoSpeak] = useState(true);
    const [isConnecting, setIsConnecting] = useState(false);
    const [viewMode, setViewMode] = useState<'live' | 'history'>('live');
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabaseClient = useRef<any>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const url = params.get('url');
        const key = params.get('key');

        if (id && url && key) {
            setHwid(id);
            setSupabaseUrl(url);
            setSupabaseKey(key);
            connectToSupabase(id, url, key);
        }
    }, []);

    const connectToSupabase = async (deviceId: string, url: string, key: string) => {
        setIsConnecting(true);
        console.log('[Companion] Connecting with deviceId:', deviceId);

        try {
            supabaseClient.current = createClient(url, key);

            const channel = supabaseClient.current
                .channel(`phantom_${deviceId}`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'realtime_solutions',
                    filter: `device_id=eq.${deviceId}`
                }, (payload: any) => {
                    console.log('[Companion] Realtime event:', payload);
                    handleNewSolution(payload.new);
                })
                .subscribe((status: string) => {
                    console.log('[Companion] Subscription status:', status);
                    if (status === 'SUBSCRIBED') {
                        setIsLive(true);
                        setIsConnecting(false);
                    }
                });

            // Load existing COMPLETED solutions for live feed
            const { data, error } = await supabaseClient.current
                .from('realtime_solutions')
                .select('*')
                .eq('device_id', deviceId)
                .eq('status', 'completed')
                .order('created_at', { ascending: false })
                .limit(20);

            console.log('[Companion] Loaded solutions:', data?.length, 'Error:', error);
            if (data) setSolutions(data);

        } catch (error) {
            console.error('Connection failed:', error);
            setIsConnecting(false);
        }
    };

    const handleNewSolution = (data: any) => {
        if (data.status !== 'completed') return;

        setSolutions(prev => {
            if (prev.find(s => s.id === data.id)) return prev;
            return [data, ...prev];
        });

        if (autoSpeak && data.answer_text) {
            const utterance = new SpeechSynthesisUtterance(data.answer_text.replace(/[`#*]/g, ''));
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }

        if (window.navigator.vibrate) {
            window.navigator.vibrate([200, 100, 200]);
        }

        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const cleanQuestionText = (text: string) => {
        if (!text) return "";
        // Remove common OCR noise like browser tabs, URLs, navigation
        return text
            .replace(/https?:\/\/[^\s]+/g, '')
            .replace(/(Gmail|YouTube|Collections|Roadmap|AlgoMaster|Bookmarks|LeetCode|ProblemList|Premium|Editorial|Submissions|Code)/gi, '')
            .replace(/[vV] 4 [gG]oog [xX][\s\S]*?\+ -/g, '')
            .trim()
            .substring(0, 300);
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-[#f8fafc] font-sans flex flex-col selection:bg-violet-500/30">
            {/* --- STEALTH HEADER --- */}
            <div className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl px-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xs font-black tracking-tighter uppercase">CELATO PHANTOM</h1>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest">
                            <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
                            <span className="text-white/40">
                                {isLive ? 'ENCRYPTED CHANNEL' : isConnecting ? 'HANDSHAKING...' : 'OFFLINE'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode(viewMode === 'live' ? 'history' : 'live')}
                        className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'history' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/40'}`}
                    >
                        <History className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">HISTORY</span>
                    </button>
                    <button
                        onClick={() => setAutoSpeak(!autoSpeak)}
                        className={`p-2 rounded-lg border transition-all ${autoSpeak ? 'bg-violet-600/20 border-violet-500/50 text-violet-400' : 'bg-white/5 border-white/10 text-white/20'}`}
                    >
                        <Volume2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* --- MAIN FEED --- */}
            <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
                {solutions.length > 0 ? solutions.map((item, idx) => (
                    <div
                        key={item.id}
                        className="animate-fade-in slide-in-bottom duration-300"
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        <div className="flex items-center justify-between gap-2 mb-2 opacity-30 px-1">
                            <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </div>
                            <div className="text-[9px] font-black text-violet-400/80 uppercase">#{solutions.length - idx}</div>
                        </div>

                        <div className="group rounded-3xl bg-[#0f0f11] border border-white/5 p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all hover:border-white/10">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-violet-600/10 transition-colors" />

                            {/* Question Transcript */}
                            <div className="mb-6 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-3 h-3 text-white/20" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">OCR Capture Extraction</span>
                                </div>
                                <p className="text-[11px] text-white/40 font-medium leading-relaxed italic border-l-2 border-white/5 pl-4 py-1">
                                    "{cleanQuestionText(item.question_text)}..."
                                </p>
                            </div>

                            {/* AI Solution */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-6 h-6 rounded-full bg-violet-600/20 flex items-center justify-center border border-violet-500/30">
                                            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-[0.1em] text-white/90">AI Synthesis Result</span>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(item.answer_text)}
                                        className="text-white/20 hover:text-white transition-all p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="prose prose-invert prose-slate max-w-none text-sm leading-relaxed text-slate-300">
                                    <ReactMarkdown
                                        components={{
                                            code({ node, inline, className, children, ...props }: any) {
                                                const match = /language-(\w+)/.exec(className || '')
                                                return !inline && match ? (
                                                    <div className="relative group/code my-4">
                                                        <div className="absolute top-0 right-0 p-2 z-10 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
                                                                className="bg-white/10 hover:bg-white/20 p-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white backdrop-blur-md"
                                                            >
                                                                <Copy className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <SyntaxHighlighter
                                                            style={vscDarkPlus as any}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            customStyle={{
                                                                margin: 0,
                                                                borderRadius: '16px',
                                                                border: '1px solid rgba(255,255,255,0.05)',
                                                                backgroundColor: '#050506',
                                                                padding: '1.25rem'
                                                            }}
                                                            {...props}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    </div>
                                                ) : (
                                                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-violet-300 font-mono" {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            }
                                        }}
                                    >
                                        {item.answer_text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center px-12 opacity-20">
                        {isConnecting ? (
                            <>
                                <Loader2 className="w-12 h-12 mb-6 animate-spin text-violet-500" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-2">Establishing Uplink</h2>
                                <p className="text-[9px] font-medium leading-relaxed">Securing P2P Tunnel with Supabase...</p>
                            </>
                        ) : isLive ? (
                            <>
                                <Cpu className="w-12 h-12 mb-6 animate-pulse text-emerald-500" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-2">Neural Link Active</h2>
                                <p className="text-[9px] font-medium leading-relaxed">System is armed. Capture screens on PC to see results here.</p>
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="w-12 h-12 mb-6 opacity-30" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-2">Comms Offline</h2>
                                <p className="text-[9px] font-medium leading-relaxed">Initialize connection from desktop terminal</p>
                            </>
                        )}
                    </div>
                )}
            </main>

            {/* --- FOOTER STATUS --- */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#09090b] via-[#09090b]/95 to-transparent pointer-events-none">
                <div className="max-w-md mx-auto bg-[#131316] border border-white/5 rounded-[2rem] p-4 flex items-center justify-between shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] backdrop-blur-2xl pointer-events-auto">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-2xl bg-black/60 border border-white/5">
                            <History className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                            <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.1em]">Intelligence Log</div>
                            <div className="text-xs font-bold text-white/80">
                                {solutions.length} Active {solutions.length === 1 ? 'Answer' : 'Answers'}
                            </div>
                        </div>
                    </div>
                    {hwid && (
                        <div className="flex flex-col items-end gap-1">
                            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-tighter flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                Node: {hwid.substring(0, 8)}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-in-bottom { 
                    from { transform: translateY(20px); opacity: 0; } 
                    to { transform: translateY(0); opacity: 1; } 
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                .slide-in-bottom { animation: slide-in-bottom 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                ::-webkit-scrollbar { width: 3px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(139, 92, 246, 0.2); }
            `}</style>
        </div>
    );
}
