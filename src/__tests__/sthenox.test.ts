import { describe, it, expect } from 'vitest';
import {
  STHENOX_SYSTEM_PROMPT,
  buildIntentGuidance,
  buildSystemPrompt,
  detectIntent,
  extractProfileHints,
  validateMessages,
} from '@/lib/sthenox';

describe('detectIntent', () => {
  it('routes pain reports to dolore', () => {
    expect(detectIntent('Ho un dolore acuto alla spalla')).toBe('dolore');
    expect(detectIntent('Sento formicolio alle dita')).toBe('dolore');
  });

  it('routes pricing questions to abbonamento', () => {
    expect(detectIntent('Quanto costa il coaching 1:1?')).toBe('abbonamento');
    expect(detectIntent('Che piano fa per me?')).toBe('abbonamento');
  });

  it('routes volume/tecnica/mobilita correctly', () => {
    expect(detectIntent('Calcola il carico di oggi')).toBe('volume');
    expect(detectIntent('Come si fa il front lever?')).toBe('tecnica');
    expect(detectIntent('Routine mobilita polsi')).toBe('mobilita');
    expect(detectIntent('Variante senza attrezzi per le trazioni')).toBe('varianti');
  });
});

describe('validateMessages', () => {
  it('rejects invalid payloads', () => {
    expect(() => validateMessages(null)).toThrow();
    expect(() => validateMessages([])).toThrow();
    expect(() => validateMessages([{ role: 'user' }])).toThrow();
  });

  it('trims and caps message length', () => {
    const msgs = validateMessages([{ role: 'user', content: `  ${'a'.repeat(5000)}  ` }]);
    expect(msgs[0].content.length).toBeLessThanOrEqual(2000);
  });
});

describe('profile', () => {
  it('extracts level/equipment/goal hints without overwriting', () => {
    const p = extractProfileHints('Sono principiante, mi alleno senza attrezzi per la planche', {});
    expect(p.level).toBe('principiante');
    expect(p.equipment).toBe('Zero');
    expect(p.goal).toBe('planche');
    const kept = extractProfileHints('ciao', { ...p, level: 'avanzato' });
    expect(kept.level).toBe('avanzato');
  });

  it('injects saved profile into the system prompt (server-side only)', () => {
    const prompt = buildSystemPrompt({ level: 'principiante', equipment: 'Zero' }, 'nota');
    expect(prompt).toContain('principiante');
    expect(prompt).toContain('Zero');
    expect(STHENOX_SYSTEM_PROMPT).toContain('Non fare mai diagnosi mediche');
    expect(buildIntentGuidance('abbonamento')).toContain('/programs');
  });
});
