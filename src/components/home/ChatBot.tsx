"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Globe, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import persona from "@/data/persona.json";
import { BorderBeam } from "@/components/ui/border-beam";

interface Message {
    id: string;
    type: "bot" | "user";
    text: string;
    timestamp: Date;
}

interface ChatBotProps {
    isHeroVariant?: boolean;
}

const TypingIndicator = () => (
    <div className="flex items-center gap-1 px-4 py-3">
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-typing-1" />
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-typing-2" />
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-typing-3" />
    </div>
);

const formatMessage = (text: string) => {
    // Parse markdown-like syntax for rich display
    return text.split("\n").map((line, i) => {
        // Bold text
        const boldParsed = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>');
        // Links
        const linkParsed = boldParsed.replace(
            /\[(.*?)\]\((.*?)\)/g,
            '<a href="$2" class="text-accent hover:text-accent/80 underline underline-offset-2 transition-colors">$1</a>'
        );

        if (line.startsWith("**") && line.includes(":**")) {
            return (
                <div key={i} className="mt-2 first:mt-0" dangerouslySetInnerHTML={{ __html: linkParsed }} />
            );
        }

        if (line.match(/^[✅🎵📊🤖🌐🏢🚀💡🌍🎮☕🌙📚🎯]/)) {
            return (
                <div key={i} className="flex items-start gap-2 mt-1 ml-1" dangerouslySetInnerHTML={{ __html: linkParsed }} />
            );
        }

        return (
            <div key={i} className={cn(line === "" ? "h-2" : "mt-1 first:mt-0")} dangerouslySetInnerHTML={{ __html: linkParsed }} />
        );
    });
};

export const ChatBot = ({ isHeroVariant = false }: ChatBotProps) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            type: "bot",
            text: `Hi👋, Ask me anything about **${persona.name}** ...`,
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [language, setLanguage] = useState("en");
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        // Small timeout to allow DOM to update before scrolling
        const timeoutId = setTimeout(() => {
            scrollToBottom();
        }, 100);
        return () => clearTimeout(timeoutId);
    }, [messages, isTyping]);

    const askGroq = async (userText: string, lang: string, history: Message[]) => {
        try {
            const formattedHistory = history.map(m => ({
                role: m.type === "bot" ? "assistant" : "user",
                content: m.text
            }));

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...formattedHistory, { role: "user", content: userText }],
                    language: lang
                })
            });

            const data = await response.json();
            return data.content || "I'm having a bit of trouble connecting to my brain right now. Please try again!";
        } catch (error) {
            console.error("Chat Error:", error);
            return "Something went wrong. Let's try that again!";
        }
    };

    const handleQuestion = async (questionId: string, questionLabel: string) => {
        const userMsg: Message = {
            id: `user-${Date.now()}`,
            type: "user",
            text: questionLabel,
            timestamp: new Date(),
        };
        const newHistory = [...messages, userMsg];
        setMessages(newHistory);
        setIsTyping(true);

        const answer = await askGroq(questionLabel, language, messages);

        setIsTyping(false);
        const botMsg: Message = {
            id: `bot-${Date.now()}`,
            type: "bot",
            text: answer,
            timestamp: new Date(),
        };
        setMessages([...newHistory, botMsg]);
    };

    const handleCustomInput = async () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            type: "user",
            text: inputValue,
            timestamp: new Date(),
        };
        const newHistory = [...messages, userMsg];
        setMessages(newHistory);
        const currentInput = inputValue;
        setInputValue("");
        setIsTyping(true);

        const answer = await askGroq(currentInput, language, messages);

        setIsTyping(false);
        const botMsg: Message = {
            id: `bot-${Date.now()}`,
            type: "bot",
            text: answer,
            timestamp: new Date(),
        };
        setMessages([...newHistory, botMsg]);
    };

    const currentLang = persona.languages.find((l) => l.code === language);

    return (
        <div className={cn("w-full mx-auto transition-all duration-500", isHeroVariant ? "max-w-none h-full flex flex-col" : "max-w-md")}>
            {/* Avatar Section */}
            {!isHeroVariant && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center mb-6"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                        <div className="relative w-20 h-20 rounded-full bg-background flex items-center justify-center overflow-hidden border border-foreground/10">
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center">
                                <span className="text-3xl font-display font-bold text-foreground tracking-tighter">SD</span>
                            </div>
                        </div>
                        <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-[3px] border-background shadow-lg" />
                    </div>
                    <motion.p className="mt-4 text-sm font-bold text-foreground tracking-tight font-display">{persona.name}</motion.p>
                    <motion.p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold flex items-center gap-1.5 opacity-80">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Neural Interface Online
                    </motion.p>
                </motion.div>
            )}

            {/* Main Chat Interface */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "relative overflow-hidden flex flex-col rounded-3xl border border-foreground/[0.08] bg-background/40 backdrop-blur-xl shadow-2xl",
                    isHeroVariant ? "flex-1" : "shadow-primary/5"
                )}
            >
                {/* Visual Accent - Top Beam */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent z-50" />

                <BorderBeam size={350} duration={15} delay={5} colorFrom="#a855f7" colorTo="#06b6d4" />

                {/* Messages Feed */}
                <div
                    ref={chatContainerRef}
                    className={cn(
                        "overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-hide",
                        isHeroVariant ? "h-[350px] md:h-[450px]" : "h-[400px]"
                    )}
                    style={{ scrollbarWidth: "none" }}
                >
                    <AnimatePresence mode="popLayout" initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={cn(
                                    "flex w-full group",
                                    msg.type === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[85%] md:max-w-[75%] px-5 py-4 text-sm relative",
                                        msg.type === "bot"
                                            ? "bg-foreground/5 border border-foreground/10 rounded-2xl rounded-tl-none font-sans text-foreground/90 shadow-sm"
                                            : "bg-primary text-primary-foreground rounded-2xl rounded-tr-none font-sans font-medium shadow-lg shadow-primary/20"
                                    )}
                                >
                                    <div className="relative z-10">
                                        {formatMessage(msg.text)}
                                    </div>

                                    {/* Subtle timestamp on hover */}
                                    <span className={cn(
                                        "absolute -bottom-5 text-[10px] opacity-0 group-hover:opacity-50 transition-opacity whitespace-nowrap",
                                        msg.type === "user" ? "right-0" : "left-0"
                                    )}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex justify-start"
                        >
                            <div className="bg-foreground/5 border border-foreground/10 rounded-2xl rounded-tl-none px-4 py-2">
                                <TypingIndicator />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Interaction Footer */}
                <div className="p-6 bg-gradient-to-b from-transparent to-foreground/[0.02] border-t border-foreground/[0.08] space-y-5">
                    {/* Quick Actions Grid */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {persona.suggestedQuestions.map((q) => (
                            <button
                                key={q.id}
                                onClick={() => handleQuestion(q.id, q.label)}
                                disabled={isTyping}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 flex items-center gap-2",
                                    q.id === "projects"
                                        ? "bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 shadow-lg shadow-primary/5"
                                        : "bg-foreground/5 border border-foreground/10 text-foreground/60 hover:text-foreground hover:bg-foreground/10 hover:border-foreground/20"
                                )}
                            >
                                {q.label}
                            </button>
                        ))}
                    </div>

                    {/* Smart Input Bar */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 group">
                            <div className="absolute -inset-px bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCustomInput()}
                                placeholder="Message Neural Interface..."
                                disabled={isTyping}
                                className="relative w-full bg-background/60 border border-foreground/10 rounded-2xl px-6 py-4 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-all disabled:opacity-50 backdrop-blur-md"
                            />
                        </div>
                        <button
                            onClick={handleCustomInput}
                            disabled={isTyping || !inputValue.trim()}
                            className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-primary/30"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
