"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Mic, Plus, Square } from "lucide-react";

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Called on Enter (not composing) or send-button press. Parent owns send logic. */
  onSend: () => void;
  onStop?: () => void;
  isLoading?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  compact?: boolean;
  /** Suggestion chips (rendered only when showSuggestions and input is empty). */
  suggestions?: string[];
  showSuggestions?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
  /** Left circular action. Hidden when not provided. */
  onPlus?: () => void;
  plusLabel?: string;
  onEscape?: () => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  /** Max visible rows before inner scroll (default 6). */
  maxRows?: number;
}

function speechRecognitionAvailable(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as Record<string, unknown>;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

/**
 * Google AI Mode style chat input. Presentational only:
 * pill container, auto-growing textarea, "+" action on the left,
 * mic → send morph on the right (stop while streaming).
 */
const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onStop,
  isLoading = false,
  isStreaming = false,
  placeholder = "Chiedi qualsiasi cosa",
  autoFocus = false,
  compact = false,
  suggestions,
  showSuggestions = false,
  onSuggestionClick,
  onPlus,
  plusLabel = "Nuova conversazione",
  onEscape,
  textareaRef,
  maxRows = 6,
}) => {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [multiline, setMultiline] = useState(false);
  const [listening, setListening] = useState(false);
  const [micSupported] = useState(speechRecognitionAvailable);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  // Keep an optional external ref in sync (assignment inside effect, never during render).
  useEffect(() => {
    if (!textareaRef) return;
    textareaRef.current = innerRef.current;
  }, [textareaRef, value]);

  // Auto-grow up to maxRows, then inner scroll. Also tracks single- vs multi-line
  // to morph the container between rounded-full and rounded-3xl.
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = compact ? 18 : 20;
    const verticalPadding = compact ? 20 : 22;
    const maxHeight = maxRows * lineHeight + verticalPadding;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
    setMultiline(el.scrollHeight > lineHeight + 6);
  }, [value, compact, maxRows]);

  // Stop dictation on unmount.
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        /* already stopped */
      }
    };
  }, []);

  const canSend = value.trim().length > 0 && !isLoading && !isStreaming;

  const submit = useCallback(() => {
    if (isComposing) return;
    if (!canSend) return;
    onSend();
  }, [isComposing, canSend, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
    if (e.key === "Escape") {
      onEscape?.();
    }
  };

  const toggleDictation = () => {
    if (listening) {
      try {
        recognitionRef.current?.stop();
      } finally {
        setListening(false);
      }
      return;
    }
    const w = window as unknown as Record<string, new () => any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "it-IT";
    rec.interimResults = false;
    rec.continuous = false;
    let base = value;
    rec.onresult = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      transcript = transcript.trim();
      if (!transcript) return;
      base = (base ? `${base} ` : "") + transcript;
      onChange(base);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  const showChips =
    showSuggestions &&
    !!onSuggestionClick &&
    !!suggestions &&
    suggestions.length > 0 &&
    value.trim().length === 0 &&
    !isStreaming;

  const actionSize = compact ? "w-8 h-8" : "w-10 h-10";
  const iconSize = compact ? 15 : 18;

  return (
    <div className="w-full pb-[env(safe-area-inset-bottom)]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div
          className={`bg-zinc-900 border border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-all duration-200 motion-reduce:transition-none focus-within:border-white/25 focus-within:shadow-[0_4px_24px_rgba(0,0,0,0.5)] ${
            multiline ? "rounded-3xl" : "rounded-full"
          }`}
        >
          <div className={`flex items-end gap-1 ${compact ? "px-2 py-2" : "px-3 py-2.5"}`}>
            {onPlus && (
              <button
                type="button"
                onClick={onPlus}
                title={plusLabel}
                aria-label={plusLabel}
                className="shrink-0 p-2 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <Plus size={iconSize} />
              </button>
            )}

            <textarea
              ref={innerRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder={placeholder}
              rows={1}
              autoFocus={autoFocus}
              aria-label={placeholder}
              className={`grow bg-transparent text-zinc-100 focus:outline-none placeholder:text-zinc-600 resize-none block min-w-0 ${
                compact ? "px-2 py-1.5 text-[13px] leading-[18px]" : "px-2 py-2 text-sm leading-5"
              }`}
            />

            {isStreaming && onStop ? (
              <button
                type="button"
                onClick={onStop}
                title="Interrompi generazione"
                aria-label="Interrompi generazione"
                className={`shrink-0 ${actionSize} rounded-full bg-white text-black hover:bg-zinc-200 transition-colors duration-150 motion-reduce:transition-none flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900`}
              >
                <Square size={compact ? 12 : 14} fill="currentColor" aria-hidden />
              </button>
            ) : (
              <div className={`shrink-0 relative ${actionSize}`}>
                {/* Mic ↔ send morph with a soft cross-fade */}
                <button
                  type="button"
                  onClick={toggleDictation}
                  title={listening ? "Interrompi dettatura" : "Dettatura vocale"}
                  aria-label={listening ? "Interrompi dettatura" : "Dettatura vocale"}
                  aria-hidden={canSend}
                  tabIndex={canSend ? -1 : 0}
                  className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                    canSend
                      ? "opacity-0 scale-90 pointer-events-none"
                      : listening
                        ? "text-red-400 bg-red-500/10 opacity-100 scale-100"
                        : "text-zinc-400 hover:text-white hover:bg-white/10 opacity-100 scale-100"
                  } ${micSupported ? "" : "hidden"}`}
                >
                  <span className={listening ? "absolute inset-0 rounded-full bg-red-500/20 animate-ping motion-reduce:animate-none" : "hidden"} />
                  <Mic size={iconSize} className="relative" aria-hidden />
                </button>
                <button
                  type="submit"
                  disabled={!canSend}
                  title="Invia messaggio"
                  aria-label="Invia messaggio"
                  className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 ${
                    canSend
                      ? "bg-white text-black hover:bg-zinc-200 opacity-100 scale-100"
                      : "bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-0 scale-90 pointer-events-none"
                  }`}
                >
                  <ArrowUp size={iconSize} strokeWidth={2.5} aria-hidden />
                </button>
              </div>
            )}
          </div>
        </div>
      </form>

      {showChips && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-3 pb-1" role="list">
          {suggestions!.map((s) => (
            <button
              key={s}
              type="button"
              role="listitem"
              onClick={() => onSuggestionClick!(s)}
              className={`shrink-0 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 text-zinc-400 hover:text-white transition-colors duration-150 font-medium motion-reduce:transition-none ${
                compact ? "px-3 py-1.5 text-[11px]" : "px-4 py-2 text-xs"
              }`}
            >
              <span className="whitespace-nowrap">{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatInput;
