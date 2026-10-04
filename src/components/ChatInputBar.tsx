"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Mic, Plus, Sparkles, Square } from "lucide-react";

interface ChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  isLoading?: boolean;
  isStreaming?: boolean;
  onStop?: () => void;
  onNewChat?: () => void;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  autoFocus?: boolean;
  compact?: boolean;
  maxHeight?: number;
}

/**
 * AI Mode style chat input:
 * rounded container, textarea on top, toolbar row inside
 * (+ new chat, mic dictation, circular gradient send button),
 * optional suggestion chips above.
 */
const ChatInputBar: React.FC<ChatInputBarProps> = ({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  placeholder = "Chiedi qualsiasi cosa",
  isLoading = false,
  isStreaming = false,
  onStop,
  onNewChat,
  suggestions,
  onSuggestionClick,
  textareaRef,
  autoFocus = false,
  compact = false,
  maxHeight = 200,
}) => {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    const SR =
      typeof window !== "undefined"
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition // eslint-disable-line @typescript-eslint/no-explicit-any
        : null;
    setSpeechSupported(!!SR);
  }, []);

  // Auto-resize
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [value, maxHeight]);

  const setRefs = (el: HTMLTextAreaElement | null) => {
    innerRef.current = el;
    if (textareaRef) {
      (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
    }
  };

  const toggleDictation = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!SR) return;
    const rec = new SR();
    rec.lang = "it-IT";
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = value;
    rec.onresult = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += (finalText ? " " : "") + transcript;
        } else {
          interim += transcript;
        }
      }
      onChange((finalText + (interim ? " " + interim : "")).trimStart());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  const canSend = value.trim().length > 0 && !isLoading && !isStreaming;

  return (
    <div className="w-full">
      {suggestions && suggestions.length > 0 && onSuggestionClick && (
        <div className={`flex gap-2 overflow-x-auto scrollbar-hide ${compact ? "mb-2 pb-1" : "mb-3 pb-1"}`}>
          {suggestions.map((s) => (
            <motion.button
              key={s}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onSuggestionClick(s)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-red-500/30 text-zinc-400 hover:text-white transition-all font-medium ${
                compact ? "px-3 py-1.5 text-[11px]" : "px-4 py-2 text-xs"
              }`}
            >
              <Sparkles size={compact ? 11 : 13} className="text-orange-400 shrink-0" />
              <span className="whitespace-nowrap">{s}</span>
            </motion.button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div
          className={`relative bg-zinc-900/90 backdrop-blur-2xl border transition-all duration-300 shadow-2xl overflow-hidden ${
            compact ? "rounded-[22px]" : "rounded-[26px]"
          } border-white/10 focus-within:border-red-500/40 focus-within:shadow-[0_0_40px_rgba(220,38,38,0.12)]`}
        >
          <textarea
            ref={setRefs}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            rows={compact ? 1 : 2}
            autoFocus={autoFocus}
            className={`w-full bg-transparent text-white focus:outline-none placeholder:text-zinc-600 resize-none overflow-hidden block ${
              compact ? "px-4 pt-3 pb-1 text-[13px] min-h-[40px]" : "px-5 pt-4 pb-1 text-sm min-h-[52px]"
            }`}
            style={{ maxHeight }}
          />

          {/* Toolbar row inside the box — AI Mode style */}
          <div className={`flex items-center gap-1 ${compact ? "px-2.5 pb-2.5" : "px-3.5 pb-3.5"}`}>
            {onNewChat && (
              <button
                type="button"
                onClick={onNewChat}
                title="Nuova conversazione"
                className="p-2 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
              >
                <Plus size={compact ? 16 : 18} />
              </button>
            )}
            {speechSupported && (
              <button
                type="button"
                onClick={toggleDictation}
                title={listening ? "Interrompi dettatura" : "Dettatura vocale"}
                className={`p-2 rounded-full transition-all relative ${
                  listening ? "text-red-400 bg-red-500/10" : "text-zinc-500 hover:text-white hover:bg-white/10"
                }`}
              >
                {listening && (
                  <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                )}
                <Mic size={compact ? 16 : 18} className="relative" />
              </button>
            )}

            <div className="flex-1" />

            {isStreaming && onStop ? (
              <button
                type="button"
                onClick={onStop}
                title="Interrompi"
                className={`rounded-full bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center ${
                  compact ? "w-8 h-8" : "w-10 h-10"
                }`}
              >
                <Square size={compact ? 12 : 14} fill="currentColor" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canSend}
                title="Invia"
                className={`rounded-full transition-all flex items-center justify-center ${
                  compact ? "w-8 h-8" : "w-10 h-10"
                } ${
                  canSend
                    ? "bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg shadow-red-900/40 hover:shadow-red-900/60 hover:scale-105 active:scale-95"
                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                }`}
              >
                <ArrowUp size={compact ? 15 : 18} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInputBar;
