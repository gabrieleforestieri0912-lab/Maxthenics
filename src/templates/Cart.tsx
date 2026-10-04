"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import Image from 'next/image';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <SEO
          title="Carrello"
          description="Accedi per visualizzare il carrello."
        />
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 sm:px-6 relative">
          <Link
            to="/"
            className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
          >
            <ArrowRight className="w-4 h-4 -rotate-45 transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Home</span>
          </Link>
          <div className="bg-zinc-900/50 p-6 sm:p-12 rounded-2xl sm:rounded-[2.5rem] border border-white/10 text-center max-w-md w-full">
            <ShoppingBag className="w-10 h-10 sm:w-14 sm:h-14 text-zinc-500 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-2xl font-black text-white mb-3">
              Accedi per continuare
            </h2>
            <p className="text-zinc-400 text-sm mb-8">
              Devi aver effettuato l&apos;accesso per vedere il carrello.
            </p>
            <Link
              to="/login?redirect=/cart"
              className="inline-block w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black py-3 sm:py-4 rounded-xl transition-all text-sm uppercase tracking-widest"
            >
              Accedi
            </Link>
          </div>
        </div>
      </>
    );
  }

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(
          "Errore durante la creazione della sessione di checkout: " +
          (data.message || "Errore sconosciuto")
        );
      }
    } catch (err) {
      console.error("Errore checkout:", err);
      setError("Si è verificato un errore durante il checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <>
        <SEO
          title="Carrello Vuoto"
          description="Il tuo carrello è vuoto. Esplora i programmi di calisthenics su Maxthenics e inizia il tuo Allenamento."
          keywords="carrello programmi calisthenics, acquista allenamento"
        />
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 sm:px-6 relative">
          {/* Home link top left */}
          <Link
            to="/"
            className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
          >
            <ArrowRight className="w-4 h-4 -rotate-45 transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Home</span>
          </Link>

          <div className="bg-zinc-900/50 p-6 sm:p-12 rounded-2xl sm:rounded-[2.5rem] border border-white/10 text-center max-w-md w-full">
            <div className="bg-zinc-800 w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-8">
              <ShoppingBag className="w-6 h-6 sm:w-10 sm:h-10 text-zinc-500" />
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Il carrello è vuoto
            </h2>
            <p className="text-zinc-400 mb-6 sm:mb-10 text-sm sm:text-base">
              Non hai ancora aggiunto alcun programma.
            </p>
            <Link
              to="/programs"
              className="inline-block w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all text-sm sm:text-base"
            >
              Vedi i Programmi
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Non-empty cart
  return (
    <>
      <SEO
        title="Carrello"
        description="Gestisci il tuo carrello di programmi di calisthenics su Maxthenics. Acquista programmi personalizzati per Front Lever, Planche e altro."
        keywords="carrello calisthenics, acquisto programmi, checkout fitness"
      />
      <div className="min-h-screen bg-black text-white pt-16 pb-16 px-4 sm:px-6 lg:px-8 relative">
        {/* Home link top left */}
        <Link
          to="/"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 -rotate-45 transform group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Home</span>
        </Link>

        <div className="max-w-5xl mx-auto">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-6 sm:mb-8 transition-colors font-bold text-sm sm:text-base"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Torna ai Programmi
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
              IL TUO <span className="text-red-600">CARRELLO</span>
            </h1>
            <button
              onClick={handleClearCart}
              className="text-zinc-500 hover:text-red-500 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors self-start md:self-center"
            >
              <Trash2 className="w-4 h-4" />
              Svuota
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900/50 border border-white/10 p-3 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center gap-3 sm:gap-6"
                >
                <div className="w-full sm:w-20 h-32 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 relative">
                  <Image
                    src={item.image || '/maxthenics.png'}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                  <div className="grow text-center sm:text-left">
                    <h3 className="text-base sm:text-xl font-bold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm mb-1 sm:mb-2 uppercase tracking-widest font-black">
                      {item.level}
                    </p>
                    <p className="text-lg sm:text-2xl font-black text-red-500">
                      €{item.price}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="w-full sm:w-auto p-3 sm:p-3 bg-zinc-800 hover:bg-red-900/30 text-zinc-400 hover:text-red-500 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sm:hidden font-bold uppercase text-xs tracking-widest">
                      Rimuovi
                    </span>
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-zinc-900 border border-white/10 p-4 sm:p-8 rounded-2xl sm:rounded-[2.5rem] sticky top-24 sm:top-32">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-8">
                  Riepilogo
                </h3>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <div className="flex justify-between text-zinc-400 text-sm">
                    <span>Programmi ({cartItems.length})</span>
                    <span>€{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400 text-sm">
                    <span>Sconto</span>
                    <span className="text-green-500">-€0.00</span>
                  </div>
                  <div className="pt-3 sm:pt-4 border-t border-white/10 flex justify-between">
                    <span className="text-lg sm:text-xl font-bold text-white">
                      Totale
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-red-600">
                      €{cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-xs font-medium mt-3 text-center">{error}</p>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold py-3 sm:py-5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Elaborazione...
                    </>
                  ) : (
                    <>
                      Checkout
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </>
                  )}
                </button>

                <Link
                  to="/programs"
                  className="block text-center mt-4 sm:mt-6 text-zinc-500 hover:text-white text-xs sm:text-sm font-bold transition-colors"
                >
                  Continua lo shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
