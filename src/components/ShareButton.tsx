"use client";

import React, { useState } from "react";
import { Share2, Check, Link2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface ShareButtonProps {
  /** Absolute URL to share (falls back to current page URL). */
  url?: string;
  title?: string;
  text?: string;
  compact?: boolean;
}

/** Share via native sheet when available, otherwise copy the link. */
const ShareButton: React.FC<ShareButtonProps> = ({ url, title, text, compact = false }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (url) return url;
    if (typeof window !== "undefined") return window.location.href;
    return "";
  };

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback for non-secure contexts / older browsers.
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareUrl = getUrl();
    const shareData = { title: title ?? document.title, text: text ?? "", url: shareUrl };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User dismissed the sheet — do nothing.
        return;
      }
    }
    await copyToClipboard(shareUrl);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      title={t("Condividi programma", "Share program")}
      aria-label={t("Condividi programma", "Share program")}
      className={`inline-flex items-center gap-2 rounded-xl border font-black uppercase tracking-widest transition-all ${
        compact ? "text-[11px] px-2.5 py-1.5" : "text-[11px] px-3.5 py-2"
      } ${
        copied
          ? "border-green-500/30 bg-green-500/10 text-green-400"
          : "border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:border-white/25"
      }`}
    >
      {copied ? (
        <>
          <Check size={13} />
          {t("Copiato!", "Copied!")}
        </>
      ) : typeof navigator !== "undefined" && typeof navigator.share === "function" ? (
        <>
          <Share2 size={13} />
          {t("Condividi", "Share")}
        </>
      ) : (
        <>
          <Link2 size={13} />
          {t("Copia link", "Copy link")}
        </>
      )}
    </button>
  );
};

export default ShareButton;
