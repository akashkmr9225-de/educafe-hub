import type { Metadata } from "next";
import Link from "next/link";
import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, AuthProvider } from "@/components/sites/educafehub/Hero";
import { Footer } from "@/components/sites/educafehub/Legal";

export const metadata: Metadata = {
  title: "Page Not Found | EduCafe Hub",
  description:
    "This page does not exist on EduCafe Hub. Go back to the 16 free tools for photo, PDF and form work, plus 31 official daily links. 2026.",
};

export default function NotFound() {
  return (
    <AuthProvider>
      <div className="wrap" id="top">
        <LanguageBar />
        <div style={{ textAlign: "center", padding: "56px 16px 40px" }}>
          <p style={{ fontSize: 52, fontWeight: 800, margin: "0 0 4px", color: "var(--accent)" }}>404</p>
          <h1 data-i18n="nfTitle">Page not found</h1>
          <p className="sec-sub" style={{ margin: "0 auto" }} data-i18n="nfText">
            The page you opened does not exist. It may have been moved, or the address may be wrong.
          </p>
          <div className="btnrow" style={{ justifyContent: "center", marginTop: 22 }}>
            <Link className="btn" href="/" data-i18n="nfHome">
              Go to the home page
            </Link>
            <Link className="btn ghost" href="/#tools" data-i18n="nfTools">
              See all 16 tools
            </Link>
          </div>
        </div>
        <Footer />
        <EduCafeRuntime />
      </div>
    </AuthProvider>
  );
}
