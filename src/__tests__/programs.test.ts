import { describe, it, expect } from 'vitest';
import {
  programData,
  getAllProgramsList,
  getProgramByIdList,
  localizeProgram,
  type ProgramDataItem,
} from '@/data/programs';

const ALL_IDS = [101, 102, 103, 201, 202, 203, 301, 302, 303, 401, 402, 403, 404, 405, 406];

describe('program catalog', () => {
  it('contains all 15 programs', () => {
    expect(getAllProgramsList()).toHaveLength(15);
  });

  it('finds every program by id (incl. skills 401-406)', () => {
    for (const id of ALL_IDS) {
      expect(getProgramByIdList(id)?.id, `id ${id}`).toBe(id);
    }
  });

  it('returns undefined for unknown ids', () => {
    expect(getProgramByIdList(999)).toBeUndefined();
    expect(getProgramByIdList('abc')).toBeUndefined();
  });

  it('every program is fully translated to English', () => {
    for (const p of getAllProgramsList()) {
      expect(p.titleEn, `${p.id} titleEn`).toBeTruthy();
      expect(p.descriptionEn, `${p.id} descriptionEn`).toBeTruthy();
      expect(p.levelEn, `${p.id} levelEn`).toBeTruthy();
      expect(p.durationEn, `${p.id} durationEn`).toBeTruthy();
      expect(p.intensityEn, `${p.id} intensityEn`).toBeTruthy();
      expect(p.featuresEn?.length, `${p.id} featuresEn`).toBe(p.features.length);
    }
  });

  it('localizeProgram returns EN strings for locale en', () => {
    const p = getProgramByIdList(201)!;
    const loc = localizeProgram(p, 'en');
    expect(loc.localizedTitle).toBe(p.titleEn);
    expect(loc.localizedDescription).toBe(p.descriptionEn);
    expect(loc.localizedFeatures).toEqual(p.featuresEn);
  });

  it('localizeProgram falls back to Italian when EN is missing', () => {
    const p: ProgramDataItem = {
      id: 1,
      title: 'Solo ITA',
      description: 'desc',
      price: 0,
      level: 'Base',
      image: '/x.png',
      features: ['a'],
      duration: '1 settimana',
      intensity: 'Bassa',
    };
    const loc = localizeProgram(p, 'en');
    expect(loc.localizedTitle).toBe('Solo ITA');
    expect(loc.localizedFeatures).toEqual(['a']);
  });

  it('programData categories are non-empty', () => {
    expect(programData.workout.length).toBeGreaterThan(0);
    expect(programData.frontLever.length).toBeGreaterThan(0);
    expect(programData.planche.length).toBeGreaterThan(0);
    expect(programData.skills.length).toBeGreaterThan(0);
  });
});
