"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useLanguage } from "./LanguageContext";

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  purchases: string[];
  subscriptionTier?: string;
  subscriptionStatus?: string;
}

interface Notification {
  id: string;
  message: string;
  type: "success" | "error";
}

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  notifications: Notification[];
  addNotification: (message: string, type?: "success" | "error") => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
   const [user, setUser] = useState<IUser | null>(null);
   const [loading, setLoading] = useState(true);
   const [notifications, setNotifications] = useState<Notification[]>([]);
   const { t } = useLanguage();

  // Fetch current user from cookies
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCurrentUser();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchCurrentUser]);

  const addNotification = (message: string, type: "success" | "error" = "error") => {
    const id = Math.random().toString(36).substring(2, 11);
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("Errore durante il login", "Login error"));
      }

      // Fetch user after successful login
      await fetchCurrentUser();
      addNotification(t("Accesso effettuato con successo!", "Logged in successfully!"), "success");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        addNotification(error.message);
      } else {
        addNotification(t("Errore durante il login", "Login error"));
      }
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("Errore durante la registrazione", "Registration error"));
      }

      // Fetch user after successful registration
      await fetchCurrentUser();
      addNotification(t("Account creato con successo!", "Account created successfully!"), "success");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        addNotification(error.message);
      } else {
        addNotification(t("Errore durante la registrazione", "Registration error"));
      }
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Clear httpOnly cookies via logout endpoint
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      addNotification(t("Sessione terminata", "Session ended"), "success");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        fetchCurrentUser,
        notifications,
        addNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
