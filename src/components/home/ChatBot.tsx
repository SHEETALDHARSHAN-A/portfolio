"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ExternalLink, Sun, Moon, House, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import persona from "@/data/persona.json";
import { BorderBeam } from "@/components/ui/border-beam";
import Image from "next/image";

interface ChatProject {
    title: string;
    description: string;
    tags: string[];
    link?: string;
    image_url?: string;
}

interface Message {
    id: string;
    type: "bot" | "user";
    text: string;
    timestamp: Date;
    projects?: ChatProject[];
}

interface ChatBotProps {
    isHeroVariant?: boolean;
}

interface ShowcaseItem {
    id: string;
    title: string;
    subtitle: string;
    url: string;
}

const showcaseItems: ShowcaseItem[] = [
    { id: "work", title: "Project Showcase", subtitle: "Featured builds", url: "/work" },
    { id: "blog", title: "Blog", subtitle: "Thoughts and notes", url: "/blog" },
    { id: "hire", title: "Hire Me", subtitle: "Services and process", url: "/hire-me" },
];

const createWelcomeMessage = (): Message => ({
    id: `welcome-${Date.now()}`,
    type: "bot",
    text: `Hi👋, Ask me anything about **${persona.name}** ...`,
    timestamp: new Date(),
});

const TypingIndicator = () => (
    <div className="flex items-center gap-1 px-4 py-3">
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-typing-1" />
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-typing-2" />
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-typing-3" />
    </div>
);

const ChatProjectCard = ({
    project,
    index,
    onOpenInPreview,
}: {
    project: ChatProject;
    index: number;
    onOpenInPreview?: (url: string, title?: string) => void;
}) => (
    <motion.a
        href={project.link || "#"}
        target={project.link ? "_blank" : undefined}
        rel="noopener noreferrer"
        onClick={(event) => {
            if (onOpenInPreview && project.link) {
                event.preventDefault();
                onOpenInPreview(project.link, project.title);
            }
        }}
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, delay: index * 0.1, ease: "easeOut" }}
        className="group block rounded-xl overflow-hidden border border-foreground/[0.08] bg-background/60 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
    >
        {/* Image */}
        <div className="relative h-28 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
            {project.image_url ? (
                <Image
                    src={project.image_url + "?auto=format&fit=crop&q=80&w=400"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
            )}
            {/* Link indicator */}
            {project.link && (
                <div className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-background/70 backdrop-blur-md flex items-center justify-center border border-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-3.5 h-3.5 text-primary" />
                </div>
            )}
        </div>

        {/* Content */}
        <div className="p-3">
            <h4 className="text-sm font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {project.title}
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                {project.description}
            </p>
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
                {project.tags?.slice(0, 3).map((tag) => (
                    <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[9px] font-mono font-medium bg-primary/10 text-primary/80 border border-primary/10"
                    >
                        {tag}
                    </span>
                ))}
                {project.tags && project.tags.length > 3 && (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-mono text-muted-foreground">
                        +{project.tags.length - 3}
                    </span>
                )}
            </div>
        </div>
    </motion.a>
);

const formatMessage = (text: string) => {
    // Remove the [SHOW_PROJECTS] marker from displayed text
    const cleanText = text.replace(/\[SHOW_PROJECTS\]/g, "").trim();
    if (!cleanText) return null;

    return cleanText.split("\n").map((line, i) => {
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
    const [messages, setMessages] = useState<Message[]>([createWelcomeMessage()]);
    const [isTyping, setIsTyping] = useState(false);
    const [language, setLanguage] = useState("en");
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [activeShowcase, setActiveShowcase] = useState(showcaseItems[0].id);
    const [previewUrl, setPreviewUrl] = useState(showcaseItems[0].url);
    const [previewTitle, setPreviewTitle] = useState(showcaseItems[0].title);
    const [browserAddress, setBrowserAddress] = useState(showcaseItems[0].url);
    const [browserHistory, setBrowserHistory] = useState<string[]>([showcaseItems[0].url]);
    const [browserHistoryIndex, setBrowserHistoryIndex] = useState(0);
    const [iframeReloadKey, setIframeReloadKey] = useState(0);
    const [browserDarkMode, setBrowserDarkMode] = useState(true);
    const [rightPanelWidth, setRightPanelWidth] = useState(600);
    const [isResizingRightPanel, setIsResizingRightPanel] = useState(false);
    const resizeStartRef = useRef<{ startX: number; startWidth: number } | null>(null);
    const browserIframeRef = useRef<HTMLIFrameElement>(null);
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

    useEffect(() => {
        if (!isResizingRightPanel) return;

        const previousCursor = document.body.style.cursor;
        const previousUserSelect = document.body.style.userSelect;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";

        return () => {
            document.body.style.cursor = previousCursor;
            document.body.style.userSelect = previousUserSelect;
        };
    }, [isResizingRightPanel]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "error-page-action") {
                if (event.data.action === "go-back") {
                    // Try to go back in browser history, otherwise go to work page
                    if (browserHistoryIndex > 0) {
                        const nextIndex = browserHistoryIndex - 1;
                        const nextUrl = browserHistory[nextIndex];
                        setBrowserHistoryIndex(nextIndex);
                        navigateBrowserTo(nextUrl, previewTitle, false);
                    } else {
                        navigateBrowserTo("/work", "Project Showcase", true);
                    }
                } else if (event.data.action === "home") {
                    navigateBrowserTo("/work", "Project Showcase", true);
                }
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [browserHistoryIndex, browserHistory, previewTitle]);

    const askGroq = async (userText: string, lang: string, history: Message[]): Promise<{ content: string; projects?: ChatProject[] }> => {
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
            return {
                content: data.content || "I'm having a bit of trouble connecting to my brain right now. Please try again!",
                projects: data.projects
            };
        } catch (error) {
            console.error("Chat Error:", error);
            return { content: "Something went wrong. Let's try that again!" };
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

        const { content, projects } = await askGroq(questionLabel, language, messages);

        setIsTyping(false);
        const botMsg: Message = {
            id: `bot-${Date.now()}`,
            type: "bot",
            text: content,
            timestamp: new Date(),
            projects,
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

        const { content, projects } = await askGroq(currentInput, language, messages);

        setIsTyping(false);
        const botMsg: Message = {
            id: `bot-${Date.now()}`,
            type: "bot",
            text: content,
            timestamp: new Date(),
            projects,
        };
        setMessages([...newHistory, botMsg]);
    };

    const startNewSession = () => {
        setMessages([createWelcomeMessage()]);
        setInputValue("");
        setIsTyping(false);
    };

    const resolveBrowserInput = (value: string) => {
        const raw = value.trim();
        if (!raw) return previewUrl;

        if (/^https?:\/\//i.test(raw)) return raw;
        if (raw.startsWith("/")) return raw;

        const matchedRoute = showcaseItems.find((item) => item.url.replace(/^\//, "") === raw.toLowerCase());
        if (matchedRoute) return matchedRoute.url;

        if (raw.includes(" ")) return `https://duckduckgo.com/?q=${encodeURIComponent(raw)}`;
        if (raw.includes(".")) return `https://${raw}`;

        return `https://duckduckgo.com/?q=${encodeURIComponent(raw)}`;
    };

    const syncIframeTheme = () => {
        const iframe = browserIframeRef.current;
        if (!iframe) return;

        try {
            const iframeDoc = iframe.contentDocument;
            if (!iframeDoc?.documentElement) return;
            iframeDoc.documentElement.classList.toggle("dark", browserDarkMode);
        } catch {
            // Cross-origin pages cannot be themed from parent context.
        }
    };

    const normalizeBrowserUrl = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return "";
        if (/^https?:\/\//i.test(trimmed)) return trimmed;
        if (trimmed.startsWith("/")) return trimmed;
        if (/\.[a-z]{2,}/i.test(trimmed)) return `https://${trimmed}`;
        return `/${trimmed.replace(/^\/+/, "")}`;
    };

    const toAbsoluteBrowserUrl = (url: string) => {
        try {
            return new URL(url, window.location.origin).toString();
        } catch {
            return url;
        }
    };

    const toProxyBrowserUrl = (url: string) => `/api/browser-proxy?url=${encodeURIComponent(url)}`;

    const toBrowserErrorPageUrl = (title: string, description: string) =>
        `/api/browser-proxy?mode=error&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

    const showcaseAllowedHostPatterns = [
        "hexoran.com",
        "*.hexoran.com",
        ...(process.env.NEXT_PUBLIC_BROWSER_PANEL_ALLOWED_HOSTS || "")
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean),
    ];

    const hostMatchesPattern = (hostname: string, pattern: string) => {
        const host = hostname.toLowerCase();
        const normalized = pattern.toLowerCase();

        if (normalized.startsWith("*.")) {
            const base = normalized.slice(2);
            return host === base || host.endsWith(`.${base}`);
        }

        return host === normalized || host.endsWith(`.${normalized}`);
    };

    const isShowcaseAllowedExternalUrl = (url: string) => {
        try {
            const parsed = new URL(url, window.location.origin);
            if (!/^https?:$/i.test(parsed.protocol)) return false;
            if (parsed.hostname === window.location.hostname) return true;
            return showcaseAllowedHostPatterns.some((pattern) => hostMatchesPattern(parsed.hostname, pattern));
        } catch {
            return false;
        }
    };

    const isKnownBlockedEmbedExternalUrl = (url: string) => {
        try {
            const parsed = new URL(url, window.location.origin);
            const host = parsed.hostname.toLowerCase();
            return (
                host === "google.com" ||
                host.endsWith(".google.com") ||
                host === "duckduckgo.com" ||
                host.endsWith(".duckduckgo.com") ||
                host === "vercel.com" ||
                host.endsWith(".vercel.com") ||
                host === "vercel.app"
            );
        } catch {
            return false;
        }
    };

    const fromProxyBrowserUrl = (url: string) => {
        try {
            const parsed = new URL(url, window.location.origin);
            if (parsed.pathname !== "/api/browser-proxy") return null;
            return parsed.searchParams.get("url");
        } catch {
            return null;
        }
    };

    const isExternalBrowserUrl = (url: string) => /^https?:\/\//i.test(url);

    const navigateBrowserTo = (url: string, title?: string, pushHistory = true) => {
        if (!url) return;

        let nextPreviewUrl = url;
        let nextAddress = url;

        if (isExternalBrowserUrl(url)) {
            const absoluteUrl = toAbsoluteBrowserUrl(url);
            nextAddress = absoluteUrl;

            if (isShowcaseAllowedExternalUrl(absoluteUrl)) {
                if (isKnownBlockedEmbedExternalUrl(absoluteUrl)) {
                    nextPreviewUrl = toProxyBrowserUrl(absoluteUrl);
                } else {
                    nextPreviewUrl = absoluteUrl;
                }
            } else {
                nextPreviewUrl = toBrowserErrorPageUrl(
                    "Showcase-only Panel",
                    "Only Sheetal showcases can be shown here."
                );
            }
        }

        setPreviewUrl(nextPreviewUrl);
        if (title) setPreviewTitle(title);
        setBrowserAddress(nextAddress);

        if (pushHistory) {
            setBrowserHistory((prev) => {
                const truncated = prev.slice(0, browserHistoryIndex + 1);
                if (truncated[truncated.length - 1] === nextAddress) return truncated;
                const next = [...truncated, nextAddress];
                setBrowserHistoryIndex(next.length - 1);
                return next;
            });
        }

        const matched = showcaseItems.find((item) => item.url === nextAddress);
        if (matched) setActiveShowcase(matched.id);
    };

    const syncBrowserStateFromIframe = () => {
        if (!isHeroVariant) return;

        try {
            const iframe = browserIframeRef.current;
            if (!iframe?.contentWindow) return;
            const iframeUrl = iframe.contentWindow.location.href;
            const decodedTarget = fromProxyBrowserUrl(iframeUrl);
            if (!decodedTarget) return;

            setPreviewUrl(toProxyBrowserUrl(decodedTarget));

            const shouldPush = decodedTarget !== browserAddress;
            setBrowserAddress(decodedTarget);

            if (shouldPush) {
                setBrowserHistory((prev) => {
                    if (prev[prev.length - 1] === decodedTarget) return prev;
                    const next = [...prev, decodedTarget];
                    setBrowserHistoryIndex(next.length - 1);
                    return next;
                });
            }
        } catch {
            // Ignore iframe access issues.
        }
    };

    const handleBrowserIframeLoad = () => {
        syncIframeTheme();
        syncBrowserStateFromIframe();
    };

    const handleBrowserIframeError = () => {
        setPreviewUrl(
            toBrowserErrorPageUrl(
                "Unable to Load Showcase",
                "Sorry for the inconvenience. The selected showcase page is currently unreachable."
            )
        );
    };

    const selectShowcase = (item: ShowcaseItem) => {
        setActiveShowcase(item.id);
        navigateBrowserTo(item.url, item.title, true);
    };

    const openInPreview = (url: string, title?: string) => {
        const normalized = normalizeBrowserUrl(url);
        navigateBrowserTo(normalized, title, true);
    };

    const handleMessageContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isHeroVariant) return;
        const target = event.target as HTMLElement;
        const anchor = target.closest("a") as HTMLAnchorElement | null;
        if (!anchor) return;
        const href = anchor.getAttribute("href") || anchor.href;
        if (!href) return;
        event.preventDefault();
        openInPreview(href, anchor.textContent || "Preview");
    };

    const handleRightPanelResizeStart = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isHeroVariant || window.innerWidth < 1280) return;

        event.preventDefault();
        resizeStartRef.current = {
            startX: event.clientX,
            startWidth: rightPanelWidth,
        };
        setIsResizingRightPanel(true);
    };

    const handleRightPanelResizeMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isResizingRightPanel || !resizeStartRef.current) return;

        const { startX, startWidth } = resizeStartRef.current;
        const deltaX = startX - event.clientX;
        const nextWidth = Math.min(820, Math.max(420, startWidth + deltaX));
        setRightPanelWidth(nextWidth);
    };

    const handleRightPanelResizeEnd = () => {
        setIsResizingRightPanel(false);
        resizeStartRef.current = null;
    };

    const handleBrowserGo = () => {
        const normalized = resolveBrowserInput(browserAddress);
        if (!normalized) return;
        navigateBrowserTo(normalized, previewTitle, true);
    };

    const handleBrowserBack = () => {
        if (browserHistoryIndex <= 0) return;
        const nextIndex = browserHistoryIndex - 1;
        const nextUrl = browserHistory[nextIndex];
        setBrowserHistoryIndex(nextIndex);
        navigateBrowserTo(nextUrl, previewTitle, false);
    };

    const handleBrowserForward = () => {
        if (browserHistoryIndex >= browserHistory.length - 1) return;
        const nextIndex = browserHistoryIndex + 1;
        const nextUrl = browserHistory[nextIndex];
        setBrowserHistoryIndex(nextIndex);
        navigateBrowserTo(nextUrl, previewTitle, false);
    };

    const handleBrowserReload = () => {
        setIframeReloadKey((prev) => prev + 1);
    };

    const handleBrowserThemeToggle = () => {
        setBrowserDarkMode((prev) => !prev);
    };

    useEffect(() => {
        syncIframeTheme();
    }, [browserDarkMode, previewUrl, iframeReloadKey]);

    const historyItems = messages.filter((m) => m.type === "user").slice(-8).reverse();
    const selectedShowcase = showcaseItems.find((item) => item.id === activeShowcase) || showcaseItems[0];
    const sessionItems = historyItems.slice(0, 7);
    const browserDisplayUrl = previewUrl.startsWith("http")
        ? previewUrl
        : `http://localhost:3000${previewUrl}`;

    const formatTimeAgo = (timestamp: Date) => {
        const diffMinutes = Math.max(0, Math.floor((Date.now() - timestamp.getTime()) / 60000));
        if (diffMinutes < 1) return "now";
        if (diffMinutes < 60) return `${diffMinutes}m`;
        const hours = Math.floor(diffMinutes / 60);
        return `${hours}h`;
    };

    const currentLang = persona.languages.find((l) => l.code === language);
    const heroGridStyle = {
        ["--chat-right-width" as string]: `${rightPanelWidth}px`,
    } as React.CSSProperties;

    return (
        <div className={cn("w-full mx-auto transition-all duration-500", isHeroVariant ? "max-w-none flex flex-col" : "max-w-md")} style={isHeroVariant ? { height: "72vh", minHeight: "420px", maxHeight: "760px" } : {}}>
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

                {!isHeroVariant && <BorderBeam size={350} duration={15} delay={5} colorFrom="#a855f7" colorTo="#06b6d4" />}

                {isHeroVariant && isResizingRightPanel && (
                    <div
                        className="absolute inset-0 z-[90] cursor-col-resize"
                        onMouseMove={handleRightPanelResizeMove}
                        onMouseUp={handleRightPanelResizeEnd}
                        onMouseLeave={handleRightPanelResizeEnd}
                    />
                )}

                {isHeroVariant ? (
                    <div className="h-full flex flex-col bg-[#0f0f10]">
                        <div className="h-9 border-b border-foreground/[0.08] px-3 flex items-center justify-between bg-[#141415]">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-foreground/35" />
                                <span className="h-2.5 w-2.5 rounded-full bg-foreground/35" />
                                <span className="h-2.5 w-2.5 rounded-full bg-foreground/35" />
                            </div>
                            <p className="text-xs text-foreground/80 tracking-wide">Neural Workspace</p>
                            <p className="text-xs text-primary/80">Portfolio</p>
                        </div>

                        <div
                            className="grid flex-1 min-h-0 grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] xl:[grid-template-columns:260px_minmax(0,1fr)_var(--chat-right-width)]"
                            style={heroGridStyle}
                        >
                        <aside className="hidden lg:flex flex-col border-r border-foreground/[0.08] bg-[#111112]">
                            <div className="px-4 py-4 border-b border-foreground/[0.08]">
                                <p className="text-[11px] font-semibold tracking-wide text-foreground/70 uppercase">Ready For Review {sessionItems.length || 1}</p>
                            </div>
                            <div className="p-3 space-y-2 overflow-y-auto">
                                <button
                                    onClick={startNewSession}
                                    className="w-full text-left px-3 py-2 rounded-lg border border-primary/30 bg-primary/10 text-primary text-[11px]"
                                >
                                    + New Session
                                </button>
                                {sessionItems.length === 0 ? (
                                    <div className="px-3 py-8 text-center text-xs text-foreground/40">Start chatting to build your session history.</div>
                                ) : (
                                    sessionItems.map((item, idx) => (
                                        <div key={item.id} className="px-3 py-2.5 rounded-lg border border-foreground/10 bg-foreground/[0.03]">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-[11px] text-foreground/80 line-clamp-1">{idx + 1}. {item.text}</p>
                                                <span className="text-[10px] text-foreground/45 shrink-0">{formatTimeAgo(item.timestamp)}</span>
                                            </div>
                                            <p className="mt-1 text-[10px] text-foreground/45 line-clamp-1">All set! Tracking latest changes.</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </aside>

                        <div className="min-w-0 min-h-0 flex flex-col border-r border-foreground/[0.08] xl:border-r bg-[#121213]">
                            <div className="px-5 py-3 border-b border-foreground/[0.08] bg-[#151516]">
                                <p className="text-[11px] text-foreground/45">Current session</p>
                            </div>

                            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                                <div
                                    ref={chatContainerRef}
                                    className="flex-1 min-h-0 overflow-y-auto px-4 py-4 md:px-6 md:py-5 scroll-smooth scrollbar-hide"
                                    style={{ scrollbarWidth: "none" }}
                                >
                                    <div className="mx-auto w-full max-w-[720px] space-y-6">
                                        <AnimatePresence mode="popLayout" initial={false}>
                                            {messages.map((msg) => (
                                                <motion.div
                                                    key={msg.id}
                                                    animate={{ opacity: 1, x: 0, y: 0 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className={cn("flex w-full group", msg.type === "user" ? "justify-end" : "justify-start")}
                                                >
                                                    <div
                                                        className={cn(
                                                            "max-w-[92%] md:max-w-[82%] px-5 py-4 text-sm relative",
                                                            msg.type === "bot"
                                                                ? "bg-foreground/5 border border-foreground/10 rounded-2xl rounded-tl-none font-sans text-foreground/90 shadow-sm"
                                                                : "bg-primary text-primary-foreground rounded-2xl rounded-tr-none font-sans font-medium shadow-lg shadow-primary/20"
                                                        )}
                                                    >
                                                        <div className="relative z-10" onClick={handleMessageContentClick}>
                                                            {formatMessage(msg.text)}
                                                            {msg.projects && msg.projects.length > 0 && (
                                                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4">
                                                                    {msg.projects.map((project, idx) => (
                                                                        <ChatProjectCard key={project.title} project={project} index={idx} onOpenInPreview={openInPreview} />
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span
                                                            className={cn(
                                                                "absolute -bottom-5 text-[10px] opacity-0 group-hover:opacity-50 transition-opacity whitespace-nowrap",
                                                                msg.type === "user" ? "right-0" : "left-0"
                                                            )}
                                                        >
                                                            {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>

                                        {isTyping && (
                                            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-start">
                                                <div className="bg-foreground/5 border border-foreground/10 rounded-2xl rounded-tl-none px-4 py-2">
                                                    <TypingIndicator />
                                                </div>
                                            </motion.div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>

                                <div className="p-3 md:p-4 border-t border-foreground/[0.08] bg-transparent space-y-3 shrink-0">
                                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1" style={{ scrollbarWidth: "none" }}>
                                        {persona.suggestedQuestions.map((q) => (
                                            <button
                                                key={q.id}
                                                onClick={() => handleQuestion(q.id, q.label)}
                                                disabled={isTyping}
                                                className={cn(
                                                    "px-2.5 py-1 rounded-full text-[8px] md:text-[9px] font-semibold uppercase tracking-wide transition-all duration-300 disabled:opacity-50 flex items-center gap-1 whitespace-nowrap shrink-0",
                                                    q.id === "projects"
                                                        ? "bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                                                        : "bg-foreground/5 border border-foreground/10 text-foreground/60 hover:text-foreground hover:bg-foreground/10"
                                                )}
                                            >
                                                {q.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleCustomInput()}
                                            placeholder="make a landing page based on attached docs"
                                            disabled={isTyping}
                                            className="w-full bg-background/60 border border-foreground/10 rounded-xl px-4 py-2.5 text-xs md:text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-primary/40 disabled:opacity-50"
                                        />
                                        <button
                                            onClick={handleCustomInput}
                                            disabled={isTyping || !inputValue.trim()}
                                            className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground transition-all disabled:opacity-50"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="xl:hidden mt-1 rounded-lg border border-foreground/10 bg-[#111112] p-2 space-y-2">
                                        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                                            {showcaseItems.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => selectShowcase(item)}
                                                    className={cn(
                                                        "px-2 py-1 text-[10px] rounded-md border transition-colors whitespace-nowrap",
                                                        activeShowcase === item.id
                                                            ? "border-primary/40 bg-primary/10 text-primary"
                                                            : "border-foreground/15 bg-foreground/5 text-foreground/60 hover:text-foreground"
                                                    )}
                                                >
                                                    {item.title}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="h-9 border border-foreground/[0.08] rounded-md px-2 flex items-center gap-1.5 bg-[#1a1c20]">
                                            <button onClick={handleBrowserBack} disabled={browserHistoryIndex <= 0} className="text-[10px] px-1.5 py-1 rounded border border-foreground/15 text-foreground/60 disabled:opacity-40">←</button>
                                            <button onClick={handleBrowserForward} disabled={browserHistoryIndex >= browserHistory.length - 1} className="text-[10px] px-1.5 py-1 rounded border border-foreground/15 text-foreground/60 disabled:opacity-40">→</button>
                                            <button onClick={handleBrowserReload} className="text-[10px] px-1.5 py-1 rounded border border-foreground/15 text-foreground/60">↻</button>
                                            <button onClick={() => navigateBrowserTo("/work", "Project Showcase", true)} className="text-[10px] px-1.5 py-1 rounded border border-foreground/15 text-foreground/60"><House className="w-3 h-3" /></button>
                                            <button onClick={handleBrowserThemeToggle} className="text-[10px] px-1.5 py-1 rounded border border-foreground/15 text-foreground/60">{browserDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}</button>
                                            <input
                                                value={browserAddress}
                                                onChange={(e) => setBrowserAddress(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleBrowserGo()}
                                                className="flex-1 min-w-0 rounded-md border border-foreground/15 bg-black/25 px-2 py-1 text-[10px] text-foreground/70 outline-none"
                                            />
                                            <button onClick={handleBrowserGo} className="text-[10px] px-2 py-1 rounded border border-primary/30 bg-primary/10 text-primary"><Search className="w-3 h-3" /></button>
                                        </div>
                                        <div className="h-40 rounded-md overflow-hidden border border-foreground/10 bg-black/25">
                                            <iframe
                                                ref={browserIframeRef}
                                                key={`mobile-${iframeReloadKey}`}
                                                title={previewTitle}
                                                src={previewUrl}
                                                onLoad={handleBrowserIframeLoad}
                                                onError={handleBrowserIframeError}
                                                className="w-full h-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <aside className="hidden xl:flex flex-col bg-[#101011] border-l border-foreground/[0.08] relative">
                            <div
                                onMouseDown={handleRightPanelResizeStart}
                                className={cn(
                                    "absolute left-0 top-0 h-full w-1.5 -translate-x-1/2 cursor-col-resize transition-colors",
                                    isResizingRightPanel ? "bg-primary/40" : "bg-transparent hover:bg-primary/25"
                                )}
                            />
                            <div className="h-10 border-b border-foreground/[0.08] flex items-center px-3 gap-1.5 bg-[#151516]">
                                {showcaseItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => selectShowcase(item)}
                                        className={cn(
                                            "px-2.5 py-1 text-[10px] rounded-md border transition-colors",
                                            activeShowcase === item.id
                                                ? "border-primary/40 bg-primary/10 text-primary"
                                                : "border-foreground/15 bg-foreground/5 text-foreground/60 hover:text-foreground"
                                        )}
                                    >
                                        {item.title}
                                    </button>
                                ))}
                            </div>

                            <div className="h-9 border-b border-foreground/[0.08] px-2 flex items-center gap-2 bg-[#1a1c20]">
                                <span className="h-2 w-2 rounded-full bg-foreground/35" />
                                <span className="h-2 w-2 rounded-full bg-foreground/35" />
                                <span className="h-2 w-2 rounded-full bg-foreground/35" />

                                <button
                                    onClick={handleBrowserBack}
                                    disabled={browserHistoryIndex <= 0}
                                    className="text-[10px] px-1.5 py-1 rounded border border-foreground/15 text-foreground/60 disabled:opacity-40"
                                >
                                    ←
                                </button>
                                <button
                                    onClick={handleBrowserForward}
                                    disabled={browserHistoryIndex >= browserHistory.length - 1}
                                    className="text-[10px] px-1.5 py-1 rounded border border-foreground/15 text-foreground/60 disabled:opacity-40"
                                >
                                    →
                                </button>
                                <button
                                    onClick={handleBrowserReload}
                                    className="text-[10px] px-1.5 py-1 rounded border border-foreground/15 text-foreground/60"
                                >
                                    ↻
                                </button>
                                <button
                                    onClick={() => navigateBrowserTo("/work", "Project Showcase", true)}
                                    className="text-[10px] px-1.5 py-1 rounded border border-foreground/15 text-foreground/60"
                                >
                                    <House className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={handleBrowserThemeToggle}
                                    className="text-[10px] px-1.5 py-1 rounded border border-foreground/15 text-foreground/60"
                                >
                                    {browserDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                                </button>

                                <input
                                    value={browserAddress}
                                    onChange={(e) => setBrowserAddress(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleBrowserGo()}
                                    className="ml-1 flex-1 rounded-md border border-foreground/15 bg-black/25 px-2.5 py-1 text-[10px] text-foreground/70 outline-none"
                                />
                                <button
                                    onClick={handleBrowserGo}
                                    className="text-[10px] px-2 py-1 rounded border border-primary/30 bg-primary/10 text-primary"
                                >
                                    <Search className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="flex-1 min-h-0 bg-[#111112]">
                                <iframe
                                    ref={browserIframeRef}
                                    key={iframeReloadKey}
                                    title={previewTitle}
                                    src={previewUrl}
                                    onLoad={handleBrowserIframeLoad}
                                    onError={handleBrowserIframeError}
                                    className="w-full h-full"
                                />
                            </div>
                        </aside>
                        </div>
                    </div>
                ) : (
                    <>
                        <div
                            ref={chatContainerRef}
                            className="overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-hide h-[400px]"
                            style={{ scrollbarWidth: "none" }}
                        >
                            <AnimatePresence mode="popLayout" initial={false}>
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        animate={{ opacity: 1, x: 0, y: 0 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className={cn("flex w-full group", msg.type === "user" ? "justify-end" : "justify-start")}
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
                                                {msg.projects && msg.projects.length > 0 && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                                        {msg.projects.map((project, idx) => (
                                                            <ChatProjectCard key={project.title} project={project} index={idx} />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <span
                                                className={cn(
                                                    "absolute -bottom-5 text-[10px] opacity-0 group-hover:opacity-50 transition-opacity whitespace-nowrap",
                                                    msg.type === "user" ? "right-0" : "left-0"
                                                )}
                                            >
                                                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isTyping && (
                                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-start">
                                    <div className="bg-foreground/5 border border-foreground/10 rounded-2xl rounded-tl-none px-4 py-2">
                                        <TypingIndicator />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-3 md:p-6 bg-gradient-to-b from-transparent to-foreground/[0.02] border-t border-foreground/[0.08] space-y-3 md:space-y-5">
                            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1 md:flex-wrap md:justify-center md:overflow-visible" style={{ scrollbarWidth: "none" }}>
                                {persona.suggestedQuestions.map((q) => (
                                    <button
                                        key={q.id}
                                        onClick={() => handleQuestion(q.id, q.label)}
                                        disabled={isTyping}
                                        className={cn(
                                            "px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-semibold uppercase tracking-wide transition-all duration-300 disabled:opacity-50 flex items-center gap-1 whitespace-nowrap shrink-0",
                                            q.id === "projects"
                                                ? "bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 shadow-sm shadow-primary/5"
                                                : "bg-foreground/5 border border-foreground/10 text-foreground/60 hover:text-foreground hover:bg-foreground/10 hover:border-foreground/20"
                                        )}
                                    >
                                        {q.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="relative flex-1 group">
                                    <div className="absolute -inset-px bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleCustomInput()}
                                        placeholder="Message Neural Interface..."
                                        disabled={isTyping}
                                        className="relative w-full bg-background/60 border border-foreground/10 rounded-full px-4 py-2.5 md:px-6 md:py-3 text-xs md:text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-all disabled:opacity-50 backdrop-blur-md"
                                    />
                                </div>
                                <button
                                    onClick={handleCustomInput}
                                    disabled={isTyping || !inputValue.trim()}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-primary/30 shrink-0"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};
