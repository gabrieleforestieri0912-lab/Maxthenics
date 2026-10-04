"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useChatContext } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { Sparkles, Bot, X } from "lucide-react";

type Corner = "bottom-right" | "bottom-left" | "top-right" | "top-left";

const BTN_SIZE = 56;
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

// Section-aware assistant messages
const getSectionMessages = (userName: string | null): Record<string, string[]> => ({
  "how-it-works": [
    "Ecco come funziona il protocollo",
    "Scopri l'integrazione con l'AI",
  ],
  "programs": [
    "Sblocca Planche & Front Lever",
    "Trova il programma perfetto per te",
    "Protocolli basati sulla scienza",
  ],
  "pricing": [
    "Scegli il piano ideale per i tuoi obiettivi",
  ],
  "coaching": [
    "Coaching 1:1 d'Élite dedicato",
  ],
  "about": [
    "Maxthenics è più di una scheda",
  ],
  "default": userName
    ? [
        `Ciao ${userName}! Sono Sthenox, il tuo Coach`,
        `Bentornato ${userName}! Come posso aiutarti?`,
        `${userName}, hai domande sul tuo allenamento?`,
      ]
    : [
        "Ciao! Sono Sthenox AI, il tuo Coach",
        "Come posso aiutarti oggi?",
        "Hai domande sul tuo allenamento?",
      ],
});

export default function ChatToggle() {
  const { isChatOpen, setIsChatOpen, chatCorner: corner, setChatCorner: setCorner } = useChatContext();
  const { user } = useAuth();
  const [dragging, setDragging] = useState(false);
  const [snapping, setSnapping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [showPreview, setShowPreview] = useState(false);
  const [previewMsg, setPreviewMsg] = useState("");
  const [activeSection, setActiveSection] = useState<string>("default");

  const btnRef = useRef<HTMLButtonElement>(null);
  const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });
  const hasMoved = useRef(false);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Page section awareness (drives proactive messages)
  useEffect(() => {
    const handleScroll = () => {
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Proactive Speech Bubble scheduler
  useEffect(() => {
    if (isChatOpen || dragging) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowPreview(false);
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
      return;
    }

    const triggerBubble = () => {
      const SECTION_MESSAGES = getSectionMessages(user?.name || null);
      const messages = SECTION_MESSAGES[activeSection] || SECTION_MESSAGES["default"];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setPreviewMsg(randomMsg);
      setShowPreview(true);

      setTimeout(() => setShowPreview(false), 4500);
    };

    const timer = setTimeout(() => {
      triggerBubble();
      previewTimerRef.current = setInterval(triggerBubble, 20000 + Math.random() * 10000);
    }, 6000);

    return () => {
      clearTimeout(timer);
      if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    };
  }, [isChatOpen, dragging, activeSection, user?.name]);

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
      {/* Proactive message bubble */}
      <AnimatePresence>
        {showPreview && !isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: isCornerBottom ? 10 : -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isCornerBottom ? 10 : -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 cursor-pointer select-none"
            onClick={() => setIsChatOpen(true)}
            style={{
              [isCornerBottom ? "bottom" : "top"]: GAP + BTN_SIZE + 8,
              [isCornerRight ? "right" : "left"]: GAP,
            }}
          >
            <div className="relative bg-zinc-950/95 border border-white/10 text-white text-xs font-medium px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-2.5 max-w-[260px] hover:border-red-500/40 transition-colors">
              <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500 shrink-0">
                <Bot size={15} />
              </div>
              <span className="leading-snug text-zinc-200">{previewMsg}</span>

              {/* Tail Arrow Pointer */}
              <div
                className={`absolute w-3 h-3 bg-zinc-950 border-r border-b border-white/10 rotate-45 ${
                  isCornerBottom ? "-bottom-1.5" : "-top-1.5"
                } ${isCornerRight ? "right-6" : "left-6"}`}
                style={
                  isCornerBottom
                    ? undefined
                    : {
                        borderRight: "none",
                        borderBottom: "none",
                        borderLeft: "1px solid rgba(255,255,255,0.1)",
                        borderTop: "1px solid rgba(255,255,255,0.1)",
                      }
                }
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating chat button */}
      <motion.button
        ref={btnRef}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed z-50 rounded-full bg-zinc-950 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center justify-center text-zinc-300 hover:text-white hover:border-red-500/40 transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        style={{
          width: BTN_SIZE,
          height: BTN_SIZE,
          ...cornerStyles(corner),
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
          transition: dragging || snapping ? "none" : "transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1)",
          cursor: dragging ? "grabbing" : "grab",
        }}
        aria-label={isChatOpen ? "Chiudi chat" : "Apri chat con Sthenox AI"}
      >
        <span className="relative flex items-center justify-center">
          {isChatOpen ? (
            <X size={22} strokeWidth={2.25} />
          ) : (
            <>
              <Sparkles
                size={22}
                strokeWidth={2}
                className={isHovered || dragging ? "text-red-500" : "text-zinc-200"}
              />
              {!dragging && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60 animate-ping motion-reduce:animate-none" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 border-2 border-zinc-950" />
                </span>
              )}
            </>
          )}
        </span>
      </motion.button>
    </>
  );
}
