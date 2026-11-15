"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/hooks/useLang";
import { getAuthState, setAuthState, clearAuthState, watchAuthState } from "./runtime/auth-helpers";
import { T } from "./runtime/state";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [kind, setKind] = useState<"school" | "cafe">("school");
  const [auth, setAuth] = useState(getAuthState());
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const lang = useLang();

  useEffect(() => {
    if (auth.profile) {
      setKind(auth.profile.kind);
    }
  }, [auth]);

  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const unsub = watchAuthState((newAuth) => {
      setAuth(newAuth);
    });
    return unsub;
  }, []);

  const handleClose = () => {
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      handleClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const nameInput = form.elements.namedItem("authName") as HTMLInputElement;
    const contactInput = form.elements.namedItem("authContact") as HTMLInputElement;
    const name = nameInput.value.trim();
    const contact = contactInput.value.trim();
    if (!name || !contact) return;
    const kindVal = kind;
    setAuthState({ name, contact, kind: kindVal });
    handleClose();
  };

  const updateKind = (k: "school" | "cafe") => {
    setKind(k);
    if (auth.profile) {
      setAuthState({ ...auth.profile, kind: k });
    }
  };

  const handleSignOut = () => {
    clearAuthState();
    setAuth(getAuthState());
  };

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="auth-backdrop show"
      onClick={handleBackdropClick}
      role="button"
      tabIndex={-1}
    >
      <div
        ref={modalRef}
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="authTitle"
      >
        <button
          className="auth-close"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>
        {auth.profile ? (
          <div className="auth-profile">
            <p data-i18n="authHello">Signed in as</p>
            <h3 id="authTitle">{auth.profile.name}</h3>
            <p className="auth-meta">{auth.profile.contact} · {auth.profile.kind === "cafe" ? "🖨️ Cyber Cafe" : "🏫 School"}</p>
            <button className="btn ghost small" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        ) : (
          <form ref={formRef} id="authForm" onSubmit={handleFormSubmit} data-i18n="authDesc">
            <h2 id="authTitle" data-i18n="authTitle">Sign in — a small profile on this device</h2>
            <p className="sec-sub" data-i18n="authDesc">
              One small profile, saved only in this browser on this device. No password, and nothing is sent to any server.
            </p>
            <div className="field">
              <label className="fl" htmlFor="authName" data-i18n="authNameL">
                Your name
              </label>
              <input
                type="text"
                id="authName"
                name="authName"
                autoComplete="name"
                ref={firstFieldRef}
              />
            </div>
            <div className="field">
              <label className="fl" htmlFor="authContact" data-i18n="authContactL">
                Mobile number or email
              </label>
              <input
                type="text"
                id="authContact"
                name="authContact"
                autoComplete="tel"
              />
            </div>
            <div className="field">
              <label className="fl" data-i18n="authKindL">
                I am signing in as
              </label>
              <div className="chips">
                 <button
                   type="button"
                   className={`chip ${kind === "school" ? "active" : ""}`}
                   data-v="school"
                   aria-pressed={kind === "school" ? "true" : "false"}
                   onClick={() => updateKind("school")}
                 >
                   🏫 School
                 </button>
                 <button
                   type="button"
                   className={`chip saf ${kind === "cafe" ? "active" : ""}`}
                   data-v="cafe"
                   aria-pressed={kind === "cafe" ? "true" : "false"}
                   onClick={() => updateKind("cafe")}
                 >
                   🖨️ Cyber Cafe
                 </button>
              </div>
            </div>
            <div className="btnrow">
              <button className="btn" type="submit">{T("authSave")}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}