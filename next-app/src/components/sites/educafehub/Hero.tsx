"use client";

import { Wordmark } from "./Brand";
import { useState, createContext, useContext } from "react";
import { AuthModal } from "./AuthModal";

const AuthContext = createContext<{ openAuth: () => void } | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [showAuth, setShowAuth] = useState(false);
  const openAuth = () => setShowAuth(true);
  const closeAuth = () => setShowAuth(false);
  return (
    <AuthContext.Provider value={{ openAuth }}>
      {children}
      <AuthModal open={showAuth} onClose={closeAuth} />
    </AuthContext.Provider>
  );
}

export function LanguageBar() {
  const auth = useAuth();
  return (
    <div className="langbar" role="group" aria-label="Language / Bhasha">
      <span className="lbl" data-i18n="langLabel">
        🌐 Bhasha / Language
      </span>
      <span className="langbar-right"><span className="grp">
        <button type="button" className="langbtn" id="langEn" aria-pressed="true">
          English
        </button>
        <button type="button" className="langbtn" id="langHi" aria-pressed="false">
          हिंदी
        </button>
      </span><span className="grp topbar-actions"><button type="button" className="langbtn" onClick={auth?.openAuth} data-i18n="navSignin">👤 Sign in</button><a className="langbtn" href="#tasks" data-i18n="navTasks">✓ My Tasks</a></span></span>
    </div>
  );
}

export function Intro() {
  return (
    <div className="intro">
      <Wordmark />
      <h1 data-i18n="site.heroHeading">EduCafe Hub — for school & cyber cafe</h1>
      <p className="lede" data-i18n="site.heroSubheading">
        Passport photos, exact-KB photo & signature for forms, image to PDF, age & marks
        calculators — plus every government website you open daily, on one page. Sign in is optional and stays on this device; files are never uploaded anywhere.
      </p>
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
          <span data-i18n="heroTrust.trust1">
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
          <span data-i18n="heroTrust.trust2">Zero server load — fast even on old PCs</span>
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
          <span data-i18n="heroTrust.trust3">100% free — no limits, no watermark</span>
        </span>
      </div>
    </div>
  );
}

const NAV: Array<{ href: string; key: string; label: string; hot?: boolean }> = [
  { href: "/tools/passport-photo/", key: "navPassport", label: "📸 Passport Photo", hot: true },
  { href: "/tools/exact-kb-photo/", key: "navKb", label: "🗜️ Exact KB Photo" },
  { href: "/tools/signature-maker/", key: "navSign", label: "✍️ Signature" },
  { href: "/tools/photo-signature-joiner/", key: "navJoiner", label: "🧾 Photo + Sign" },
  { href: "/tools/image-to-pdf/", key: "navPdf", label: "📄 Image → PDF" },
  { href: "/tools/pdf-compress/", key: "navPdfComp", label: "🗜️ PDF Compress" },
  { href: "/tools/image-compressor/", key: "navComp", label: "🖼️ Compressor" },
  { href: "/tools/age-calculator/", key: "navAge", label: "🎂 Age Calculator" },
  { href: "/tools/marks-percentage-calculator/", key: "navMarks", label: "🧮 Marks %" },
  { href: "#links", key: "navLinks", label: "🔗 Daily Links" },
  { href: "/tools/file-tools/", key: "navFile", label: "📁 File Tools" },
  { href: "/tools/file-converter/", key: "navConvert", label: "🔄 File Converter" },
  { href: "/tools/qr-code-maker/", key: "navQr", label: "🔳 QR Code" },
  { href: "/tools/bulk-student-photos/", key: "navBulk", label: "👥 Bulk Photos" },
  { href: "/tools/exam-form-photo/", key: "navExam", label: "📝 Exam Photo" },
  { href: "/tools/receipt-bill-maker/", key: "navReceipt", label: "🧾 Receipt / Bill" },
  { href: "/tools/print-cost-calculator/", key: "navCost", label: "🛮 Print Cost" },
  { href: "#capacity", key: "navCapacity", label: "🛡️ Capacity & Status" },
  { href: "auth:", key: "navLoginLink", label: "🔐 Sign in" },
  { href: "#tasks", key: "navTasks", label: "✓ My Tasks" },
  { href: "#legal", key: "navLegal", label: "⚖️ Legal & Contact" },
];

export function ToolNav() {
  const auth = useAuth();
  return (
    <nav className="toolnav" aria-label="Tools">
      <div className="row">
        {NAV.map((item) => {
          const isAuthLink = item.key === "navLoginLink";
          return isAuthLink ? (
            <button
              key={item.href}
              type="button"
              className="hot"
              onClick={auth?.openAuth}
              data-i18n={item.key}
            >
              {item.label}
            </button>
          ) : (
            <a
              key={item.href}
              className={item.hot ? "hot" : undefined}
              href={item.href}
              data-i18n={item.key}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}