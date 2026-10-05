import React from "react";
import LegalPage from "../components/LegalPage";

const LAST_UPDATED = "19 Aprile 2026";

const TermsPage: React.FC = () => (
  <LegalPage
    seoTitle="Termini di Servizio"
    seoDescription="I termini e le condizioni per l'utilizzo di Maxthenics."
    eyebrow="Legale"
    title="Termini di Servizio"
    intro="Benvenuto in Maxthenics. Questi termini regolano il tuo accesso e utilizzo dei nostri servizi. Utilizzando Maxthenics, accetti di essere vincolato da questi termini."
    lastUpdated={LAST_UPDATED}
    sections={[
      {
        heading: "1. Accettazione dei Termini",
        body: "Accedendo o utilizzando Maxthenics, confermi di aver letto, compreso e accettato di essere vincolato da questi termini. Se non accetti, non utilizzare i nostri servizi.",
      },
      {
        heading: "2. Utilizzo dei Servizi",
        body: "I nostri servizi sono destinati a persone che desiderano migliorare le proprie capacità di calistenica e fitness. È vietato utilizzare i servizi per scopi illegali o non autorizzati.",
      },
      {
        heading: "3. Proprietà Intellettuale",
        body: "Tutti i contenuti, i design, i testi, la grafica e il software su Maxthenics sono di proprietà di Maxthenics e sono protetti dalle leggi sul copyright e sulla proprietà intellettuale.",
      },
      {
        heading: "4. Modifiche ai Servizi",
        body: "Ci riserviamo il diritto di modificare o interrompere i servizi in qualsiasi momento senza preavviso.",
      },
      {
        heading: "5. Legge Applicabile",
        body: "Questi termini saranno regolati e interpretati in conformità con le leggi vigenti.",
      },
    ]}
  />
);

export default TermsPage;