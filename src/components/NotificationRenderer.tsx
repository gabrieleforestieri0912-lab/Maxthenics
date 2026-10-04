"use client";

import { useAuth } from '../context/AuthContext';
import { useChatContext } from '../context/ChatContext';

export default function NotificationRenderer() {
  const { notifications } = useAuth();
  
  // We try to get ChatContext safely. 
  // If it's not available (e.g. outside provider), we default to false.
  let isChatOpen = false;
  try {
    const chatContext = useChatContext();
    isChatOpen = chatContext.isChatOpen;
  } catch (_e) {
    // Ignore error if useChatContext is called outside provider
  }

  return (
    <div 
      className={`fixed right-4 sm:right-6 z-[9999] flex flex-col-reverse gap-4 pointer-events-none transition-all duration-300 ${
        isChatOpen ? 'top-6 bottom-auto' : 'bottom-24'
      }`}
    >
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`pointer-events-auto min-w-[300px] p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transform transition-all duration-500 animate-slideInUp ${
            n.type === "success"
              ? "bg-green-500/10 border-green-500/50 text-green-400"
              : "bg-red-500/10 border-red-500/50 text-red-400"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`h-2 w-2 rounded-full ${n.type === "success" ? "bg-green-500" : "bg-red-500"} animate-pulse`}
            />
            <p className="font-bold text-sm tracking-wide">{n.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
