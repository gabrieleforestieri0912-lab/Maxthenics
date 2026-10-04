import { describe, it, expect } from 'vitest';
import { savedToProgram, exerciseEntryFromSaved } from '@/types/program';

describe('savedToProgram', () => {
  it('splits exercises across training days', () => {
    const program = savedToProgram({
      id: 'p1',
      title: 'Test',
      description: 'd',
      level: 'Base',
      price: 0,
      exercises: [
        { name: 'Push-up', sets: 3, reps: '10', rest: '60s' },
        { name: 'Squat', sets: 3, reps: '12', rest: '60s' },
        { name: 'Plank', sets: 3, reps: '60s', rest: '60s' },
      ],
      date: '2026-01-01',
      daysPerWeek: 3,
      goals: '',
      age: '',
      weight: '',
      height: '',
      experience: '',
      equipment: '',
      focus: 'Full Body',
      injury: '',
    } as never);
    expect(program.weeks).toHaveLength(1);
    expect(program.weeks[0].days).toHaveLength(3);
    expect(program.weeklyPlan).toHaveLength(3);
  });

  it('exerciseEntryFromSaved applies defaults', () => {
    const entry = exerciseEntryFromSaved({ name: 'Dip' });
    expect(entry.sets).toBe(3);
    expect(entry.reps).toBe('10');
    expect(entry.rest).toBe('60s');
    expect(entry.exercise.name).toBe('Dip');
  });
});
