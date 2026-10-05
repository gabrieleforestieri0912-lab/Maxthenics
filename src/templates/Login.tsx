"use client";

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSupabaseBrowser } from "../lib/supabase-browser";
import AuthShell, {
  AuthDivider,
  Field,
  GoogleButton,
  PasswordInput,
} from "../components/AuthShell";

const INPUT_CLASS =
  "w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white transition-colors placeholder:text-zinc-700 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/30";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, addNotification } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Read redirect destination from query string (?redirect=/cart)
  const redirectTo = new URLSearchParams(location.search).get("redirect") || "/";

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const sb = getSupabaseBrowser();
      const { data, error } = await sb.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { prompt: "select_account" },
        },
      });
      if (error) {
        addNotification(error.message || "Accesso Google non riuscito. Riprova.", "error");
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      } else {
        addNotification("Accesso Google non riuscito. Riprova.", "error");
      }
    } catch {
      addNotification("Accesso Google non riuscito. Riprova.", "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <AuthShell
      seoTitle="Accedi"
      seoDescription="Accedi al tuo account Maxthenics per riprendere i tuoi programmi di calisthenics e il tuo piano di allenamento."
      seoKeywords="login calisthenics, accedi maxthenics"
      titleLead="Bentornato su"
      description="Inserisci le tue credenziali per accedere al tuo profilo."
      footerLead="Non hai ancora un account?"
      footerActionLabel="Registrati ora"
      footerActionTo="/register"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@esempio.com"
            autoComplete="email"
            className={INPUT_CLASS}
            required
          />
        </Field>

        <Field
          label="Password"
          htmlFor="password"
          action={
            <Link to="/feedback" className="text-xs text-red-500 hover:text-red-400 transition-colors">
              Dimenticata?
            </Link>
          }
        >
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            visible={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            autoComplete="current-password"
          />
        </Field>

        <button type="submit" className="btn-primary w-full py-3">
          Accedi
        </button>
      </form>

      <AuthDivider />

      <GoogleButton loading={googleLoading} onClick={handleGoogleLogin} label="Accedi con Google" />
    </AuthShell>
  );
};

export default Login;