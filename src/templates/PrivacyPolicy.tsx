// src/templates/PrivacyPolicy.tsx
import React from 'react';
import SEO from '../components/SEO';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 lg:px-8">
      <SEO
        title="Privacy Policy"
        description="Politica sulla privacy di Maxthenics."
      />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">Informativa sulla Privacy</h1>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-zinc-300 space-y-6">
          <p>
            La tua privacy è importante. Questa Informativa sulla Privacy spiega come Maxthenics raccoglie, utilizza, divulga e protegge le tue informazioni quando visiti il sito web e utilizzi i servizi.
          </p>
          <h2 className="text-2xl font-bold text-white">Raccolta delle Informazioni</h2>
          <p>
            Raccogliamo informazioni che ci fornisci volontariamente, come quando ti registri, effettui un acquisto o ci contatti. Possiamo anche raccogliere automaticamente informazioni tecniche sull&apos;utilizzo del sito.
          </p>
          <h2 className="text-2xl font-bold text-white">Utilizzo delle Informazioni</h2>
          <p>
            Le informazioni raccolte vengono utilizzate per fornire e migliorare i nostri servizi, personalizzare la tua esperienza, elaborare le transazioni e comunicare con te.
          </p>
          <h2 className="text-2xl font-bold text-white">Condivisione delle Informazioni</h2>
          <p>
            Non vendiamo né affittiamo le tue informazioni personali a terzi. Le informazioni possono essere condivise con fornitori di servizi terzi che ci assistono nella gestione del sito e nell&apos;erogazione dei servizi, sempre nel rispetto della presente informativa.
          </p>
          <h2 className="text-2xl font-bold text-white">Sicurezza dei Dati</h2>
          <p>
            Adottiamo misure di sicurezza adeguate per proteggere le tue informazioni personali da accessi non autorizzati, alterazioni, divulgazioni o distruzioni.
          </p>
          <h2 className="text-2xl font-bold text-white">Modifiche all&apos;Informativa</h2>
          <p>
            Ci riserviamo il diritto di aggiornare questa Informativa sulla Privacy in qualsiasi momento. Ti invitiamo a rivederla periodicamente.
          </p>
          <p className="text-sm text-zinc-500 italic">
            Ultimo aggiornamento: 19 Aprile 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
