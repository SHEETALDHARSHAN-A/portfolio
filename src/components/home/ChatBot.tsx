"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Globe, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import persona from "@/data/persona.json";

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
        const boldParsed = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
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
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
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
            {/* Avatar (Only in non-hero variant as Hero already has one) */}
            {!isHeroVariant && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                    className="flex flex-col items-center mb-4"
                >
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-accent to-primary p-[2px] animate-pulse-glow">
                            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                                    <span className="text-2xl font-display font-bold text-white">S</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                    </div>
                    <motion.p className="mt-3 text-sm font-medium text-white">{persona.name}</motion.p>
                    <motion.p className="text-xs text-text-muted flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-primary" /> AI Replica • Online
                    </motion.p>
                </motion.div>
            )}

            {/* Chat Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={cn(
                    "glass-card !rounded-2xl overflow-hidden flex flex-col",
                    isHeroVariant ? "flex-1 border-white/10 shadow-2xl" : ""
                )}
            >
                {/* Content Area */}

                {/* Messages */}
                <div
                    ref={chatContainerRef}
                    className={cn(
                        "overflow-y-auto p-6 space-y-4 font-mono transition-all duration-300",
                        isHeroVariant ? "h-[35vh] md:h-[40vh]" : "h-[300px]"
                    )}
                    style={{ scrollbarWidth: "none" }}
                >
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    "flex w-full",
                                    msg.type === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[85%] md:max-w-[70%] px-5 py-3.5 text-sm leading-relaxed rounded-2xl",
                                        msg.type === "bot"
                                            ? "bg-white/[0.03] border border-white/[0.06] text-white/90 rounded-tl-none"
                                            : "bg-primary/20 border border-primary/30 text-white/90 rounded-tr-none"
                                    )}
                                >
                                    {formatMessage(msg.text)}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl rounded-tl-none">
                                <TypingIndicator />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Footer Controls */}
                <div className="p-6 bg-white/[0.01] border-t border-white/5 space-y-4">
                    {/* Suggested Questions / Quick Actions */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {persona.suggestedQuestions.map((q) => (
                            <button
                                key={q.id}
                                onClick={() => handleQuestion(q.id, q.label)}
                                disabled={isTyping}
                                className="px-4 py-2 rounded-full text-[11px] font-mono bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all disabled:opacity-50"
                            >
                                {q.label}
                            </button>
                        ))}
                    </div>

                    {/* Input Field */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 group">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCustomInput()}
                                placeholder={`Ask anything about ${persona.name}...`}
                                disabled={isTyping}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-full px-6 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50"
                            />
                            <div className="absolute inset-0 rounded-full border border-primary/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 blur-[2px]" />
                        </div>
                        <button
                            onClick={handleCustomInput}
                            disabled={isTyping || !inputValue.trim()}
                            className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-50 shadow-lg shadow-primary/10"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
