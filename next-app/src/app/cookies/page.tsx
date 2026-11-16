import type { Metadata } from "next";
import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, AuthProvider } from "@/components/sites/educafehub/Hero";
import { LegalDoc, Footer } from "@/components/sites/educafehub/Legal";

export const metadata: Metadata = {
  title: "Cookie Policy | EduCafe Hub",
  description:
    "EduCafe Hub sets no cookies at all. What your browser stores on this device instead, and how to remove it.",
};

export default function Page() {
  return (
    <AuthProvider>
      <div className="wrap" id="top">
        <LanguageBar />
        <LegalDoc doc="cookies" />
        <Footer />
        <EduCafeRuntime />
      </div>
    </AuthProvider>
  );
}
