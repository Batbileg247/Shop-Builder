"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: Record<string, unknown>,
          elementId: string,
        ) => unknown;
      };
    };
  }
}

const LANGS = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "mn", label: "Монгол", flag: "🇲🇳" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "zh-CN", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

const STORAGE_KEY = "landing-language";
const SCRIPT_ID = "gt-script";
const STYLE_ID = "gt-override";
const CONTAINER_ID = "gt-hidden";
const INCLUDED_LANGUAGES = LANGS.map((lang) => lang.code).join(",");

let translateReadyPromise: Promise<void> | null = null;
let resolveTranslateReady: (() => void) | null = null;

function readStoredLanguage() {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem(STORAGE_KEY) || "en";
}

function injectGoogleTranslateStyles() {
  if (document.querySelector(`#${STYLE_ID}`)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .goog-te-banner-frame,
    #goog-gt-tt,
    .goog-te-balloon-frame,
    .goog-tooltip,
    .goog-tooltip:hover,
    .goog-text-highlight,
    .goog-te-spinner-pos,
    .skiptranslate iframe { display: none !important; }
    body { top: 0 !important; position: static !important; }
    font[style*="vertical-align"] { vertical-align: inherit !important; }
  `;
  document.head.appendChild(style);
}

function cleanupGoogleTranslateArtifacts() {
  document.body.style.top = "";

  document
    .querySelectorAll<HTMLElement>(".goog-text-highlight")
    .forEach((el) => {
      el.style.cssText = "";
      el.classList.remove("goog-text-highlight");
    });
}

function resolveReady() {
  resolveTranslateReady?.();
  resolveTranslateReady = null;
}

function initGoogleTranslate() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container || container.dataset.ready === "true") {
    resolveReady();
    return;
  }

  const TranslateElement = window.google?.translate?.TranslateElement;
  if (!TranslateElement) return;

  new TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: INCLUDED_LANGUAGES,
      autoDisplay: false,
    },
    CONTAINER_ID,
  );

  container.dataset.ready = "true";
  resolveReady();
}

function ensureGoogleTranslate() {
  injectGoogleTranslateStyles();

  if (!translateReadyPromise) {
    translateReadyPromise = new Promise<void>((resolve) => {
      resolveTranslateReady = resolve;
    });
  }

  window.googleTranslateElementInit = initGoogleTranslate;

  if (window.google?.translate?.TranslateElement) {
    initGoogleTranslate();
    return translateReadyPromise;
  }

  if (!document.querySelector(`#${SCRIPT_ID}`)) {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }

  return translateReadyPromise;
}

function dispatchLanguageChange(code: string) {
  const select = document.querySelector(".goog-te-combo") as
    | HTMLSelectElement
    | null;

  if (!select) return false;

  select.value = code === "en" ? "" : code;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  window.localStorage.setItem(STORAGE_KEY, code);
  cleanupGoogleTranslateArtifacts();
  window.setTimeout(cleanupGoogleTranslateArtifacts, 250);
  window.setTimeout(cleanupGoogleTranslateArtifacts, 1000);
  return true;
}

export default function TranslateWidget() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("en");
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const storedLanguage = readStoredLanguage();
    setActive(storedLanguage);

    ensureGoogleTranslate().then(() => {
      if (cancelled) return;
      setReady(true);
      if (storedLanguage !== "en") dispatchLanguageChange(storedLanguage);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Гадна дарахад хаах
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const translate = async (code: string) => {
    setActive(code);
    setOpen(false);
    setPending(code);

    await Promise.race([
      ensureGoogleTranslate(),
      new Promise((resolve) => window.setTimeout(resolve, 6000)),
    ]);

    const changed = dispatchLanguageChange(code);
    setReady(changed);
    setPending(null);
  };

  const current = LANGS.find((l) => l.code === active)!;

  return (
    <>
      <div id="gt-hidden" className="hidden" />

      <div ref={ref} className="relative" translate="no">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 backdrop-blur transition hover:bg-white/10 hover:text-white"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <span className="text-sm">{current.flag}</span>
          <span>{pending ? "Changing..." : current.label}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-35 overflow-hidden rounded-xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
            <div className="p-1">
              {LANGS.map((lang) => (
                <button
                  type="button"
                  key={lang.code}
                  onClick={() => translate(lang.code)}
                  disabled={pending === lang.code}
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-xs transition ${
                    active === lang.code
                      ? "bg-indigo-500/20 text-indigo-300"
                      : "text-white/60 hover:bg-white/6 hover:text-white"
                  } ${pending === lang.code ? "cursor-wait opacity-70" : ""}`}
                >
                  <span className="text-sm">{lang.flag}</span>
                  <span className="flex-1 text-left">{lang.label}</span>
                  {pending === lang.code ? (
                    <span className="size-2 animate-pulse rounded-full bg-indigo-300" />
                  ) : active === lang.code && ready ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
