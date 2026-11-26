import type { Metadata } from "next";
import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, AuthProvider } from "@/components/sites/educafehub/Hero";
import { ToolGrid } from "@/components/sites/educafehub/ToolGrid";
import { Footer } from "@/components/sites/educafehub/Legal";

export const metadata: Metadata = {
  title: "Cyber Cafe Tools | EduCafe Hub",
  description:
    "Cyber cafe tools only: passport photo sheets, exact-KB photo and signature resize, image to PDF, PDF compress, QR code maker and calculators, free in your browser, in English and Hindi.",
  openGraph: {
    type: "website",
    siteName: "EduCafe Hub",
    url: "https://educafehub.pages.dev/cyber-cafe/",
    title: "Cyber Cafe Tools | EduCafe Hub",
    description:
      "Only the tools: passport photos, exact-KB resize, signatures, PDFs, QR codes and calculators, free in your browser, in English and Hindi.",
    images: [
      {
        url: "https://educafehub.pages.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "EduCafe Hub cyber cafe tools",
      },
    ],
  },
};

export default function Page() {
  return (
    <AuthProvider>
      <div className="wrap" id="top">
        <LanguageBar />
        <ToolGrid />
        <Footer />
        <EduCafeRuntime />
      </div>
    </AuthProvider>
  );
}
