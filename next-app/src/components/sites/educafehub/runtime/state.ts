import rawDict from "@/data/i18n.json";
import type { Lang } from "@/types/educafe";

const I18N = rawDict as Record<Lang, Record<string, string>>;

let curLang: Lang = "en";

const langSubs = new Set<() => void>();
const downloadSubs = new Set<(name: string) => void>();

export function getLang(): Lang {
  return curLang;
}

export function T(key: string): string {
  return I18N[curLang]?.[key] ?? I18N.en[key] ?? key;
}

export function i18nCounts(): { en: number; hi: number } {
  return { en: Object.keys(I18N.en).length, hi: Object.keys(I18N.hi).length };
}

export function onLangChange(fn: () => void): () => void {
  langSubs.add(fn);
  return () => {
    langSubs.delete(fn);
  };
}

export function onDownload(fn: (name: string) => void): () => void {
  downloadSubs.add(fn);
  return () => {
    downloadSubs.delete(fn);
  };
}

export function emitDownload(name: string): void {
  downloadSubs.forEach((fn) => fn(name));
}

function applyText(): void {
  const d = I18N[curLang];
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (k && d[k]) el.textContent = d[k];
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-ph]").forEach((el) => {
    const k = el.getAttribute("data-i18n-ph");
    if (k && d[k]) el.setAttribute("placeholder", d[k]);
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-aria]").forEach((el) => {
    const k = el.getAttribute("data-i18n-aria");
    if (k && d[k]) el.setAttribute("aria-label", d[k]);
  });
  document.querySelectorAll<HTMLElement>("#linkGrid [data-en]").forEach((el) => {
    const next = curLang === "hi" ? el.getAttribute("data-hi") : el.getAttribute("data-en");
    if (next !== null) el.textContent = next;
  });
  document.getElementById("langEn")?.setAttribute("aria-pressed", curLang === "en" ? "true" : "false");
  document.getElementById("langHi")?.setAttribute("aria-pressed", curLang === "hi" ? "true" : "false");
}

export function setLang(lang: string): void {
  curLang = lang === "en" ? "en" : "hi";
  document.documentElement.lang = curLang;
  applyText();
  langSubs.forEach((fn) => fn());
}

interface Store {
  get<T>(key: string): T | null;
  set(key: string, value: unknown): void;
  del(key: string): void;
}

const memory: Record<string, unknown> = {};

export const store: Store = {
  get<T>(key: string): T | null {
    try {
      const v = localStorage.getItem(key);
      return v ? (JSON.parse(v) as T) : null;
    } catch {
      return (memory[key] as T | undefined) ?? null;
    }
  },
  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      memory[key] = value;
    }
  },
  del(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      delete memory[key];
    }
  },
};

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export function showToast(msg: string): void {
  const t = document.getElementById("toast");
  const txt = document.getElementById("toastTxt");
  if (!t || !txt) return;
  txt.textContent = msg;
  t.classList.add("show");
  const tick = t.querySelector<HTMLElement>(".tick");
  if (tick) {
    tick.style.animation = "none";
    void tick.offsetWidth;
    tick.style.animation = "";
  }
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

export function pulse(btn: HTMLElement | null): void {
  if (!btn) return;
  btn.classList.remove("done");
  void btn.offsetWidth;
  btn.classList.add("done");
}
