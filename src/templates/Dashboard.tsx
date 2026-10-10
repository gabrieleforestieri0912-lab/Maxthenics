import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  CreditCard, 
  Dumbbell, 
  MessageSquare, 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Zap,
  Activity,
  History,
  Languages,
  Palette
} from 'lucide-react';
import Button from "../components/Button";
import LanguageToggle from "../components/LanguageToggle";
import ThemeToggle from "../components/ThemeToggle";
import { useLanguage } from "../context/LanguageContext";
import SEO from "../components/SEO";
import { safeJsonParse } from "../lib/safeJson";
import type { SavedProgram } from "@/types/program";

interface UserProfile {
  name: string;
  email: string;
  subscriptionTier: 'free' | 'pro' | 'elite';
  subscriptionStatus: 'active' | 'inactive' | 'past_due' | 'canceled';
  purchases: string[];
}

/* Sotto-griglia dei programmi: mostra i programmi AI salvati dall'utente + link per crearne di nuovi */
const DashboardProgramGrid: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [savedPrograms, setSavedPrograms] = useState<SavedProgram[]>([]);

  useEffect(() => {
    const local: SavedProgram[] = safeJsonParse(localStorage.getItem("maxthenicsPrograms"), []);

    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/programs/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : []))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((serverPrograms: any[]) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const server: SavedProgram[] = serverPrograms.map((p: any) => ({
            id: p._id || p.id,
            userId: p.userId || "",
            title: p.title || "Programma",
            description: p.description || "",
            level: p.level || "Intermediate",
            price: p.price || 0,
            exercises: p.exercises || [],
            date: p.createdAt
              ? new Date(p.createdAt).toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "",
            daysPerWeek: p.daysPerWeek || 3,
            goals: p.goals || "",
            age: p.age || "",
            weight: p.weight || "",
            height: p.height || "",
            experience: p.experience || "",
            equipment: p.equipment || "",
            focus: p.focus || "",
            injury: p.injury || "",
          }));
          const merged = [...server];
          const serverIds = new Set(server.map((s) => s.id));
          for (const l of local) {
            if (!serverIds.has(l.id)) merged.push(l);
          }
          setSavedPrograms(merged);
        })
        .catch(() => {
          if (local.length) setSavedPrograms(local);
        });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (local.length) setSavedPrograms(local);
    }
  }, []);

  if (savedPrograms.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-zinc-300 dark:border-white/5 rounded-2xl">
        <Dumbbell className="mx-auto text-zinc-300 dark:text-zinc-800 mb-5" size={40} />
        <p className="text-zinc-500 font-normal text-sm">
          {t("Non hai ancora programmi personalizzati.", "You don't have custom programs yet.")}
        </p>
        <p className="text-zinc-500 dark:text-zinc-700 text-xs mt-1 mb-6">
          {t(
            "Usa l'AI per generare il tuo primo piano di allenamento su misura.",
            "Use AI to generate your first tailored training plan."
          )}
        </p>
        <button
          onClick={() => navigate("/create")}
          className="bg-linear-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-red-900/20"
        >
          {t("Crea il Tuo Primo Programma", "Create Your First Program")}
        </button>
      </div>
    );
  }

  /* mostriamo solo i primi 3 nella dashboard, con link "vedi tutti" */
  const displayed = savedPrograms.slice(0, 3);

  return (
    <div className="space-y-4">
      {displayed.map((p, i) => {
        const lvlCls =
          p.level === "avanzato"
            ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
            : p.level === "intermedio"
            ? "text-red-400 bg-red-500/10 border-red-500/20"
            : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
        return (
          <div
            key={p.id + i}
            className="flex items-center gap-5 p-5 rounded-2xl bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-white/5 hover:border-red-500/15 transition-all group"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${lvlCls}`}
            >
              <Dumbbell size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${lvlCls}`}
                >
                  {p.level}
                </span>
                {p.focus && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/8 text-red-400 border border-red-500/12">
                    {p.focus}
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{p.title}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                {p.daysPerWeek} {t("giorni/sett", "days/wk")} · {p.sessionDuration || 60}min · {p.exercises?.length || 0} {t("esercizi", "exercises")}
              </p>
            </div>
            <button
              onClick={() => navigate("/my-workouts")}
              className="text-[10px] font-black uppercase tracking-wider text-red-500 hover:text-red-400 group-hover:gap-2 gap-1.5 flex items-center transition-all shrink-0"
            >
              {t("Apri", "Open")} <ChevronRight size={12} />
            </button>
          </div>
        );
      })}

      {savedPrograms.length > 3 && (
        <Link
          to="/my-workouts"
          className="block text-center text-[11px] font-black uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:underline pt-1"
        >
          +{savedPrograms.length - 3} {t("altri programmi", "more programs")}
        </Link>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
          navigate('/login');
          return;
        }
        const data = await res.json();
        if (data.user) {
          setProfile(data.user);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const tierInfo = {
    free: { icon: Zap, label: 'Free Plan', color: 'text-zinc-500', bg: 'bg-zinc-500/10' },
    pro: { icon: Star, label: 'Pro Member', color: 'text-red-500', bg: 'bg-red-500/10' },
    elite: { icon: ShieldCheck, label: 'Elite Athlete', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  };

  const currentTier = profile?.subscriptionTier || 'free';
  const TierIcon = tierInfo[currentTier].icon;

  return (
    <div className="page-shell px-6 lg:px-8">
      <SEO
        title={t("Dashboard", "Dashboard")}
        description={t(
          "Gestisci i tuoi programmi e il tuo profilo Maxthenics.",
          "Manage your Maxthenics programs and profile."
        )}
      />

      <div className="container-max space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="eyebrow">Dashboard</p>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="page-title mt-2 text-3xl md:text-4xl"
            >
              {t("Bentornato", "Welcome back")}, <span className="text-red-500">{profile?.name}</span>
            </motion.h1>
            <p className="body-copy text-sm mt-2">
              {t(
                "Il tuo centro di comando per l'eccellenza fisica.",
                "Your command center for physical excellence."
              )}
            </p>
          </div>

          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border border-zinc-200 dark:border-white/10 ${tierInfo[currentTier].bg}`}
          >
            <TierIcon className={tierInfo[currentTier].color} size={20} aria-hidden />
            <div>
              <p className="meta-mono">{t("Stato Abbonamento", "Subscription Status")}</p>
              <p className={`text-sm font-bold ${tierInfo[currentTier].color}`}>
                {tierInfo[currentTier].label}
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column: Stats & Quick Actions */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: t("Programmi Attivi", "Active Programs"), value: profile?.purchases.length || 0, icon: Dumbbell },
                { label: t("Giorni di Training", "Training Days"), value: "12", icon: Activity },
                { label: t("Messaggi AI", "AI Messages"), value: "42", icon: MessageSquare },
              ].map((stat) => (
                <div key={stat.label} className="card hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors p-5">
                  <stat.icon className="text-red-500 mb-4" size={20} aria-hidden />
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                  <p className="meta-mono mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Program Library Section */}
            <div className="card p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 mb-8">
                <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">{t("I miei programmi", "My programs")}</h2>
                <Link
                  to="/my-workouts"
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-400 transition-colors"
                >
                  {t("Vedi tutti", "See all")}
                  <ChevronRight size={14} aria-hidden />
                </Link>
              </div>

              <DashboardProgramGrid />
            </div>
          </div>

          {/* Right Column: Sidebar Actions */}
          <div className="space-y-4">
            <div className="card border-red-500/20 bg-red-600/[0.08] p-7">
              <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">Neural Coach</h3>
              <p className="body-copy text-sm mt-2 mb-6">
                {t(
                  "Hai domande sul tuo allenamento? Chiedi all'AI d'élite.",
                  "Questions about your training? Ask the elite AI."
                )}
              </p>
              <Button to="/chat" variant="secondary" size="md" className="w-full bg-zinc-900 text-white hover:bg-red-600 hover:text-white border-transparent dark:bg-white dark:text-black dark:hover:bg-red-600 dark:hover:text-white">
                {t("Parla con il Coach", "Talk to the Coach")}
              </Button>
            </div>

            <nav className="card p-6">
              <p className="meta-mono mb-4">{t("Impostazioni Account", "Account Settings")}</p>
              <ul className="space-y-1">
                {[
                  { label: t("Modifica Profilo", "Edit Profile"), icon: User, path: "/create" },
                  { label: t("Cronologia Acquisti", "Purchase History"), icon: History, path: "/purchase-history" },
                  { label: t("Metodi di Pagamento", "Payment Methods"), icon: CreditCard, path: "/purchase-history" },
                  { label: t("Sicurezza Account", "Account Security"), icon: Settings, path: "/purchase-history" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-900/5 dark:hover:bg-white/5 transition-colors group"
                    >
                      <span className="flex items-center gap-3">
                        <item.icon
                          size={16}
                          className="text-zinc-500 group-hover:text-red-500 transition-colors"
                          aria-hidden
                        />
                        <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                          {item.label}
                        </span>
                      </span>
                      <ChevronRight
                        size={14}
                        className="text-zinc-400 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between gap-3 p-3 mt-1 rounded-lg bg-zinc-900/[0.02] dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10">
                <span className="flex items-center gap-3">
                  <Languages
                    size={16}
                    className="text-zinc-500"
                    aria-hidden
                  />
                  <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
                    {t("Lingua", "Language")}
                  </span>
                </span>
                <LanguageToggle compact />
              </div>
              <div className="flex items-center justify-between gap-3 p-3 mt-1 rounded-lg bg-zinc-900/[0.02] dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10">
                <span className="flex items-center gap-3">
                  <Palette
                    size={16}
                    className="text-zinc-500"
                    aria-hidden
                  />
                  <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
                    {t("Tema", "Theme")}
                  </span>
                </span>
                <ThemeToggle compact />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
