// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { localizeProgram, getProgramByIdList } from '@/data/programs';

function Consumer() {
  const { locale, t } = useLanguage();
  const p = localizeProgram(getProgramByIdList(201)!, locale);
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="chrome">{t('Ciao', 'Hello')}</span>
      <span data-testid="title">{p.localizedTitle}</span>
    </div>
  );
}

describe('language switching (IT/EN toggle)', () => {
  afterEach(cleanup);
  it('clicking EN switches chrome strings and program content', () => {
    Object.defineProperty(window.navigator, 'language', { value: 'it-IT', configurable: true });
    render(
      <LanguageProvider>
        <LanguageToggle />
        <Consumer />
      </LanguageProvider>
    );

    expect(screen.getByTestId('chrome').textContent).toBe('Ciao');

    fireEvent.click(screen.getByRole('button', { name: 'EN' }));

    expect(screen.getByTestId('locale').textContent).toBe('en');
    expect(screen.getByTestId('chrome').textContent).toBe('Hello');
    expect(screen.getByTestId('title').textContent).toBe('Scapular Retraction & Depression');
  });

  it('clicking back to IT restores Italian', () => {
    Object.defineProperty(window.navigator, 'language', { value: 'it-IT', configurable: true });
    render(
      <LanguageProvider>
        <LanguageToggle />
        <Consumer />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'EN' }));
    fireEvent.click(screen.getByRole('button', { name: 'IT' }));

    expect(screen.getByTestId('locale').textContent).toBe('it');
    expect(screen.getByTestId('chrome').textContent).toBe('Ciao');
  });
});
