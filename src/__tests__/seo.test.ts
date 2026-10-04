import { describe, it, expect } from 'vitest';
import {
  getAllPrograms,
  getProgramById,
  getProgramCategory,
  resolveCatchAllRoute,
} from '@/lib/seo';

describe('seo helpers', () => {
  it('getAllPrograms returns the 15 catalog programs', () => {
    expect(getAllPrograms()).toHaveLength(15);
  });

  it('getProgramById resolves static and skills programs', () => {
    expect(getProgramById(101)?.id).toBe(101);
    expect(getProgramById('406')?.id).toBe(406);
    expect(getProgramById(999)).toBeUndefined();
  });

  it('getProgramCategory maps every program', () => {
    expect(getProgramCategory(101)).toBe('workout');
    expect(getProgramCategory(202)).toBe('frontLever');
    expect(getProgramCategory(303)).toBe('planche');
    expect(getProgramCategory(401)).toBe('skills');
    expect(getProgramCategory(999)).toBeUndefined();
  });

  it('resolves program detail routes with metadata', () => {
    const route = resolveCatchAllRoute(['program', '201']);
    expect(route.crawlable?.h1).toBeTruthy();
  });

  it('unknown program ids fall back to noindex (soft 404)', () => {
    const route = resolveCatchAllRoute(['program', '999']);
    expect(route.metadata.robots).toMatchObject({ index: false });
  });
});
