import type { Metadata } from "next";
import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, AuthProvider } from "@/components/sites/educafehub/Hero";
import { LegalSection, Footer } from "@/components/sites/educafehub/Legal";

export const metadata: Metadata = {
  title: "Legal & Contact | EduCafe Hub",
  description:
    "Privacy policy, terms of use, disclaimer, about and contact details for EduCafe Hub — free tools for schools and cyber cafes.",
};

export default function LegalPage() {
  return (
    <AuthProvider>
      <div className="wrap" id="top">
        <LanguageBar />
        <LegalSection />
        <Footer />
        <EduCafeRuntime />
      </div>
    </AuthProvider>
  );
}
