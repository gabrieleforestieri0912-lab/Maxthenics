import React from "react";
import LegalPage from "../components/LegalPage";

const LAST_UPDATED = "19 Aprile 2026";

const PrivacyPolicyPage: React.FC = () => (
  <LegalPage
    seoTitle="Privacy Policy"
    seoDescription="Politica sulla privacy di Maxthenics."
    eyebrow="Legale"
    title="Informativa sulla Privacy"
    intro="La tua privacy è importante. Questa informativa spiega come Maxthenics raccoglie, utilizza, divulga e protegge le tue informazioni quando visiti il sito web e utilizzi i servizi."
    lastUpdated={LAST_UPDATED}
    sections={[
      {
        heading: "Raccolta delle Informazioni",
        body: "Raccogliamo informazioni che ci fornisci volontariamente, come quando ti registri, effettui un acquisto o ci contatti. Possiamo anche raccogliere automaticamente informazioni tecniche sull'utilizzo del sito.",
      },
      {
        heading: "Utilizzo delle Informazioni",
        body: "Le informazioni raccolte vengono utilizzate per fornire e migliorare i nostri servizi, personalizzare la tua esperienza, elaborare le transazioni e comunicare con te.",
      },
      {
        heading: "Condivisione delle Informazioni",
        body: "Non vendiamo né affittiamo le tue informazioni personali a terzi. Le informazioni possono essere condivise con fornitori di servizi terzi che ci assistono nella gestione del sito e nell'erogazione dei servizi, sempre nel rispetto della presente informativa.",
      },
      {
        heading: "Sicurezza dei Dati",
        body: "Adottiamo misure di sicurezza adeguate per proteggere le tue informazioni personali da accessi non autorizzati, alterazioni, divulgazioni o distruzioni.",
      },
      {
        heading: "Modifiche all'Informativa",
        body: "Ci riserviamo il diritto di aggiornare questa informativa in qualsiasi momento. Ti invitiamo a rivederla periodicamente.",
      },
    ]}
  />
);

export default PrivacyPolicyPage;