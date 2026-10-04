"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  X, Trash2, ArrowRight, History, Plus, ChevronDown,
  Copy, Check, Pencil, RefreshCw, Download, CheckCheck,
  Sparkles, CornerDownRight, Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useChatContext, IMessage, Corner } from "../context/ChatContext";
import ChatInput from "./ChatInput";

const Typewriter = ({ text, onComplete, isStreaming }: { text: string; onComplete?: () => void; isStreaming?: boolean }) => {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    if (indexRef.current >= text.length) {
      if (onComplete && !isStreaming) onComplete();
      return;
    }

    const timeout = setTimeout(() => {
      indexRef.current += 1;
      setDisplayedText(text.slice(0, indexRef.current));
    }, 15);
    return () => clearTimeout(timeout);
  }, [displayedText, text, onComplete, isStreaming]);

  return <FormattedMessage text={displayedText} />;
};

const FormattedMessage = ({ text }: { text: string }) => {
  const formatLine = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-black text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="leading-relaxed">
      {text.split("\n").map((line, i) => {
        const isBullet = line.trim().match(/^[•\-*]\s+/);
        if (isBullet) {
          const content = line.trim().replace(/^[•\-*]\s+/, "");
          return (
            <div key={i} className="flex gap-2 mt-1.5 first:mt-0">
              <span className="text-red-500 font-bold shrink-0">•</span>
              <span className="flex-1">{formatLine(content)}</span>
            </div>
          );
        }
        return (
          <div key={i} className={line.trim() === "" ? "h-2" : "mt-1.5 first:mt-0"}>
            {formatLine(line)}
          </div>
        );
      })}
    </div>
  );
};

const ChatWidget = () => {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  return mounted ? <ChatWidgetContent /> : null;
};

const ChatWidgetContent = () => {
  const { addNotification } = useAuth();
  const location = useLocation();
  const {
    messages, setMessages, activeChatId, isLoading, isStreaming,
    sendMessage, stopGeneration, editMessage, regenerate,
    clearChat, history, loadChat, deleteChat, renameChat,
    exportChat, copyChatToClipboard, isChatOpen, setIsChatOpen, chatCorner,
  } = useChatContext();
  const [showHistory, setShowHistory] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [editingMessageContent, setEditingMessageContent] = useState("");
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renamingChatTitle, setRenamingChatTitle] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ message: IMessage; index: number }[]>([]);
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);

  const BTN_SIZE = 56;
  const GAP = 16;
  const corner = chatCorner ?? "bottom-right";

  function panelCornerStyle(c: Corner): React.CSSProperties {
    switch (c) {
      case "bottom-right": return { bottom: GAP + BTN_SIZE + 8, right: GAP, top: "auto", left: "auto", transformOrigin: "bottom right" };
      case "bottom-left": return { bottom: GAP + BTN_SIZE + 8, left: GAP, top: "auto", right: "auto", transformOrigin: "bottom left" };
      case "top-right": return { top: GAP + BTN_SIZE + 8, right: GAP, bottom: "auto", left: "auto", transformOrigin: "top right" };
      case "top-left": return { top: GAP + BTN_SIZE + 8, left: GAP, bottom: "auto", right: "auto", transformOrigin: "top left" };
    }
  }
  function panelAnimVars(c: Corner) {
    const isBottom = c.startsWith("bottom");
    return { initial: { opacity: 0, y: isBottom ? 20 : -20, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: isBottom ? 20 : -20, scale: 0.95 } };
  }

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  // Auto-create new chat when widget opens (except on /chat page)
  useEffect(() => {
    if (isChatOpen && location.pathname !== '/chat') {
      clearChat();
    }
  }, [isChatOpen, clearChat, location.pathname]);

  useEffect(() => {
    if (isChatOpen && messages.some(m => m.isNew)) {
      setMessages(prev => prev.map(m => ({ ...m, isNew: false })));
    }
  }, [isChatOpen, messages, setMessages]);

  const hiddenPaths = ['/chat', '/login', '/register'];
  const isHidden = hiddenPaths.includes(location.pathname);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isStreaming) return;
    const text = input;
    setInput("");
    const ok = await sendMessage(text);
    if (!ok) {
      // Restore the text so nothing is lost on error.
      setInput(text);
    }
    inputRef.current?.focus();
  };

  const handleInputEscape = () => {
    if (editingMessageIndex !== null) cancelEdit();
    if (showSearch) { setShowSearch(false); setSearchQuery(""); }
  };

  const handleNewChat = () => {
    clearChat();
    setShowHistory(false);
  };

  const handleSelectChat = (chatId: string) => {
    loadChat(chatId);
    setShowHistory(false);
    setEditingMessageIndex(null);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteChat(deleteConfirmId);
      setDeleteConfirmId(null);
      addNotification("Chat eliminata correttamente", "success");
    }
  };

  const startRename = (chatId: string, currentTitle: string) => {
    setRenamingChatId(chatId);
    setRenamingChatTitle(currentTitle);
  };

  const saveRename = async () => {
    if (renamingChatId && renamingChatTitle.trim()) {
      await renameChat(renamingChatId, renamingChatTitle.trim());
    }
    setRenamingChatId(null);
    setRenamingChatTitle("");
  };

  const _handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); saveRename(); }
    if (e.key === "Escape") { setRenamingChatId(null); setRenamingChatTitle(""); }
  };

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

  const _handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveEdit(); }
    if (e.key === "Escape") cancelEdit();
  };

  const copyMessage = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(index);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch { /* fallback */ }
  };

  const formatTime = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) { setSearchResults([]); return; }
    const lower = query.toLowerCase();
    const results = messages
      .map((m, i) => ({ message: m, index: i }))
      .filter(({ message }) => message.content.toLowerCase().includes(lower));
    setSearchResults(results);
    setActiveSearchIndex(0);
  };

  const navigateSearch = (dir: 'up' | 'down') => {
    if (!searchResults.length) return;
    setActiveSearchIndex(prev => dir === 'down' ? (prev + 1) % searchResults.length : (prev - 1 + searchResults.length) % searchResults.length);
  };

  const handleExportText = async () => {
    await copyChatToClipboard();
    addNotification("Chat copiata negli appunti", "success");
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
  };

  const anim = panelAnimVars(corner);
  const posStyle = panelCornerStyle(corner);

  if (isHidden) return null;

  return (
    <>
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[320px] bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-2xl"
            >
              <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center mb-4">
                <Trash2 className="text-red-500" size={24} />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2">Elimina Chat?</h3>
              <p className="text-zinc-500 text-xs font-medium mb-6">Questa azione è irreversibile. Sei sicuro di voler procedere?</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Annulla</button>
                <button onClick={confirmDelete} className="px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/20">Elimina</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsChatOpen(false)}
            />
            <motion.div
              key="chat-panel"
              initial={anim.initial}
              animate={anim.animate}
              exit={anim.exit}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[460px] sm:h-[560px] max-h-[85vh] bg-zinc-950/90 backdrop-blur-3xl border border-white/[0.06] rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden"
              style={posStyle}
            >
              {/* Gradient top edge accent */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

              {/* ── Header ── */}
              <div className="px-4 py-3 relative shrink-0">
                {/* Background blur */}
                <div className="absolute inset-0 bg-white/[0.02] rounded-t-3xl" />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-900/30">
                      <Sparkles size={15} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-black text-white uppercase tracking-tight leading-none">Sthenox AI</span>
                      <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.15em] mt-0.5">
                        {isStreaming ? "Sta scrivendo..." : (messages.length > 0 ? `${messages.length} messaggi` : "In linea")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    <div ref={historyRef} className="relative">
                      <button onClick={() => setShowHistory(!showHistory)} className={`p-2 rounded-xl transition-all ${showHistory ? 'bg-red-600/20 text-red-500' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
                        <History size={15} />
                      </button>
                      <AnimatePresence>
                        {showHistory && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full right-0 mt-2 w-64 bg-zinc-950/95 backdrop-blur-3xl border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden z-[70]"
                          >
                            <div className="p-2 border-b border-white/[0.04]">
                              <button onClick={handleNewChat} className="w-full flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl text-xs font-bold text-white transition-all group">
                                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-red-900/30"><Plus size={13} /></div> Nuova Chat
                              </button>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto p-1.5 scrollbar-hide">
                              {history.length === 0 ? (
                                <p className="p-4 text-[10px] text-zinc-600 text-center font-bold uppercase tracking-widest">Nessuna cronologia</p>
                              ) : (
                                history.map((chat: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                  <div key={chat._id} className="relative group/item">
                                    <button onClick={() => handleSelectChat(chat._id)} className={`w-full text-left p-3 rounded-xl text-[11px] transition-all hover:bg-white/[0.03] ${activeChatId === chat._id ? 'bg-red-600/[0.06] border border-red-500/20 text-red-400' : 'text-zinc-400 border border-transparent'}`}>
                                      {renamingChatId === chat._id ? (
                                        <input value={renamingChatTitle} onChange={(e) => setRenamingChatTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') { setRenamingChatId(null); } }} onBlur={saveRename} autoFocus onClick={(e) => e.stopPropagation()} className="w-full bg-zinc-800 text-white px-2 py-1 rounded text-[11px] outline-none border border-red-500/30" />
                                      ) : (
                                        <><div className="font-bold truncate pr-16">{chat.title || 'Nuova Conversazione'}</div><div className="text-[8px] opacity-40 mt-1 uppercase font-black tracking-tighter">{new Date(chat.updatedAt).toLocaleDateString()}</div></>
                                      )}
                                    </button>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                                      <button onClick={(e) => { e.stopPropagation(); startRename(chat._id, chat.title); }} className="p-1.5 text-zinc-600 hover:text-amber-400 opacity-0 group-hover/item:opacity-100 transition-all"><Pencil size={11} /></button>
                                      <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(chat._id); }} className="p-1.5 text-zinc-600 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all"><Trash2 size={11} /></button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button onClick={() => setIsChatOpen(false)} className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                      <X size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Messages ── */}
              <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide overscroll-contain">
                {messages.length === 0 && !isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/20 to-orange-500/20 border border-red-500/10 flex items-center justify-center mx-auto mb-5">
                        <Sparkles size={28} className="text-red-500" />
                      </div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-2">
                        Come posso <span className="text-red-500">aiutarti</span>?
                      </h2>
                      <p className="text-zinc-500 text-xs font-medium">Scegli un argomento o scrivi la tua domanda</p>
                    </motion.div>
                    <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                      {["Come inizio il Front Lever?", "Programmi personalizzati", "Analisi biomeccanica AI", "Prezzi Membership"].map((suggestion, idx) => (
                        <motion.button key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                          onClick={() => sendMessage(suggestion)}
                          className="w-full p-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-left text-[11px] font-bold text-zinc-400 hover:text-white hover:border-red-500/30 hover:bg-red-600/[0.04] transition-all flex items-center justify-between group"
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-lg bg-white/[0.04] flex items-center justify-center text-zinc-600">
                              <CornerDownRight size={10} />
                            </span>
                            {suggestion}
                          </span>
                          <ArrowRight size={12} className="text-zinc-700 group-hover:text-red-400 transition-colors" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg: any, i: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                      const isEditing = editingMessageIndex === i;
                      return (
                        <motion.div
                          key={msg.id || i}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0, ...(searchResults.length > 0 && searchResults[activeSearchIndex]?.index === i ? { scale: [1, 1.02, 1] } : {}) }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} ${searchResults.length > 0 && searchResults[activeSearchIndex]?.index === i ? 'ring-2 ring-red-500/20 rounded-2xl' : ''}`}
                        >
                          <div className={`max-w-[88%] ${msg.role === "user" ? "text-right" : "text-left"}`}>
                            {isEditing ? (
                              <div className="space-y-2">
                                <textarea value={editingMessageContent} onChange={(e) => setEditingMessageContent(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); } if (e.key === 'Escape') cancelEdit(); }} autoFocus className="w-full bg-zinc-800 border border-red-500/30 text-white px-3 py-2 rounded-2xl text-xs outline-none resize-none" rows={2} />
                                <div className="flex items-center gap-2 justify-end">
                                  <button onClick={cancelEdit} className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">Annulla</button>
                                  <button onClick={saveEdit} className="px-3 py-1 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1 shadow-lg shadow-red-900/30"><CheckCheck size={10} /> Rigenera</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className={`px-4 py-3 text-[13px] leading-relaxed ${
                                  msg.role === "user"
                                    ? "bg-gradient-to-br from-red-600 to-orange-500 text-white rounded-2xl rounded-tr-md shadow-lg shadow-red-900/20"
                                    : "bg-white/[0.04] border border-white/[0.06] text-zinc-200 rounded-2xl rounded-tl-md"
                                }`}>
                                  {msg.role === "assistant" && (msg.isNew || msg.isStreaming) ? (
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    <Typewriter text={msg.content} isStreaming={msg.isStreaming} onComplete={() => setMessages((prev: any[]) => prev.map((m: any, idx: number) => idx === i ? { ...m, isNew: false } : m))} />
                                  ) : (
                                    <FormattedMessage text={msg.content} />
                                  )}
                                </div>
                                {!msg.isStreaming && (
                                  <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <span className="text-[7px] text-zinc-700 font-bold uppercase tracking-widest">{formatTime(msg.createdAt)}</span>
                                    <span className="text-zinc-800">·</span>
                                    <button onClick={() => copyMessage(msg.content, i)} className="p-0.5 text-zinc-700 hover:text-zinc-400 transition-colors" title="Copia">{copiedMessageId === i ? <Check size={9} className="text-green-500" /> : <Copy size={9} />}</button>
                                    {msg.role === "user" && <button onClick={() => startEdit(i, msg.content)} className="p-0.5 text-zinc-700 hover:text-amber-400 transition-colors" title="Modifica"><Pencil size={9} /></button>}
                                    {msg.role === "assistant" && !isLoading && !isStreaming && i === messages.length - 1 && <button onClick={() => regenerate()} className="p-0.5 text-zinc-700 hover:text-blue-400 transition-colors" title="Rigenera"><RefreshCw size={9} /></button>}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white/[0.04] border border-white/[0.06] px-4 py-3 rounded-2xl rounded-tl-md flex items-center gap-2">
                          {[0, 1, 2].map((i) => <motion.span key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} className="w-1.5 h-1.5 bg-gradient-to-r from-red-500 to-orange-400 rounded-full" />)}
                          {isStreaming && <span className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest ml-1">Scrittura...</span>}
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* ── Footer / Input ── */}
              <div className="px-3 pb-3 pt-1 relative">
                <div className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
                <ChatInput
                  value={input}
                  onChange={setInput}
                  onSend={handleSend}
                  onStop={stopGeneration}
                  isLoading={isLoading}
                  isStreaming={isStreaming}
                  placeholder="Chiedi qualsiasi cosa"
                  compact
                  textareaRef={inputRef}
                  onPlus={handleNewChat}
                  plusLabel="Nuova chat"
                  onEscape={handleInputEscape}
                />
                <div className="flex items-center justify-between mt-2 px-1">
                  <div className="flex items-center gap-2">
                    {messages.length > 0 && (
                      <>
                        <button onClick={() => { setShowSearch(!showSearch); if (!showSearch) setTimeout(() => searchInputRef.current?.focus(), 100); else setSearchQuery(""); }} className="text-[7px] text-zinc-600 hover:text-zinc-400 font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-1">{showSearch ? <X size={9} /> : <Eye size={9} />} Cerca</button>
                        <button onClick={handleExportText} className="text-[7px] text-zinc-600 hover:text-zinc-400 font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-1"><Copy size={9} /> Copia</button>
                        <button onClick={handleExportMarkdown} className="text-[7px] text-zinc-600 hover:text-zinc-400 font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-1"><Download size={9} /> .md</button>
                      </>
                    )}
                  </div>
                </div>
                {showSearch && (
                  <div className="mt-2">
                    <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="Cerca nei messaggi..." className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-3 py-2 rounded-xl text-[11px] outline-none focus:border-red-500/30 focus:bg-white/[0.06] transition-all" />
                    {searchResults.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[8px] text-zinc-500 font-bold">{activeSearchIndex + 1}/{searchResults.length}</span>
                        <button onClick={() => navigateSearch('up')} className="p-1 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"><ChevronDown size={11} className="rotate-180" /></button>
                        <button onClick={() => navigateSearch('down')} className="p-1 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"><ChevronDown size={11} /></button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
