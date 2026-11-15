"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Tool, getToolsByCategory } from "@/data/tool-registry";
import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, AuthProvider } from "@/components/sites/educafehub/Hero";
import { LegalSection, Footer } from "@/components/sites/educafehub/Legal";

import { PassportTool, ExactKbTool } from "@/components/sites/educafehub/PhotoTools1";
import { SignatureTool, JoinerTool } from "@/components/sites/educafehub/PhotoTools2";
import { ImageToPdfTool, PdfCompressTool, ImageCompressorTool } from "@/components/sites/educafehub/PdfTools";
import { AgeTool, MarksTool } from "@/components/sites/educafehub/Calculators";
import { FileToolsSection, ConverterCard } from "@/components/sites/educafehub/FileTools";
import { QrTool } from "@/components/sites/educafehub/QrTool";
import { BulkTool } from "@/components/sites/educafehub/Bulk";
import { ExamPhotoTool, ReceiptTool, PrintCostTool } from "@/components/sites/educafehub/ExamReceipt";

function renderToolComponent(slug: string) {
  switch (slug) {
    case "passport-photo":
      return <PassportTool />;
    case "exact-kb-photo":
      return <ExactKbTool />;
    case "signature-maker":
      return <SignatureTool />;
    case "photo-signature-joiner":
      return <JoinerTool />;
    case "image-to-pdf":
      return <ImageToPdfTool />;
    case "pdf-compress":
      return <PdfCompressTool />;
    case "image-compressor":
      return <ImageCompressorTool />;
    case "age-calculator":
      return <AgeTool />;
    case "marks-percentage-calculator":
      return <MarksTool />;
    case "qr-code-maker":
      return <QrTool />;
    case "bulk-student-photos":
      return <BulkTool />;
    case "exam-form-photo":
      return <ExamPhotoTool />;
    case "receipt-bill-maker":
      return <ReceiptTool />;
    case "print-cost-calculator":
      return <PrintCostTool />;
    case "file-converter":
      return (
        <section id="converter">
          <ConverterCard />
        </section>
      );
    case "file-tools":
      return <FileToolsSection />;
    default:
      return null;
  }
}

export function ToolPageContent({ tool }: { tool: Tool }) {
  const relatedTools = getToolsByCategory(tool.category).filter((t) => t.slug !== tool.slug);

  return (
    <div className="wrap" id="top">
      <noscript>
        <div
          style={{
            background: "var(--saffron-bg)",
            color: "var(--warn)",
            border: "1px solid var(--warn)",
            borderRadius: 12,
            padding: "14px 18px",
            marginTop: 16,
            fontWeight: 600,
          }}
        >
          JavaScript is off in this browser, so the tools cannot run. Please enable JavaScript and
          reload. / JavaScript बंद है, इसलिए टूल नहीं चलेंगे — कृपया JavaScript चालू करके पेज दोबारा
          खोलें।
        </div>
      </noscript>

      <AuthProvider><LanguageBar /></AuthProvider>

      <div style={{ margin: "20px 0 10px 0" }}>
        <Link href="/" style={{ fontSize: 14, textDecoration: "none", color: "var(--brand)" }} data-i18n="backHome">
          ← Back to EduCafe Hub Home
        </Link>
      </div>

      <div className="sec-head" style={{ marginTop: 20 }}>
        <h1 className="en-only">{tool.titleEn}</h1>
        <h1 className="hi-only">{tool.titleHi}</h1>
      </div>

      {renderToolComponent(tool.slug)}

      {/* Privacy strip */}
      <div
        style={{
          background: "var(--green-bg)",
          border: "1px solid var(--good)",
          borderRadius: 12,
          padding: "16px 20px",
          margin: "24px 0",
          textAlign: "center",
        }}
      >
        <p style={{ fontWeight: 600, color: "var(--good-ink)", margin: 0, fontSize: 15.5 }} data-i18n="privacyStrip">
          🔒 Your file never leaves your device — everything is processed in your browser.
        </p>
      </div>

      {/* 3-Step How it works strip */}
      <div className="card" style={{ margin: "24px 0" }}>
        <h3 style={{ fontSize: 18, marginBottom: 14 }} data-i18n="howTitle">How it works</h3>
        <div className="grid3" style={{ gap: 16 }}>
          <div style={{ background: "var(--surface2)", padding: 14, borderRadius: 8 }}>
            <strong style={{ display: "block", marginBottom: 6, color: "var(--brand)" }} data-i18n="howStepLbl1">
              Step 1
            </strong>
            <p style={{ margin: 0, fontSize: 14, color: "var(--ink2)" }} data-i18n="howStep1">
              Select or drop your file into the tool box above.
            </p>
          </div>
          <div style={{ background: "var(--surface2)", padding: 14, borderRadius: 8 }}>
            <strong style={{ display: "block", marginBottom: 6, color: "var(--brand)" }} data-i18n="howStepLbl2">
              Step 2
            </strong>
            <p style={{ margin: 0, fontSize: 14, color: "var(--ink2)" }} data-i18n="howStep2">
              Adjust settings like size, quality, or dimensions as needed.
            </p>
          </div>
          <div style={{ background: "var(--surface2)", padding: 14, borderRadius: 8 }}>
            <strong style={{ display: "block", marginBottom: 6, color: "var(--brand)" }} data-i18n="howStepLbl3">
              Step 3
            </strong>
            <p style={{ margin: 0, fontSize: 14, color: "var(--ink2)" }} data-i18n="howStep3">
              Download your processed file instantly — completely free!
            </p>
          </div>
        </div>
      </div>

      {/* Related tools row */}
      {relatedTools.length > 0 && (
        <div className="card" style={{ margin: "24px 0" }}>
          <h3 style={{ fontSize: 18, marginBottom: 12 }} data-i18n="relTools">Related Tools</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {relatedTools.map((rel) => (
              <Link
                key={rel.slug}
                href={`/tools/${rel.slug}/`}
                className="chip saf"
                style={{ textDecoration: "none", display: "inline-block", padding: "8px 14px" }}
              >
                <span className="en-only">{rel.nameEn}</span><span className="hi-only">{rel.nameHi}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <LegalSection />
      <Footer />

      <div className="toast" id="toast" role="status" aria-live="polite">
        <span className="tick">✓</span>
        <span id="toastTxt" />
      </div>
      <a className="totop" href="#top" data-i18n-aria="ariaTop" aria-label="Back to top">
        ↑ Top
      </a>
      <EduCafeRuntime />
    </div>
  );
}