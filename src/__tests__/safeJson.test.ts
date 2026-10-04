import { describe, it, expect } from 'vitest';
import { safeJsonParse } from '@/lib/safeJson';

describe('safeJsonParse', () => {
  it('parses valid JSON', () => {
    expect(safeJsonParse('{"a":1}', {})).toEqual({ a: 1 });
    expect(safeJsonParse('[1,2]', [])).toEqual([1, 2]);
  });

  it('returns fallback on corrupt input instead of throwing', () => {
    expect(safeJsonParse('{corrupt', { ok: true })).toEqual({ ok: true });
    expect(safeJsonParse('undefined', [])).toEqual([]);
  });

  it('returns fallback on null/undefined/empty', () => {
    expect(safeJsonParse(null, [])).toEqual([]);
    expect(safeJsonParse(undefined, 'x')).toBe('x');
    expect(safeJsonParse('', 0)).toBe(0);
  });
});
