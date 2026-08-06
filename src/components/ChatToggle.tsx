"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useChatContext } from "../context/ChatContext";
import { Sparkles, Bot } from "lucide-react";

type Corner = "bottom-right" | "bottom-left" | "top-right" | "top-left";

const STORAGE_KEY = "maxthenicsChatCorner";
const BTN_SIZE = 64;
const GAP = 20;

function cornerStyles(corner: Corner): React.CSSProperties {
  switch (corner) {
    case "bottom-right":
      return { bottom: GAP, right: GAP, top: "auto", left: "auto" };
    case "bottom-left":
      return { bottom: GAP, left: GAP, top: "auto", right: "auto" };
    case "top-right":
      return { top: GAP, right: GAP, bottom: "auto", left: "auto" };
    case "top-left":
      return { top: GAP, left: GAP, bottom: "auto", right: "auto" };
  }
}

function snapCorner(x: number, y: number, w: number, h: number): Corner {
  const corners: { corner: Corner; cx: number; cy: number }[] = [
    { corner: "bottom-right", cx: w - BTN_SIZE / 2 - GAP, cy: h - BTN_SIZE / 2 - GAP },
    { corner: "bottom-left", cx: BTN_SIZE / 2 + GAP, cy: h - BTN_SIZE / 2 - GAP },
    { corner: "top-right", cx: w - BTN_SIZE / 2 - GAP, cy: BTN_SIZE / 2 + GAP },
    { corner: "top-left", cx: BTN_SIZE / 2 + GAP, cy: BTN_SIZE / 2 + GAP },
  ];
  let best = corners[0];
  let bestDist = Infinity;
  for (const c of corners) {
    const d = (x - c.cx) ** 2 + (y - c.cy) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best.corner;
}

// Section-aware interactive assistant messages
const SECTION_MESSAGES: Record<string, string[]> = {
  "how-it-works": [
    "Ecco come funziona il protocollo! ⚙️",
    "Passa con il mouse sulle card! 👆",
    "Scopri l'integrazione con l'AI 🤖"
  ],
  "programs": [
    "Sblocca Planche & Front Lever! 🔥",
    "Trova il programma perfetto per te 💪",
    "Protocolli basati sulla scienza 🧬"
  ],
  "pricing": [
    "Scegli il piano ideale per i tuoi goals! ⚡",
    "Investi nella tua evoluzione 🏆"
  ],
  "coaching": [
    "Coaching 1:1 d'Élite dedicato! 👑",
    "Vuoi un coach sempre al tuo fianco? 🚀"
  ],
  "about": [
    "Maxthenics è più di una scheda! 💡",
    "Algoritmo proprietario adattivo 🧠"
  ],
  "default": [
    "Ciao! Sono Sthenox AI, il tuo Coach! 👋",
    "Come posso aiutarti oggi? 🤖",
    "Hai domande sul tuo allenamento? 💪",
    "Sono qui per guidare la tua forza! ⚡"
  ]
};

interface FaceProps {
  isOpen: boolean;
  isHovered: boolean;
  isDragging: boolean;
  isScrolling: boolean;
}

function MinimalFace({ isOpen, isHovered, isDragging, isScrolling }: FaceProps) {
  const [blink, setBlink] = useState(false);
  const [mouthPhase, setMouthPhase] = useState(0);

  // Random blink loop
  useEffect(() => {
    const triggerBlink = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 130);
    };

    const interval = setInterval(() => {
      triggerBlink();
      if (Math.random() > 0.7) {
        setTimeout(triggerBlink, 220);
      }
    }, 3000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  // Talking mouth animation loop when chat is open
  useEffect(() => {
    if (!isOpen) {
      setMouthPhase(0);
      return;
    }
    const interval = setInterval(() => {
      setMouthPhase((prev) => (prev + 1) % 5);
    }, 180);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Pure white talking mouth paths
  const talkPaths = [
    "M 3 2 Q 10 8 17 2",
    "M 3 2 Q 10 11 17 2 M 6 6 Q 10 9 14 6",
    "M 3 2 Q 10 5 17 2",
    "M 3 2 Q 10 12 17 2",
    "M 3 2 Q 10 7 17 2",
  ];

  const getMouthD = () => {
    if (isDragging) return "M 6 3 Q 10 10 14 3 Q 10 1 6 3";
    if (isOpen) return talkPaths[mouthPhase];
    if (isHovered) return "M 2 1 Q 10 11 18 1";
    if (isScrolling) return "M 4 2 Q 10 8 16 2";
    return "M 4 2 Q 10 7 16 2";
  };

  const headRotation = isDragging ? 8 : isHovered ? -5 : isScrolling ? 3 : 0;

  return (
    <motion.div
      animate={{
        scale: isHovered ? 1.1 : isDragging ? 0.95 : 1,
        rotate: headRotation,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex flex-col items-center justify-center relative select-none"
      style={{ gap: 4 }}
    >
      {/* Pure White Eyes */}
      <div className="flex items-center justify-center gap-[10px] relative z-10">
        {/* Left Eye */}
        <div className="relative w-3.5 h-3.5 flex items-center justify-center">
          {isOpen || isHovered ? (
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M 2 8 Q 7 1 12 8" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
          ) : blink ? (
            <div className="w-3.5 h-0.5 bg-white rounded-full" />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
          )}
        </div>

        {/* Right Eye */}
        <div className="relative w-3.5 h-3.5 flex items-center justify-center">
          {isOpen || isHovered ? (
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M 2 8 Q 7 1 12 8" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
          ) : blink ? (
            <div className="w-3.5 h-0.5 bg-white rounded-full" />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
          )}
        </div>
      </div>

      {/* Pure White Mouth */}
      <div className="relative z-10">
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none" className="overflow-visible">
          <path
            d={getMouthD()}
            stroke="white"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill={isDragging ? "white" : "none"}
            className="transition-all duration-100"
          />
        </svg>
      </div>
    </motion.div>
  );
}

export default function ChatToggle() {
  const { isChatOpen, setIsChatOpen, chatCorner: corner, setChatCorner: setCorner } = useChatContext();
  const [dragging, setDragging] = useState(false);
  const [snapping, setSnapping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isScrolling, setIsScrolling] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [previewMsg, setPreviewMsg] = useState("");
  const [activeSection, setActiveSection] = useState<string>("default");

  const btnRef = useRef<HTMLButtonElement>(null);
  const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });
  const hasMoved = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll detection & Page Section awareness
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => setIsScrolling(false), 200);

      const sections = ["how-it-works", "programs", "pricing", "coaching", "about"];
      let found = "default";

      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.6 && rect.bottom >= window.innerHeight * 0.2) {
            found = sec;
            break;
          }
        }
      }
      setActiveSection(found);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  // Proactive Speech Bubble scheduler
  useEffect(() => {
    if (isChatOpen || dragging) {
      setShowPreview(false);
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
      return;
    }

    const triggerBubble = () => {
      const messages = SECTION_MESSAGES[activeSection] || SECTION_MESSAGES["default"];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setPreviewMsg(randomMsg);
      setShowPreview(true);

      setTimeout(() => setShowPreview(false), 4500);
    };

    const timer = setTimeout(() => {
      triggerBubble();
      previewTimerRef.current = setInterval(triggerBubble, 12000 + Math.random() * 8000);
    }, 4000);

    return () => {
      clearTimeout(timer);
      if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    };
  }, [isChatOpen, dragging, activeSection]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    hasMoved.current = false;
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: dragOffset.x, oy: dragOffset.y };
    setDragging(true);
  }, [dragOffset]);

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - dragStart.current.mx);
      const dy = Math.abs(e.clientY - dragStart.current.my);
      if (dx > 4 || dy > 4) hasMoved.current = true;
      setDragOffset({
        x: dragStart.current.ox + (e.clientX - dragStart.current.mx),
        y: dragStart.current.oy + (e.clientY - dragStart.current.my),
      });
    };

    const handleUp = () => {
      setDragging(false);
      if (hasMoved.current) {
        const rect = btnRef.current?.getBoundingClientRect();
        if (rect) {
          const cx = rect.left + BTN_SIZE / 2;
          const cy = rect.top + BTN_SIZE / 2;
          const newCorner = snapCorner(cx, cy, window.innerWidth, window.innerHeight);

          setSnapping(true);
          setDragOffset({ x: 0, y: 0 });
          setCorner(newCorner);
          requestAnimationFrame(() => requestAnimationFrame(() => setSnapping(false)));
        }
      } else {
        setIsChatOpen((s: boolean) => !s);
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragging, setIsChatOpen, corner, setCorner]);

  const pathname = usePathname();
  const authPaths = ['/login', '/register'];

  const isCornerBottom = corner.startsWith("bottom");
  const isCornerRight = corner.endsWith("right");

  if (authPaths.includes(pathname)) return null;

  return (
    <>
      {/* Interactive Speech Bubble */}
      <AnimatePresence>
        {showPreview && !isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: isCornerBottom ? 10 : -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isCornerBottom ? 10 : -10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed z-50 cursor-pointer select-none"
            onClick={() => setIsChatOpen(true)}
            style={{
              [isCornerBottom ? "bottom" : "top"]: GAP + BTN_SIZE + 8,
              [isCornerRight ? "right" : "left"]: GAP,
            }}
          >
            <div className="relative bg-zinc-950/95 border border-red-500/30 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-2.5 max-w-[260px] group hover:border-red-500/60 transition-colors">
              <div className="p-1.5 rounded-xl bg-red-500/20 text-red-500 shrink-0 group-hover:scale-110 transition-transform">
                <Bot size={16} />
              </div>
              <span className="leading-snug text-zinc-100">{previewMsg}</span>
              <Sparkles size={14} className="text-red-500 shrink-0 animate-pulse" />

              {/* Tail Arrow Pointer */}
              <div
                className={`absolute w-3 h-3 bg-zinc-950 border-r border-b border-red-500/30 rotate-45 ${
                  isCornerBottom ? "-bottom-1.5" : "-top-1.5"
                } ${isCornerRight ? "right-6" : "left-6"}`}
                style={{
                  borderRight: isCornerBottom ? undefined : "none",
                  borderBottom: isCornerBottom ? undefined : "none",
                  borderLeft: isCornerBottom ? undefined : "1px solid rgba(239, 68, 68, 0.3)",
                  borderTop: isCornerBottom ? undefined : "1px solid rgba(239, 68, 68, 0.3)",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Reactive AI Assistant Button */}
      <motion.button
        ref={btnRef}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed z-50 text-white rounded-3xl shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950`}
        style={{
          width: BTN_SIZE,
          height: BTN_SIZE,
          ...cornerStyles(corner),
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
          transition: dragging || snapping
            ? "none"
            : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s",
          background: "linear-gradient(135deg, #dc2626, #ef4444, #f97316)",
          boxShadow: isChatOpen || isHovered
            ? "0 0 35px rgba(239,68,68,0.6), 0 10px 40px rgba(0,0,0,0.5)"
            : "0 0 22px rgba(239,68,68,0.35), 0 8px 30px rgba(0,0,0,0.4)",
        }}
        aria-label={isChatOpen ? "Chiudi chat" : "Apri chat con Sthenox AI"}
      >
        {/* Ambient Pulsing Aura */}
        <span
          className={`absolute -inset-1 rounded-3xl bg-gradient-to-r from-red-600 via-orange-500 to-red-600 blur-md opacity-40 transition-opacity duration-300 ${
            isHovered || isChatOpen ? "opacity-90 animate-pulse" : ""
          }`}
        />

        {/* Inner Button Canvas */}
        <div className="relative z-10 w-full h-full rounded-3xl bg-gradient-to-br from-red-600 via-red-500 to-orange-600 flex items-center justify-center border border-white/20 overflow-hidden">
          {/* Subtle reflection shine */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-white/20 rounded-full blur-md pointer-events-none" />

          {/* Minimalist Face (Pure White Eyes & Mouth Only) */}
          <MinimalFace
            isOpen={isChatOpen}
            isHovered={isHovered}
            isDragging={dragging}
            isScrolling={isScrolling}
          />
        </div>
      </motion.button>
    </>
  );
}

