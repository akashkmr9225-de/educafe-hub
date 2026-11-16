import type { Metadata } from "next";
import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, AuthProvider } from "@/components/sites/educafehub/Hero";
import { LegalDoc, Footer } from "@/components/sites/educafehub/Legal";

export const metadata: Metadata = {
  title: "Privacy Policy | EduCafe Hub",
  description:
    "How EduCafe Hub handles your data: every tool runs in your browser, your files are never uploaded, no cookies and no analytics.",
};

export default function Page() {
  return (
    <AuthProvider>
      <div className="wrap" id="top">
        <LanguageBar />
        <LegalDoc doc="privacy" />
        <Footer />
        <EduCafeRuntime />
      </div>
    </AuthProvider>
  );
}
