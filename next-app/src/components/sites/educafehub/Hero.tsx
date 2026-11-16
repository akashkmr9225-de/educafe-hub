"use client";

import { Wordmark } from "./Brand";
import { useState, useEffect, createContext, useContext } from "react";
import { AuthModal } from "./AuthModal";
import { watchAuthState } from "./runtime/auth-helpers";

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
  const [who, setWho] = useState("");
  useEffect(
    () =>
      watchAuthState((s) => {
        setWho(s.profile ? s.profile.name : "");
      }),
    [],
  );
  return (
    <div className="langbar" role="group" data-i18n-aria="ariaLangGroup" aria-label="Language">
      <span className="lbl" data-i18n="langLabel">Language</span>
      <span className="langbar-right"><span className="grp">
        <button type="button" className="langbtn" id="langEn" aria-pressed="true">
          English
        </button>
        <button type="button" className="langbtn" id="langHi" aria-pressed="false">
          हिंदी
        </button>
      </span><span className="grp topbar-actions">{who ? <button type="button" className="langbtn signedin" onClick={auth?.openAuth}>{who} ✓</button> : <button type="button" className="langbtn" onClick={auth?.openAuth} data-i18n="navSignin">Sign in</button>}</span></span>
    </div>
  );
}

export function Intro() {
  return (
    <div className="intro">
      <Wordmark />
      <h1 data-i18n="site.heroHeading">16 free tools for photo, PDF and form work.</h1>
      <p className="lede" data-i18n="site.heroSubheading">
        Every tool runs in your browser. Your files are not uploaded anywhere. No sign-up
        is needed.
      </p>
      <p className="stepsline" data-i18n="site.heroSteps">
        Pick a tool. Add your file. Download the result.
      </p>
    </div>
  );
}

const NAV: Array<{ href: string; key: string; label: string; hot?: boolean }> = [
  { href: "/tools/passport-photo/", key: "navPassport", label: "Passport Photo", hot: true },
  { href: "/tools/exact-kb-photo/", key: "navKb", label: "Exact KB Photo" },
  { href: "/tools/signature-maker/", key: "navSign", label: "Signature" },
  { href: "/tools/photo-signature-joiner/", key: "navJoiner", label: "Photo + Sign" },
  { href: "/tools/image-to-pdf/", key: "navPdf", label: "Image to PDF" },
  { href: "/tools/pdf-compress/", key: "navPdfComp", label: "PDF Compress" },
  { href: "/tools/image-compressor/", key: "navComp", label: "Compressor" },
  { href: "/tools/age-calculator/", key: "navAge", label: "Age Calculator" },
  { href: "/tools/marks-percentage-calculator/", key: "navMarks", label: "Marks %" },
  { href: "#links", key: "navLinks", label: "Daily Links" },
  { href: "/tools/file-tools/", key: "navFile", label: "File Tools" },
  { href: "/tools/file-converter/", key: "navConvert", label: "File Converter" },
  { href: "/tools/qr-code-maker/", key: "navQr", label: "QR Code" },
  { href: "/tools/bulk-student-photos/", key: "navBulk", label: "Bulk Photos" },
  { href: "/tools/exam-form-photo/", key: "navExam", label: "Exam Photo" },
  { href: "/tools/receipt-bill-maker/", key: "navReceipt", label: "Receipt / Bill" },
  { href: "/tools/print-cost-calculator/", key: "navCost", label: "Print Cost" },
  { href: "auth:", key: "navLoginLink", label: "Sign in" },
  { href: "#legal", key: "navLegal", label: "Legal & Contact" },
];

export function ToolNav() {
  const auth = useAuth();
  return (
    <nav className="toolnav" data-i18n-aria="ariaTools" aria-label="Tools">
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