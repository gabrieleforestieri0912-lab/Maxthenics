"use client";

import React from "react";
import LegalPage from "../components/LegalPage";
import { useLanguage } from "../context/LanguageContext";

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <LegalPage
      seoTitle={t("Privacy Policy", "Privacy Policy")}
      seoDescription={t(
        "Politica sulla privacy di Maxthenics.",
        "Maxthenics privacy policy."
      )}
      eyebrow={t("Legale", "Legal")}
      title={t("Informativa sulla Privacy", "Privacy Policy")}
      intro={t(
        "La tua privacy è importante. Questa informativa spiega come Maxthenics raccoglie, utilizza, divulga e protegge le tue informazioni quando visiti il sito web e utilizzi i servizi.",
        "Your privacy matters. This policy explains how Maxthenics collects, uses, discloses, and protects your information when you visit the website and use the services."
      )}
      lastUpdated={t("19 Aprile 2026", "April 19, 2026")}
      sections={[
        {
          heading: t("Raccolta delle Informazioni", "Information Collection"),
          body: t(
            "Raccogliamo informazioni che ci fornisci volontariamente, come quando ti registri, effettui un acquisto o ci contatti. Possiamo anche raccogliere automaticamente informazioni tecniche sull'utilizzo del sito.",
            "We collect information you voluntarily provide to us, such as when you sign up, make a purchase, or contact us. We may also automatically collect technical information about your use of the site."
          ),
        },
        {
          heading: t("Utilizzo delle Informazioni", "Use of Information"),
          body: t(
            "Le informazioni raccolte vengono utilizzate per fornire e migliorare i nostri servizi, personalizzare la tua esperienza, elaborare le transazioni e comunicare con te.",
            "The information collected is used to provide and improve our services, personalize your experience, process transactions, and communicate with you."
          ),
        },
        {
          heading: t("Condivisione delle Informazioni", "Sharing of Information"),
          body: t(
            "Non vendiamo né affittiamo le tue informazioni personali a terzi. Le informazioni possono essere condivise con fornitori di servizi terzi che ci assistono nella gestione del sito e nell'erogazione dei servizi, sempre nel rispetto della presente informativa.",
            "We do not sell or rent your personal information to third parties. Information may be shared with third-party service providers who assist us in managing the site and delivering services, always in compliance with this policy."
          ),
        },
        {
          heading: t("Sicurezza dei Dati", "Data Security"),
          body: t(
            "Adottiamo misure di sicurezza adeguate per proteggere le tue informazioni personali da accessi non autorizzati, alterazioni, divulgazioni o distruzioni.",
            "We take appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction."
          ),
        },
        {
          heading: t("Modifiche all'Informativa", "Changes to This Policy"),
          body: t(
            "Ci riserviamo il diritto di aggiornare questa informativa in qualsiasi momento. Ti invitiamo a rivederla periodicamente.",
            "We reserve the right to update this policy at any time. We invite you to review it periodically."
          ),
        },
      ]}
    />
  );
};

export default PrivacyPolicyPage;
