"use client";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ChatToggle from './ChatToggle';
import ChatWidget from './ChatWidget';

function ChatLayoutInner() {
  const location = useLocation();

  // Niente minichat sulla landing e nel carrello
  if (location.pathname === '/' || location.pathname === '/cart') return null;

  return (
    <>
      <ChatToggle />
      <ChatWidget />
    </>
  );
}

export default function ChatLayoutClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prima dell'hydrate (e senza router) non renderizzare nulla
  if (!mounted) return null;

  return <ChatLayoutInner />;
}
