import type { Metadata } from "next";
import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, AuthProvider } from "@/components/sites/educafehub/Hero";
import { LegalSection, Footer } from "@/components/sites/educafehub/Legal";

export const metadata: Metadata = {
  title: "Legal & Contact | EduCafe Hub",
  description:
    "Privacy policy, terms of use, disclaimer, about and contact details for EduCafe Hub — free tools for schools and cyber cafes.",
  openGraph: {
    type: "website",
    siteName: "EduCafe Hub",
    url: "https://educafehub.pages.dev/legal/",
    title: "EduCafe Hub — School & Cyber Cafe",
    description:
      "Passport photos, exact-KB resize, signatures, PDFs, QR codes and calculators — free, in your browser, in English and Hindi. Plus 31 official daily links.",
    images: [
      {
        url: "https://educafehub.pages.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "EduCafe Hub — free tools for schools and cyber cafes",
      },
    ],
  },
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
