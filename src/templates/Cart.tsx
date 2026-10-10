"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";

function CartBackLink() {
  const { t } = useLanguage();
  return (
    <Link
      to="/programs"
      className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors font-bold text-sm group"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden />
      {t("Programmi", "Programs")}
    </Link>
  );
}

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClearCart = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearCart();
    setConfirmClear(false);
  };

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
        <SEO
          title={t("Carrello", "Cart")}
          description={t("Accedi per visualizzare il carrello.", "Log in to view your cart.")}
        />
        <div className="page-shell flex flex-col items-center justify-center px-6 relative">
          <div className="absolute top-6 left-6">
            <CartBackLink />
          </div>

          <div className="w-full max-w-md">
            <EmptyState
              icon={ShoppingBag}
              title={t("Accedi per continuare", "Log in to continue")}
              description={t(
                "Devi aver effettuato l'accesso per vedere il carrello.",
                "You must be logged in to see your cart."
              )}
            >
              <Button to="/login?redirect=/cart" size="lg" className="w-full">
                {t("Accedi", "Log in")}
                <ArrowRight size={16} aria-hidden />
              </Button>
            </EmptyState>
          </div>
        </div>
      </>
    );
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0 || loading) return;
    try {
      setLoading(true);
      setError(null);
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

      const data = await response.json().catch(() => null);

      if (response.ok && data?.url) {
        window.location.href = data.url;
      } else {
        setError(
          t("Errore durante la creazione della sessione di checkout: ", "Error creating the checkout session: ") +
            (data?.message || t("Errore sconosciuto", "Unknown error"))
        );
      }
    } catch (err) {
      console.error("Errore checkout:", err);
      setError(t("Si è verificato un errore durante il checkout.", "An error occurred during checkout."));
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <SEO
          title={t("Carrello Vuoto", "Empty Cart")}
          description={t(
            "Il tuo carrello è vuoto. Esplora i programmi di calisthenics su Maxthenics e inizia il tuo allenamento.",
            "Your cart is empty. Explore Maxthenics calisthenics programs and start training."
          )}
          keywords="carrello programmi calisthenics, acquista allenamento"
        />
        <div className="page-shell flex flex-col items-center justify-center px-6 relative">
          <div className="absolute top-6 left-6">
            <CartBackLink />
          </div>

          <div className="w-full max-w-md">
            <EmptyState
              icon={ShoppingBag}
              title={t("Il carrello è vuoto", "Your cart is empty")}
              description={t(
                "Non hai ancora aggiunto alcun programma.",
                "You haven't added any program yet."
              )}
            >
              <Button to="/programs" size="lg" className="w-full">
                {t("Vedi i Programmi", "See Programs")}
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
        title={t("Carrello", "Cart")}
        description={t(
          "Gestisci il tuo carrello di programmi di calisthenics su Maxthenics. Acquista programmi personalizzati per Front Lever, Planche e altro.",
          "Manage your Maxthenics calisthenics program cart. Buy custom programs for Front Lever, Planche and more."
        )}
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
                {t("Il tuo", "Your")} <span className="text-red-500">{t("carrello", "cart")}</span>
              </>
            }
            description={t(
              `${cartItems.length} ${cartItems.length === 1 ? "programma selezionato" : "programmi selezionati"}. L'accesso ai protocolli acquistati è a vita.`,
              `${cartItems.length} ${cartItems.length === 1 ? "selected program" : "selected programs"}. Lifetime access to purchased protocols.`
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearCart}
              onBlur={() => setConfirmClear(false)}
              className={confirmClear ? "text-red-500" : "text-zinc-500 hover:text-red-500"}
            >
              <Trash2 className="w-4 h-4" aria-hidden />
              {confirmClear ? t("Confermi?", "Confirm?") : t("Svuota", "Clear")}
            </Button>
          </PageHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="card flex flex-col sm:flex-row items-center gap-5 p-4"
                >
                  <div className="relative w-full sm:w-28 h-36 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-950">
                    <Image
                      src={item.image || "/maxthenics.png"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="grow text-center sm:text-left min-w-0">
                    <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">{item.title}</h3>
                    {item.level && <p className="meta-mono mt-1.5">{item.level}</p>}
                    <p className="text-2xl font-bold text-red-500 mt-2">€{item.price.toFixed(2)}</p>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    ariaLabel={t(`Rimuovi ${item.title} dal carrello`, `Remove ${item.title} from cart`)}
                    className="w-full sm:w-auto text-zinc-500 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden />
                    <span className="sm:hidden">{t("Rimuovi", "Remove")}</span>
                  </Button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="card bg-white dark:bg-zinc-900/60 p-6 lg:sticky lg:top-28">
                <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">{t("Riepilogo", "Summary")}</h3>

                <dl className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <dt className="text-zinc-500 dark:text-zinc-400">{t("Programmi", "Programs")} ({cartItems.length})</dt>
                    <dd className="text-zinc-900 dark:text-zinc-200">€{cartTotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between pt-4 mt-1 border-t border-zinc-200 dark:border-white/10">
                    <dt className="text-base font-bold text-zinc-900 dark:text-white">{t("Totale", "Total")}</dt>
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
                  {loading ? t("Elaborazione...", "Processing...") : t("Vai al pagamento", "Go to payment")}
                  {!loading && <ArrowRight className="w-4 h-4" aria-hidden />}
                </Button>

                <p className="meta-mono mt-4 flex items-center justify-center gap-1.5 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" aria-hidden />
                  {t("Pagamento sicuro con Stripe", "Secure payment with Stripe")}
                </p>

                <Link
                  to="/programs"
                  className="mt-4 block text-center text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  {t("Continua lo shopping", "Continue shopping")}
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