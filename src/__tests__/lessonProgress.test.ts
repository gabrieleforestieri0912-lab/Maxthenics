import { describe, it, expect } from 'vitest';
import { getLessonProgress, toggleLessonProgress } from '@/lib/lessonProgress';

describe('lessonProgress', () => {
  it('returns an empty set without a browser', () => {
    expect(getLessonProgress(201)).toEqual(new Set());
  });

  it('toggle updates the in-memory set without storage and does not throw', () => {
    expect(toggleLessonProgress(201, '201-l01')).toEqual(new Set(['201-l01']));
  });
});
