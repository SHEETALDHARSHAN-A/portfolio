"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scan, 
  Zap, 
  AlertCircle, 
  Code2, 
  Camera, 
  Brain, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  Play, 
  Pause,
  Cpu,
  Calculator,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types for our content states
type ScreenshotType = 'coding' | 'aptitude';
type LiveType = 'behavioral' | 'coding';

export const CelatoScanner = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [mode, setMode] = useState<'screenshot' | 'live'>('screenshot');
  const [screenshotType, setScreenshotType] = useState<ScreenshotType>('coding');
  const [liveType, setLiveType] = useState<LiveType>('coding');
  const [isAutoScanning, setIsAutoScanning] = useState(false);
  
  const ref = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Handle Mouse Movement (Desktop)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAutoScanning || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  // Handle Touch Movement (Mobile)
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isAutoScanning || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const touch = e.touches[0];
    setPosition({ x: touch.clientX - rect.left, y: touch.clientY - rect.top - 50 });
    setOpacity(1);
  };

  // Auto-Scan Animation Logic
  useEffect(() => {
    if (isAutoScanning && ref.current) {
      setOpacity(1);
      let startTime = Date.now();
      
      const animate = () => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        
        const time = Date.now() - startTime;
        const x = (rect.width / 2) + (rect.width / 3) * Math.sin(time * 0.002);
        const y = (rect.height / 2) + (rect.height / 4) * Math.cos(time * 0.003) * Math.sin(time * 0.001);
        
        setPosition({ x, y });
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAutoScanning]);

  return (
    <div className="py-12 md:py-24 px-4 md:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">See What Celato AI Sees</h2>
        <p className="text-text-muted mb-8 text-sm md:text-base">
          Hover, drag, or auto-scan to reveal the hidden AI layer.
        </p>
        
        {/* Main Mode Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <div className="inline-flex bg-surface border border-white/10 rounded-lg p-1">
            <button 
              onClick={() => setMode('screenshot')}
              className={cn(
                "px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-all flex items-center gap-2",
                mode === 'screenshot' ? "bg-white/10 text-white shadow-sm" : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <Camera className="w-4 h-4" /> Screenshot Mode
            </button>
            <button 
              onClick={() => setMode('live')}
              className={cn(
                "px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-all flex items-center gap-2",
                mode === 'live' ? "bg-white/10 text-white shadow-sm" : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <Activity className="w-4 h-4" /> Live Mode
            </button>
          </div>

          <button
            onClick={() => setIsAutoScanning(!isAutoScanning)}
            className={cn(
              "px-4 py-2 rounded-lg text-xs md:text-sm font-bold border flex items-center gap-2 transition-all",
              isAutoScanning 
                ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]" 
                : "bg-surface text-text-muted border-white/10 hover:border-primary/50"
            )}
          >
            {isAutoScanning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAutoScanning ? "Stop Scan" : "Auto Scan"}
          </button>
        </div>

        {/* Sub-Mode Toggles */}
        <div className="flex justify-center gap-4">
            {mode === 'screenshot' ? (
                <div className="flex gap-2 bg-black/20 p-1 rounded-full">
                    <button 
                        onClick={() => setScreenshotType('coding')}
                        className={cn("px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1", screenshotType === 'coding' ? "bg-primary/20 text-primary border border-primary/20" : "text-gray-500 hover:text-gray-300")}
                    >
                        <Code2 className="w-3 h-3"/> Coding
                    </button>
                    <button 
                        onClick={() => setScreenshotType('aptitude')}
                        className={cn("px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1", screenshotType === 'aptitude' ? "bg-primary/20 text-primary border border-primary/20" : "text-gray-500 hover:text-gray-300")}
                    >
                        <Calculator className="w-3 h-3"/> Aptitude
                    </button>
                </div>
            ) : (
                <div className="flex gap-2 bg-black/20 p-1 rounded-full">
                    <button 
                        onClick={() => setLiveType('coding')}
                        className={cn("px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1", liveType === 'coding' ? "bg-primary/20 text-primary border border-primary/20" : "text-gray-500 hover:text-gray-300")}
                    >
                        <Terminal className="w-3 h-3"/> Tech Question
                    </button>
                    <button 
                        onClick={() => setLiveType('behavioral')}
                        className={cn("px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1", liveType === 'behavioral' ? "bg-primary/20 text-primary border border-primary/20" : "text-gray-500 hover:text-gray-300")}
                    >
                        <MessageSquare className="w-3 h-3"/> Behavioral
                    </button>
                </div>
            )}
        </div>
      </div>

      <div 
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => !isAutoScanning && setOpacity(0)}
        onTouchStart={handleTouchMove}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => !isAutoScanning && setOpacity(0)}
        className="relative min-h-[550px] md:min-h-[500px] h-auto w-full bg-surface border border-white/10 rounded-xl overflow-hidden cursor-crosshair shadow-2xl transition-all duration-500 touch-none"
      >
        {/* Content Container (The "Visible" Layer) */}
        <AnimatePresence mode="wait">
          {mode === 'screenshot' ? (
            <motion.div
              key={screenshotType}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {screenshotType === 'coding' ? <CodingView /> : <AptitudeView />}
            </motion.div>
          ) : (
            <motion.div
              key={liveType}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
               {liveType === 'coding' ? <LiveTechView /> : <LiveBehavioralView />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Magic Lens Layer (The "X-Ray" Layer) */}
        <motion.div 
          className="absolute inset-0 bg-[#0f172a] pointer-events-none"
          style={{
            maskImage: `radial-gradient(circle 200px at ${position.x}px ${position.y}px, black, transparent)`,
            WebkitMaskImage: `radial-gradient(circle 200px at ${position.x}px ${position.y}px, black, transparent)`,
            opacity: opacity
          }}
        >
           {mode === 'screenshot' 
              ? (screenshotType === 'coding' ? <CodingOverlay /> : <AptitudeOverlay />)
              : (liveType === 'coding' ? <LiveTechOverlay /> : <LiveBehavioralOverlay />)
           }
        </motion.div>

        {/* Lens Ring UI */}
        <div 
          className="absolute pointer-events-none border border-primary/50 rounded-full shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-opacity duration-300"
          style={{
            left: position.x - 100,
            top: position.y - 100,
            width: 200,
            height: 200,
            opacity: opacity,
            background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)'
          }}
        >
          {/* Crosshairs */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary/30"/>
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-primary/30"/>
          
          {/* Status Label near cursor */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-bold px-2 rounded-full opacity-80 whitespace-nowrap">
            {mode === 'screenshot' ? 'ANALYZING...' : 'LISTENING...'}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SCENARIO 1: CODING SCREENSHOT
// ==========================================

const CodingView = () => (
  <div className="absolute inset-0 p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8 overflow-y-auto">
    <div className="w-full md:w-1/2 bg-[#09090b] border border-white/5 rounded-lg p-4 md:p-6 relative group min-h-[250px]">
      <div className="absolute top-2 right-2 bg-white/10 px-2 py-1 rounded text-[10px] text-gray-400">LeetCode</div>
      <h3 className="text-lg md:text-xl font-bold text-white mb-4">Longest Substring Without Repeating...</h3>
      <p className="text-text-muted mb-4 text-xs md:text-sm leading-relaxed">
        Given a string <code>s</code>, find the length of the longest substring without repeating characters.
      </p>
      <div className="bg-white/5 p-3 rounded mb-4 border border-white/5">
        <code className="text-xs md:text-sm text-gray-300 block mb-2">Input: s = "abcabcbb"</code>
        <code className="text-xs md:text-sm text-gray-300 block">Output: 3</code>
      </div>
    </div>
    
    <div className="w-full md:w-1/2 bg-[#09090b] border border-white/5 rounded-lg p-4 md:p-6 font-mono text-xs md:text-sm text-gray-500 relative min-h-[200px]">
      <div className="flex gap-2 mb-4 opacity-50">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <p className="text-purple-400">class <span className="text-yellow-200">Solution</span>:</p>
      <p className="pl-4">def <span className="text-blue-400">lengthOfLongestSubstring</span>(self, s):</p>
      <p className="pl-8 text-gray-600"># TODO: Implement sliding window</p>
      <p className="pl-8 text-white animate-pulse">|</p>
    </div>
  </div>
);

const CodingOverlay = () => (
  <div className="absolute inset-0 p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8">
    <div className="w-full md:w-1/2 p-2 relative">
      <div className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-lg"></div>
      <div className="absolute -top-3 left-4 bg-primary text-black text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
        <Scan className="w-3 h-3"/> Problem Parsed
      </div>
      <div className="absolute bottom-4 left-4 right-4 bg-primary/10 backdrop-blur-md border border-primary/50 p-3 rounded-lg text-primary-foreground shadow-2xl">
        <div className="flex items-center gap-2 mb-2 font-bold text-primary text-xs">
          <Brain className="w-4 h-4" /> Strategy: Sliding Window
        </div>
        <p className="text-[10px] md:text-xs text-gray-300">
          Use a set to store characters in the current window. Expand right, contract left if duplicate found.
        </p>
      </div>
    </div>

    <div className="w-full md:w-1/2 p-2 relative">
      <div className="absolute top-10 left-4 bg-green-500/10 border border-green-500 text-green-400 p-3 rounded-lg backdrop-blur-md w-[90%] shadow-2xl">
        <div className="flex items-center gap-2 font-bold text-xs mb-2 border-b border-green-500/30 pb-1">
          <Code2 className="w-4 h-4" /> Code Generated
        </div>
        <div className="font-mono text-[10px] md:text-xs space-y-1 text-gray-300">
           <p>charSet = set()</p>
           <p>l = 0</p>
           <p><span className="text-purple-400">for</span> r <span className="text-purple-400">in</span> range(len(s)):</p>
           <p className="pl-4"><span className="text-purple-400">while</span> s[r] <span className="text-purple-400">in</span> charSet:</p>
           <p className="pl-8">charSet.remove(s[l])</p>
           <p className="pl-8">l += 1</p>
           <p className="pl-4">charSet.add(s[r])</p>
           <p className="pl-4">res = max(res, r - l + 1)</p>
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// SCENARIO 2: APTITUDE SCREENSHOT
// ==========================================

const AptitudeView = () => (
    <div className="absolute inset-0 p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8 overflow-y-auto">
      <div className="w-full md:w-1/2 bg-[#09090b] border border-white/5 rounded-lg p-4 md:p-6 relative group min-h-[250px]">
        <div className="absolute top-2 right-2 bg-white/10 px-2 py-1 rounded text-[10px] text-gray-400">Aptitude Test</div>
        <h3 className="text-lg md:text-xl font-bold text-white mb-4">Logical Reasoning</h3>
        <p className="text-text-muted mb-4 text-xs md:text-sm leading-relaxed">
          Q: A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?
        </p>
        <div className="space-y-2 mt-4">
          {['120 metres', '180 metres', '324 metres', '150 metres'].map((opt, i) => (
            <div key={i} className="flex items-center gap-3 p-2 border border-white/10 rounded hover:bg-white/5">
              <div className="w-4 h-4 rounded-full border border-gray-500"></div>
              <span className="text-xs text-gray-300">{opt}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-1/2 bg-[#09090b] border border-white/5 rounded-lg p-4 md:p-6 font-mono text-xs md:text-sm text-gray-500 flex items-center justify-center">
        <p className="text-center opacity-50">Waiting for user input...</p>
      </div>
    </div>
);

const AptitudeOverlay = () => (
    <div className="absolute inset-0 p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8">
      <div className="w-full md:w-1/2 p-2 relative">
        <div className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-lg"></div>
        <div className="absolute -top-3 left-4 bg-primary text-black text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
          <Scan className="w-3 h-3"/> Question Identified
        </div>
        <div className="absolute bottom-4 left-4 right-4 bg-primary/10 backdrop-blur-md border border-primary/50 p-3 rounded-lg text-primary-foreground shadow-2xl">
          <div className="flex items-center gap-2 mb-2 font-bold text-primary text-xs">
            <Brain className="w-4 h-4" /> Reasoning
          </div>
          <p className="text-[10px] md:text-xs text-gray-300">
            Speed = 60 km/hr = 60 * (5/18) m/sec = 50/3 m/sec.<br/>
            Time = 9 sec.<br/>
            Length = Speed * Time = (50/3) * 9 = 150 meters.
          </p>
        </div>
      </div>
  
      <div className="w-full md:w-1/2 p-2 relative">
        <div className="absolute top-10 left-4 bg-green-500/10 border border-green-500 text-green-400 p-3 rounded-lg backdrop-blur-md w-[90%] shadow-2xl">
          <div className="flex items-center gap-2 font-bold text-xs mb-2 border-b border-green-500/30 pb-1">
            <CheckCircle2 className="w-4 h-4" /> Correct Answer
          </div>
          <div className="font-mono text-lg font-bold text-white">Option D: 150 metres</div>
        </div>
      </div>
    </div>
);

// ==========================================
// SCENARIO 3: LIVE TECH QUESTION
// ==========================================

const LiveTechView = () => (
    <div className="absolute inset-0 bg-[#09090b] font-mono text-xs md:text-sm p-4 md:p-8 flex flex-col">
      <div className="flex gap-2 mb-4 md:mb-6 border-b border-white/5 pb-4 items-center">
        <Terminal className="w-4 h-4 text-gray-500" />
        <span className="text-gray-500">Live Transcription</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-red-500 text-[10px]">REC</span>
        </div>
      </div>
      <div className="space-y-4 flex-1 relative">
         <p className="text-gray-500 italic text-[10px] mb-4">Listening to system audio...</p>
         <div className="flex gap-3">
           <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px]">I</div>
           <p className="text-gray-300">"Could you write a function to check if a number is a palindrome without converting it to a string?"</p>
         </div>
      </div>
    </div>
);

const LiveTechOverlay = () => (
    <div className="absolute inset-0 p-4 md:p-8">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm">
        <div className="bg-primary/10 border border-primary text-primary p-4 rounded-xl backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-2 mb-3 font-bold border-b border-primary/20 pb-2">
            <Cpu className="w-4 h-4" /> Live Coding Solution
          </div>
          <div className="font-mono text-[10px] text-gray-300 space-y-1 bg-black/40 p-2 rounded">
            <p>def isPalindrome(x):</p>
            <p className="pl-4">if x &lt; 0: return False</p>
            <p className="pl-4">rev, temp = 0, x</p>
            <p className="pl-4">while temp:</p>
            <p className="pl-8">rev = rev * 10 + temp % 10</p>
            <p className="pl-8">temp //= 10</p>
            <p className="pl-4">return rev == x</p>
          </div>
        </div>
      </div>
    </div>
);

// ==========================================
// SCENARIO 4: LIVE BEHAVIORAL QUESTION
// ==========================================

const LiveBehavioralView = () => (
  <div className="absolute inset-0 bg-[#09090b] font-mono text-xs md:text-sm p-4 md:p-8 flex flex-col">
    <div className="flex gap-2 mb-4 md:mb-6 border-b border-white/5 pb-4 items-center">
      <Terminal className="w-4 h-4 text-gray-500" />
      <span className="text-gray-500">Live Transcription</span>
      <div className="ml-auto flex items-center gap-2">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        <span className="text-red-500 text-[10px]">REC</span>
      </div>
    </div>
    
    <div className="space-y-4 flex-1 relative">
       <p className="text-gray-500 italic text-[10px] mb-4">Listening to system audio...</p>
       <div className="flex gap-3">
         <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px]">I</div>
         <p className="text-gray-300">"Tell me about a time you handled a conflict in a team setting."</p>
       </div>
    </div>
  </div>
);

const LiveBehavioralOverlay = () => (
  <div className="absolute inset-0 p-4 md:p-8">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm">
      <div className="bg-primary/10 border border-primary text-primary p-4 rounded-xl backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-2 mb-3 font-bold border-b border-primary/20 pb-2">
          <Zap className="w-4 h-4" /> Behavioral Hint (STAR Method)
        </div>
        <div className="space-y-2 text-xs text-gray-300">
          <p><strong className="text-white">Situation:</strong> Define the context/conflict briefly.</p>
          <p><strong className="text-white">Task:</strong> What was your specific goal?</p>
          <p><strong className="text-white">Action:</strong> Focus on "I" (what YOU did), not "We".</p>
          <p><strong className="text-white">Result:</strong> Quantify the positive outcome.</p>
        </div>
      </div>
    </div>
  </div>
);