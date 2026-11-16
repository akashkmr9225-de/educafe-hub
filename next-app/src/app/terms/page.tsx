import type { Metadata } from "next";
import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, AuthProvider } from "@/components/sites/educafehub/Hero";
import { LegalDoc, Footer } from "@/components/sites/educafehub/Legal";

export const metadata: Metadata = {
  title: "Terms of Use | EduCafe Hub",
  description:
    "The terms for using EduCafe Hub — free tools for schools, cyber cafes and students, provided as they are.",
};

export default function Page() {
  return (
    <AuthProvider>
      <div className="wrap" id="top">
        <LanguageBar />
        <LegalDoc doc="terms" />
        <Footer />
        <EduCafeRuntime />
      </div>
    </AuthProvider>
  );
}
