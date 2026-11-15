import { Wordmark } from "./Brand";

export function LanguageBar() {
  return (
    <div className="langbar" role="group" aria-label="Language / Bhasha">
      <span className="lbl" data-i18n="langLabel">
        🌐 Bhasha / Language
      </span>
      <span className="grp">
        <button type="button" className="langbtn" id="langEn" aria-pressed="true">
          English
        </button>
        <button type="button" className="langbtn" id="langHi" aria-pressed="false">
          हिंदी
        </button>
      </span>
    </div>
  );
}

export function Intro() {
  return (
    <div className="intro">
      <Wordmark />
      <h1 data-i18n="introTitle">EduCafe Hub — school &amp; cyber cafe ke liye</h1>
      <p className="lede" data-i18n="introLede">
        Passport photo, form ke liye exact-KB photo aur signature, image se PDF, age aur marks
        calculator — aur roz khulne wali saari sarkari websites, ek hi page par. Koi login nahi,
        koi upload server nahi.
      </p>
      <div className="hero-cta">
        <a href="#login" data-i18n="heroSignin">
          🔐 Sign in (optional)
        </a>
        <a href="#tasks" data-i18n="navTasks">
          ✓ My Tasks
        </a>
      </div>
      <div className="trustrow">
        <span className="trust">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z" />
            <path d="M9 12l2 2 4-4" />
          </svg>{" "}
          <span data-i18n="trust1">
            Photos never leave this computer — everything runs in the browser
          </span>
        </span>
        <span className="trust">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
          </svg>{" "}
          <span data-i18n="trust2">Zero server load — fast even on old PCs</span>
        </span>
        <span className="trust">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>{" "}
          <span data-i18n="trust3">100% free — no limits, no watermark</span>
        </span>
      </div>
    </div>
  );
}

const NAV: Array<{ href: string; key: string; label: string; hot?: boolean }> = [
  { href: "#passport", key: "navPassport", label: "📸 Passport Photo", hot: true },
  { href: "#school", key: "navSchool", label: "🏫 School" },
  { href: "#cafe", key: "navCafe", label: "🖥️ Cyber Cafe" },
  { href: "#notices", key: "navNotices", label: "📢 Notices" },
  { href: "#kb", key: "navKb", label: "🗜️ Exact KB Photo" },
  { href: "#signature", key: "navSign", label: "✍️ Signature" },
  { href: "#joiner", key: "navJoiner", label: "🧾 Photo + Sign" },
  { href: "#pdf", key: "navPdf", label: "📄 Image → PDF" },
  { href: "#pdfcompress", key: "navPdfComp", label: "🗜️ PDF Compress" },
  { href: "#compress", key: "navComp", label: "🖼️ Compressor" },
  { href: "#age", key: "navAge", label: "🎂 Age Calculator" },
  { href: "#marks", key: "navMarks", label: "🧮 Marks %" },
  { href: "#links", key: "navLinks", label: "🔗 Daily Links" },
  { href: "#filetools", key: "navFile", label: "📁 File Tools" },
  { href: "#converter", key: "navConvert", label: "🔄 File Converter" },
  { href: "#qr", key: "navQr", label: "🔳 QR Code" },
  { href: "#bulk", key: "navBulk", label: "👥 Bulk Photos" },
  { href: "#exam", key: "navExam", label: "📝 Exam Photo" },
  { href: "#receipt", key: "navReceipt", label: "🧾 Receipt / Bill" },
  { href: "#printcost", key: "navCost", label: "🧮 Print Cost" },
  { href: "#earn", key: "navEarn", label: "💰 Earn Money" },
  { href: "#golive", key: "navLive", label: "🚀 Go Live Free" },
  { href: "#capacity", key: "navCapacity", label: "🛡️ Capacity & Status" },
  { href: "#login", key: "navLogin", label: "🔐 Sign in" },
  { href: "#tasks", key: "navTasks", label: "✓ My Tasks" },
  { href: "#legal", key: "navLegal", label: "⚖️ Legal & Contact" },
];

export function ToolNav() {
  return (
    <nav className="toolnav" aria-label="Tools">
      <div className="row">
        {NAV.map((item) => (
          <a
            key={item.href}
            className={item.hot ? "hot" : undefined}
            href={item.href}
            data-i18n={item.key}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function StartHere() {
  return (
    <section id="start" style={{ marginTop: 30 }}>
      <div className="sec-head">
        <span className="no" data-i18n="audBadge">
          Start here
        </span>
        <h2 data-i18n="audTitle">Who are you here for?</h2>
      </div>
      <div className="audgrid">
        <div className="card aud">
          <span className="audtag" data-i18n="audSchoolTag">
            Buddha World School
          </span>
          <p data-i18n="audSchoolD">
            Parents &amp; students — admission details, notices and contact, without hunting
            through the page.
          </p>
          <div className="btnrow">
            <a className="btn" href="#school" data-i18n="audSchoolB1">
              Admissions &amp; school info
            </a>
            <a className="btn ghost" href="#notices" data-i18n="audSchoolB2">
              See notices
            </a>
          </div>
        </div>
        <div className="card aud cafe">
          <span className="audtag" data-i18n="audCafeTag">
            Cyber Cafe
          </span>
          <p data-i18n="audCafeD">
            Customers — see the services and counter rates first, then use the free tools or
            reach us in one tap.
          </p>
          <div className="btnrow">
            <a className="btn saf" href="#cafe" data-i18n="audCafeB1">
              Services &amp; rates
            </a>
            <a className="btn ghost" href="#passport" data-i18n="audCafeB2">
              Open the tools
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
