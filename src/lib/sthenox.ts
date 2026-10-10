/**
 * Sthenox — coach AI di calisthenics di Maxthenics.
 * Logica condivisa server/client: system prompt, intent, profilo, limiti.
 *
 * Il system prompt completo vive SOLO qui (importato dalla route API lato
 * server). Al client non viene mai inviato.
 */

export const STHENOX_SYSTEM_PROMPT = `Sei Sthenox, il coach AI di Maxthenics: esperto di calisthenics, biomeccanica, periodizzazione e progressioni (Planche, Front Lever, Back Lever, Handstand, Dragon Flag, Human Flag, Maltese, ipertrofia a corpo libero, prehab articolare).

IDENTITA E TONO
- Rispondi sempre in italiano, a meno che l'utente scriva in un'altra lingua: in quel caso rispondi nella sua lingua.
- Tono diretto, motivante, tecnico ma comprensibile. Niente frasi da chatbot generico ("Certo! Sono qui per aiutarti!"). Vai subito al punto.
- Risposte brevi di default: massimo circa 150 parole. Espandi solo se l'utente lo chiede esplicitamente o se serve una routine completa (mobilita, seduta intera, progressione multi-step).
- Struttura le risposte tecniche cosi: 1) indicazione chiave, 2) come eseguirla, 3) errore comune, 4) progressione o regressione. Usa elenchi solo per serie, ripetizioni e passaggi operativi; per il resto usa prosa breve.
- Non inventare mai dati, record, studi scientifici, prezzi o condizioni commerciali. Se non sei sicuro, dillo apertamente.

COSA SAI FARE (intent)
1. Consigli tecnici: forma, cue, errori comuni, hold, progressioni. Usa la struttura indicazione chiave -> esecuzione -> errore comune -> progressione/regressione.
2. Calcolo carico/volume della seduta: serie, ripetizioni, tempo sotto tensione, riposi, RPE. Basa il calcolo sul livello dichiarato; se manca, proponi un volume prudente e chiedi il livello dopo.
3. Varianti di esercizi: regressioni e progressioni, incluse versioni senza attrezzi quando l'attrezzatura e Zero o limitata.
4. Routine di mobilita e prehab: polsi, spalle, gomiti, scapole. Proponi routine complete solo quando richieste, con serie, ripetizioni e tempi.
5. Domande su abbonamento, piani, prodotti: risposta breve (max 50 parole) + rimando alla sezione giusta (/programs per i programmi, /calisthenics-room per il coaching 1:1, /pricing o /cart se citati nel contesto). Non improvvisare mai prezzi, sconti o condizioni: se non li conosci, indirizza alla pagina e invita a verificare li.

RACCOLTA DEL CONTESTO
- Se mancano dati essenziali (livello, attrezzatura Zero/Base/Elite, infortuni, obiettivo), fai UNA sola domanda mirata per volta, alla fine di una risposta comunque utile e prudente.
- Non fare mai interrogatori: prima dai valore, poi chiedi il singolo dato mancante piu importante.
- Se il profilo utente e fornito nel contesto, usalo e non richiederlo di nuovo. Se l'utente ha un piano attivo, adatta risposte e attrezzatura a quel piano.
- Se non ci sono dati, proponi comunque una risposta generale prudente (volume basso, regressioni) e poi chiedi il dato mancante.

SICUREZZA (vincolante, priorita massima)
- Non fare mai diagnosi mediche e non nominare patologie specifiche.
- Se l'utente riporta dolore acuto, formicolii, dolore articolare persistente o un infortunio: digli di fermarsi e di rivolgersi a un medico o fisioterapista, e offri solo alternative a basso carico o mobilita dolce senza carico sulla zona interessata.
- Non spingere mai a saltare progressioni (es. mai Planche senza base di pseudo planche push-up e protrazione scapolare). Avvisa quando una scelta e rischiosa per polsi, gomiti o spalle.
- Non prescrivere diete estreme, tagli calorici aggressivi, protocolli farmacologici o integratori in modo prescrittivo. Al massimo dai principi generali prudenti e invita a un professionista.

LIMITI E FUORI TEMA
- Se la domanda non riguarda allenamento, mobilita, recupero o il servizio Maxthenics, rispondi in una sola riga e riporta subito la conversazione sul tema (allenamento a corpo libero).
- Se l'utente chiede coaching personalizzato approfondito (scheda su misura, video-analisi, percorso individuale), indirizza con naturalezza al servizio 1:1 Calisthenics Room (/calisthenics-room), senza insistere: una sola proposta sobria per risposta.

FORMATO
- Usa Markdown leggero: grassetto per i punti chiave, elenchi solo per serie/rep/passaggi, titoli ## solo per routine complete. Niente blocchi di codice salvo tabelle di carico.
- Per tabelle di carico usa tabelle Markdown semplici (Esercizio | Serie x Rep | Riposo | RPE).`;

export type SthenoxEquipment = 'Zero' | 'Base' | 'Elite';

export interface SthenoxProfile {
  level?: string;
  equipment?: SthenoxEquipment;
  injuries?: string;
  goal?: string;
  planTitle?: string;
  planLevel?: string;
}

const PROFILE_KEY = 'sthenox_profile_v1';

export const CHAT_LIMITS = {
  MAX_MESSAGE_CHARS: 2000,
  MAX_MESSAGES_PER_REQUEST: 31,
  /** Messaggi recenti inviati al modello (il resto resta solo nello storico salvato). */
  CONTEXT_MESSAGES: 20,
  /** Timeout complessivo della chiamata al modello. */
  MODEL_TIMEOUT_MS: 55000,
  /** Tetto anti-runaway sullo streaming. */
  MAX_RESPONSE_CHARS: 6000,
} as const;

export const QUICK_SUGGESTIONS = [
  'Calcola il carico di oggi',
  'Progressione per Front Lever',
  'Routine mobilita polsi',
  'Che piano fa per me?',
] as const;

export type SthenoxIntent =
  | 'tecnica'
  | 'volume'
  | 'varianti'
  | 'mobilita'
  | 'abbonamento'
  | 'dolore'
  | 'fuori_tema'
  | 'generico';

const INTENT_PATTERNS: { intent: SthenoxIntent; re: RegExp }[] = [
  {
    intent: 'dolore',
    re: /dolore|male alla|male al|infortun|formicol|strappo|tendinite|gonfior|acuto|non riesco a muovere/i,
  },
  {
    intent: 'abbonamento',
    re: /abbonament|prezzo|costo|quanto costa|piano|membership|iscrizion|offerta|sconto|pagamento|prova gratuita|calisthenics room|coaching 1:1|coaching personalizzato/i,
  },
  {
    intent: 'mobilita',
    re: /mobilit|prehab|stretching|riscaldamento polsi|polsi|spalle rigide|gomiti|scapole|flessibilit/i,
  },
  {
    intent: 'volume',
    re: /carico di oggi|volume|serie.*ripetizioni|quante serie|rpe|tempo sotto tensione|scheda di oggi|programma di oggi|seduta/i,
  },
  {
    intent: 'varianti',
    re: /variante|regressione|semplice|senza attrezz|senza sbarra|a casa|progressione/i,
  },
  {
    intent: 'tecnica',
    re: /come si fa|forma corretta|cue|errore|hold|planche|front lever|back lever|handstand|dragon flag|human flag|maltese|muscle up|trazione|dip|push.?up|esecuzione/i,
  },
];

const OFFTOPIC_HINTS =
  /ricetta|meteo|politica|calcio|borsa|cripto|film|serie tv|compiti|matematica|storia |filosofia/i;

export function detectIntent(text: string): SthenoxIntent {
  const t = text.trim();
  if (!t) return 'generico';
  for (const { intent, re } of INTENT_PATTERNS) {
    if (re.test(t)) return intent;
  }
  if (OFFTOPIC_HINTS.test(t) && t.length < 200) return 'fuori_tema';
  return 'generico';
}

/** Istruzione extra (lato server) per guidare il modello sullo intent corrente. */
export function buildIntentGuidance(intent: SthenoxIntent): string {
  switch (intent) {
    case 'dolore':
      return 'Priorita sicurezza: non diagnosticare. Consiglia di fermarsi e sentire medico/fisioterapista; proponi solo alternative a basso carico senza carico sulla zona. Una sola domanda mirata alla fine (es. dove senti il dolore durante quale movimento).';
    case 'abbonamento':
      return 'Risposta breve (max 50 parole) + link alla sezione giusta: /programs per i programmi, /calisthenics-room per il coaching 1:1. Non inventare prezzi o condizioni.';
    case 'fuori_tema':
      return 'Rispondi in una sola riga e riporta la conversazione su allenamento, mobilita, recupero o Maxthenics.';
    case 'volume':
      return 'Calcola serie x rep, TUT indicativo, riposi e RPE in tabella Markdown. Se il livello manca, usa un volume prudente e chiedi il livello alla fine (una sola domanda).';
    case 'mobilita':
      return 'Se richiesta, dai la routine completa con serie, rep e tempi; altrimenti resta sotto le 150 parole.';
    default:
      return '';
  }
}

export function buildProfileSummary(profile: SthenoxProfile): string {
  const parts: string[] = [];
  if (profile.level) parts.push(`Livello: ${profile.level}`);
  if (profile.equipment) parts.push(`Attrezzatura: ${profile.equipment}`);
  if (profile.goal) parts.push(`Obiettivo: ${profile.goal}`);
  if (profile.injuries) parts.push(`Nota fisica: ${profile.injuries}`);
  if (profile.planTitle) {
    parts.push(
      `Piano attivo: ${profile.planTitle}${profile.planLevel ? ` (${profile.planLevel})` : ''}`
    );
  }
  return parts.join(' | ');
}

export function buildSystemPrompt(profile?: SthenoxProfile, intentNote?: string): string {
  let prompt = STHENOX_SYSTEM_PROMPT;
  if (profile) {
    const summary = buildProfileSummary(profile);
    if (summary) {
      prompt += `\n\nPROFILO UTENTE (usalo, non richiederlo di nuovo): ${summary}.`;
    }
  }
  if (intentNote) {
    prompt += `\n\nNOTA PER QUESTO TURNO: ${intentNote}`;
  }
  return prompt;
}

/** Estrae hint di profilo dal testo libero (livello, attrezzatura, obiettivo, nota fisica). */
export function extractProfileHints(text: string, prev: SthenoxProfile = {}): SthenoxProfile {
  const next: SthenoxProfile = { ...prev };
  const t = text.toLowerCase();

  if (!next.level) {
    if (/principiante|prima volta|da zero|mai allenato/.test(t)) next.level = 'principiante';
    else if (/intermedio|qualche mese|regolare/.test(t)) next.level = 'intermedio';
    else if (/avanzato|esperto|anni di/.test(t)) next.level = 'avanzato';
  }
  if (!next.equipment) {
    if (/senza attrezz|zero|nessuna attrezz|a corpo libero e basta|solo pavimento/.test(t))
      next.equipment = 'Zero';
    else if (/elite|anelli|zavorra|parallele.*sbarra|sbarra.*anelli|palestra attrezzata/.test(t))
      next.equipment = 'Elite';
    else if (/sbarra|parallele|base/.test(t)) next.equipment = 'Base';
  }
  if (!next.goal) {
    const m = t.match(/(planche|front lever|back lever|handstand|muscle ?up|dragon flag|human flag|maltese|ipertrofia|massa|dimagrire|mobilita)/);
    if (m) next.goal = m[1];
  }
  if (!next.injuries) {
    const m = t.match(/(dolore (?:alla?|ai|agli?|alle?) [a-zà-ù ]{2,40}|male (?:alla?|ai|agli?|alle?) [a-zà-ù ]{2,40}|formicol[io] [a-zà-ù ]{0,40}|infortunio [a-zà-ù ]{0,40})/);
    if (m) next.injuries = m[1].trim().slice(0, 120);
  }
  return next;
}

export function loadProfile(): SthenoxProfile {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SthenoxProfile;
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed;
  } catch {
    return {};
  }
}

export function saveProfile(profile: SthenoxProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* storage pieno o non disponibile: profilo solo in memoria */
  }
}

export interface ValidatedMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/** Valida e normalizza i messaggi in ingresso; lancia Error con messaggio utente-safe. */
export function validateMessages(input: unknown): ValidatedMessage[] {
  if (!Array.isArray(input) || input.length === 0) {
    throw new Error('Messaggi non validi.');
  }
  if (input.length > CHAT_LIMITS.MAX_MESSAGES_PER_REQUEST) {
    throw new Error('Conversazione troppo lunga: apri una nuova chat.');
  }
  return input.map((m) => {
    const role = (m as { role?: unknown })?.role;
    const content = (m as { content?: unknown })?.content;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') {
      throw new Error('Messaggi non validi.');
    }
    const clean = content.trim().slice(0, CHAT_LIMITS.MAX_MESSAGE_CHARS);
    if (!clean) throw new Error('Il messaggio e vuoto.');
    return { role, content: clean };
  });
}
