// src/templates/TermsPage.tsx
import React from 'react';
import SEO from '../components/SEO';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 lg:px-8">
      <SEO
        title="Termini di Servizio"
        description="I termini e le condizioni per l'utilizzo di Maxthenics."
      />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">Termini di Servizio</h1>
        <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-[2.5rem] text-zinc-300 space-y-6">
          <p>
            Benvenuto in Maxthenics. Questi Termini di Servizio regolano il tuo accesso e utilizzo dei nostri servizi. Utilizzando Maxthenics, accetti di essere vincolato da questi termini.
          </p>
          <h2 className="text-2xl font-bold text-white">1. Accettazione dei Termini</h2>
          <p>
            Accedendo o utilizzando Maxthenics, confermi di aver letto, compreso e accettato di essere vincolato da questi Termini. Se non accetti, non utilizzare i nostri servizi.
          </p>
          <h2 className="text-2xl font-bold text-white">2. Utilizzo dei Servizi</h2>
          <p>
            I nostri servizi sono destinati a persone che desiderano migliorare le proprie capacità di calistenica e fitness. È vietato utilizzare i servizi per scopi illegali o non autorizzati.
          </p>
          <h2 className="text-2xl font-bold text-white">3. Proprietà Intellettuale</h2>
          <p>
            Tutti i contenuti, i design, i testi, la grafica e il software su Maxthenics sono di proprietà di Maxthenics e sono protetti dalle leggi sul copyright e sulla proprietà intellettuale.
          </p>
          <h2 className="text-2xl font-bold text-white">4. Modifiche ai Servizi</h2>
          <p>
            Ci riserviamo il diritto di modificare o interrompere i servizi in qualsiasi momento senza preavviso.
          </p>
          <h2 className="text-2xl font-bold text-white">5. Legge Applicabile</h2>
          <p>
            Questi Termini saranno regolati e interpretati in conformità con le leggi vigenti.
          </p>
          <p className="text-sm text-zinc-500 italic">
            Ultimo aggiornamento: 19 Aprile 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
