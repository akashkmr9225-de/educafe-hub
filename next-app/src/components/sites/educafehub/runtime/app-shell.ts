import { chipGroup, setMsg } from "./helpers";
import {
  T,
  getLang,
  i18nCounts,
  onLangChange,
  pulse,
  setLang,
  showToast,
  store,
} from "./state";
import { playSound } from "./sound";

const PK = "educafehub_profile";
const LK = "educafehub_lang";

interface Profile {
  name: string;
  contact: string;
  kind: string;
}

// Null-safe element helpers: pages render different sections, so every lookup
// here must tolerate a
// missing element instead of throwing and killing the whole shell.
function el(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function inp(id: string): HTMLInputElement | null {
  return document.getElementById(id) as HTMLInputElement | null;
}

function on(id: string, ev: string, fn: (e: Event) => void): void {
  el(id)?.addEventListener(ev, fn);
}

function renderAuth(): void {
  const form = el("authForm") as HTMLFormElement | null;
  const box = el("authProfile");
  if (!form || !box) return;
  const p = store.get<Profile>(PK);
  if (p) {
    form.hidden = true;
    box.hidden = false;
    const who = el("authWho");
    if (who) who.textContent = p.name;
    const meta = el("authMeta");
    if (meta)
      meta.textContent = `${p.contact} · ${p.kind === "cafe" ? T("authKindCafe") : T("authKindSchool")}`;
    const rc = inp("rcShop");
    if (rc && !rc.value) rc.value = p.name;
    const qn = document.getElementById("qrUpiName") as HTMLInputElement | null;
    if (qn && !qn.value) qn.value = p.name;
  } else {
    form.hidden = false;
    box.hidden = true;
  }
}

export function initAppShell(): void {
  let authKindVal = "school";
  if (el("authKind")) {
    authKindVal =
      chipGroup("authKind", (v) => {
        authKindVal = v;
      }) || "school";
  }

  el("authForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (inp("authName")?.value || "").trim();
    const contact = (inp("authContact")?.value || "").trim();
    if (!name || !contact) {
      if (el("authMsg")) setMsg("authMsg", T("authNeed"), "warn");
      return;
    }
    const msg = el("authMsg");
    if (msg) msg.textContent = "";
    store.set(PK, { name, contact, kind: authKindVal });
    renderAuth();
    pulse(el("authSave"));
    showToast(T("authSaved"));
  });
  on("authEdit", "click", () => {
    const p = store.get<Profile>(PK);
    if (!p) return;
    const n = inp("authName");
    if (n) n.value = p.name;
    const c = inp("authContact");
    if (c) c.value = p.contact;
    document.querySelectorAll("#authKind .chip").forEach((chip) => {
      const onChip = chip.getAttribute("data-v") === p.kind;
      chip.setAttribute("aria-pressed", onChip ? "true" : "false");
      if (onChip) authKindVal = p.kind;
    });
    const prof = el("authProfile");
    if (prof) prof.hidden = true;
    const form = el("authForm") as HTMLFormElement | null;
    if (form) form.hidden = false;
  });
  on("authOut", "click", () => {
    store.del(PK);
    renderAuth();
    showToast(T("authOutMsg"));
  });

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
    const hashTab: Record<string, string> = {
      privacy: "tab-priv",
      terms: "tab-terms",
      disclaimer: "tab-disc",
      about: "tab-about",
      contact: "tab-contact",
    };
    const applyHash = () => {
      const id = hashTab[window.location.hash.replace("#", "")];
      if (id) document.getElementById(id)?.click();
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
    applyHash();
    window.addEventListener("hashchange", applyHash);
  }

  const ADDR = "educafehub@gmail.com";
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

  const secs = Array.from(document.querySelectorAll<HTMLElement>(".wrap > section"));
  const reduce =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Two-way reveal: elements rise in when they enter the viewport and
  // reverse out when they leave, replaying on every pass (never one-shot).
  const toggleIn = (entries: IntersectionObserverEntry[]) =>
    entries.forEach((en) => en.target.classList.toggle("in", en.isIntersecting));
  if (secs.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      secs.forEach((s) => s.classList.add("in"));
    } else {
      secs.forEach((s) => s.classList.add("rv"));
      const io = new IntersectionObserver(toggleIn, { rootMargin: "0px", threshold: 0 });
      secs.forEach((s) => io.observe(s));
    }
    if (!reduce) {
      secs.forEach((sec, i) => {
        sec.style.transitionDelay = `${(i % 3) * 70}ms`;
      });
    }
  }

  // Hero trust badges join the same two-way .rv reveal as the sections,
  // with a per-pill stagger. They are intersecting on load, so they rise
  // in immediately; scrolling them out of view reverses them and
  // scrolling back replays the rise. Reduced motion (or no
  // IntersectionObserver): the .rv class is never added and the pills
  // simply stay visible, as on sections.
  const badges = Array.from(document.querySelectorAll<HTMLElement>(".trustrow .trust"));
  if (badges.length && !reduce && "IntersectionObserver" in window) {
    badges.forEach((b, i) => {
      b.classList.add("rv");
      b.style.transitionDelay = `${i * 160}ms`;
    });
    const bio = new IntersectionObserver(toggleIn, { rootMargin: "0px", threshold: 0 });
    badges.forEach((b) => bio.observe(b));
  }

  const capBox = document.getElementById("capStatus");
  if (capBox) {
    const links = document.querySelectorAll("#linkGrid a.site").length;
    const counts = i18nCounts();
    const span = (ok: boolean, txt: string) =>
      `<span class='${ok ? "good" : ""}'>${ok ? "✔ " : "⚠ "}${txt}</span>`;
    capBox.innerHTML =
      span(links === 31, `Daily links loaded: ${links} / 31`) +
      span(!!window.jspdf, "PDF maker (jsPDF)") +
      span(!!window.pdfjsLib, "PDF reader (PDF.js)") +
      span(!!window.JSZip, "ZIP maker (JSZip)") +
      span(counts.en === counts.hi, `EN / हिंदी text: ${counts.en} = ${counts.hi}`);
  }

  onLangChange(() => {
    renderAuth();
    document.querySelectorAll<HTMLInputElement>("#rcItems .rcn").forEach((i) => {
      i.placeholder = T("rcItemPh");
    });
    document.querySelectorAll<HTMLInputElement>("#rcItems .rca").forEach((i) => {
      i.placeholder = T("rcAmtPh");
    });
  });

  const saved = store.get<string>(LK);
    setLang(saved === "hi" ? "hi" : "en");
    renderAuth();

    // Delegated sound triggers — one listener for the whole page
    document.addEventListener("click", (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          // Primary action buttons (.btn, .chip[aria-pressed="false"]) — select cue
          const btn = target.closest<HTMLButtonElement>(".btn, .chip");
          if (btn && !btn.disabled) {
            // Only play for primary actions: .btn (always primary) or .chip becoming pressed
            const isPrimaryBtn = btn.classList.contains("btn");
            const isChipTogglingOn =
              btn.classList.contains("chip") && btn.getAttribute("aria-pressed") === "false";
            if (isPrimaryBtn || isChipTogglingOn) {
              playSound("select");
            }
          }
          // Download links (anchor with download attribute) — success cue
          // Only for trusted (real user) clicks, not programmatic a.click() from downloadBlob
          const dl = target.closest<HTMLAnchorElement>("a[download]");
          if (dl && e.isTrusted) playSound("success");
        });
  }
