import type { Metadata } from "next";
import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, AuthProvider } from "@/components/sites/educafehub/Hero";
import { LegalDoc, Footer } from "@/components/sites/educafehub/Legal";

export const metadata: Metadata = {
  title: "Cookie Policy | EduCafe Hub",
  description:
    "EduCafe Hub sets no cookies at all. What your browser stores on this device instead, and how to remove it.",
  openGraph: {
    type: "website",
    siteName: "EduCafe Hub",
    url: "https://educafehub.pages.dev/cookies/",
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
