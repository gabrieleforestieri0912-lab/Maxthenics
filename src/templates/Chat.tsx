"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Plus,
  Trash2,
  LogOut,
  Menu,
  MessageSquare,
  User as UserIcon,
  Brain,
  ChevronLeft,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Pencil,
  Download,
  Search,
  X,
  CheckCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useChatContext, IMessage as ChatMessage } from "../context/ChatContext";
import SEO from "../components/SEO";
import ChatInput from "../components/ChatInput";
import Image from 'next/image';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  isStreaming?: boolean;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 20, onComplete, isStreaming }) => {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);
  const prevTextRef = useRef(text);

  useEffect(() => {
    if (text !== prevTextRef.current) {
      prevTextRef.current = text;
    }

    if (indexRef.current >= text.length) {
      if (onComplete && !isStreaming) onComplete();
      return;
    }

    const timeout = setTimeout(() => {
      indexRef.current += 1;
      setDisplayedText(text.slice(0, indexRef.current));
    }, speed);
    return () => clearTimeout(timeout);
  }, [displayedText, text, speed, onComplete, isStreaming]);

  return <RenderContent content={displayedText} />;
};

interface RenderContentProps {
  content: string;
}

const RenderContent: React.FC<RenderContentProps> = ({ content }) => {
  const [copiedCodeBlock, setCopiedCodeBlock] = useState<string | null>(null);

  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const parseCodeBlocks = (text: string) => {
    const parts: { type: 'code' | 'text'; content: string; language?: string }[] = [];
    const regex = /```(\w*)\n?([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }
      parts.push({
        type: 'code',
        language: match[1] || undefined,
        content: match[2].trim(),
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return parts;
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeBlock(code);
      setTimeout(() => setCopiedCodeBlock(null), 2000);
    } catch {
      // fallback
    }
  };

  const renderLine = (line: string, i: number) => {
    const trimmed = line.trim();
    const bulletMatch = line.match(/^(\s*[•\-*]\s+)(.*)/);

    if (bulletMatch) {
      const content = bulletMatch[2];
      return (
        <li key={i} className="ml-4 list-disc text-zinc-300 mt-1 first:mt-0">
          {formatText(content)}
        </li>
      );
    }

    if (/^\d+\.\s/.test(trimmed)) {
      return (
        <li key={i} className="ml-4 list-decimal text-zinc-300 mt-1 first:mt-0">
          {formatText(trimmed.replace(/^\d+\.\s/, ""))}
        </li>
      );
    }

    if (/^###\s/.test(trimmed)) {
      return (
        <h3 key={i} className="text-sm font-black text-white uppercase tracking-wider mt-4 mb-2">
          {formatText(trimmed.replace(/^###\s/, ""))}
        </h3>
      );
    }

    if (/^##\s/.test(trimmed)) {
      return (
        <h2 key={i} className="text-base font-black text-white uppercase tracking-wider mt-5 mb-2">
          {formatText(trimmed.replace(/^##\s/, ""))}
        </h2>
      );
    }

    if (/^#\s/.test(trimmed)) {
      return (
        <h1 key={i} className="text-lg font-black text-white uppercase tracking-wider mt-6 mb-2">
          {formatText(trimmed.replace(/^#\s/, ""))}
        </h1>
      );
    }

    return (
      <div key={i} className={trimmed === "" ? "h-2" : "mt-1.5 first:mt-0 text-zinc-300"}>
        {formatText(line)}
      </div>
    );
  };

  const renderTextPart = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let regularLines: string[] = [];

    const flushRegularLines = () => {
      if (regularLines.length > 0) {
        elements.push(
          <div key={`text-${elements.length}`} className="leading-relaxed">
            {regularLines.map((line, i) => renderLine(line, i))}
          </div>
        );
        regularLines = [];
      }
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      const isBullet = line.match(/^(\s*[•\-*]\s+)/);
      const isOrdered = /^\d+\.\s/.test(trimmed);
      const isHeading = /^#{1,3}\s/.test(trimmed);

      if (isBullet || isOrdered || isHeading) {
        flushRegularLines();
        elements.push(renderLine(line, i));
      } else {
        regularLines.push(line);
      }
    });

    flushRegularLines();
    return elements;
  };

  const blocks = parseCodeBlocks(content);

  return (
    <div className="leading-relaxed space-y-3">
      {blocks.map((block, idx) => {
        if (block.type === 'code') {
          return (
            <div key={`code-${idx}`} className="relative group/code my-3">
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/80 border border-white/5 rounded-t-xl">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {block.language || 'code'}
                </span>
                <button
                  onClick={() => copyCode(block.content)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  {copiedCodeBlock === block.content ? (
                    <><Check size={12} className="text-green-400" /> Copiato</>
                  ) : (
                    <><Copy size={12} /> Copia</>
                  )}
                </button>
              </div>
              <pre className="bg-zinc-900/80 border border-t-0 border-white/5 rounded-b-xl p-4 overflow-x-auto">
                <code className="text-xs text-zinc-300 font-mono leading-relaxed">{block.content}</code>
              </pre>
            </div>
          );
        }
        return <div key={`text-${idx}`}>{renderTextPart(block.content)}</div>;
      })}
    </div>
  );
};

type IMessage = ChatMessage;

const suggestedFollowUps = [
  "Approfondisci questo argomento",
  "Fammi un esempio pratico",
  "Quali sono i pro e i contro?",
  "Mostrami i dati scientifici",
];

function groupMessagesByDate(messages: IMessage[]) {
  const groups: { date: string; label: string; messages: IMessage[] }[] = [];
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (const msg of messages) {
    const msgDate = msg.createdAt ? new Date(msg.createdAt) : new Date();
    let label: string;
    if (msgDate.toDateString() === today.toDateString()) {
      label = 'Oggi';
    } else if (msgDate.toDateString() === yesterday.toDateString()) {
      label = 'Ieri';
    } else {
      label = msgDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
    }
    const dateKey = msgDate.toDateString();
    const existing = groups.find(g => g.date === dateKey);
    if (existing) {
      existing.messages.push(msg);
    } else {
      groups.push({ date: dateKey, label, messages: [msg] });
    }
  }
  return groups;
}

const Chat: React.FC = () => {
  const { user, logout, addNotification } = useAuth();
  const {
    messages, setMessages, activeChatId, isLoading, isStreaming,
    sendMessage, stopGeneration, editMessage, regenerate,
    clearChat, history, loadChat, deleteChat, renameChat,
    exportChat, copyChatToClipboard, searchMessages,
  } = useChatContext();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [guestMessageCount, setGuestMessageCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('guest_message_count');
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });
  const [hasAutoGreeted, setHasAutoGreeted] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [editingMessageContent, setEditingMessageContent] = useState("");
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renamingChatTitle, setRenamingChatTitle] = useState("");
  const [renamingChatOriginalTitle, setRenamingChatOriginalTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<{ message: IMessage; index: number }[]>([]);
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (user) {
      localStorage.removeItem('guest_message_count');
      setGuestMessageCount(0);
    }
  }, [user]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!hasAutoGreeted && messages.length === 0 && !isLoading) {
      setHasAutoGreeted(true);
      sendMessage("", true);
    }
  }, [hasAutoGreeted, messages.length, isLoading, sendMessage]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "assistant" && !lastMsg.isNew && !lastMsg.isStreaming) {
        setShowFollowUps(true);
      } else {
        setShowFollowUps(false);
      }
    }
  }, [messages]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Close export menu on click outside
  useEffect(() => {
    if (!exportMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [exportMenuOpen]);

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 200);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isStreaming) return;

    if (!user) {
      if (guestMessageCount >= 5) {
        addNotification('Hai raggiunto il limite di 5 messaggi. Registrati per continuare a chattare!', 'error');
        return;
      }
      setGuestMessageCount(prev => {
        const newCount = prev + 1;
        localStorage.setItem('guest_message_count', String(newCount));
        return newCount;
      });
    }

    const text = input;
    setInput("");
    setShowFollowUps(false);
    const ok = await sendMessage(text);
    if (!ok) {
      // Restore the text so nothing is lost on error.
      setInput(text);
    }
    inputRef.current?.focus();
  };

  const handleInputEscape = () => {
    if (editingMessageIndex !== null) cancelEdit();
    if (showSearch) setShowSearch(false);
  };

  const startNewChat = () => {
    clearChat();
    setShowFollowUps(false);
    setHasAutoGreeted(false);
    setSearchQuery("");
    setShowSearch(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const selectChat = (chatId: string) => {
    loadChat(chatId);
    setShowFollowUps(false);
    setSearchQuery("");
    setShowSearch(false);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteChat(deleteConfirmId);
      setDeleteConfirmId(null);
      addNotification("Chat eliminata correttamente", "success");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setDeleteConfirmId(chatId);
  };

  const copyMessage = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(index);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch {
      // fallback
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setShowFollowUps(false);
    sendMessage(suggestion);
  };

  const handleVote = async (index: number, value: "up" | "down") => {
    const msg = messages[index];
    if (!msg || msg.role !== "assistant" || msg.isStreaming || isStreaming) return;
    const next = msg.feedback === value ? null : value;
    setMessages((prev) => prev.map((m, i) => (i === index ? { ...m, feedback: next } : m)));
    if (!activeChatId || !/^[0-9a-fA-F-]{36}$/.test(activeChatId)) return;
    try {
      await fetch(`/api/chat/${activeChatId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageIndex: index,
          role: msg.role,
          excerpt: msg.content.slice(0, 120),
          value: next,
        }),
      });
    } catch {
      // Local vote stays visible even if persistence fails.
    }
  };

  // Edit message handlers
  const startEdit = (index: number, content: string) => {
    setEditingMessageIndex(index);
    setEditingMessageContent(content);
  };

  const cancelEdit = () => {
    setEditingMessageIndex(null);
    setEditingMessageContent("");
  };

  const saveEdit = async () => {
    if (editingMessageIndex === null || !editingMessageContent.trim()) return;
    await editMessage(editingMessageIndex, editingMessageContent);
    setEditingMessageIndex(null);
    setEditingMessageContent("");
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    }
    if (e.key === "Escape") {
      cancelEdit();
    }
  };

  // Rename handlers
  const startRename = (chatId: string, currentTitle: string) => {
    setRenamingChatId(chatId);
    setRenamingChatTitle(currentTitle);
    setRenamingChatOriginalTitle(currentTitle);
  };

  const saveRename = async () => {
    if (renamingChatId && renamingChatTitle.trim() && renamingChatTitle.trim() !== renamingChatOriginalTitle) {
      await renameChat(renamingChatId, renamingChatTitle.trim());
    }
    setRenamingChatId(null);
    setRenamingChatTitle("");
    setRenamingChatOriginalTitle("");
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveRename();
    }
    if (e.key === "Escape") {
      setRenamingChatId(null);
      setRenamingChatTitle("");
    }
  };

  // Search handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchMessages(query);
      setSearchResults(results);
      setActiveSearchIndex(0);
    } else {
      setSearchResults([]);
    }
  }, [searchMessages]);

  const navigateSearchResult = (direction: 'up' | 'down') => {
    if (searchResults.length === 0) return;
    setActiveSearchIndex(prev => {
      const next = direction === 'down'
        ? (prev + 1) % searchResults.length
        : (prev - 1 + searchResults.length) % searchResults.length;
      // Scroll to the result
      const resultMsg = searchResults[next];
      if (resultMsg) {
        const el = messagesContainerRef.current?.querySelector(`[data-msg-index="${resultMsg.index}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return next;
    });
  };

  // Scroll to active search result when it changes
  useEffect(() => {
    if (searchResults.length > 0 && searchResults[activeSearchIndex]) {
      const resultMsg = searchResults[activeSearchIndex];
      const el = messagesContainerRef.current?.querySelector(`[data-msg-index="${resultMsg.index}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeSearchIndex, searchResults]);

  // Export handlers
  const handleExportText = async () => {
    await copyChatToClipboard();
    addNotification("Chat copiata negli appunti", "success");
    setExportMenuOpen(false);
  };

  const handleExportMarkdown = () => {
    const md = exportChat('markdown');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const title = activeChatId ? history.find(h => h._id === activeChatId)?.title || 'chat' : 'chat';
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification("Chat scaricata come Markdown", "success");
    setExportMenuOpen(false);
  };

  const hasMessages = messages.length > 0;

  const groupedMessages = useMemo(() => groupMessagesByDate(messages), [messages]);

  const formatTime = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const activeChat = history.find(h => h._id === activeChatId);

  return (
    <>
      <SEO
        title="Chat AI"
        description="Chatta con Sthenox, l'AI coach di calisthenics, per ricevere consigli personalizzati sul tuo allenamento a corpo libero."
        keywords="AI chat calisthenics, coaching fitness, assistente allenamento"
      />
      <div className="h-screen bg-[#050505] text-white flex overflow-hidden relative font-sans">

        {/* ── Deletion Modal ── */}
        <AnimatePresence>
          {deleteConfirmId && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDeleteConfirmId(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-[360px] bg-zinc-950 border border-white/10 p-8 rounded-[2rem] shadow-2xl"
              >
                <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mb-6">
                  <Trash2 className="text-red-500" size={32} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-3">Elimina Chat?</h3>
                <p className="text-zinc-500 text-sm font-medium mb-8 leading-relaxed">Questa azione è irreversibile. Tutti i dati di questa conversazione verranno rimossi dai nostri sistemi.</p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-6 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-6 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/40"
                  >
                    Elimina
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Open Sidebar Button */}
        {!isSidebarOpen && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-6 left-6 z-50 p-3 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl hover:bg-zinc-800 transition-all shadow-2xl group"
          >
            <Menu size={20} className="text-zinc-400 group-hover:text-white" />
          </motion.button>
        )}

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            width: isSidebarOpen ? 300 : 0,
            opacity: isSidebarOpen ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed lg:relative inset-y-0 left-0 z-40 bg-zinc-950/50 backdrop-blur-3xl border-r border-white/5 flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center gap-3 group">
                <Image
                  src="/Img/maxthenics.png"
                  alt="Maxthenics"
                  width={36}
                  height={36}
                  className="rounded-xl object-contain group-hover:scale-110 transition-transform"
                />
                <span className="text-lg font-black tracking-tighter uppercase italic">
                  MAX<span className="text-red-600">THENICS</span>
                </span>
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-red-600 hover:bg-red-500 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-900/20 active:scale-95"
            >
              <Plus size={16} />
              Nuova chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] px-4 py-4">
              Recenti
            </p>
            {history.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest leading-relaxed">
                  Nessuna conversazione <br /> salvata
                </p>
              </div>
            ) : (
              history.map((chat) => (
                <div key={chat._id} className="relative group/item">
                  <button
                    onClick={() => selectChat(chat._id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left text-xs font-bold transition-all group border ${activeChatId === chat._id
                      ? "bg-red-600/10 text-red-500 border-red-500/20"
                      : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300 border-transparent"
                      }`}
                  >
                    <MessageSquare size={14} className={activeChatId === chat._id ? "text-red-500" : "text-zinc-700 group-hover:text-zinc-500"} />
                    {renamingChatId === chat._id ? (
                      <input
                        value={renamingChatTitle}
                        onChange={(e) => setRenamingChatTitle(e.target.value)}
                        onKeyDown={handleRenameKeyDown}
                        onBlur={saveRename}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-zinc-800 text-white px-2 py-1 rounded text-xs outline-none border border-red-500/30"
                      />
                    ) : (
                      <span className="truncate flex-1 pr-10">
                        {chat.title || "Chat senza titolo"}
                      </span>
                    )}
                  </button>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); startRename(chat._id, chat.title); }}
                      title="Rinomina"
                      className="p-1.5 text-zinc-700 hover:text-amber-500 opacity-0 group-hover/item:opacity-100 transition-all"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                      title="Elimina chat"
                      className="p-1.5 text-zinc-700 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t border-white/5 bg-black/20">
            {user ? (
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-white/10">
                    <UserIcon size={18} className="text-zinc-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-black truncate uppercase tracking-tight">{user.name}</p>
                    {user.subscriptionTier && user.subscriptionTier !== 'free' && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[8px] font-black text-amber-500 uppercase tracking-widest">
                        {user.subscriptionTier}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                      {user.subscriptionTier === 'free' || !user.subscriptionTier ? 'Basic' : user.subscriptionTier}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[9px] text-zinc-600 text-center font-bold uppercase tracking-widest">
                  Accedi per salvare i dati
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="flex items-center justify-center px-3 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center px-3 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Join
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.aside>

        {/* Mobile overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-30 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 relative h-full">

          {/* Top bar */}
          <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between shrink-0 bg-zinc-950/30 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              {showSearch ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Cerca nei messaggi..."
                    className="bg-zinc-900 border border-white/10 text-white px-4 py-2 rounded-xl text-xs outline-none focus:border-red-500/30 w-64 transition-all placeholder:text-zinc-600"
                    autoFocus
                  />
                  <div className="flex items-center gap-1">
                    {searchResults.length > 0 && (
                      <span className="text-[10px] text-zinc-500 font-bold">
                        {activeSearchIndex + 1}/{searchResults.length}
                      </span>
                    )}
                    <button
                      onClick={() => navigateSearchResult('up')}
                      disabled={searchResults.length === 0}
                      className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-30 transition-all"
                    >
                      <ChevronDown size={14} className="rotate-180" />
                    </button>
                    <button
                      onClick={() => navigateSearchResult('down')}
                      disabled={searchResults.length === 0}
                      className="p-1.5 text-zinc-500 hover:text-white disabled:opacity-30 transition-all"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => { setShowSearch(false); setSearchQuery(""); setSearchResults([]); }}
                    className="p-1.5 text-zinc-500 hover:text-white transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <Brain size={16} className="text-red-500" />
                  <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                    STHENOX
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasMessages && !showSearch && (
                <>
                  <button
                    onClick={() => setShowSearch(true)}
                    className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    title="Cerca"
                  >
                    <Search size={15} />
                  </button>
                  <div className="relative" ref={exportMenuRef}>
                    <button
                      onClick={() => setExportMenuOpen(!exportMenuOpen)}
                      className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      title="Esporta"
                    >
                      <Download size={15} />
                    </button>
                    <AnimatePresence>
                      {exportMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-52 bg-zinc-900 border border-white/5 rounded-xl shadow-2xl overflow-hidden z-50"
                        >
                          <button
                            onClick={handleExportText}
                            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-left border-b border-white/5"
                          >
                            <Copy size={14} />
                            Copia chat (testo)
                          </button>
                          <button
                            onClick={handleExportMarkdown}
                            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-left"
                          >
                            <Download size={14} />
                            Scarica Markdown
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className={`flex-1 overflow-y-auto scrollbar-hide overscroll-contain ${hasMessages ? 'p-4 lg:p-8 space-y-8' : 'flex flex-col items-center justify-center'}`}
          >
            {!hasMessages ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center px-6 w-full"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20"
                >
                  <Brain size={40} className="text-red-500" />
                </motion.div>

                <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
                  COME POSSO <br />
                  <span className="text-red-600">AIUTARTI?</span>
                </h2>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-10 max-w-md mx-auto">
                  Protocolli d&apos;azione, analisi biomeccanica e programmazione d&apos;élite a tua disposizione.
                </p>

                <div className="max-w-xl mx-auto mb-10">
                  <ChatInput
                    value={input}
                    onChange={setInput}
                    onSend={handleSend}
                    onStop={stopGeneration}
                    isLoading={isLoading}
                    isStreaming={isStreaming}
                    placeholder="Chiedi qualsiasi cosa"
                    autoFocus
                    textareaRef={inputRef}
                    onPlus={startNewChat}
                    plusLabel="Nuova conversazione"
                    showSuggestions
                    suggestions={[
                      "Crea un protocollo per la Planche",
                      "Analisi biomeccanica Front Lever",
                      "Come gestire il volume allenante?",
                      "Consigli per il recupero neurale",
                    ]}
                    onSuggestionClick={(suggestion) => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    onEscape={handleInputEscape}
                  />
                  <p className="text-[9px] text-zinc-700 text-center font-bold uppercase tracking-widest mt-3">
                    <kbd className="px-1.5 py-0.5 bg-zinc-900 rounded text-zinc-500">Enter</kbd> invia · <kbd className="px-1.5 py-0.5 bg-zinc-900 rounded text-zinc-500">Shift+Enter</kbd> nuova riga
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-8 pb-48 w-full">
                {groupedMessages.map((group) => (
                  <div key={group.date}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex-1 h-px bg-white/5" />
                      <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest shrink-0">
                        {group.label}
                      </span>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>
                    <div className="space-y-6">
                      {group.messages.map((msg, msgIdx) => {
                        const globalIdx = messages.indexOf(msg);
                        const isEditing = editingMessageIndex === globalIdx;

                        return (
                          <motion.div
                            key={msg.id || globalIdx}
                            data-msg-index={globalIdx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              ...(searchResults.length > 0 && searchResults[activeSearchIndex]?.index === globalIdx
                                ? { scale: [1, 1.02, 1] }
                                : {}),
                            }}
                            transition={{ duration: searchResults.length > 0 && searchResults[activeSearchIndex]?.index === globalIdx ? 0.5 : 0.3 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} ${searchResults.length > 0 && searchResults[activeSearchIndex]?.index === globalIdx ? 'ring-2 ring-red-500/30 rounded-3xl' : ''}`}
                          >
                            <div className={`max-w-[85%] lg:max-w-[80%] ${msg.role === "user" ? "text-right" : "text-left"}`}>
                              {msg.role === "assistant" && msgIdx === 0 && (
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-8 h-8 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center">
                                    <Brain size={14} className="text-red-500" />
                                  </div>
                                  <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] italic flex items-center gap-1.5">
                                    <Sparkles size={10} />
                                    STHENOX
                                  </span>
                                </div>
                              )}

                              {/* Edit mode for user messages */}
                              {isEditing ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editingMessageContent}
                                    onChange={(e) => setEditingMessageContent(e.target.value)}
                                    onKeyDown={handleEditKeyDown}
                                    autoFocus
                                    className="w-full bg-zinc-900 border border-red-500/30 text-white px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                                    rows={3}
                                  />
                                  <div className="flex items-center gap-2 justify-end">
                                    <button
                                      onClick={cancelEdit}
                                      className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
                                    >
                                      Annulla
                                    </button>
                                    <button
                                      onClick={saveEdit}
                                      className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5"
                                    >
                                      <CheckCheck size={12} />
                                      Salva e rigenera
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div
                                    className={`p-3 lg:p-4 text-sm leading-relaxed shadow-2xl ${msg.role === "user"
                                      ? "bg-red-600 text-white rounded-3xl rounded-tr-none"
                                      : "bg-zinc-900/40 backdrop-blur-xl border border-white/10 text-zinc-200 rounded-3xl rounded-tl-none"
                                      }`}
                                  >
                                    {msg.role === "assistant" && (msg.isNew || msg.isStreaming) ? (
                                      <Typewriter
                                        text={msg.content}
                                        isStreaming={msg.isStreaming}
                                        onComplete={() => {
                                          setMessages(prev => prev.map((m, idx) => idx === globalIdx ? { ...m, isNew: false } : m));
                                        }}
                                      />
                                    ) : (
                                      <RenderContent content={msg.content} />
                                    )}
                                  </div>

                                  {/* Message actions */}
                                  {!msg.isStreaming && (
                                    <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                      <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">
                                        {formatTime(msg.createdAt)}
                                      </span>

                                      {/* Copy button */}
                                      <button
                                        onClick={() => copyMessage(msg.content, globalIdx)}
                                        className="p-1 text-zinc-700 hover:text-zinc-400 transition-colors"
                                        title="Copia messaggio"
                                      >
                                        {copiedMessageId === globalIdx ? (
                                          <Check size={10} className="text-green-500" />
                                        ) : (
                                          <Copy size={10} />
                                        )}
                                      </button>

                                      {/* Edit button (only on user messages) */}
                                      {msg.role === "user" && !isStreaming && (
                                        <button
                                          onClick={() => startEdit(globalIdx, msg.content)}
                                          className="p-1 text-zinc-700 hover:text-amber-500 transition-colors"
                                          title="Modifica messaggio"
                                        >
                                          <Pencil size={10} />
                                        </button>
                                      )}

                                      {/* Regenerate button (only on AI messages, not while streaming) */}
                                      {msg.role === "assistant" && !isStreaming && !isLoading && globalIdx === messages.length - 1 && (
                                        <button
                                          onClick={() => regenerate()}
                                          className="p-1 text-zinc-700 hover:text-blue-500 transition-colors"
                                          title="Rigenera risposta"
                                        >
                                          <RefreshCw size={10} />
                                        </button>
                                      )}
                                    </div>
                                  )}

                                  {/* Feedback buttons on AI messages */}
                                  {msg.role === "assistant" && !msg.isStreaming && (
                                    <div className="flex items-center gap-2 mt-2 px-1">
                                      <button
                                        onClick={() => handleVote(globalIdx, "up")}
                                        disabled={isStreaming}
                                        aria-pressed={msg.feedback === "up"}
                                        title="Utile"
                                        aria-label="Risposta utile"
                                        className={`p-1.5 border rounded-lg transition-all disabled:opacity-40 ${
                                          msg.feedback === "up"
                                            ? "bg-green-500/10 border-green-500/40 text-green-500"
                                            : "bg-zinc-900/60 border-white/5 text-zinc-600 hover:text-green-500 hover:border-green-500/30"
                                        }`}
                                      >
                                        <ThumbsUp size={10} />
                                      </button>
                                      <button
                                        onClick={() => handleVote(globalIdx, "down")}
                                        disabled={isStreaming}
                                        aria-pressed={msg.feedback === "down"}
                                        title="Non utile"
                                        aria-label="Risposta non utile"
                                        className={`p-1.5 border rounded-lg transition-all disabled:opacity-40 ${
                                          msg.feedback === "down"
                                            ? "bg-red-500/10 border-red-500/40 text-red-500"
                                            : "bg-zinc-900/60 border-white/5 text-zinc-600 hover:text-red-500 hover:border-red-500/30"
                                        }`}
                                      >
                                        <ThumbsDown size={10} />
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Suggested follow-ups */}
                {showFollowUps && !isStreaming && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start pl-14"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {suggestedFollowUps.map((followUp, idx) => (
                        <motion.button
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => handleSuggestionClick(followUp)}
                          className="px-3 py-2 bg-zinc-900/60 border border-white/5 rounded-xl text-[10px] font-bold text-zinc-500 hover:text-white hover:border-red-500/30 hover:bg-zinc-900 transition-all text-left flex items-center gap-2 whitespace-nowrap"
                        >
                          <Plus size={10} className="shrink-0 text-zinc-700" />
                          {followUp}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Loading / Streaming indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    {isStreaming ? (
                      <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl rounded-tl-none flex items-center gap-3">
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                              className="w-2 h-2 bg-red-600 rounded-full"
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                          Generazione in corso...
                        </span>
                      </div>
                    ) : (
                      <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl rounded-tl-none flex items-center gap-3">
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                              className="w-2 h-2 bg-zinc-600 rounded-full"
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                          Analisi in corso...
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Scroll to bottom button */}
          {showScrollButton && hasMessages && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToBottom}
              className="absolute bottom-40 right-8 z-20 p-3 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-zinc-800 transition-all shadow-2xl group"
            >
              <ChevronDown size={18} className="text-zinc-400 group-hover:text-white" />
            </motion.button>
          )}

          {/* Bottom Input */}
          {hasMessages && (
            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 bg-linear-to-t from-[#050505] via-[#050505]/90 to-transparent pointer-events-none">
              <div className="max-w-[720px] mx-auto pointer-events-auto">
                <ChatInput
                  value={input}
                  onChange={setInput}
                  onSend={handleSend}
                  onStop={stopGeneration}
                  isLoading={isLoading}
                  isStreaming={isStreaming}
                  placeholder="Chiedi qualsiasi cosa"
                  textareaRef={inputRef}
                  onPlus={startNewChat}
                  plusLabel="Nuova conversazione"
                  onEscape={handleInputEscape}
                />
                <div className="flex items-center justify-between mt-4 px-6">
                  <div className="flex items-center gap-4">
                    <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">
                      Terminale Sthenox
                    </p>
                    {activeChat && (
                      <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest max-w-[200px] truncate">
                        {activeChat.title}
                      </p>
                    )}
                  </div>
                  {!user ? (
                    <p className="text-[9px] font-black uppercase tracking-widest">
                      {guestMessageCount >= 5 ? (
                        <span className="text-red-500">Accesso Limitato. <Link to="/register" className="underline">Registrati</Link></span>
                      ) : (
                        <span className="text-zinc-600">Buffer ospite: {5 - guestMessageCount} msg</span>
                      )}
                    </p>
                  ) : (
                    <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">
                      <kbd className="px-1 py-0.5 bg-zinc-900 rounded">Enter</kbd> invia · <kbd className="px-1 py-0.5 bg-zinc-900 rounded">Shift+Enter</kbd> nuova riga
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
