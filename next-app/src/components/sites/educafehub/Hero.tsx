"use client";

import { Wordmark } from "./Brand";
import { useState, useEffect, createContext, useContext } from "react";
import { AuthModal } from "./AuthModal";
import { watchAuthState } from "./runtime/auth-helpers";
import { isSoundEnabled, setSoundEnabled, playSound } from "./runtime/sound";

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
  const [soundOn, setSoundOn] = useState(true);
  useEffect(
    () =>
      watchAuthState((s) => {
        setWho(s.profile ? s.profile.name : "");
      }),
    [],
  );
  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);
  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    playSound("select");
  };
  return (
    <>
      <div className="langbar" role="group" data-i18n-aria="ariaLangGroup" aria-label="Language">
        <span className="langbar-right"><span className="grp">
          <button type="button" className="langbtn" id="langEn" aria-pressed="true">
            English
          </button>
          <button type="button" className="langbtn" id="langHi" aria-pressed="false">
            हिंदी
          </button>
          <button
            type="button"
            className={`langbtn soundbtn ${soundOn ? "on" : "off"}`}
            onClick={toggleSound}
            aria-pressed={soundOn}
            data-i18n={soundOn ? "soundOn" : "soundOff"}
          >
            {soundOn ? "Sound" : "Sound off"}
          </button>
        </span><span className="grp topbar-actions">{who ? <button type="button" className="langbtn signedin" onClick={auth?.openAuth}>👤 {who} ✓</button> : <button type="button" className="langbtn" onClick={auth?.openAuth} data-i18n="navSignin">👤 Sign in</button>}</span></span>
      </div>
    </>
  );
}

export function Intro() {
  return (
    <div className="intro">
      <Wordmark />
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

