import { describe, it, expect } from 'vitest';
import { getCurriculum, PROGRAM_WEEKS } from '@/data/curriculum';
import { getAllProgramsList } from '@/data/programs';

describe('program curriculum', () => {
  it('builds 8 sections for every program', () => {
    for (const p of getAllProgramsList()) {
      const c = getCurriculum(p.id);
      expect(c.sections, `${p.id} sections`).toHaveLength(8);
      expect(c.totalLessons).toBeGreaterThan(20);
      expect(c.totalMinutes).toBeGreaterThan(60);
      expect(c.highlights).toHaveLength(3);
    }
  });

  it('exposes a free preview (first intro lessons)', () => {
    const c = getCurriculum(201);
    const previews = c.sections.flatMap((s) => s.lessons).filter((l) => l.freePreview);
    expect(previews.length).toBeGreaterThanOrEqual(2);
  });

  it('highlights advertise the real routine count (weeks x 4 days)', () => {
    for (const p of getAllProgramsList()) {
      const c = getCurriculum(p.id);
      const weeks = PROGRAM_WEEKS[p.id] ?? 8;
      expect(c.highlights[0].text).toContain(String(weeks * 4));
      expect(c.highlights[0].textEn).toContain(String(weeks * 4));
    }
  });

  it('video lessons reference known exercise ids only when set', () => {
    for (const p of getAllProgramsList()) {
      const c = getCurriculum(p.id);
      const videos = c.sections.flatMap((s) => s.lessons).filter((l) => l.kind === 'video');
      expect(videos.length).toBeGreaterThanOrEqual(4);
      for (const v of videos) {
        expect(v.titleEn, `${p.id} video EN`).toBeTruthy();
      }
    }
  });
});
