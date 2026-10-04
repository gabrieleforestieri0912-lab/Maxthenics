import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { getAllProgramsList } from '@/data/programs';
import { SITE_URL, DEFAULT_IMAGE } from '@/lib/seo';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

function publicExists(publicPath: string): boolean {
  const pathname = publicPath.startsWith('http')
    ? new URL(publicPath).pathname
    : publicPath;
  return fs.existsSync(path.join(PUBLIC_DIR, pathname.replace(/^\//, '')));
}

describe('program assets', () => {
  it('every program image exists under public/', () => {
    for (const p of getAllProgramsList()) {
      expect(publicExists(p.image), `${p.id} image ${p.image}`).toBe(true);
    }
  });

  it('default OG image exists', () => {
    expect(publicExists(DEFAULT_IMAGE)).toBe(true);
  });

  it('site URL is the production domain', () => {
    expect(SITE_URL).toBe('https://maxthenics.com');
  });
});
