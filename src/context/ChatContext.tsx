"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface IMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  isNew?: boolean;
  isStreaming?: boolean;
  createdAt?: string;
}

interface ChatHistoryItem {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export type Corner = "bottom-right" | "bottom-left" | "top-right" | "top-left";

interface ChatContextType {
  messages: IMessage[];
  activeChatId: string | null;
  isLoading: boolean;
  isStreaming: boolean;
  history: ChatHistoryItem[];
  chatCorner: Corner;
  setChatCorner: React.Dispatch<React.SetStateAction<Corner>>;
  sendMessage: (content: string, isInitial?: boolean) => Promise<void>;
  stopGeneration: () => void;
  editMessage: (index: number, newContent: string) => Promise<void>;
  regenerate: () => Promise<void>;
  loadChat: (chatId: string) => Promise<void>;
  clearChat: () => void;
  refreshHistory: () => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  renameChat: (chatId: string, title: string) => Promise<void>;
  exportChat: (format: "text" | "markdown") => string;
  copyChatToClipboard: () => Promise<void>;
  searchMessages: (query: string) => { message: IMessage; index: number }[];
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
  guestId: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatCorner, setChatCorner] = useState<Corner>("bottom-right");
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<IMessage[]>([]);
  const isLoadingRef = useRef(false);
  const activeChatIdRef = useRef<string | null>(null);
  const guestIdRef = useRef<string | null>(null);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);
  useEffect(() => { activeChatIdRef.current = activeChatId; }, [activeChatId]);
  useEffect(() => { guestIdRef.current = guestId; }, [guestId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedGuestId = localStorage.getItem("chat_guest_id");
      if (storedGuestId) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGuestId(storedGuestId);
      } else {
        const cookies = document.cookie.split("; ");
        const sessionCookie = cookies.find((c) => c.startsWith("chat_session="));
        if (sessionCookie) {
          const cookieValue = sessionCookie.split("=")[1];
          if (cookieValue) {
            localStorage.setItem("chat_guest_id", cookieValue);
            setGuestId(cookieValue);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("maxthenicsChatCorner") as Corner | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setChatCorner(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("maxthenicsChatCorner", chatCorner);
  }, [chatCorner]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setActiveChatId(null);
  }, []);

  const deleteChat = useCallback(async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        if (activeChatId === chatId) {
          clearChat();
        }
        setHistory((prev) => prev.filter((chat) => chat._id !== chatId));
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  }, [activeChatId, clearChat]);

  const renameChat = useCallback(async (chatId: string, title: string) => {
    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (response.ok) {
        setHistory((prev) =>
          prev.map((chat) =>
            chat._id === chatId ? { ...chat, title } : chat
          )
        );
      }
    } catch (error) {
      console.error("Failed to rename chat:", error);
    }
  }, []);

  const refreshHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const url = new URL("/api/chat/history", window.location.origin);
      if (guestId) url.searchParams.append("guestId", guestId);

      const response = await fetch(url.toString(), {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Failed to refresh chat history:", error);
    }
  }, [guestId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshHistory();
  }, [refreshHistory]);

  const loadChat = useCallback(async (chatId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/chat/${chatId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages.map((m: IMessage, i: number) => ({
          ...m,
          id: m.id || `msg-${chatId}-${i}`,
          isNew: false,
          isStreaming: false,
        })));
        setActiveChatId(chatId);
      }
    } catch (error) {
      console.error("Failed to load chat:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setIsLoading(false);
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false, isNew: false } : m))
    );
  }, []);

  const sendMessage = useCallback(async (content: string, isInitial: boolean = false) => {
    const currentMessages = messagesRef.current;
    const currentActiveChatId = activeChatIdRef.current;
    const currentGuestId = guestIdRef.current;

    if ((!content.trim() && !isInitial) || isLoadingRef.current) return;

    let updatedMessages = [...currentMessages];

    if (!isInitial) {
      const userMsg: IMessage = {
        id: `msg-user-${Date.now()}`,
        role: "user",
        content,
        isNew: false,
        createdAt: new Date().toISOString(),
      };
      updatedMessages = [...currentMessages, userMsg];
      setMessages(updatedMessages);
    }

    setIsLoading(true);
    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: isInitial
            ? [{ role: 'user', content: "[SYSTEM_COMMAND: Genera un messaggio di benvenuto breve, tecnico e motivante per l'utente, presentandoti come Sthenox]" }]
            : updatedMessages,
          chatId: currentActiveChatId,
          guestId: currentGuestId,
          stream: true,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get('Content-Type') || '';

      if (contentType.includes('text/event-stream')) {
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';
        const streamingMsgId = `msg-ai-${Date.now()}`;

        const placeholder: IMessage = {
          id: streamingMsgId,
          role: "assistant",
          content: "",
          isNew: true,
          isStreaming: true,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, placeholder]);

        let savedChatId: string | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const data = JSON.parse(line.slice(6));

              if (data.error) {
                throw new Error(data.message || 'Stream error');
              }

              if (data.token) {
                fullContent += data.token;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === streamingMsgId
                      ? { ...m, content: fullContent }
                      : m
                  )
                );
              }

              if (data.done) {
                savedChatId = data.chatId;

                if (data.guestId && !user) {
                  localStorage.setItem("chat_guest_id", data.guestId);
                  setGuestId(data.guestId);
                }

                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === streamingMsgId
                      ? { ...m, content: fullContent, isStreaming: false, isNew: false }
                      : m
                  )
                );
              }
            } catch (e) {
              if (e instanceof SyntaxError) continue;
              throw e;
            }
          }
        }

        if (savedChatId) {
          setActiveChatId(savedChatId);
          refreshHistory();
        }
      } else {
        const data = await response.json();
        const aiMsg: IMessage = {
          id: `msg-ai-${Date.now()}`,
          ...data.message,
          isNew: true,
          isStreaming: false,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setActiveChatId(data.chatId);

        if (!user && data.guestId) {
          localStorage.setItem("chat_guest_id", data.guestId);
          setGuestId(data.guestId);
        }

        refreshHistory();
      }
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (error?.name === 'AbortError') {
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: "assistant",
          content: "Errore di connessione. Verifica la rete e riprova.",
          isNew: false,
          isStreaming: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [user, refreshHistory]);

  const editMessage = useCallback(async (index: number, newContent: string) => {
    const currentMessages = messagesRef.current;
    const currentActiveChatId = activeChatIdRef.current;
    const currentGuestId = guestIdRef.current;

    const msgsToKeep = currentMessages.slice(0, index + 1).map((m, i) =>
      i === index ? { ...m, content: newContent, isNew: false } : m
    );
    setMessages(msgsToKeep);

    setIsLoading(true);
    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: msgsToKeep.map(({ id: _id, isNew: _isNew, isStreaming: _isStreaming, createdAt: _createdAt, ..._rest }) => _rest),
          chatId: currentActiveChatId,
          guestId: currentGuestId,
          stream: true,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';
      const streamingMsgId = `msg-ai-${Date.now()}`;

      const placeholder: IMessage = {
        id: streamingMsgId,
        role: "assistant",
        content: "",
        isNew: true,
        isStreaming: true,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, placeholder]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) throw new Error(data.message);
            if (data.token) {
              fullContent += data.token;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === streamingMsgId ? { ...m, content: fullContent } : m
                )
              );
            }
            if (data.done) {
              if (data.chatId) setActiveChatId(data.chatId);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === streamingMsgId
                    ? { ...m, content: fullContent, isStreaming: false, isNew: false }
                    : m
                )
              );
              refreshHistory();
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: "assistant",
          content: "Errore durante la rigenerazione. Riprova.",
          isNew: false,
          isStreaming: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [refreshHistory]);

  const regenerate = useCallback(async () => {
    const currentMessages = messagesRef.current;
    const currentActiveChatId = activeChatIdRef.current;
    const currentGuestId = guestIdRef.current;

    let lastUserIdx = -1;
    for (let i = currentMessages.length - 1; i >= 0; i--) {
      if (currentMessages[i].role === 'user') {
        lastUserIdx = i;
        break;
      }
    }

    if (lastUserIdx === -1) return;

    const msgsToKeep = currentMessages.slice(0, lastUserIdx + 1);
    setMessages(msgsToKeep);

    setIsLoading(true);
    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: msgsToKeep.map(({ id: _id, isNew: _isNew, isStreaming: _isStreaming, createdAt: _createdAt, ..._rest }) => _rest),
          chatId: currentActiveChatId,
          guestId: currentGuestId,
          stream: true,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';
      const streamingMsgId = `msg-ai-${Date.now()}`;

      const placeholder: IMessage = {
        id: streamingMsgId,
        role: "assistant",
        content: "",
        isNew: true,
        isStreaming: true,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, placeholder]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) throw new Error(data.message);
            if (data.token) {
              fullContent += data.token;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === streamingMsgId ? { ...m, content: fullContent } : m
                )
              );
            }
            if (data.done) {
              if (data.chatId) setActiveChatId(data.chatId);
              if (data.guestId && !user) {
                localStorage.setItem("chat_guest_id", data.guestId);
                setGuestId(data.guestId);
              }
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === streamingMsgId
                    ? { ...m, content: fullContent, isStreaming: false, isNew: false }
                    : m
                )
              );
              refreshHistory();
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: "assistant",
          content: "Errore durante la rigenerazione. Riprova.",
          isNew: false,
          isStreaming: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [user, refreshHistory]);

  const exportChat = useCallback((format: "text" | "markdown"): string => {
    const msgs = messagesRef.current;
    if (msgs.length === 0) return '';

    if (format === "markdown") {
      return msgs
        .map((m) => {
          const prefix = m.role === 'user' ? '**Tu:**' : '**Sthenox:**';
          return `${prefix}\n\n${m.content}\n\n---\n`;
        })
        .join('\n');
    }

    return msgs
      .map((m) => {
        const prefix = m.role === 'user' ? 'Tu:' : 'Sthenox:';
        return `${prefix}\n${m.content}\n`;
      })
      .join('\n');
  }, []);

  const copyChatToClipboard = useCallback(async () => {
    const text = exportChat('text');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
    }
  }, [exportChat]);

  const searchMessages = useCallback((query: string) => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return messagesRef.current
      .map((m, i) => ({ message: m, index: i }))
      .filter(({ message }) => message.content.toLowerCase().includes(lowerQuery));
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        activeChatId,
        isLoading,
        isStreaming,
        history,
        sendMessage,
        stopGeneration,
        editMessage,
        regenerate,
        loadChat,
        clearChat,
        refreshHistory,
        deleteChat,
        renameChat,
        exportChat,
        copyChatToClipboard,
        searchMessages,
        chatCorner,
        setChatCorner,
        isChatOpen,
        setIsChatOpen,
        setMessages,
        setActiveChatId,
        guestId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
