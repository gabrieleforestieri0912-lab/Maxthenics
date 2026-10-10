"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getSupabaseBrowser } from "../lib/supabase-browser";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";

const AuthCallback: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { fetchCurrentUser } = useAuth();
  const [status, setStatus] = useState<"syncing" | "error">("syncing");
  const attempts = useRef(0);

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    const handleCallback = async (): Promise<boolean> => {
      try {
        // PKCE flow returns ?code=: exchange it for a session first.
        const code = new URL(window.location.href).searchParams.get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) return false;
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

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
      <div className="page-shell flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <EmptyState
            icon={AlertCircle}
            title={t("Errore di accesso", "Sign-in error")}
            description={t(
              "Impossibile completare l'accesso con Google. Riprova.",
              "Could not complete Google sign-in. Please try again."
            )}
          >
            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate("/login", { replace: true })}
            >
              {t("Torna al login", "Back to login")}
            </Button>
          </EmptyState>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-5">
          <Loader2 className="w-5 h-5 text-red-500 animate-spin" aria-hidden />
        </div>
        <p className="meta-mono">{t("Accesso in corso...", "Signing in...")}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
