<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Git

Dopo ogni commit, eseguire sempre `git push` sulla remote di tracking corrente.

# Stile

- **Vietato `italic`**: nessun testo in corsivo in tutto il progetto. Per l'enfasi usare il peso (`font-bold`), il colore o gli spaziature.
- Niente emoji come icone: usare solo icone `lucide-react`.
- Usare i token canonici di `src/app/globals.css` (`card`, `card-hover`, `btn-*`, `page-title`, `eyebrow`, `meta-mono`, `prose-*`) e i componenti condivisi (`Button`, `PageHeader`, `SectionHeading`, `EmptyState`, `MetaPill`, `AuthShell`, `LegalPage`) invece di riscrivere le classi a mano.
- In Tailwind v4 usare `bg-linear-*` (non `bg-gradient-to-*`).
