"use client";

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabaseBrowser } from "../lib/supabase-browser";
import { useAuth } from "../context/AuthContext";
import { AlertCircle } from "lucide-react";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { fetchCurrentUser } = useAuth();
  const [status, setStatus] = useState<"syncing" | "error">("syncing");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const supabase = getSupabaseBrowser();

    const syncSession = async (accessToken: string): Promise<boolean> => {
      try {
        const res = await fetch("/api/auth/supabase-callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken }),
          credentials: "include",
        });
        if (!res.ok) return false;
        await fetchCurrentUser();
        navigate("/", { replace: true });
        return true;
      } catch {
        return false;
      }
    };

    const handleCallback = async () => {
      try {
        // 1) OAuth code exchange (?code=...) — required after Google redirect
        const url = new URL(window.location.href);
        if (url.searchParams.has("code")) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (error) {
            throw new Error(error.message);
          }
          // Clean the URL so a refresh doesn't re-exchange
          window.history.replaceState({}, document.title, "/auth/callback");
        }

        // 2) Legacy implicit flow (#access_token=...) — supabase-js parses it via getSession
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error("Nessuna sessione trovata dopo il redirect.");
        }

        const ok = await syncSession(session.access_token);
        if (!ok) throw new Error("Sincronizzazione account non riuscita.");
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Errore sconosciuto durante l'accesso."
        );
        setStatus("error");
      }
    };

    handleCallback();
  }, [navigate, fetchCurrentUser]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-center max-w-sm mx-auto px-6">
          <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-3">
            Errore di Accesso
          </h2>
          <p className="text-zinc-500 text-sm font-medium mb-8 leading-relaxed">
            Impossibile completare l&apos;accesso con Google. Riprova.
            {errorMessage ? ` (${errorMessage})` : null}
          </p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
          >
            Torna al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="text-center">
        <div className="w-16 h-16 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-zinc-400 font-bold uppercase tracking-widest">
          Accesso in corso...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
