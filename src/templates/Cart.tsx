"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";

function CartBackLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold text-sm group"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden />
      Home
    </Link>
  );
}

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-red-500 animate-spin" aria-label="Caricamento" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <SEO title="Carrello" description="Accedi per visualizzare il carrello." />
        <div className="page-shell flex flex-col items-center justify-center px-6 relative">
          <div className="absolute top-6 left-6">
            <CartBackLink />
          </div>

          <div className="w-full max-w-md">
            <EmptyState
              icon={ShoppingBag}
              title="Accedi per continuare"
              description="Devi aver effettuato l'accesso per vedere il carrello."
            >
              <Button to="/login?redirect=/cart" size="lg" className="w-full">
                Accedi
                <ArrowRight size={16} aria-hidden />
              </Button>
            </EmptyState>
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

  if (cartItems.length === 0) {
    return (
      <>
        <SEO
          title="Carrello Vuoto"
          description="Il tuo carrello è vuoto. Esplora i programmi di calisthenics su Maxthenics e inizia il tuo allenamento."
          keywords="carrello programmi calisthenics, acquista allenamento"
        />
        <div className="page-shell flex flex-col items-center justify-center px-6 relative">
          <div className="absolute top-6 left-6">
            <CartBackLink />
          </div>

          <div className="w-full max-w-md">
            <EmptyState
              icon={ShoppingBag}
              title="Il carrello è vuoto"
              description="Non hai ancora aggiunto alcun programma."
            >
              <Button to="/programs" size="lg" className="w-full">
                Vedi i Programmi
                <ArrowRight size={16} aria-hidden />
              </Button>
            </EmptyState>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Carrello"
        description="Gestisci il tuo carrello di programmi di calisthenics su Maxthenics. Acquista programmi personalizzati per Front Lever, Planche e altro."
        keywords="carrello calisthenics, acquisto programmi, checkout fitness"
      />

      <div className="page-shell px-6 lg:px-8">
        <div className="container-max">
          <div className="mb-8">
            <CartBackLink />
          </div>

          <PageHeader
            eyebrow="Checkout"
            title={
              <>
                Il tuo <span className="text-red-500">carrello</span>
              </>
            }
            description={`${cartItems.length} ${cartItems.length === 1 ? "programma selezionato" : "programmi selezionati"}. L'accesso ai protocolti acquistati è a vita.`}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-zinc-500 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" aria-hidden />
              Svuota
            </Button>
          </PageHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="card flex flex-col sm:flex-row items-center gap-5 p-4"
                >
                  <div className="relative w-full sm:w-28 h-36 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-950">
                    <Image
                      src={item.image || "/maxthenics.png"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="grow text-center sm:text-left min-w-0">
                    <h3 className="text-lg font-bold tracking-tight text-white">{item.title}</h3>
                    {item.level && <p className="meta-mono mt-1.5">{item.level}</p>}
                    <p className="text-2xl font-bold text-red-500 mt-2">€{item.price}</p>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    ariaLabel={`Rimuovi ${item.title} dal carrello`}
                    className="w-full sm:w-auto text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden />
                    <span className="sm:hidden">Rimuovi</span>
                  </Button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="card bg-zinc-900/60 p-6 lg:sticky lg:top-28">
                <h3 className="text-base font-bold tracking-tight text-white">Riepilogo</h3>

                <dl className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <dt className="text-zinc-400">Programmi ({cartItems.length})</dt>
                    <dd className="text-zinc-200">€{cartTotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-zinc-400">Sconto</dt>
                    <dd className="text-emerald-500">-€0.00</dd>
                  </div>
                  <div className="flex justify-between pt-4 mt-1 border-t border-white/10">
                    <dt className="text-base font-bold text-white">Totale</dt>
                    <dd className="text-xl font-bold text-red-500">€{cartTotal.toFixed(2)}</dd>
                  </div>
                </dl>

                {error && (
                  <p role="alert" className="mt-4 text-center text-xs font-medium text-red-400">
                    {error}
                  </p>
                )}

                <Button
                  size="lg"
                  onClick={handleCheckout}
                  loading={loading}
                  className="w-full mt-6"
                >
                  {loading ? "Elaborazione..." : "Checkout"}
                  {!loading && <ArrowRight className="w-4 h-4" aria-hidden />}
                </Button>

                <Link
                  to="/programs"
                  className="mt-4 block text-center text-xs font-bold text-zinc-500 hover:text-white transition-colors"
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