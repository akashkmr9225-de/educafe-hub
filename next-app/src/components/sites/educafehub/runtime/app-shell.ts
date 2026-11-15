import { $, chipGroup, input, setMsg } from "./helpers";
import {
  T,
  getLang,
  i18nCounts,
  onDownload,
  onLangChange,
  pulse,
  setLang,
  showToast,
  store,
} from "./state";
import { pcCalc } from "./tools-calc";

const PK = "educafehub_profile";
const TK = "educafehub_tasks";

interface Profile {
  name: string;
  contact: string;
  kind: string;
}

interface TaskItem {
  t: string;
  ts: number;
}

function getTasks(): TaskItem[] {
  return store.get<TaskItem[]>(TK) || [];
}

function addTask(text: string): void {
  const list = getTasks();
  list.unshift({ t: text, ts: Date.now() });
  if (list.length > 100) list.length = 100;
  store.set(TK, list);
  renderTasks();
}

function renderTasks(): void {
  const list = getTasks();
  const ul = $("taskList");
  ul.innerHTML = "";
  $("taskEmpty").style.display = list.length ? "none" : "";
  list.forEach((it) => {
    const li = document.createElement("li");
    const a = document.createElement("span");
    a.className = "tt";
    a.textContent = it.t;
    const b = document.createElement("span");
    b.className = "td";
    try {
      b.textContent = new Date(it.ts).toLocaleString(getLang() === "hi" ? "hi-IN" : "en-IN", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      b.textContent = "";
    }
    li.appendChild(a);
    li.appendChild(b);
    ul.appendChild(li);
  });
}

function renderAuth(): void {
  const p = store.get<Profile>(PK);
  const form = $("authForm") as HTMLFormElement;
  const box = $("authProfile");
  if (p) {
    form.hidden = true;
    box.hidden = false;
    $("authWho").textContent = p.name;
    $("authMeta").textContent = `${p.contact} · ${p.kind === "cafe" ? T("authKindCafe") : T("authKindSchool")}`;
    if (!input("rcShop").value) input("rcShop").value = p.name;
    const qn = document.getElementById("qrUpiName") as HTMLInputElement | null;
    if (qn && !qn.value) qn.value = p.name;
  } else {
    form.hidden = false;
    box.hidden = true;
  }
}

export function initAppShell(): void {
  let authKindVal = "school";
  authKindVal =
    chipGroup("authKind", (v) => {
      authKindVal = v;
    }) || "school";

  $("taskAdd").addEventListener("click", function (this: HTMLElement) {
    const v = input("taskNote").value.trim();
    if (!v) return;
    input("taskNote").value = "";
    addTask(`📝 ${v}`);
    pulse(this);
  });
  input("taskNote").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      $("taskAdd").click();
    }
  });
  $("taskClear").addEventListener("click", () => {
    store.set(TK, []);
    renderTasks();
  });

  onDownload((name) => {
    addTask(`⬇ ${name}`);
    showToast(T("tasksLogged"));
  });

  ($("authForm") as HTMLFormElement).addEventListener("submit", (e) => {
    e.preventDefault();
    const name = input("authName").value.trim();
    const contact = input("authContact").value.trim();
    const msg = $("authMsg");
    if (!name || !contact) {
      setMsg("authMsg", T("authNeed"), "warn");
      return;
    }
    msg.textContent = "";
    store.set(PK, { name, contact, kind: authKindVal });
    renderAuth();
    pulse($("authSave"));
    showToast(T("authSaved"));
  });
  $("authEdit").addEventListener("click", () => {
    const p = store.get<Profile>(PK);
    if (!p) return;
    input("authName").value = p.name;
    input("authContact").value = p.contact;
    document.querySelectorAll("#authKind .chip").forEach((c) => {
      const on = c.getAttribute("data-v") === p.kind;
      c.setAttribute("aria-pressed", on ? "true" : "false");
      if (on) authKindVal = p.kind;
    });
    $("authProfile").hidden = true;
    ($("authForm") as HTMLFormElement).hidden = false;
  });
  $("authOut").addEventListener("click", () => {
    store.del(PK);
    renderAuth();
    showToast(T("authOutMsg"));
  });

  $("langEn").addEventListener("click", () => setLang("en"));
  $("langHi").addEventListener("click", () => setLang("hi"));

  const linkSearch = input("linkSearch");
  const grid = $("linkGrid");
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
    $("linkNone").style.display = any ? "none" : "block";
  });

  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('#legal [role="tab"]'));
  if (tabs.length) {
    const select = (tab: HTMLButtonElement, focus: boolean) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        const controls = t.getAttribute("aria-controls");
        const p = controls ? document.getElementById(controls) : null;
        if (p) p.hidden = !on;
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

  const ADDR = "educafehub@gmail.com";
  $("ctCopy")?.addEventListener("click", () => {
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
  $("ctSend")?.addEventListener("click", () => {
    const name = (input("ctName").value || "").trim();
    const topic = ($("ctTopic") as HTMLSelectElement).value || "";
    const body = (input("ctMsg").value || "").trim();
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
    renderTasks();
    pcCalc();
    document.querySelectorAll<HTMLInputElement>("#rcItems .rcn").forEach((i) => {
      i.placeholder = T("rcItemPh");
    });
    document.querySelectorAll<HTMLInputElement>("#rcItems .rca").forEach((i) => {
      i.placeholder = T("rcAmtPh");
    });
  });

  setLang("en");
  renderAuth();
  renderTasks();
  pcCalc();
}
