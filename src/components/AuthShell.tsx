import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "./SEO";

interface AuthShellProps {
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string;
  /** Short line above the title, e.g. "Bentornato su" */
  titleLead: string;
  titleAccent?: string;
  description: string;
  children: React.ReactNode;
  /** Footer line, e.g. "Non hai ancora un account?" */
  footerLead: string;
  footerActionLabel: string;
  footerActionTo: string;
}

const FIELD_CLASS =
  "w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white transition-colors placeholder:text-zinc-700 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/30";

const LABEL_CLASS = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-400";

export function Field({
  label,
  htmlFor,
  children,
  action,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className={LABEL_CLASS}>
          {label}
        </label>
        {action}
      </div>
      {children}
    </div>
  );
}

export function PasswordInput({
  id,
  name,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
}: {
  id?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  visible: boolean;
  onToggle: () => void;
  autoComplete?: string;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder="••••••••"
        autoComplete={autoComplete}
        className={`${FIELD_CLASS} pr-11`}
        required
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? "Nascondi password" : "Mostra password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
      >
        <span className="sr-only">{visible ? "Nascondi" : "Mostra"}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          {visible ? (
            <>
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </>
          ) : (
            <>
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}

export function AuthDivider({ label = "oppure" }: { label?: string }) {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/10" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-zinc-900/60 px-3 meta-mono">{label}</span>
      </div>
    </div>
  );
}

export function GoogleButton({
  loading,
  onClick,
  label,
}: {
  loading: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button type="button" onClick={onClick} disabled={loading} className="btn-secondary w-full bg-white hover:bg-zinc-200 text-zinc-950 border-transparent">
      <GoogleMark />
      {loading ? "Reindirizzamento…" : label}
    </button>
  );
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

export default function AuthShell({
  seoTitle,
  seoDescription,
  seoKeywords,
  titleLead,
  titleAccent = "Maxthenics",
  description,
  children,
  footerLead,
  footerActionLabel,
  footerActionTo,
}: AuthShellProps) {
  return (
    <>
      <SEO title={seoTitle} description={seoDescription} keywords={seoKeywords} />

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20 sm:px-6">
        <Link
          to="/"
          className="absolute top-6 left-6 sm:top-8 sm:left-8 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors group"
        >
          <ArrowLeft
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            aria-hidden
          />
          Torna alla Home
        </Link>

        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none -z-10"
          aria-hidden
        />
        <div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none -z-10"
          aria-hidden
        />

        <div className="w-full max-w-sm mx-auto">
          <header className="text-center mb-8 animate-fadeIn">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {titleLead}{" "}
              <span className="text-red-500">{titleAccent}</span>
            </h1>
            <p className="body-copy text-sm mt-2">{description}</p>
          </header>

          <div className="card bg-zinc-900/60 backdrop-blur-xl p-6 shadow-xl">{children}</div>

          <div className="mt-6 text-center">
            <p className="text-zinc-400 text-xs">
              {footerLead}{" "}
              <Link to={footerActionTo} className="text-red-500 font-bold hover:text-red-400 transition-colors">
                {footerActionLabel}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}