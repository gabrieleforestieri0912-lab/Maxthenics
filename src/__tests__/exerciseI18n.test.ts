import { describe, it, expect } from 'vitest';
import { localizeList, localizeNote, tr, MUSCLE_GROUP_EN } from '@/data/exerciseI18n';

describe('exerciseI18n', () => {
  it('translates muscle groups to EN', () => {
    expect(localizeList(['Petto', 'Tricipiti'], 'en')).toEqual(['Chest', 'Triceps']);
    expect(localizeList(['Core'], 'it')).toEqual(['Core']);
  });

  it('translates short progression phrases, passes EN through', () => {
    expect(tr('aumenta rep', 'en')).toBe('add reps');
    expect(tr('straddle front lever hold', 'en')).toBe('straddle front lever hold');
    expect(tr('aumenta rep', 'it')).toBe('aumenta rep');
  });

  it('translates coach notes with fallback', () => {
    expect(localizeNote('Controllo totale', 'en')).toBe('Total control');
    expect(localizeNote('Unknown note xyz', 'en')).toBe('Unknown note xyz');
    expect(localizeNote('Controllo totale', 'it')).toBe('Controllo totale');
    expect(localizeNote(undefined, 'en')).toBeUndefined();
  });

  it('covers every muscle group used by the exercise DB', () => {
    const used = [
      'Petto', 'Tricipiti', 'Quadricipiti', 'Glutei', 'Core', 'Schiena', 'Bicipiti',
      'Full Body', 'Spalle', 'Femorali', 'Polsi', 'Hip Flexors', 'Obliqui',
      'Spalla Posteriore', 'Larghe del Dorso', 'Latissimus', 'Braccia', 'Anche',
      'Avambracci', 'Spina Dorsale', 'Cinetic Chain',
    ];
    for (const m of used) {
      expect(MUSCLE_GROUP_EN[m], m).toBeTruthy();
    }
  });
});
