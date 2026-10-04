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
  History
} from 'lucide-react';
import SEO from "../components/SEO";
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
  const [savedPrograms, setSavedPrograms] = useState<SavedProgram[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("maxthenicsPrograms");
    const local: SavedProgram[] = saved ? JSON.parse(saved) : [];

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
      <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[2rem]">
        <Dumbbell className="mx-auto text-zinc-800 mb-5" size={40} />
        <p className="text-zinc-500 font-medium italic text-sm">
          Non hai ancora programmi personalizzati.
        </p>
        <p className="text-zinc-700 text-xs mt-1 mb-6">
          Usa l&apos;AI per generare il tuo primo piano di allenamento su misura.
        </p>
        <button
          onClick={() => navigate("/create")}
          className="bg-linear-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-red-900/20"
        >
          Crea il Tuo Primo Programma
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
            className="flex items-center gap-5 p-5 rounded-2xl bg-zinc-950/40 border border-white/5 hover:border-red-500/15 transition-all group"
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
              <p className="text-sm font-bold text-white truncate">{p.title}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                {p.daysPerWeek} giorni/sett · {p.sessionDuration || 60}min · {p.exercises?.length || 0} esercizi
              </p>
            </div>
            <button
              onClick={() => navigate("/my-workouts")}
              className="text-[10px] font-black uppercase tracking-wider text-red-500 hover:text-red-400 group-hover:gap-2 gap-1.5 flex items-center transition-all shrink-0"
            >
              Apri <ChevronRight size={12} />
            </button>
          </div>
        );
      })}

      {savedPrograms.length > 3 && (
        <Link
          to="/my-workouts"
          className="block text-center text-[11px] font-black uppercase tracking-wider text-zinc-500 hover:text-white hover:underline pt-1"
        >
          +{savedPrograms.length - 3} altri programmi
        </Link>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tierInfo = {
    free: { icon: Zap, label: 'Free Plan', color: 'text-zinc-500', bg: 'bg-zinc-500/10' },
    pro: { icon: Star, label: 'Pro Member', color: 'text-red-500', bg: 'bg-red-500/10' },
    elite: { icon: ShieldCheck, label: 'Elite Athlete', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  };

  const currentTier = profile?.subscriptionTier || 'free';
  const TierIcon = tierInfo[currentTier].icon;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <SEO title="Dashboard" description="Gestisci i tuoi programmi e il tuo profilo Maxthenics." />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
            >
              Bentornato, <span className="text-red-600">{profile?.name}</span>
            </motion.h1>
            <p className="text-zinc-500 mt-2 font-medium italic">Il tuo centro di comando per l&apos;eccellenza fisica.</p>
          </div>
          
          <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border border-white/5 ${tierInfo[currentTier].bg}`}>
            <TierIcon className={tierInfo[currentTier].color} size={24} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Stato Abbonamento</p>
              <p className={`font-black uppercase tracking-tight ${tierInfo[currentTier].color}`}>{tierInfo[currentTier].label}</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Stats & Quick Actions */}
          <div className="md:col-span-2 space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
               {[
                 { label: 'Programmi Attivi', value: profile?.purchases.length || 0, icon: Dumbbell },
                 { label: 'Giorni di Training', value: '12', icon: Activity },
                 { label: 'Messaggi AI', value: '42', icon: MessageSquare },
               ].map((stat, i) => (
                 <div key={i} className="bg-zinc-900/30 border border-white/5 p-6 rounded-[2rem] hover:bg-zinc-900/50 transition-colors">
                    <stat.icon className="text-red-600 mb-4" size={24} />
                    <p className="text-3xl font-black">{stat.value}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
                 </div>
               ))}
            </div>

             {/* Program Library Section */}
            <div className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-8 md:p-12">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black uppercase tracking-tighter">I Miei Programmi</h2>
                <Link to="/my-workouts" className="text-red-500 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                  Vedi Tutti <ChevronRight size={14} />
                </Link>
              </div>

              <DashboardProgramGrid />
            </div>
          </div>

          {/* Right Column: Sidebar Actions */}
          <div className="space-y-6">
            <div className="bg-linear-to-br from-red-600 to-orange-600 p-8 rounded-[3rem] shadow-2xl shadow-red-900/20">
              <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-white">Neural Coach</h3>
              <p className="text-white/80 text-sm mb-8 font-medium">Hai domande sul tuo allenamento? Chiedi all&apos;AI d&apos;élite.</p>
              <Link to="/chat" className="block w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-center text-xs hover:scale-[1.02] transition-transform">
                Parla con il Coach
              </Link>
            </div>

            <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[3rem] space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">Impostazioni Account</h4>
               {[
                 { label: 'Modifica Profilo', icon: User, path: '/questionnaire' },
                 { label: 'Cronologia Acquisti', icon: History, path: '/purchase-history' },
                 { label: 'Metodi di Pagamento', icon: CreditCard, path: '#' },
                 { label: 'Sicurezza Account', icon: Settings, path: '#' },
               ].map((item, i) => (
                 <Link key={i} to={item.path} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-4">
                       <item.icon size={18} className="text-zinc-500 group-hover:text-red-500 transition-colors" />
                       <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-zinc-800 group-hover:text-white transition-all" />
                 </Link>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
