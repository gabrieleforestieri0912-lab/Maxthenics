"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

/**
 * Rendering Markdown sicuro per Sthenox.
 * Solo testo: nessun HTML non fidato, nessun dangerouslySetInnerHTML.
 * Supporta titoli, grassetto, elenchi, tabelle (in contenitore con
 * overflow-x) e blocchi di codice.
 */

function Bold({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
          <strong key={i} className="font-bold text-zinc-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

function isTableRow(line: string) {
  return line.trim().startsWith("|") && line.trim().endsWith("|");
}

function isDelimiterRow(line: string) {
  return /^\|[\s:|-]+\|$/.test(line.trim());
}

function splitCells(line: string) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());
}

function MarkdownTable({ lines }: { lines: string[] }) {
  const header = splitCells(lines[0]);
  const body = lines.slice(2).map(splitCells);
  return (
    <div className="my-3 overflow-x-auto rounded-xl border border-zinc-200 dark:border-white/10">
      <table className="w-full min-w-[420px] border-collapse text-left text-xs">
        <thead>
          <tr className="bg-zinc-100 dark:bg-white/5">
            {header.map((cell, i) => (
              <th
                key={i}
                className="border-b border-zinc-200 px-3 py-2 font-bold text-zinc-900 dark:border-white/10 dark:text-white"
              >
                <Bold text={cell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, r) => (
            <tr key={r} className="odd:bg-transparent even:bg-zinc-50 dark:even:bg-white/[0.02]">
              {row.map((cell, c) => (
                <td
                  key={c}
                  className="border-b border-zinc-100 px-3 py-2 text-zinc-700 last:border-0 dark:border-white/5 dark:text-zinc-300"
                >
                  <Bold text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ language, code }: { language?: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard non disponibile */
    }
  };
  return (
    <div className="my-3 overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10">
      <div className="flex items-center justify-between bg-zinc-100 px-4 py-2 dark:bg-white/5">
        <span className="meta-mono">{language || "code"}</span>
        <button
          type="button"
          onClick={copy}
          className="meta-mono flex items-center gap-1.5 rounded-lg px-2 py-1 transition-colors hover:text-zinc-900 hover:dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          {copied ? (
            <>
              <Check size={12} className="text-green-500" /> {t("Copiato", "Copied")}
            </>
          ) : (
            <>
              <Copy size={12} /> {t("Copia", "Copy")}
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto bg-zinc-50 p-4 dark:bg-zinc-900/80">
        <code className="font-mono text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          {code}
        </code>
      </pre>
    </div>
  );
}

function renderLine(line: string, key: number) {
  const trimmed = line.trim();
  const bullet = line.match(/^(\s*[•\-*]\s+)(.*)/);

  if (bullet) {
    return (
      <li key={key} className="ml-4 list-disc text-zinc-700 first:mt-0 dark:text-zinc-300">
        <Bold text={bullet[2]} />
      </li>
    );
  }
  if (/^\d+\.\s/.test(trimmed)) {
    return (
      <li key={key} className="ml-4 list-decimal text-zinc-700 first:mt-0 dark:text-zinc-300">
        <Bold text={trimmed.replace(/^\d+\.\s/, "")} />
      </li>
    );
  }
  if (/^###\s/.test(trimmed)) {
    return (
      <h4 key={key} className="mb-1 mt-3 text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
        <Bold text={trimmed.replace(/^###\s/, "")} />
      </h4>
    );
  }
  if (/^##\s/.test(trimmed)) {
    return (
      <h3 key={key} className="mb-1 mt-4 text-[15px] font-bold tracking-tight text-zinc-900 dark:text-white">
        <Bold text={trimmed.replace(/^##\s/, "")} />
      </h3>
    );
  }
  if (/^#\s/.test(trimmed)) {
    return (
      <h2 key={key} className="mb-1 mt-4 text-base font-bold tracking-tight text-zinc-900 dark:text-white">
        <Bold text={trimmed.replace(/^#\s/, "")} />
      </h2>
    );
  }
  return (
    <p key={key} className={trimmed === "" ? "h-2" : "mt-1.5 break-words first:mt-0"}>
      <Bold text={line} />
    </p>
  );
}

function TextPart({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    // Tabella Markdown: header + delimitatore + righe
    if (
      isTableRow(lines[i]) &&
      i + 1 < lines.length &&
      isDelimiterRow(lines[i + 1])
    ) {
      const tableLines = [lines[i], lines[i + 1]];
      let j = i + 2;
      while (j < lines.length && isTableRow(lines[j])) {
        tableLines.push(lines[j]);
        j++;
      }
      out.push(<MarkdownTable key={`table-${i}`} lines={tableLines} />);
      i = j;
      continue;
    }
    out.push(renderLine(lines[i], i));
    i++;
  }
  return <>{out}</>;
}

export default function ChatMarkdown({ content }: { content: string }) {
  const blocks: { type: "code" | "text"; content: string; language?: string }[] = [];
  const regex = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(content)) !== null) {
    if (m.index > last) blocks.push({ type: "text", content: content.slice(last, m.index) });
    blocks.push({ type: "code", language: m[1] || undefined, content: m[2].trim() });
    last = m.index + m[0].length;
  }
  if (last < content.length) blocks.push({ type: "text", content: content.slice(last) });

  return (
    <div className="min-w-0 leading-relaxed">
      {blocks.map((b, idx) =>
        b.type === "code" ? (
          <CodeBlock key={`code-${idx}`} language={b.language} code={b.content} />
        ) : (
          <TextPart key={`text-${idx}`} text={b.content} />
        )
      )}
    </div>
  );
}
