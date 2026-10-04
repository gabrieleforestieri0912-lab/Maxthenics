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
  const attempts = useRef(0);

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    const handleCallback = async (): Promise<boolean> => {
      try {
        // PKCE flow returns ?code=: exchange it for a session first.
        const code = new URL(window.location.href).searchParams.get('code');
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) return false;
        }

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session?.access_token) return false;

        const res = await fetch("/api/auth/supabase-callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: session.access_token }),
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

    const tryCallback = async () => {
      attempts.current++;
      const ok = await handleCallback();
      if (!ok && attempts.current < 5) {
        setTimeout(tryCallback, 500);
      } else if (!ok) {
        setStatus("error");
      }
    };

    tryCallback();
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
          </p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
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
