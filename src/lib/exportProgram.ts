import type { Program, WeekPlan } from '@/types/program';

export interface ExerciseExport {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

export interface ProgramForExport {
  _id: string;
  title: string;
  description: string;
  level: string;
  price: number;
  exercises: ExerciseExport[];
  date: string;
  daysPerWeek?: number;
  goals?: string;
  age?: string;
  weight?: string;
  height?: string;
  experience?: string;
  equipment?: string;
  focus?: string;
  injury?: string;
}

const escHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

// ─── TXT Export ───────────────────────────────────────────────────────────────

export function exportToTxt(program: ProgramForExport): string {
  const lines: string[] = [];
  lines.push('\u2550'.repeat(60));
  lines.push(`  ${program.title.toUpperCase()}`);
  lines.push('\u2550'.repeat(60));
  lines.push('');
  lines.push(`  Livello:       ${program.level}`);
  if (program.daysPerWeek) lines.push(`  Giorni/sett:   ${program.daysPerWeek}`);
  if (program.focus) lines.push(`  Focus:         ${program.focus}`);
  if (program.equipment) lines.push(`  Attrezzatura:  ${program.equipment}`);
  if (program.age) lines.push(`  Eta:           ${program.age} anni`);
  if (program.weight) lines.push(`  Peso:          ${program.weight} kg`);
  if (program.height) lines.push(`  Altezza:       ${program.height} cm`);
  if (program.experience) lines.push(`  Esperienza:    ${program.experience} anni`);
  lines.push(`  Data creazione: ${program.date}`);
  lines.push('');
  lines.push(`  DESCRIZIONE`);
  lines.push(`  ${program.description}`);
  lines.push('');
  if (program.goals) {
    lines.push(`  OBIETTIVI`);
    lines.push(`  "${program.goals}"`);
    lines.push('');
  }
  lines.push('\u2500'.repeat(60));
  lines.push(`  SCHEDA DI ALLENAMENTO`);
  lines.push('\u2500'.repeat(60));
  lines.push('');
  program.exercises.forEach((ex, i) => {
    lines.push(`  ${i + 1}. ${ex.name}`);
    lines.push(`     Serie:    ${ex.sets}`);
    lines.push(`     Ripetiz:  ${ex.reps}`);
    lines.push(`     Recupero: ${ex.rest}`);
    if (ex.notes) lines.push(`     Note:     ${ex.notes}`);
    lines.push('');
  });
  lines.push('\u2550'.repeat(60));
  lines.push(`  Generato da Maxthenics \u2014 ${new Date().getFullYear()}`);
  lines.push('\u2550'.repeat(60));
  return lines.join('\n');
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

export function exportToCsv(program: ProgramForExport): string {
  const header = 'Esercizio,Serie,Ripetizioni,Recupero,Note';
  const rows = program.exercises.map(ex =>
    `"${ex.name}","${ex.sets}","${ex.reps}","${ex.rest}","${(ex.notes || '').replace(/"/g, '""')}"`
  );
  return [header, ...rows].join('\n');
}

// ─── Week-Structured TXT Export ───────────────────────────────────────────────

export function exportWeeksToTxt(program: Program, weeks: WeekPlan[]): string {
  const lines: string[] = [];
  lines.push('\u2550'.repeat(60));
  lines.push(`  ${program.title.toUpperCase()}`);
  lines.push('\u2550'.repeat(60));
  lines.push('');
  lines.push(`  Livello:       ${program.level}`);
  lines.push(`  Data:          ${program.date}`);
  lines.push('');

  for (const week of weeks) {
    lines.push('');
    lines.push(`  \u2500\u2500 SETTIMANA ${week.weekNumber}${week.theme ? ` \u2014 ${week.theme}` : ''}${week.isDeload ? ' [SCARICO]' : ''}`);
    lines.push('');
    for (const day of week.days) {
      lines.push(`    ${day.name}`);
      for (const workout of day.workouts) {
        lines.push(`      ${workout.name}`);
        workout.exercises.forEach(ex => {
          lines.push(`        ${ex.exercise.name}  |  ${ex.sets}x${ex.reps}  |  ${ex.rest}${ex.notes ? `  |  ${ex.notes}` : ''}`);
        });
      }
      if (day.notes) lines.push(`      Note: ${day.notes}`);
      lines.push('');
    }
  }
  lines.push('\u2550'.repeat(60));
  lines.push(`  Generato da Maxthenics \u2014 ${new Date().getFullYear()}`);
  lines.push('\u2550'.repeat(60));
  return lines.join('\n');
}

export function exportWeeksToCsv(program: Program, weeks: WeekPlan[]): string {
  const header = 'Settimana,Giorno,Giorno-Notes,Allenamento,Esercizio,Serie,Ripetizioni,Recupero,Tempo,Note';
  const rows: string[] = [];
  for (const week of weeks) {
    for (const day of week.days) {
      for (const workout of day.workouts) {
        for (const ex of workout.exercises) {
          rows.push([
            week.weekNumber,
            day.name,
            (day.notes || '').replace(/"/g, '""'),
            workout.name,
            ex.exercise.name,
            ex.sets,
            ex.reps,
            ex.rest,
            (ex.tempo || '').replace(/"/g, '""'),
            (ex.notes || '').replace(/"/g, '""'),
          ].map(c => `"${c}"`).join(','));
        }
      }
    }
  }
  return [header, ...rows].join('\n');
}

// ─── JSON Export ──────────────────────────────────────────────────────────────

export function exportToJson(program: ProgramForExport): string {
  return JSON.stringify(program, null, 2);
}

export function exportProgramToJson(program: Program): string {
  return JSON.stringify(program, null, 2);
}

// ─── PDF / Print Export ───────────────────────────────────────────────────────

export function openPrintView(program: ProgramForExport): void {
  const exRows = program.exercises
    .map(ex => `<tr>
      <td>${escHtml(ex.name)}</td>
      <td>${ex.sets}</td>
      <td>${escHtml(ex.reps)}</td>
      <td>${escHtml(ex.rest)}</td>
      <td class="notes-cell">${ex.notes ? escHtml(ex.notes) : '\u2014'}</td>
    </tr>`)
    .join('');

  const css = `
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      @page { size: A4; margin: 18mm 16mm; }
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1a1a1a; font-size: 11pt; line-height: 1.55; }
      .page-header { border-bottom: 3px solid #dc2626; padding-bottom: 10px; margin-bottom: 18px; }
      .brand { font-size: 8pt; color: #888; text-transform: uppercase; letter-spacing: .12em; margin-bottom: 4px; }
      h1 { font-size: 20pt; font-weight: 900; color: #1a1a1a; line-height: 1.15; text-transform: uppercase; }
      .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 18px; margin: 14px 0; padding: 10px 14px; background: #f7f7f7; border-radius: 6px; }
      .meta-item { font-size: 9.5pt; }
      .meta-label { color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; font-size: 8pt; }
      .meta-value { color: #1a1a1a; font-weight: 700; }
      .section-title { font-size: 10pt; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: #dc2626; border-bottom: 1px solid #e5e5e5; padding-bottom: 4px; margin: 18px 0 8px; }
      .goals-box { border-left: 3px solid #dc2626; padding: 8px 12px; background: #fff8f8; font-style: italic; margin-bottom: 16px; color: #444; font-size: 10.5pt; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
      thead th { background: #1a1a1a; color: #fff; font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; padding: 7px 10px; text-align: left; }
      thead th:not(:first-child) { text-align: center; }
      tbody tr:nth-child(even) td { background: #f9f9f9; }
      tbody td { padding: 7px 10px; border-bottom: 1px solid #eee; font-size: 10pt; }
      tbody td:not(:first-child) { text-align: center; }
      tbody td:first-child { font-weight: 600; }
      .notes-cell { font-style: italic; color: #666; font-size: 9pt; }
      .footer { margin-top: 22px; border-top: 1px solid #e5e5e5; padding-top: 8px; font-size: 8pt; color: #aaa; text-align: center; }
    </style>`;

  const goalsBlock = program.goals
    ? `<div class="goals-box">"${escHtml(program.goals)}"</div>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(program.title)} \u2014 Maxthenics</title>
  ${css}
</head>
<body>
  <div class="page-header">
    <div class="brand">Maxthenics \u00b7 Prodotto Format</div>
    <h1>${escHtml(program.title)}</h1>
    <div class="meta-grid">
      <div class="meta-item"><div class="meta-label">Livello</div><div class="meta-value">${escHtml(program.level)}</div></div>
      ${program.daysPerWeek ? `<div class="meta-item"><div class="meta-label">Giorni / settimana</div><div class="meta-value">${program.daysPerWeek}</div></div>` : ''}
      ${program.focus ? `<div class="meta-item"><div class="meta-label">Focus</div><div class="meta-value">${escHtml(program.focus)}</div></div>` : ''}
      ${program.equipment ? `<div class="meta-item"><div class="meta-label">Attrezzatura</div><div class="meta-value">${escHtml(program.equipment)}</div></div>` : ''}
      ${program.age ? `<div class="meta-item"><div class="meta-label">Et\u00e0</div><div class="meta-value">${program.age} anni</div></div>` : ''}
      ${program.weight ? `<div class="meta-item"><div class="meta-label">Peso</div><div class="meta-value">${program.weight} kg</div></div>` : ''}
      ${program.height ? `<div class="meta-item"><div class="meta-label">Altezza</div><div class="meta-value">${program.height} cm</div></div>` : ''}
      <div class="meta-item"><div class="meta-label">Data</div><div class="meta-value">${program.date}</div></div>
    </div>
  </div>
  ${goalsBlock}
  <div class="section-title">Descrizione</div>
  <p style="margin-bottom:14px; font-size:10.5pt; color:#444;">${escHtml(program.description)}</p>
  <div class="section-title">Scheda Esercizi \u2014 ${program.exercises.length} esercizi</div>
  <table>
    <thead>
      <tr>
        <th style="width:38%;">Esercizio</th>
        <th style="width:10%;">Serie</th>
        <th style="width:14%;">Ripetizioni</th>
        <th style="width:14%;">Recupero</th>
        <th style="width:24%;">Note</th>
      </tr>
    </thead>
    <tbody>${exRows}</tbody>
  </table>
  <div class="footer">
    Generato da Maxthenics \u00b7 maxthenics.com \u00b7 ${new Date().getFullYear()}
  </div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=800,height=1100,menubar=no,toolbar=no');
  if (win) {
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 600);
  }
}

// ─── Week-Structured Print View ───────────────────────────────────────────────

export function openWeeksPrintView(program: Program, weeks: WeekPlan[]): void {
  const weeksHtml = weeks.map(week => {
    const daysHtml = week.days.map(day => {
      const workoutsHtml = day.workouts.map(workout => {
        const rows = workout.exercises.map(ex => `<tr>
          <td>${escHtml(ex.exercise.name)}</td>
          <td>${ex.sets}</td>
          <td>${escHtml(ex.reps)}</td>
          <td>${escHtml(ex.rest)}</td>
          <td class="notes-cell">${ex.notes ? escHtml(ex.notes) : '\u2014'}</td>
        </tr>`).join('');
        return `<h4 class="workout-name">${escHtml(workout.name)}</h4>
          <table><thead><tr>
            <th style="width:34%;">Esercizio</th>
            <th style="width:10%;">Serie</th>
            <th style="width:14%;">Ripetizioni</th>
            <th style="width:14%;">Recupero</th>
            <th style="width:28%;">Note</th>
          </tr></thead><tbody>${rows || '<tr><td colspan="5" style="text-align:center;color:#aaa;">Nessun esercizio</td></tr>'}</tbody></table>`;
      }).join('');
      return `<div class="day-block">
        <h3 class="day-name">${escHtml(day.name)}</h3>
        ${day.notes ? `<p class="day-notes">${escHtml(day.notes)}</p>` : ''}
        ${workoutsHtml || '<p style="color:#aaa;font-size:10pt;">Nessun allenamento</p>'}
      </div>`;
    }).join('');

    return `<div class="week-block${week.isDeload ? ' deload' : ''}">
      <div class="week-header">
        <span class="week-badge">Settimana ${week.weekNumber}</span>
        ${week.theme ? `<span class="week-theme">${escHtml(week.theme)}</span>` : ''}
        ${week.isDeload ? '<span class="deload-badge">SCARICO</span>' : ''}
      </div>
      ${daysHtml}
    </div>`;
  }).join('');

  const css = `
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      @page { size: A4; margin: 15mm 14mm; }
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1a1a1a; font-size: 10pt; line-height: 1.5; }
      .page-header { border-bottom: 3px solid #dc2626; padding-bottom: 8px; margin-bottom: 14px; }
      .brand { font-size: 7pt; color: #888; text-transform: uppercase; letter-spacing: .12em; }
      h1 { font-size: 16pt; font-weight: 900; margin: 4px 0; }
      .week-block { margin-bottom: 20px; page-break-inside: avoid; }
      .week-block.deload { border-left: 3px solid #f59e0b; padding-left: 10px; }
      .week-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 6px 10px; background: #1a1a1a; color: #fff; border-radius: 4px; }
      .week-badge { font-weight: 800; font-size: 9pt; }
      .week-theme { font-size: 8pt; color: #ccc; font-style: italic; }
      .deload-badge { font-size: 7pt; font-weight: 700; background: #f59e0b; color: #000; padding: 2px 6px; border-radius: 3px; }
      .day-block { margin: 10px 0 6px 8px; padding: 8px 10px; background: #fafafa; border-radius: 4px; border-left: 2px solid #ddd; }
      .day-name { font-size: 11pt; font-weight: 700; margin-bottom: 4px; color: #333; }
      .day-notes { font-size: 9pt; color: #888; font-style: italic; margin-bottom: 6px; }
      .workout-name { font-size: 9.5pt; font-weight: 600; color: #dc2626; margin: 6px 0 4px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 6px; font-size: 9pt; }
      thead th { background: #444; color: #fff; font-weight: 700; padding: 5px 8px; text-align: left; }
      thead th:not(:first-child) { text-align: center; }
      tbody tr:nth-child(even) td { background: #f5f5f5; }
      tbody td { padding: 4px 8px; border-bottom: 1px solid #eee; }
      tbody td:not(:first-child) { text-align: center; }
      tbody td:first-child { font-weight: 600; }
      .notes-cell { font-style: italic; color: #666; }
      .footer { margin-top: 16px; border-top: 1px solid #ddd; padding-top: 6px; font-size: 7.5pt; color: #aaa; text-align: center; }
    </style>`;

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <title>${escHtml(program.title)} \u2014 Maxthenics (${weeks.length} settimane)</title>
  ${css}
</head>
<body>
  <div class="page-header">
    <div class="brand">Maxthenics \u00b7 Programma Completo</div>
    <h1>${escHtml(program.title)}</h1>
    <p style="font-size:9pt;color:#666;">${escHtml(program.level)} \u00b7 ${weeks.length} settimane \u00b7 ${escHtml(program.focus)}</p>
  </div>
  ${weeksHtml}
  <div class="footer">Generato da Maxthenics \u00b7 maxthenics.com \u00b7 ${new Date().getFullYear()}</div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=800,height=1100,menubar=no,toolbar=no');
  if (win) {
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 600);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\u00e0\u00e8\u00ec\u00f2\u00f9\u00c0\u00c8\u00cc\u00d2\u00d9\-_\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 60);
}

function triggerDownload(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function downloadTxt(program: ProgramForExport): void {
  triggerDownload(exportToTxt(program), `${sanitizeFilename(program.title)}.txt`, 'text/plain;charset=utf-8');
}

export function downloadJson(program: ProgramForExport): void {
  triggerDownload(exportToJson(program), `${sanitizeFilename(program.title)}.json`, 'application/json');
}

export function downloadPdf(program: ProgramForExport): void {
  openPrintView(program);
}

export function downloadCsv(program: ProgramForExport): void {
  triggerDownload(exportToCsv(program), `${sanitizeFilename(program.title)}.csv`, 'text/csv;charset=utf-8');
}

export function downloadWeeksTxt(program: Program, weeks: WeekPlan[]): void {
  triggerDownload(exportWeeksToTxt(program, weeks), `${sanitizeFilename(program.title)}-completo.txt`, 'text/plain;charset=utf-8');
}

export function downloadWeeksCsv(program: Program, weeks: WeekPlan[]): void {
  triggerDownload(exportWeeksToCsv(program, weeks), `${sanitizeFilename(program.title)}-completo.csv`, 'text/csv;charset=utf-8');
}

export function downloadWeeksPdf(program: Program, weeks: WeekPlan[]): void {
  openWeeksPrintView(program, weeks);
}

export function downloadWeeksJson(program: Program): void {
  triggerDownload(exportProgramToJson(program), `${sanitizeFilename(program.title)}-completo.json`, 'application/json');
}

export { sanitizeFilename };
