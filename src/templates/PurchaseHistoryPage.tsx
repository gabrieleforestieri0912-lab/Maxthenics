/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Clock, Package, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";

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

function formatDate(value?: string) {
  if (!value) return "N/D";
  return new Date(value).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const PurchaseHistoryPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    const fetchPurchases = async () => {
      setLoading(true);
      setError(null);
      try {
        // The token is stored in httpOnly cookie; fetch will send it automatically
        const response = await fetch("/api/purchases", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Authentication failed. Please log in again.");
            window.location.href = "/login";
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
    <div className="page-shell px-6 lg:px-8">
      <SEO
        title="I Tuoi Acquisti"
        description="Visualizza la tua cronologia acquisti e i protocolli sbloccati su Maxthenics."
      />

      <div className="container-max max-w-5xl">
        <PageHeader
          eyebrow="Billing"
          title="I tuoi acquisti"
          description="Consulta lo storico dei tuoi ordini e verifica i protocolli di allenamento che hai sbloccato nel tuo account."
        />

        {loading && (
          <div className="space-y-3 mt-10" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 w-1/3 bg-white/10 rounded mb-3" />
                <div className="h-3 w-2/3 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div role="alert" className="card border-red-500/20 bg-red-500/[0.08] p-6 mt-10 text-center">
            <AlertCircle className="w-5 h-5 text-red-500 mx-auto mb-3" aria-hidden />
            <p className="text-sm font-medium text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && purchases.length === 0 && (
          <div className="mt-10">
            <EmptyState
              icon={ShoppingBag}
              title="Nessun acquisto trovato"
              description="Non hai ancora sbloccato alcun protocollo. Esplora l'Accademia per iniziare il tuo percorso."
            >
              <Button to="/programs" size="lg" className="w-full">
Esplora l&apos;Accademia
              </Button>
            </EmptyState>
          </div>
        )}

        {!loading && !error && purchases.length > 0 && (
          <div className="space-y-4 mt-10">
            {purchases.map((purchase, index) => (
              <motion.article
                key={purchase.id || purchase._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:bg-zinc-900/60 transition-colors"
              >
                <div className="p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                  <div className="flex items-start gap-4 xl:w-1/3">
                    <div className="w-11 h-11 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-red-500" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base font-bold tracking-tight text-white">
                          Ordine {purchase.orderNumber || `#${purchase.id || purchase._id}`}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-md border text-[10px] font-black uppercase tracking-[0.2em] ${
                            purchase.status === "Completato"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}
                        >
                          {purchase.status || "Sconosciuto"}
                        </span>
                      </div>
                      <span className="meta-mono inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" aria-hidden />
                        {formatDate(purchase.date)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 rounded-xl bg-zinc-950/40 border border-white/10 p-5">
                    {purchase.items && purchase.items.length > 0 ? (
                      <ul className="space-y-3">
                        {purchase.items.map((item, i) => (
                          <li key={i} className="flex justify-between items-center gap-4 text-sm">
                            <span className="text-zinc-300 font-medium line-clamp-1">
                              {item.title}
                            </span>
                            <span className="text-zinc-500 font-bold shrink-0">
                              {item.price === 0 ? "GRATUITO" : `€${item.price.toFixed(2)}`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-zinc-500">
                        Nessun dettaglio disponibile per questo ordine.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between xl:flex-col xl:items-end gap-1 shrink-0 border-t border-white/10 xl:border-t-0 pt-5 xl:pt-0 xl:w-1/6">
                    <span className="meta-mono">Totale</span>
                    <span className="text-2xl font-bold text-white tracking-tight">
                      {purchase.total === 0 ? "FREE" : `€${purchase.total?.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistoryPage;