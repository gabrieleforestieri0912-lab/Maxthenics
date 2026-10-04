"use client";

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { getSupabaseBrowser } from "../lib/supabase-browser";
import GoogleIcon from "../components/GoogleIcon";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, addNotification } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Read redirect destination from query string (?redirect=/cart)
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const sb = getSupabaseBrowser();
      const { data, error } = await sb.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { prompt: 'select_account' },
        },
      });
      if (error) {
        addNotification(error.message || 'Accesso Google non riuscito. Riprova.', 'error');
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      } else {
        addNotification('Accesso Google non riuscito. Riprova.', 'error');
      }
    } catch {
      addNotification('Accesso Google non riuscito. Riprova.', 'error');
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
    <div className="min-h-screen px-4 sm:px-6 relative overflow-hidden flex items-center justify-center">
      {/* Back to Home */}
      <Link
        to="/"
        className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm sm:text-base">Torna alla Home</span>
      </Link>

      <div className="absolute top-0 left-1/4 w-150 h-150 bg-red-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-150 h-150 bg-orange-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-sm w-full mx-auto">
        <div className="text-center mb-6 animate-fadeIn">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 text-white tracking-tight">
            Bentornato su <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500">
              Maxthenics
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Inserisci le tue credenziali per accedere al tuo profilo.
          </p>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-500/50 to-transparent"></div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1 sm:mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@esempio.com"
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-zinc-700 text-sm"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 sm:mb-1.5">
                <label className="block text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/feedback"
                  className="text-xs text-red-500 hover:text-red-400 transition-colors"
                >
                  Dimenticata?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-[1.02] shadow-lg shadow-red-900/20 active:scale-[0.98] mt-3 sm:mt-4"
            >
              Accedi
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
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-zinc-950 py-2.5 sm:py-3 rounded-xl font-bold text-sm transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-60"
          >
            <GoogleIcon className="w-5 h-5" />
            {googleLoading ? 'Reindirizzamento…' : 'Accedi con Google'}
          </button>

          <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/10 text-center">
            <p className="text-zinc-400 text-xs">
              Non hai ancora un account?{" "}
              <Link
                to="/register"
                className="text-red-500 font-bold hover:text-red-400 transition-colors"
              >
                Registrati ora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
