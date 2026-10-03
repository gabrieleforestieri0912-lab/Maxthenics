import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Program from '@/models/Program';
import { getEnv } from '@/lib/env';
import { getUserId } from '@/lib/auth';
import { z } from 'zod';
import { isRateLimited, getRateLimitHeaders, getClientId } from '@/lib/rateLimiter';
import { getAI } from '@/lib/clients';

const PROGRAM_PROMPT = `Sei un personal trainer specializzato in Calisthenics. Genera un programma di allenamento in formato JSON con questa struttura esatta:
{
  "title": "Nome programma accattivante e descrittivo",
  "description": "Descrizione del programma (2-3 frasi)",
  "level": "Beginner" | "Intermediate" | "Advanced",
  "exercises": [
    { "name": "Nome esercizio in italiano", "sets": 3, "reps": "8-12", "rest": "90s", "notes": "Nota tecnica specifica sull'esecuzione" }
  ]
}
REGOLE FONDAMENTALI:
- Ogni esercizio DEVE essere specifico per Calisthenics (senza pesi, bilancieri o macchine)
- Usa solo esercizi a corpo libero o con l'attrezzatura indicata
- Le note devono essere tecniche e utili (es. "Mantieni le scapole in depressione", "Espira nella fase concentrica")
- Distribuisci gli esercizi uniformemente tra i giorni della settimana
- Adatta difficoltà, volume e intensità in base al livello, età, peso e obiettivi dell'atleta
- Includi sempre un riscaldamento adeguato nel primo giorno
- Genera solo JSON valido, nessun altro testo.`;

const TRAINING_TYPE_GUIDES: Record<string, string> = {
  'street-workout': 'Street Workout: esercizi esplosivi, dinamici, stile libero. Includi muscle-up, tricking, movimenti a slancio, transizioni veloci. Enfasi su potenza e agilità.',
  'skill-work': 'Skill Work: progressioni tecniche verso skill specifiche (Front Lever, Planche, Handstand, Back Lever, V-sit). Serie a basso volume, alta qualità. Include lavoro preparatorio e accessorio per ogni skill.',
  'freestyle': 'Freestyle & Flow: combinazioni creative di movimenti, transizioni fluide tra esercizi. Enfasi sulla connessione tra skill e sulla fluidità. Include sequenze e combo.',
  'power': 'Power & Static Holds: massimale isometrico, tenute statiche lunghe, forza massima. Include progressioni di difficoltà crescente per tenute, accessori di força pura.',
  'rings': 'Anelli & Gymnastics: lavoro agli anelli (support, dip, muscle-up, levet, planche progression). Include elementi di ginnastica artistica, controllo e stabilità.',
  'hypertrophy': 'Ipertrofia & Estetica: volume alto, ripetizioni 8-15, recuperi brevi. Esercizi mirati per ogni gruppo muscolare. Enfasi su pump, definizione e simmetria.',
  'endurance': 'Endurance & High Rep: resistenza muscolare, alte ripetizioni (15-20+), circuiti, poco recupero. Enfasi su capacità aerobica e resistenza alla fatica.',
};

const GenerateProgramSchema = z.object({
  preferences: z.object({
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    trainingType: z.string().max(50).optional(),
    goal: z.string().max(100).optional(),
    daysPerWeek: z.number().min(1).max(7).optional(),
    equipment: z.string().max(200).optional(),
    intensity: z.string().max(50).optional(),
    sessionDuration: z.string().max(10).optional(),
    bodyFocus: z.string().max(500).optional(),
    age: z.string().max(5).optional(),
    weight: z.string().max(5).optional(),
    height: z.string().max(5).optional(),
    gender: z.string().max(20).optional(),
    experience: z.string().max(20).optional(),
    goals: z.string().max(1000).optional(),
    injuries: z.string().max(1000).optional(),
  }),
  userId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const clientId = getClientId(request);
    const rateLimitKey = `aiprogram_${clientId}`;
    const rateLimit = isRateLimited(rateLimitKey, 'ai/generate-program');

    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        { message: 'Troppe richieste. Riprova tra qualche minuto.' },
        { status: 429 }
      );
      Object.entries(getRateLimitHeaders(rateLimitKey, 'ai/generate-program')).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    await dbConnect();

    const body = await request.json();
    const validation = GenerateProgramSchema.safeParse(body);

    if (!validation.success) {
      const response = NextResponse.json(
        { message: 'Dati non validi' },
        { status: 400 }
      );
      Object.entries(getRateLimitHeaders(rateLimitKey, 'ai/generate-program')).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    const { preferences } = validation.data;
    const userId = getUserId(request);

    const trainingTypeGuide = preferences?.trainingType
      ? TRAINING_TYPE_GUIDES[preferences.trainingType] || ''
      : '';

    const equipmentDetail = preferences?.equipment
      ? ({
          'nessuna': 'Nessun attrezzo — solo esercizi a corpo libero (push-up, pull-up, squat, dip a terra, ecc.)',
          'sbarra': 'Sbarra per trazioni (pull-up bar)',
          'parallele': 'Parallette / Dip bars (due supporti paralleli per dip, pike push-up, L-sit)',
          'anelli': 'Anelli da ginnastica (regolabili)',
          'bande': 'Bande elastiche di resistenza (pull-up assistiti, stretching, resistenza)',
          'zavorra': 'Zavorra (weight vest o cintura zavorrata per trazioni, dip, push-up)',
          'base': 'Sbarra per trazioni + Parallelette — attrezzatura base per calisthenics',
          'completo': 'Attrezzatura completa: sbarra, parallele, anelli, bande elastiche, zavorra',
        } as Record<string, string>)[preferences.equipment] || preferences.equipment
      : 'Nessuna attrezzatura specifica';

    const bodyFocusText = preferences?.bodyFocus
      ? `Concentrati su queste aree del corpo: ${preferences.bodyFocus}.`
      : 'Lavora tutto il corpo in modo bilanciato.';

    const goalsText = preferences?.goals
      ? `Obiettivi specifici dell'atleta: "${preferences.goals}"`
      : '';

    const injuriesText = preferences?.injuries
      ? `AVVERTENZE MEDICHE - Infortuni/limitazioni da rispettare ASSOLUTAMENTE: "${preferences.injuries}". Adatta TUTTI gli esercizi per evitare aggravamenti. Se necessario sostituisci esercizi a rischio con alternative sicure.`
      : 'Nessuna limitazione medica segnalata.';

    const prompt = `${PROGRAM_PROMPT}

## DATI DELL'ATLETA
- Età: ${preferences?.age || 'Non specificata'} anni
- Peso: ${preferences?.weight || 'Non specificato'} kg
- Altezza: ${preferences?.height || 'Non specificata'} cm
- Sesso: ${preferences?.gender === 'male' ? 'Maschile' : preferences?.gender === 'female' ? 'Femminile' : 'Non specificato'}
- Anni di esperienza: ${preferences?.experience || 'Non specificata'}

## LIVELLO
${preferences?.level === 'Beginner' ? 'PRINCIPIANTE: esercizi fondamentali, tecnica di base, progressioni graduali. Volume moderato (2-3 serie), recuperi più lunghi. Niente skill avanzate.' : preferences?.level === 'Intermediate' ? 'INTERMEDIO: esercizi di difficoltà media, prime skill, combinazioni. Volume medio-alto (3-4 serie), recuperi standard. Tecnica consolidata.' : 'AVANZATO: esercizi complessi, skill avanzate, massima intensità. Volume alto (4-5+ serie), recuperi brevi. Lavoro su punti deboli.'}

## TIPO DI ALLENAMENTO
${trainingTypeGuide || 'Calisthenics generale: bilanciato tra forza, ipertrofia e controllo.'}

## STRUTTURA SETTIMANALE
- Frequenza: ${preferences?.daysPerWeek || 3} giorni / settimana
- Durata sessione: ${preferences?.sessionDuration || '60'} minuti
- ${bodyFocusText}

## INTENSITÀ
${preferences?.intensity === 'baja' ? 'BASSA: RIR 3-4, serie non al cedimento, recuperi lunghi. Adatto a principianti o sessioni di recupero.' : preferences?.intensity === 'alta' ? 'ALTA: RIR 0-1, serie al cedimento tecnico, recuperi brevi. Massimo impegno richiesto.' : 'MEDIA: RIR 1-2, equilibrio tra sforzo e qualità, recuperi standard.'}

## ATTREZZATURA
${equipmentDetail}

## OBIETTIVO PRINCIPALE
${preferences?.goal === 'ipertrofia' ? 'Ipertrofia: aumentare massa muscolare e definizione. Volume 8-15 ripetizioni, recuperi 60-90s.' : preferences?.goal === 'forza' ? 'Forza pura: rafforzare sistema neuromuscolare. Basse ripetizioni (3-6), recuperi lunghi (2-3min).' : preferences?.goal === 'resistenza' ? 'Resistenza: migliorare capacità cardiovascolare e muscolare. Alte ripetizioni (15+), recuperi brevi (30-45s).' : preferences?.goal === 'skills' ? 'Skills: padroneggiare mosse avanzate. Qualità > quantità, lavoro tecnico dedicato.' : preferences?.goal === 'dimagrimento' ? 'Dimagrimento: ridurre massa grassa. Circuiti, superset, alto dispendio calorico.' : preferences?.goal === 'mobilita' ? 'Mobilità e recupero: flessibilità articolare, prevenzione infortuni. Allungamento e controllo.' : 'Bilanciato: combinazione di forza, ipertrofia e resistenza.'}

${goalsText}

${injuriesText}

Genera almeno 4-6 esercizi per giorno con dettagli precisi su serie, ripetizioni e recupero.`;


    try {
      const completion = await getAI().chat.completions.create({
        model: getEnv().XKIRO_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4096,
      });

      let programData;
      try {
        const responseText = completion.choices[0]?.message?.content || '';
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          programData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch (parseError) {
        console.error('Parse error:', parseError instanceof Error ? parseError.message : 'Unknown error');
        return NextResponse.json(
          { message: 'Errore nella generazione del programma. Riprova.' },
          { status: 500 }
        );
      }

      if (!programData.title || !programData.exercises || !Array.isArray(programData.exercises)) {
        return NextResponse.json(
          { message: 'Programma generato non valido' },
          { status: 500 }
        );
      }

      const program = await Program.create({
        ...programData,
        userId: userId || undefined,
        price: programData.level === 'Advanced' ? 19.99 : programData.level === 'Intermediate' ? 12.99 : 7.99,
        createdAt: new Date(),
      });

      const apiResponse = NextResponse.json(program);

      Object.entries(getRateLimitHeaders(rateLimitKey, 'ai/generate-program')).forEach(([key, value]) => {
        apiResponse.headers.set(key, value);
      });

      return apiResponse;
    } catch (aiError) {
      console.error('xKiro AI error:', aiError instanceof Error ? aiError.message : 'Unknown error');
      return NextResponse.json(
        { message: 'Servizio AI non disponibile. Riprova più tardi.' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Generate program error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { message: 'Errore del server' },
      { status: 500 }
    );
  }
}
