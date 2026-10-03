"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Star, ArrowLeft, ChevronDown, Check, Mail, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export const CONTACT_EMAIL = 'gabriele.forestieri0912@gmail.com';

interface Category {
    id: string;
    label: string;
}

const categories: Category[] = [
    { id: 'app', label: 'App & Interfaccia' },
    { id: 'programs', label: 'Programmi di Allenamento' },
    { id: 'ai', label: 'Assistente AI' },
    { id: 'bug', label: 'Segnala un Bug' },
    { id: 'suggestion', label: 'Suggerimento' }
];

const Feedback: React.FC = () => {
    const [rating, setOpenRating] = useState(5);
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSending(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    subject: `Feedback [${selectedCategory.label}] — ${rating}/5 stelle`,
                    message,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data.error || 'Invio non riuscito. Riprova.');
            }
            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invio non riuscito. Riprova.');
        } finally {
            setSending(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-8 p-12 rounded-[3rem] bg-zinc-900/30 border border-white/10 backdrop-blur-xl"
                >
                    <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-red-900/50">
                        <Send size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Inviato</h2>
                    <p className="text-zinc-400 font-medium">Grazie per il tuo contributo d&apos;élite.</p>
                    <Link to="/" className="inline-block px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all">
                        Dashboard
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-zinc-200 p-6 pt-24 pb-12 relative overflow-hidden flex flex-col justify-center">
            <SEO title="Invia Feedback" description="Aiutaci a migliorare Maxthenics inviando i tuoi suggerimenti." />
            
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-2xl mx-auto w-full relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
                </Link>

                <div className="mb-8">
                    <span className="text-red-600 font-black tracking-[0.4em] uppercase text-[9px] mb-2 block">Contattaci</span>
                    <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">
                        Il Tuo <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500 italic px-1">Feedback</span>
                    </h1>
                    <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="inline-flex items-center gap-2 mt-4 text-xs text-zinc-500 hover:text-white transition-colors font-medium"
                    >
                        <Mail size={13} className="text-red-500" />
                        {CONTACT_EMAIL}
                    </a>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/20 border border-white/10 p-6 md:p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
                    {/* Star Rating */}
                    <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1 text-center block w-full">Valutazione Esperienza</label>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setOpenRating(num)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                        rating >= num ? 'bg-red-600 text-white shadow-lg shadow-red-900/30' : 'bg-zinc-800/50 text-zinc-600 hover:bg-zinc-800'
                                    }`}
                                >
                                    <Star size={18} fill={rating >= num ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Dropdown */}
                    <div className="space-y-2 relative" ref={dropdownRef}>
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1 block">Categoria</label>
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full bg-zinc-800/40 border border-white/10 rounded-xl px-5 py-4 text-left text-sm font-bold text-white flex items-center justify-between hover:bg-zinc-800/60 transition-all focus:border-red-500/50"
                        >
                            <span className="tracking-wide uppercase text-[11px]">{selectedCategory.label}</span>
                            <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl shadow-black"
                                >
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedCategory(cat);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${
                                                selectedCategory.id === cat.id ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-white/5'
                                            }`}
                                        >
                                            {cat.label}
                                            {selectedCategory.id === cat.id && <Check size={12} />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Nome + Email */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1 block">Nome</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Il tuo nome"
                                className="w-full bg-zinc-800/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-zinc-200 focus:outline-none focus:border-red-500/50 transition-all font-medium placeholder:text-zinc-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1 block">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@esempio.com"
                                className="w-full bg-zinc-800/40 border border-white/10 rounded-xl px-5 py-4 text-sm text-zinc-200 focus:outline-none focus:border-red-500/50 transition-all font-medium placeholder:text-zinc-700"
                            />
                        </div>
                    </div>

                    {/* Textarea */}
                    <div className="space-y-2">
                        <label htmlFor="message" className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1 block">Dettagli</label>
                        <textarea
                            id="message"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Raccontaci la tua esperienza o suggerisci un miglioramento..."
                            required
                            className="w-full bg-zinc-800/40 border border-white/10 rounded-xl p-5 text-sm text-zinc-300 focus:outline-none focus:border-red-500/50 transition-all font-medium resize-none placeholder:text-zinc-700"
                        />
                    </div>

                    {error && (
                        <p className="text-center text-xs text-red-400 font-bold bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={sending}
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 disabled:opacity-60 disabled:cursor-wait text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-900/30 flex items-center justify-center gap-3"
                    >
                        {sending ? (
                            <><Loader2 size={14} className="animate-spin" /> Invio in corso...</>
                        ) : (
                            <>Invia <Send size={14} /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Feedback;
