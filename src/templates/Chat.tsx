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
import { useLanguage } from "../context/LanguageContext";
import SEO from "../components/SEO";
import ChatInput from "../components/ChatInput";
import ChatMarkdown from "../components/ChatMarkdown";
import { QUICK_SUGGESTIONS } from "../lib/sthenox";
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

  return <ChatMarkdown content={displayedText} />;
};

const RenderContent: React.FC<{ content: string }> = ({ content }) => {
  return <ChatMarkdown content={content} />;
};

type IMessage = ChatMessage;

function groupMessagesByDate(
  messages: IMessage[],
  labels: { today: string; yesterday: string; locale: string }
) {
  const groups: { date: string; label: string; messages: IMessage[] }[] = [];
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (const msg of messages) {
    const msgDate = msg.createdAt ? new Date(msg.createdAt) : new Date();
    let label: string;
    if (msgDate.toDateString() === today.toDateString()) {
      label = labels.today;
    } else if (msgDate.toDateString() === yesterday.toDateString()) {
      label = labels.yesterday;
    } else {
      label = msgDate.toLocaleDateString(labels.locale, { weekday: 'long', day: 'numeric', month: 'long' });
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
  const { locale, t } = useLanguage();
  const {
    messages, setMessages, activeChatId, isLoading, isStreaming,
    sendMessage, stopGeneration, editMessage, regenerate,
    clearChat, history, loadChat, deleteChat, renameChat,
    exportChat, copyChatToClipboard, searchMessages,
    retry, lastError, isOffline,
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

  const isNearBottom = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 160;
  }, []);

  useEffect(() => {
    // Scroll automatico solo se l'utente e gia in fondo: non strappa mai il controllo.
    if (messages.length > 0 && isNearBottom()) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isNearBottom]);

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
    if (isOffline) {
      addNotification(t('Sei offline. Riconnettiti per chattare con Sthenox.', 'You are offline. Reconnect to chat with Sthenox.'), 'error');
      return;
    }

    if (!user) {
      if (guestMessageCount >= 5) {
        addNotification(t('Hai raggiunto il limite di 5 messaggi. Registrati per continuare a chattare!', 'You reached the 5-message limit. Sign up to keep chatting!'), 'error');
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
      addNotification(t("Chat eliminata correttamente", "Chat deleted successfully"), "success");
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
    addNotification(t("Chat copiata negli appunti", "Chat copied to clipboard"), "success");
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
    addNotification(t("Chat scaricata come Markdown", "Chat downloaded as Markdown"), "success");
    setExportMenuOpen(false);
  };

  const hasMessages = messages.length > 0;

  const suggestedFollowUps = [
    t("Approfondisci questo argomento", "Explore this topic further"),
    t("Fammi un esempio pratico", "Give me a practical example"),
    t("Quali sono i pro e i contro?", "What are the pros and cons?"),
    t("Mostrami i dati scientifici", "Show me the scientific data"),
  ];

  const groupedMessages = useMemo(
    () => groupMessagesByDate(messages, {
      today: t("Oggi", "Today"),
      yesterday: t("Ieri", "Yesterday"),
      locale: locale === "en" ? "en-US" : "it-IT",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, locale]
  );

  const formatTime = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const activeChat = history.find(h => h._id === activeChatId);

  return (
    <>
      <SEO
        title={t("Chat AI", "AI Chat")}
        description={t(
          "Chatta con Sthenox, l'AI coach di calisthenics, per ricevere consigli personalizzati sul tuo allenamento a corpo libero.",
          "Chat with Sthenox, the calisthenics AI coach, for personalized advice on your bodyweight training."
        )}
        keywords="AI chat calisthenics, coaching fitness, assistente allenamento"
      />
      <div className="h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white flex overflow-hidden relative">

        {/* ── Deletion Modal ── */}
        <AnimatePresence>
          {deleteConfirmId && (
            <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDeleteConfirmId(null)}
                className="absolute inset-0 bg-zinc-500/30 dark:bg-zinc-950/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-[360px] card p-8 shadow-2xl"
              >
                <div className="w-14 h-14 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-6">
                  <Trash2 className="text-red-500" size={28} aria-hidden />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight mb-3">{t("Elimina chat?", "Delete chat?")}</h3>
                <p className="body-copy text-sm mb-8">{t("Questa azione è irreversibile. Tutti i dati di questa conversazione verranno rimossi dai nostri sistemi.", "This action is irreversible. All data in this conversation will be removed from our systems.")}</p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="btn-secondary-sm"
                  >
                    {t("Annulla", "Cancel")}
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="btn-primary-sm"
                  >
                    {t("Elimina", "Delete")}
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
            className="fixed top-6 left-6 z-50 p-3 card hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-2xl group"
          >
            <Menu size={20} className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
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
          className="fixed lg:relative inset-y-0 left-0 z-40 bg-white/70 dark:bg-zinc-950/50 backdrop-blur-3xl border-r border-zinc-200 dark:border-white/10 flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-zinc-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center gap-3 group">
                <Image
                  src="/maxthenics.png"
                  alt="Maxthenics"
                  width={36}
                  height={36}
                  className="rounded-xl object-contain group-hover:scale-110 transition-transform"
                />
                <span className="text-lg font-bold tracking-tight uppercase">
                  MAX<span className="text-red-600">THENICS</span>
                </span>
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                aria-label={t("Chiudi indice chat", "Close chat index")}
                className="p-2 hover:bg-zinc-900/5 dark:hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            <button
              onClick={startNewChat}
              className="btn-primary-sm w-full py-3.5"
            >
              <Plus size={16} aria-hidden />
              {t("Nuova chat", "New chat")}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
            <p className="meta-mono px-4 py-4">
              {t("Recenti", "Recent")}
            </p>
            {history.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="meta-mono leading-relaxed">
                  {t("Nessuna conversazione", "No conversations")} <br /> {t("salvata", "saved")}
                </p>
              </div>
            ) : (
              history.map((chat) => (
                <div key={chat._id} className="relative group/item">
                  <button
                    onClick={() => selectChat(chat._id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-bold transition-colors group border ${activeChatId === chat._id
                      ? "bg-red-600/10 text-red-500 border-red-500/20"
                      : "text-zinc-500 hover:bg-zinc-900/5 dark:hover:bg-white/5 hover:text-zinc-700 dark:hover:text-zinc-300 border-transparent"
                      }`}
                  >
                    <MessageSquare size={14} className={activeChatId === chat._id ? "text-red-500" : "text-zinc-400 dark:text-zinc-700 group-hover:text-zinc-500"} />
                    {renamingChatId === chat._id ? (
                      <input
                        value={renamingChatTitle}
                        onChange={(e) => setRenamingChatTitle(e.target.value)}
                        onKeyDown={handleRenameKeyDown}
                        onBlur={saveRename}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white px-2 py-1 rounded text-xs outline-none border border-red-500/30"
                      />
                    ) : (
                      <span className="truncate flex-1 pr-10">
                        {chat.title || t("Chat senza titolo", "Untitled chat")}
                      </span>
                    )}
                  </button>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); startRename(chat._id, chat.title); }}
                      title={t("Rinomina", "Rename")}
                      className="p-1.5 text-zinc-400 dark:text-zinc-700 hover:text-amber-500 opacity-0 group-hover/item:opacity-100 transition-colors"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                      title={t("Elimina chat", "Delete chat")}
                      className="p-1.5 text-zinc-400 dark:text-zinc-700 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t border-zinc-200 dark:border-white/10 bg-zinc-100/60 dark:bg-zinc-950/40">
            {user ? (
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover border border-zinc-200 dark:border-white/10"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-white/10">
                    <UserIcon size={18} className="text-zinc-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold truncate tracking-tight text-zinc-900 dark:text-white">{user.name}</p>
                    {user.subscriptionTier && user.subscriptionTier !== 'free' && (
                      <span className="meta-mono px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-amber-500">
                        {user.subscriptionTier}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    <p className="meta-mono">
                      {user.subscriptionTier === 'free' || !user.subscriptionTier ? 'Basic' : user.subscriptionTier}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  aria-label={t("Esci", "Logout")}
                  className="p-2 text-zinc-400 dark:text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="meta-mono text-center">
                  {t("Accedi per salvare i dati", "Log in to save your data")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="btn-secondary-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary-sm"
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
              className="fixed inset-0 bg-zinc-500/30 dark:bg-zinc-950/80 backdrop-blur-md z-30 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 relative h-full">

          {/* Top bar */}
          <div className="px-6 py-3 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-white/60 dark:bg-zinc-950/30 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              {showSearch ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={t("Cerca nei messaggi...", "Search messages...")}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white px-4 py-2 rounded-xl text-xs outline-none focus:border-red-500/30 w-64 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                    autoFocus
                  />
                  <div className="flex items-center gap-1">
                    {searchResults.length > 0 && (
                      <span className="meta-mono">
                        {activeSearchIndex + 1}/{searchResults.length}
                      </span>
                    )}
                    <button
                      onClick={() => navigateSearchResult('up')}
                      disabled={searchResults.length === 0}
                      aria-label={t("Risultato precedente", "Previous result")}
                      className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                    >
                      <ChevronDown size={14} className="rotate-180" />
                    </button>
                    <button
                      onClick={() => navigateSearchResult('down')}
                      disabled={searchResults.length === 0}
                      aria-label={t("Risultato successivo", "Next result")}
                      className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => { setShowSearch(false); setSearchQuery(""); setSearchResults([]); }}
                    aria-label={t("Chiudi ricerca", "Close search")}
                    className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <Brain size={16} className="text-red-500" aria-hidden />
                  <span className="eyebrow">
                    Sthenox
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasMessages && !showSearch && (
                <>
                  <button
                    onClick={() => setShowSearch(true)}
                    className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-900/5 dark:hover:bg-white/5 rounded-xl transition-colors"
                    title={t("Cerca", "Search")}
                  >
                    <Search size={15} />
                  </button>
                  <div className="relative" ref={exportMenuRef}>
                    <button
                      onClick={() => setExportMenuOpen(!exportMenuOpen)}
                      className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-900/5 dark:hover:bg-white/5 rounded-xl transition-colors"
                      title={t("Esporta", "Export")}
                    >
                      <Download size={15} />
                    </button>
                    <AnimatePresence>
                      {exportMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                        >
                          <button
                            onClick={handleExportText}
                            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-900/5 dark:hover:bg-white/5 transition-colors text-left border-b border-zinc-200 dark:border-white/10"
                          >
                            <Copy size={14} />
                            {t("Copia chat (testo)", "Copy chat (text)")}
                          </button>
                          <button
                            onClick={handleExportMarkdown}
                            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-900/5 dark:hover:bg-white/5 transition-colors text-left"
                          >
                            <Download size={14} />
                            {t("Scarica Markdown", "Download Markdown")}
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
            role="log"
            aria-live="polite"
            aria-label={t("Conversazione con Sthenox", "Conversation with Sthenox")}
            className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide overscroll-contain ${hasMessages ? 'p-4 lg:p-8 space-y-8' : 'flex flex-col items-center justify-center'}`}
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
                  className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8"
                >
                  <Brain size={32} className="text-red-500" aria-hidden />
                </motion.div>

                <p className="eyebrow mb-3">{t("Coach AI Sthenox", "Sthenox AI Coach")}</p>
                <h2 className="page-title mb-4">
                  {t("Come posso aiutarti?", "How can I help?")}
                </h2>
                <p className="body-copy text-sm mb-10 max-w-md mx-auto">
                  {t(
                    "Protocolli d'azione, analisi biomeccanica e programmazione d'élite a tua disposizione.",
                    "Action protocols, biomechanical analysis and elite programming at your disposal."
                  )}
                </p>

                <div className="max-w-xl mx-auto mb-10">
                  <ChatInput
                    value={input}
                    onChange={setInput}
                    onSend={handleSend}
                    onStop={stopGeneration}
                    isLoading={isLoading}
                    isStreaming={isStreaming}
                    placeholder={t("Chiedi qualsiasi cosa", "Ask anything")}
                    autoFocus
                    textareaRef={inputRef}
                    onPlus={startNewChat}
                    plusLabel={t("Nuova conversazione", "New conversation")}
                    showSuggestions
                    suggestions={QUICK_SUGGESTIONS.map((s) => t(s, s))}
                    onSuggestionClick={(suggestion) => {
                      if (isLoading || isStreaming || isOffline) return;
                      setShowFollowUps(false);
                      sendMessage(suggestion);
                    }}
                    onEscape={handleInputEscape}
                  />
                  <p className="meta-mono text-center mt-3">
                    <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-900 rounded text-zinc-500">Enter</kbd> {t("invia", "send")} · <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-900 rounded text-zinc-500">Shift+Enter</kbd> {t("nuova riga", "new line")}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-8 pb-48 w-full">
                {groupedMessages.map((group) => (
                  <div key={group.date}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex-1 h-px bg-zinc-200 dark:bg-white/10" />
                      <span className="meta-mono shrink-0">
                        {group.label}
                      </span>
                      <div className="flex-1 h-px bg-zinc-200 dark:bg-white/10" />
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
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} ${searchResults.length > 0 && searchResults[activeSearchIndex]?.index === globalIdx ? 'ring-2 ring-red-500/30 rounded-2xl' : ''}`}
                          >
                            <div className={`max-w-[85%] lg:max-w-[80%] ${msg.role === "user" ? "text-right" : "text-left"}`}>
                              {msg.role === "assistant" && msgIdx === 0 && (
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl flex items-center justify-center">
                                    <Brain size={14} className="text-red-500" />
                                  </div>
                                  <span className="eyebrow flex items-center gap-1.5">
                                    <Sparkles size={10} aria-hidden />
                                    Sthenox
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
                                    className="w-full bg-white dark:bg-zinc-900 border border-red-500/30 text-zinc-900 dark:text-white px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                                    rows={3}
                                  />
                                  <div className="flex items-center gap-2 justify-end">
                                    <button
                                      onClick={cancelEdit}
                                      className="btn-ghost px-3 py-1.5 text-xs"
                                    >
                                      {t("Annulla", "Cancel")}
                                    </button>
                                    <button
                                      onClick={saveEdit}
                                      className="btn-primary-sm"
                                    >
                                      <CheckCheck size={12} aria-hidden />
                                      {t("Salva e rigenera", "Save & regenerate")}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div
                                    className={`card p-4 text-sm leading-relaxed ${msg.role === "user"
                                      ? "bg-red-600/90 border-red-500/30 text-white"
                                      : "text-zinc-700 dark:text-zinc-200"
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
                                      <span className="meta-mono">
                                        {formatTime(msg.createdAt)}
                                      </span>

                                      {/* Copy button */}
                                      <button
                                        onClick={() => copyMessage(msg.content, globalIdx)}
                                        className="p-1 text-zinc-500 dark:text-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-400 transition-colors"
                                        title={t("Copia messaggio", "Copy message")}
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
                                          className="p-1 text-zinc-500 dark:text-zinc-700 hover:text-amber-500 transition-colors"
                                          title={t("Modifica messaggio", "Edit message")}
                                        >
                                          <Pencil size={10} />
                                        </button>
                                      )}

                                      {/* Regenerate button (only on AI messages, not while streaming) */}
                                      {msg.role === "assistant" && !isStreaming && !isLoading && globalIdx === messages.length - 1 && (
                                        <button
                                          onClick={() => regenerate()}
                                          className="p-1 text-zinc-500 dark:text-zinc-700 hover:text-blue-500 transition-colors"
                                          title={t("Rigenera risposta", "Regenerate response")}
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
                                        title={t("Utile", "Helpful")}
                                        aria-label={t("Risposta utile", "Helpful response")}
                                        className={`p-1.5 border rounded-lg transition-colors disabled:opacity-40 ${
                                          msg.feedback === "up"
                                            ? "bg-green-500/10 border-green-500/40 text-green-500"
                                            : "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-600 hover:text-green-500 hover:border-green-500/30"
                                        }`}
                                      >
                                        <ThumbsUp size={10} />
                                      </button>
                                      <button
                                        onClick={() => handleVote(globalIdx, "down")}
                                        disabled={isStreaming}
                                        aria-pressed={msg.feedback === "down"}
                                        title={t("Non utile", "Not helpful")}
                                        aria-label={t("Risposta non utile", "Unhelpful response")}
                                        className={`p-1.5 border rounded-lg transition-colors disabled:opacity-40 ${
                                          msg.feedback === "down"
                                            ? "bg-red-500/10 border-red-500/40 text-red-500"
                                            : "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-600 hover:text-red-500 hover:border-red-500/30"
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
                {showFollowUps && !isStreaming && !isLoading && (
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
                          disabled={isLoading || isStreaming || isOffline}
                          className="px-3 py-2 card text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:border-red-500/30 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-left flex items-center gap-2 whitespace-nowrap disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                          <Plus size={10} className="shrink-0 text-zinc-400 dark:text-zinc-700" />
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
                      <div className="card px-6 py-4 flex items-center gap-3">
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
                        <span className="meta-mono" role="status">
                          {t("Sthenox sta scrivendo…", "Sthenox is typing…")}
                        </span>
                      </div>
                    ) : (
                      <div className="card px-6 py-4 flex items-center gap-3">
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
                        <span className="meta-mono">
                          {t("Analisi in corso...", "Thinking...")}
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
                {/* Offline / errore con Riprova */}
                {isOffline && hasMessages && (
                  <div role="alert" className="card flex items-center justify-between gap-3 border-amber-500/30 px-4 py-3 text-sm">
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {t("Sei offline. Le risposte riprenderanno alla riconnessione.", "You are offline. Answers will resume on reconnect.")}
                    </span>
                  </div>
                )}
                {lastError && !isLoading && (
                  <div role="alert" className="card flex items-center justify-between gap-3 border-red-500/30 px-4 py-3 text-sm">
                    <span className="font-bold text-red-600 dark:text-red-400">{lastError}</span>
                    <button
                      type="button"
                      onClick={() => retry()}
                      className="btn-primary-sm shrink-0"
                    >
                      <RefreshCw size={12} aria-hidden />
                      {t("Riprova", "Retry")}
                    </button>
                  </div>
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
              className="absolute bottom-40 right-8 z-20 p-3 card hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-2xl group"
            >
              <ChevronDown size={18} className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
            </motion.button>
          )}

          {/* Bottom Input */}
          {hasMessages && (
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:p-6 bg-linear-to-t from-zinc-100 via-zinc-100/90 dark:from-zinc-950 dark:via-zinc-950/90 to-transparent pointer-events-none">
              <div className="max-w-[720px] mx-auto pointer-events-auto">
                <ChatInput
                  value={input}
                  onChange={setInput}
                  onSend={handleSend}
                  onStop={stopGeneration}
                  isLoading={isLoading}
                  isStreaming={isStreaming}
                  placeholder={t("Chiedi qualsiasi cosa", "Ask anything")}
                  textareaRef={inputRef}
                  onPlus={startNewChat}
                  plusLabel={t("Nuova conversazione", "New conversation")}
                  onEscape={handleInputEscape}
                />
                <div className="flex items-center justify-between mt-4 px-6">
                  <div className="flex items-center gap-4">
                    <p className="meta-mono">
                      {t("Terminale Sthenox", "Sthenox Terminal")}
                    </p>
                    {activeChat && (
                      <p className="meta-mono max-w-[200px] truncate">
                        {activeChat.title}
                      </p>
                    )}
                  </div>
                  {!user ? (
                    <p className="meta-mono">
                      {guestMessageCount >= 5 ? (
                        <span className="text-red-500">{t("Accesso Limitato.", "Limited Access.")} <Link to="/register" className="underline">{t("Registrati", "Sign up")}</Link></span>
                      ) : (
                        <span className="text-zinc-500 dark:text-zinc-600">{t("Buffer ospite:", "Guest buffer:")} {5 - guestMessageCount} msg</span>
                      )}
                    </p>
                  ) : (
                    <p className="meta-mono">
                      <kbd className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-900 rounded">Enter</kbd> {t("invia", "send")} · <kbd className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-900 rounded">Shift+Enter</kbd> {t("nuova riga", "new line")}
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
