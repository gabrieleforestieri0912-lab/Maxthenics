"use client";

import React from "react";
import LegalPage from "../components/LegalPage";
import { useLanguage } from "../context/LanguageContext";

const TermsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <LegalPage
      seoTitle={t("Termini di Servizio", "Terms of Service")}
      seoDescription={t(
        "I termini e le condizioni per l'utilizzo di Maxthenics.",
        "The terms and conditions for using Maxthenics."
      )}
      eyebrow={t("Legale", "Legal")}
      title={t("Termini di Servizio", "Terms of Service")}
      intro={t(
        "Benvenuto in Maxthenics. Questi termini regolano il tuo accesso e utilizzo dei nostri servizi. Utilizzando Maxthenics, accetti di essere vincolato da questi termini.",
        "Welcome to Maxthenics. These terms govern your access to and use of our services. By using Maxthenics, you agree to be bound by these terms."
      )}
      lastUpdated={t("19 Aprile 2026", "April 19, 2026")}
      sections={[
        {
          heading: t("1. Accettazione dei Termini", "1. Acceptance of Terms"),
          body: t(
            "Accedendo o utilizzando Maxthenics, confermi di aver letto, compreso e accettato di essere vincolato da questi termini. Se non accetti, non utilizzare i nostri servizi.",
            "By accessing or using Maxthenics, you confirm that you have read, understood, and agreed to be bound by these terms. If you do not agree, do not use our services."
          ),
        },
        {
          heading: t("2. Utilizzo dei Servizi", "2. Use of Services"),
          body: t(
            "I nostri servizi sono destinati a persone che desiderano migliorare le proprie capacità di calistenica e fitness. È vietato utilizzare i servizi per scopi illegali o non autorizzati.",
            "Our services are intended for people who want to improve their calisthenics and fitness skills. It is forbidden to use the services for illegal or unauthorized purposes."
          ),
        },
        {
          heading: t("3. Proprietà Intellettuale", "3. Intellectual Property"),
          body: t(
            "Tutti i contenuti, i design, i testi, la grafica e il software su Maxthenics sono di proprietà di Maxthenics e sono protetti dalle leggi sul copyright e sulla proprietà intellettuale.",
            "All content, designs, texts, graphics, and software on Maxthenics are owned by Maxthenics and are protected by copyright and intellectual property laws."
          ),
        },
        {
          heading: t("4. Modifiche ai Servizi", "4. Changes to Services"),
          body: t(
            "Ci riserviamo il diritto di modificare o interrompere i servizi in qualsiasi momento senza preavviso.",
            "We reserve the right to modify or discontinue the services at any time without notice."
          ),
        },
        {
          heading: t("5. Legge Applicabile", "5. Governing Law"),
          body: t(
            "Questi termini saranno regolati e interpretati in conformità con le leggi vigenti.",
            "These terms shall be governed and construed in accordance with applicable laws."
          ),
        },
      ]}
    />
  );
};

export default TermsPage;
