"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const Register: React.FC = () => {
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
      addNotification("Le password non coincidono");
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
          error.message || "Registrazione Google non riuscita. Riprova.",
          "error"
        );
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      } else {
        addNotification("Registrazione Google non riuscita. Riprova.", "error");
      }
    } catch {
      addNotification("Registrazione Google non riuscita. Riprova.", "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell
      seoTitle="Registrazione"
      seoDescription="Crea il tuo account Maxthenics e inizia il tuo percorso nel calisthenics con programmi personalizzati e coaching 1:1."
      seoKeywords="registrazione calisthenics, account fitness, iscrizione programma allenamento"
      titleLead="Unisciti a"
      description="Crea il tuo account e inizia la tua trasformazione oggi."
      footerLead="Hai già un account?"
      footerActionLabel="Accedi"
      footerActionTo="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nome Completo" htmlFor="name">
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Mario Rossi"
            autoComplete="name"
            className={INPUT_CLASS}
            required
          />
        </Field>

        <Field label="Email" htmlFor="register-email">
          <input
            id="register-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@esempio.com"
            autoComplete="email"
            className={INPUT_CLASS}
            required
          />
        </Field>

        <Field label="Password" htmlFor="register-password">
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

        <Field label="Conferma Password" htmlFor="confirm-password">
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
          Crea Account
        </button>
      </form>

      <AuthDivider />

      <GoogleButton
        loading={googleLoading}
        onClick={handleGoogleRegister}
        label="Registrati con Google"
      />
    </AuthShell>
  );
};

export default Register;