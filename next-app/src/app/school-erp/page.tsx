import type { Metadata } from "next";
import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, AuthProvider } from "@/components/sites/educafehub/Hero";
import { Footer } from "@/components/sites/educafehub/Legal";
import { ToolGrid } from "@/components/sites/educafehub/ToolGrid";
import { SchoolErpApp } from "@/components/sites/educafehub/SchoolErpApp";

export const metadata: Metadata = {
  title: "School ERP | EduCafe Hub",
  description:
    "EduCafe School ERP, inside the website: students, admissions, attendance, fees, staff and payroll, exams, certificates, timetable, library, transport, accounts and government reports for UDISE+, APAAR and RTE, in English and Hindi. Data is saved in your browser on your device.",
  openGraph: {
    type: "website",
    siteName: "EduCafe Hub",
    url: "https://educafehub.pages.dev/school-erp/",
    title: "EduCafe School ERP | EduCafe Hub",
    description:
      "The real School ERP inside EduCafe Hub: students, attendance, fees, exams, certificates and government reports, in English and Hindi.",
    images: [
      {
        url: "https://educafehub.pages.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "EduCafe School ERP",
      },
    ],
  },
};

export default function Page() {
  return (
    <AuthProvider>
      <div className="wrap" id="top">
        <LanguageBar />
        <SchoolErpApp />
        <ToolGrid />
        <section className="finalcta" aria-label="Contact">
          <p className="finalcta-t">
            <span className="en-only">Questions about the School ERP? Message us.</span>
            <span className="hi-only">स्कूल ERP के बारे में सवाल? हमें संदेश भेजें।</span>
          </p>
          <a className="btn" href="https://wa.me/918787479225" target="_blank" rel="noopener">
            WhatsApp: +91 87874 79225
          </a>{" "}
          <a className="btn ghost" href="mailto:educafehub@gmail.com">
            educafehub@gmail.com
          </a>
        </section>
        <Footer />
        <EduCafeRuntime />
      </div>
    </AuthProvider>
  );
}
