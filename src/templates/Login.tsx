"use client";

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getSupabaseBrowser } from "../lib/supabase-browser";
import AuthShell, {
  AuthDivider,
  Field,
  GoogleButton,
  PasswordInput,
} from "../components/AuthShell";

const INPUT_CLASS =
  "w-full rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 px-3 py-2.5 text-sm text-zinc-900 dark:text-white transition-colors placeholder:text-zinc-700 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/30";

const Login: React.FC = () => {
  const { t } = useLanguage();
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
        addNotification(
          error.message ||
            t("Accesso Google non riuscito. Riprova.", "Google sign-in failed. Please try again."),
          "error"
        );
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      } else {
        addNotification(
          t("Accesso Google non riuscito. Riprova.", "Google sign-in failed. Please try again."),
          "error"
        );
      }
    } catch {
      addNotification(
        t("Accesso Google non riuscito. Riprova.", "Google sign-in failed. Please try again."),
        "error"
      );
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
      seoTitle={t("Accedi", "Sign in")}
      seoDescription={t(
        "Accedi al tuo account Maxthenics per riprendere i tuoi programmi di calisthenics e il tuo piano di allenamento.",
        "Sign in to your Maxthenics account to resume your calisthenics programs and training plan."
      )}
      seoKeywords={t(
        "login calisthenics, accedi maxthenics",
        "calisthenics login, maxthenics sign in"
      )}
      titleLead={t("Bentornato su", "Welcome back to")}
      description={t(
        "Inserisci le tue credenziali per accedere al tuo profilo.",
        "Enter your credentials to access your profile."
      )}
      footerLead={t("Non hai ancora un account?", "Don't have an account yet?")}
      footerActionLabel={t("Registrati ora", "Sign up now")}
      footerActionTo="/register"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label={t("Email", "Email")} htmlFor="email">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("tu@esempio.com", "you@example.com")}
            autoComplete="email"
            className={INPUT_CLASS}
            required
          />
        </Field>

        <Field
          label={t("Password", "Password")}
          htmlFor="password"
          action={
            <Link to="/feedback" className="text-xs text-red-500 hover:text-red-400 transition-colors">
              {t("Dimenticata?", "Forgot?")}
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
          {t("Accedi", "Sign in")}
        </button>
      </form>

      <AuthDivider />

      <GoogleButton
        loading={googleLoading}
        onClick={handleGoogleLogin}
        label={t("Accedi con Google", "Sign in with Google")}
      />
    </AuthShell>
  );
};

export default Login;
