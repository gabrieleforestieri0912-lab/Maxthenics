"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { getSupabaseBrowser } from "../lib/supabase-browser";
import SEO from "../components/SEO";
import GoogleIcon from "../components/GoogleIcon";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      addNotification("Le password non coincidono");
      return;
    }

    const success = await register(
      formData.name,
      formData.email,
      formData.password,
    );
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
    const sb = getSupabaseBrowser();
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <>
      <SEO
        title="Registrazione"
        description="Crea il tuo account Maxthenics e inizia il tuo percorso nel calisthenics con programmi personalizzati e coaching 1:1."
        keywords="registrazione calisthenics, account fitness, iscrizione programma allenamento"
      />
      <div className="min-h-screen py-20 px-4 sm:px-6 relative overflow-hidden flex items-center justify-center bg-zinc-950 text-white">
      {/* Back to Home */}
      <Link
        to="/"
        className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm sm:text-base">Torna alla Home</span>
      </Link>

      {/* Background Decor */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-sm w-full mx-auto">
        <div className="text-center mb-6 animate-fadeIn">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 text-white tracking-tight">
            Unisciti a <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500">
              Maxthenics
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Crea il tuo account e inizia la tua trasformazione oggi.
          </p>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-500/50 to-transparent"></div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1 sm:mb-1.5">
                Nome Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Mario Rossi"
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-zinc-700 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1 sm:mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@esempio.com"
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-zinc-700 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1 sm:mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-zinc-700 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1 sm:mb-1.5">
                Conferma Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-zinc-700 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 sm:py-3 mt-3 sm:mt-4 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-[1.02] shadow-lg shadow-red-900/20 active:scale-[0.98]"
            >
              Crea Account
            </button>
          </form>

          <div className="relative my-3 sm:my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-3 text-zinc-500">oppure</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-3 bg-white text-zinc-950 py-2.5 sm:py-3 rounded-xl font-bold text-sm transition-all hover:bg-zinc-200 active:scale-[0.98]"
          >
            <GoogleIcon className="w-5 h-5" />
            Registrati con Google
          </button>

          <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/10 text-center">
            <p className="text-zinc-400 text-xs">
              Hai già un account?{" "}
              <Link
                to="/login"
                className="text-red-500 font-bold hover:text-red-400 transition-colors"
              >
                Accedi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Register;
