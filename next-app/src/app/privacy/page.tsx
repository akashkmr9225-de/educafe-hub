import type { Metadata } from "next";
import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, AuthProvider } from "@/components/sites/educafehub/Hero";
import { LegalDoc, Footer } from "@/components/sites/educafehub/Legal";

export const metadata: Metadata = {
  title: "Privacy Policy | EduCafe Hub",
  description:
    "How EduCafe Hub handles your data: every tool runs in your browser, your files are never uploaded, no cookies and no analytics. 2026.",
  openGraph: {
    type: "website",
    siteName: "EduCafe Hub",
    url: "https://educafehub.pages.dev/privacy/",
    title: "EduCafe Hub — School & Cyber Cafe",
    description:
      "Passport photos, exact-KB resize, signatures, PDFs, QR codes and calculators — free, in your browser, in English and Hindi. Plus 31 official daily links. 2026.",
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
