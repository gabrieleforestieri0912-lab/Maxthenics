import { describe, it, expect } from 'vitest';
import { exportToTxt } from '@/lib/exportProgram';

const SAMPLE = {
  _id: 'abc123',
  title: 'Test Program',
  description: 'desc',
  level: 'Base',
  price: 0,
  exercises: [{ name: 'Push-up & Dip <test>', sets: 3, reps: '10', rest: '60s' }],
  date: '2026-01-01',
};

describe('exportProgram', () => {
  it('txt export contains title and exercises', () => {
    const txt = exportToTxt(SAMPLE);
    expect(txt).toContain('TEST PROGRAM');
    expect(txt).toContain('Push-up');
  });
});
