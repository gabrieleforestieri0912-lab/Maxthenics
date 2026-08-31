"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { ChatProvider } from '../context/ChatContext';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import NotificationRenderer from './NotificationRenderer';

function BrowserRouterWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{children}</>;
  return (
    <BrowserRouter>
      <ScrollToTop />
      {children}
    </BrowserRouter>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <ChatProvider>
          <BrowserRouterWrapper>
            {children}
            <NotificationRenderer />
          </BrowserRouterWrapper>
        </ChatProvider>
      </CartProvider>
    </AuthProvider>
  );
}
