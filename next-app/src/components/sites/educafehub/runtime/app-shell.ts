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
import { pcCalc } from "./tools-calc";

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
  if (secs.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      secs.forEach((s) => s.classList.add("in"));
    } else {
      secs.forEach((s) => s.classList.add("rv"));
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              io.unobserve(en.target);
            }
          });
        },
        { rootMargin: "0px 0px 2000px 0px", threshold: 0 },
      );
      secs.forEach((s) => io.observe(s));
      setTimeout(() => secs.forEach((s) => s.classList.add("in")), 2000);
    }
    if (!reduce) {
      secs.forEach((sec, i) => {
        sec.style.transitionDelay = `${(i % 3) * 70}ms`;
      });
    }
  }

  // Hero trust badges join the same .rv reveal, but the hero is above the
  // fold, so they reveal on load (next frame) with a per-pill stagger
  // instead of waiting for a scroll intersection. Reduced motion: the .rv
  // class is never added and the pills simply stay visible, as on sections.
  const badges = Array.from(document.querySelectorAll<HTMLElement>(".trustrow .trust"));
  if (badges.length && !reduce) {
    badges.forEach((b, i) => {
      b.classList.add("rv");
      b.style.transitionDelay = `${i * 120}ms`;
    });
    requestAnimationFrame(() =>
      requestAnimationFrame(() => badges.forEach((b) => b.classList.add("in"))),
    );
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
      span(!!window.QRCode, "QR maker (QRCode)") +
      span(!!window.JSZip, "ZIP maker (JSZip)") +
      span(counts.en === counts.hi, `EN / हिंदी text: ${counts.en} = ${counts.hi}`);
  }

  onLangChange(() => {
    renderAuth();
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
  renderAuth();
  if (el("pcTotal")) pcCalc();
}
