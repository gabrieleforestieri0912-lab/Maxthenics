"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const Register: React.FC = () => {
  const { t } = useLanguage();
  const { register, addNotification } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      addNotification(t("Le password non coincidono", "Passwords do not match"));
      return;
    }

    const success = await register(formData.name, formData.email, formData.password);
    if (success) {
      navigate("/");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleRegister = async () => {
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
            t(
              "Registrazione Google non riuscita. Riprova.",
              "Google sign-up failed. Please try again."
            ),
          "error"
        );
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      } else {
        addNotification(
          t("Registrazione Google non riuscita. Riprova.", "Google sign-up failed. Please try again."),
          "error"
        );
      }
    } catch {
      addNotification(
        t("Registrazione Google non riuscita. Riprova.", "Google sign-up failed. Please try again."),
        "error"
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell
      seoTitle={t("Registrazione", "Sign up")}
      seoDescription={t(
        "Crea il tuo account Maxthenics e inizia il tuo percorso nel calisthenics con programmi personalizzati e coaching 1:1.",
        "Create your Maxthenics account and start your calisthenics journey with personalized programs and 1:1 coaching."
      )}
      seoKeywords={t(
        "registrazione calisthenics, account fitness, iscrizione programma allenamento",
        "calisthenics sign-up, fitness account, training program enrollment"
      )}
      titleLead={t("Unisciti a", "Join")}
      description={t(
        "Crea il tuo account e inizia la tua trasformazione oggi.",
        "Create your account and start your transformation today."
      )}
      footerLead={t("Hai già un account?", "Already have an account?")}
      footerActionLabel={t("Accedi", "Sign in")}
      footerActionTo="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label={t("Nome Completo", "Full Name")} htmlFor="name">
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("Mario Rossi", "John Smith")}
            autoComplete="name"
            className={INPUT_CLASS}
            required
          />
        </Field>

        <Field label={t("Email", "Email")} htmlFor="register-email">
          <input
            id="register-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("tu@esempio.com", "you@example.com")}
            autoComplete="email"
            className={INPUT_CLASS}
            required
          />
        </Field>

        <Field label={t("Password", "Password")} htmlFor="register-password">
          <PasswordInput
            id="register-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            visible={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            autoComplete="new-password"
          />
        </Field>

        <Field label={t("Conferma Password", "Confirm Password")} htmlFor="confirm-password">
          <PasswordInput
            id="confirm-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            visible={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((v) => !v)}
            autoComplete="new-password"
          />
        </Field>

        <button type="submit" className="btn-primary w-full py-3">
          {t("Crea Account", "Create Account")}
        </button>
      </form>

      <AuthDivider />

      <GoogleButton
        loading={googleLoading}
        onClick={handleGoogleRegister}
        label={t("Registrati con Google", "Sign up with Google")}
      />
    </AuthShell>
  );
};

export default Register;
