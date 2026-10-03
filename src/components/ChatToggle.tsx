"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useChatContext } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { Sparkles, Bot, MessageSquare, X } from "lucide-react";

type Corner = "bottom-right" | "bottom-left" | "top-right" | "top-left";

const BTN_SIZE = 60;
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

// Section-aware professional assistant messages (no emoji — Lucide icons rendered in bubble)
const getSectionMessages = (userName: string | null): Record<string, string[]> => ({
  "how-it-works": [
    "Ecco come funziona il protocollo Maxthenics.",
    "Esplora le card per scoprire ogni fase.",
    "Scopri l'integrazione con il Coach AI.",
  ],
  "programs": [
    "Sblocca Planche e Front Lever con i protocolli dedicati.",
    "Trova il programma perfetto per il tuo livello.",
    "Protocolli basati sulla scienza del movimento.",
  ],
  "pricing": [
    "Scegli il piano ideale per i tuoi obiettivi.",
    "Investi nella tua evoluzione atletica.",
  ],
  "coaching": [
    "Coaching 1:1 d'elite con correzioni in diretta.",
    "Un coach dedicato sempre al tuo fianco.",
  ],
  "about": [
    "Maxthenics: algoritmo proprietario adattivo.",
    "Un ecosistema di allenamento intelligente.",
  ],
  "default": userName
    ? [
        `Ciao ${userName}, sono Sthenox, il tuo Coach.`,
        `Bentornato ${userName}, come posso aiutarti?`,
        `${userName}, hai domande sul tuo allenamento?`,
        `Pronto ad allenarti, ${userName}? Sono qui.`,
      ]
    : [
        "Ciao, sono Sthenox AI, il tuo Coach.",
        "Come posso aiutarti oggi?",
        "Hai domande sul tuo allenamento?",
        "Sono qui per guidare la tua forza.",
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

  const pathname = usePathname();
  const hiddenPaths = ["/login", "/register", "/"];
  const isHiddenRoute = hiddenPaths.includes(pathname);

  // Page section awareness
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

  // Professional hint bubble scheduler (desktop restraint, no face)
  useEffect(() => {
    if (isChatOpen || dragging || isHiddenRoute) {
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
      previewTimerRef.current = setInterval(triggerBubble, 20000);
    }, 6000);

    return () => {
      clearTimeout(timer);
      if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    };
  }, [isChatOpen, dragging, activeSection, user?.name, isHiddenRoute]);

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

  const isCornerBottom = corner.startsWith("bottom");
  const isCornerRight = corner.endsWith("right");

  // No minichat on landing / auth pages — professional surface everywhere else
  if (isHiddenRoute) return null;

  return (
    <>
      {/* Professional hint card */}
      <AnimatePresence>
        {showPreview && !isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: isCornerBottom ? 10 : -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isCornerBottom ? 10 : -10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed z-50 cursor-pointer select-none"
            onClick={() => setIsChatOpen(true)}
            style={{
              [isCornerBottom ? "bottom" : "top"]: GAP + BTN_SIZE + 10,
              [isCornerRight ? "right" : "left"]: GAP,
            }}
          >
            <div className="relative bg-zinc-950/95 border border-white/10 text-white text-xs font-medium px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-2.5 max-w-[260px] group hover:border-red-500/40 transition-colors">
              <div className="p-1.5 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-white shrink-0">
                <Bot size={15} />
              </div>
              <span className="leading-snug text-zinc-200">{previewMsg}</span>
              <Sparkles size={13} className="text-orange-400 shrink-0" />

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

      {/* Professional floating assistant button — Lucide icon, red-orange gradient */}
      <motion.button
        ref={btnRef}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed z-50 text-white rounded-2xl shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        style={{
          width: BTN_SIZE,
          height: BTN_SIZE,
          ...cornerStyles(corner),
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
          transition: dragging || snapping
            ? "none"
            : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s",
          background: "linear-gradient(135deg, #dc2626, #f97316)",
          boxShadow: isChatOpen || isHovered
            ? "0 0 32px rgba(249,115,22,0.45), 0 10px 40px rgba(0,0,0,0.5)"
            : "0 0 18px rgba(220,38,38,0.35), 0 8px 30px rgba(0,0,0,0.4)",
        }}
        aria-label={isChatOpen ? "Chiudi assistenza" : "Apri assistenza Sthenox"}
      >
        <span className="relative z-10 flex items-center justify-center text-white">
          {isChatOpen ? <X size={24} strokeWidth={2.2} /> : <MessageSquare size={24} strokeWidth={2} />}
        </span>
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/90 shadow" />
      </motion.button>
    </>
  );
}
