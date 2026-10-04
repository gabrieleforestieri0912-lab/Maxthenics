/* eslint-disable @typescript-eslint/no-explicit-any */
 
'use client';

// src/templates/PurchaseHistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';

interface PurchaseItem {
    title: string;
    price: number;
}

interface Purchase {
    id?: string;
    _id?: string;
    orderNumber?: string;
    date: string;
    total: number;
    status: string;
    items?: PurchaseItem[];
}

const PurchaseHistoryPage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        const fetchPurchases = async () => {
            setLoading(true);
            setError(null);
            try {
                // The token is stored in httpOnly cookie; fetch will send it automatically
                const response = await fetch('/api/purchases', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'same-origin', // ensure cookies sent (default)
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setError('Authentication failed. Please log in again.');
                        window.location.href = '/login';
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }

                const data = await response.json();
                setPurchases(data);
            } catch (err: any) {
                setError(err.message);
                console.error("Error fetching purchases:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, [isAuthenticated, user]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 lg:px-6 bg-black">
            <SEO
                title="I Tuoi Acquisti"
                description="Visualizza la tua cronologia acquisti e i protocolli sbloccati su Maxthenics."
            />
            
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <span className="text-red-600 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">Billing</span>
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.85] tracking-tighter mb-6">
                        I TUOI <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-700 italic pr-2">ACQUISTI</span>
                    </h1>
                    <p className="text-zinc-500 text-lg max-w-2xl font-medium leading-relaxed">
                        Consulta lo storico dei tuoi ordini e verifica i protocolli di allenamento che hai sbloccato nel tuo account.
                    </p>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Sincronizzazione dati in corso...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
                        <p className="text-red-500 font-medium">Errore: {error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && purchases.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900/30 border border-white/5 p-12 rounded-[2rem] text-center max-w-2xl mx-auto mt-10"
                    >
                        <div className="w-20 h-20 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10 text-zinc-600" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4">Nessun acquisto trovato</h3>
                        <p className="text-zinc-400 mb-8 max-w-md mx-auto leading-relaxed">Non hai ancora sbloccato alcun protocollo. Esplora l&apos;Accademia per iniziare il tuo percorso e trasformare il tuo corpo.</p>
                        <Link
                            to="/programs"
                            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 shadow-xl shadow-white/5 group"
                        >
                            Esplora l&apos;Accademia
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                )}

                {/* Purchases List */}
                {!loading && !error && purchases.length > 0 && (
                    <div className="space-y-6">
                        {purchases.map((purchase, index) => (
                            <motion.div 
                                key={purchase.id || purchase._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 md:p-8 hover:bg-zinc-900/60 hover:border-white/10 transition-colors shadow-2xl"
                            >
                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                                    
                                    {/* Order Header */}
                                    <div className="flex items-start gap-5 xl:w-1/3">
                                        <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center shrink-0">
                                            <Package className="w-6 h-6 text-red-500" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-black text-white tracking-tight">
                                                    Ordine {purchase.orderNumber || `#${purchase.id || purchase._id}`}
                                                </h3>
                                                <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] ${purchase.status === 'Completato' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                                    {purchase.status || 'Sconosciuto'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" /> 
                                                    {purchase.date ? new Date(purchase.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/D'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="flex-1 bg-black/40 rounded-2xl p-5 border border-white/5">
                                        {purchase.items && purchase.items.length > 0 ? (
                                            <ul className="space-y-4">
                                                {purchase.items.map((item, i) => (
                                                    <li key={i} className="flex justify-between items-center text-sm">
                                                        <span className="text-zinc-300 font-medium line-clamp-1 pr-4">{item.title}</span>
                                                        <span className="text-zinc-500 font-bold shrink-0">{item.price === 0 ? 'GRATUITO' : `€${item.price.toFixed(2)}`}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-zinc-500 font-medium">Nessun dettaglio disponibile per questo ordine.</p>
                                        )}
                                    </div>

                                    {/* Order Total */}
                                    <div className="flex items-center justify-between xl:flex-col xl:items-end gap-1 shrink-0 border-t border-white/5 xl:border-t-0 pt-5 xl:pt-0 xl:w-1/6">
                                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Totale</span>
                                        <span className="text-3xl font-black text-white italic tracking-tighter">
                                            {purchase.total === 0 ? 'FREE' : `€${purchase.total?.toFixed(2)}`}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchaseHistoryPage;
