import { T, getLang, onLangChange, setLang, store } from "./state";
import { pcCalc } from "./tools-calc";

const LK = "educafehub_lang";

// Null-safe element helpers: pages render different sections (the homepage has
// Links, tool pages do not), so every lookup here must tolerate a missing
// element instead of throwing and killing the whole shell.
function el(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function inp(id: string): HTMLInputElement | null {
  return document.getElementById(id) as HTMLInputElement | null;
}

function on(id: string, ev: string, fn: (e: Event) => void): void {
  el(id)?.addEventListener(ev, fn);
}

export function initAppShell(): void {
  const applyLang = (lang: "en" | "hi") => {
    store.set(LK, lang);
    setLang(lang);
  };
  on("langEn", "click", () => applyLang("en"));
  on("langHi", "click", () => applyLang("hi"));

  const linkSearch = inp("linkSearch");
  const grid = el("linkGrid");
  if (linkSearch && grid) {
    linkSearch.addEventListener("input", function (this: HTMLInputElement) {
      const q = this.value.trim().toLowerCase();
      let any = false;
      grid.querySelectorAll<HTMLAnchorElement>("a.site").forEach((a) => {
        const show = !q || (a.dataset.search || "").indexOf(q) >= 0;
        a.style.display = show ? "flex" : "none";
        if (show) any = true;
      });
      grid.querySelectorAll<HTMLElement>(".lcat").forEach((h) => {
        let n = h.nextElementSibling;
        let vis = false;
        while (n && !n.classList.contains("lcat")) {
          if ((n as HTMLElement).style.display !== "none") vis = true;
          n = n.nextElementSibling;
        }
        h.style.display = vis ? "flex" : "none";
      });
      const none = el("linkNone");
      if (none) none.style.display = any ? "none" : "block";
    });
  }

  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('#legal [role="tab"]'));
  if (tabs.length) {
    const select = (tab: HTMLButtonElement, focus: boolean) => {
      tabs.forEach((t) => {
        const onTab = t === tab;
        t.setAttribute("aria-selected", onTab ? "true" : "false");
        t.tabIndex = onTab ? 0 : -1;
        const controls = t.getAttribute("aria-controls");
        const p = controls ? document.getElementById(controls) : null;
        if (p) p.hidden = !onTab;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t, false));
      t.addEventListener("keydown", (e) => {
        let n: HTMLButtonElement | null = null;
        if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") n = tabs[0];
        else if (e.key === "End") n = tabs[tabs.length - 1];
        if (n) {
          e.preventDefault();
          select(n, true);
        }
      });
    });
  }

  const ADDR = "akashkmr9225@gmail.com";
  el("ctCopy")?.addEventListener("click", () => {
    const done = (ok: boolean) => {
      const msg = document.getElementById("ctCopyMsg");
      if (msg) {
        msg.textContent = ok
          ? getLang() === "hi"
            ? `✔ ईमेल कॉपी हो गया: ${ADDR}`
            : `✔ Email copied: ${ADDR}`
          : ADDR;
        msg.className = `msg ${ok ? "good" : ""}`;
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ADDR).then(
        () => done(true),
        () => done(false),
      );
    } else {
      const ta = document.createElement("textarea");
      ta.value = ADDR;
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      ta.remove();
      done(ok);
    }
  });
  el("ctSend")?.addEventListener("click", () => {
    const name = (inp("ctName")?.value || "").trim();
    const topic = (el("ctTopic") as HTMLSelectElement | null)?.value || "";
    const body = (inp("ctMsg")?.value || "").trim();
    const subject = `EduCafe Hub — ${topic}${name ? ` — ${name}` : ""}`;
    const full = body + (name ? `\n\n— ${name}` : "");
    const a = document.createElement("a");
    a.href = `mailto:${ADDR}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(full)}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  onLangChange(() => {
    if (el("pcTotal")) pcCalc();
    document.querySelectorAll<HTMLInputElement>("#rcItems .rcn").forEach((i) => {
      i.placeholder = T("rcItemPh");
    });
    document.querySelectorAll<HTMLInputElement>("#rcItems .rca").forEach((i) => {
      i.placeholder = T("rcAmtPh");
    });
  });

  const saved = store.get<string>(LK);
  setLang(saved === "hi" ? "hi" : "en");
  if (el("pcTotal")) pcCalc();
}
