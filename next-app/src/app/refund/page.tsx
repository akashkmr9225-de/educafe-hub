import type { Metadata } from "next";
import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, AuthProvider } from "@/components/sites/educafehub/Hero";
import { LegalDoc, Footer } from "@/components/sites/educafehub/Legal";

export const metadata: Metadata = {
  title: "Refund Policy | EduCafe Hub",
  description:
    "Everything on EduCafe Hub is free and no payments are taken on this website — the refund policy in plain words.",
};

export default function Page() {
  return (
    <AuthProvider>
      <div className="wrap" id="top">
        <LanguageBar />
        <LegalDoc doc="refund" />
        <Footer />
        <EduCafeRuntime />
      </div>
    </AuthProvider>
  );
}
