"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Tool, getToolsByCategory } from "@/data/tool-registry";
import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, AuthProvider } from "@/components/sites/educafehub/Hero";
import { Footer } from "@/components/sites/educafehub/Legal";
import { ScrollReveal } from "@/components/sites/educafehub/ScrollReveal";

import { PassportTool, ExactKbTool } from "@/components/sites/educafehub/PhotoTools1";
import { SignatureTool, JoinerTool } from "@/components/sites/educafehub/PhotoTools2";
import { ImageToPdfTool, PdfCompressTool, ImageCompressorTool } from "@/components/sites/educafehub/PdfTools";
import { AgeTool, MarksTool } from "@/components/sites/educafehub/Calculators";
import { FileToolsSection, ConverterCard } from "@/components/sites/educafehub/FileTools";
import { QrTool } from "@/components/sites/educafehub/QrTool";
import { BulkTool } from "@/components/sites/educafehub/Bulk";
import { ExamPhotoTool, ReceiptTool, PrintCostTool } from "@/components/sites/educafehub/ExamReceipt";
import { FormPhotoTool } from "@/components/sites/educafehub/FormPhoto";
import { DocCropTool } from "@/components/sites/educafehub/DocCrop";

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
    case "online-form-photo":
      return <FormPhotoTool />;
    case "document-auto-crop":
      return <DocCropTool />;
    default:
      return null;
  }
}

const STEPS: Record<string, [string, string, string]> = {
  "passport-photo": ["Upload one clear photo — JPG, PNG or HEIC, straight from the phone gallery.", "Pick the copies, paper (A4, 4×6…) and background colour. The sheet preview updates live.", "Press Generate, then download the sheet JPG or PDF and print it — 300 DPI, exact 35×45 mm."],
  "exact-kb-photo": ["Upload the photo (or up to 200 photos in Many-photos mode).", "Type the target size — e.g. 50 KB — or pick a chip. Exact size mode makes the download exactly that big.", "Press Resize and download — the size shown is the size you get."],
  "exam-form-photo": ["Pick your exam — SSC, NEET, bank, BPSC — the size and KB range set themselves.", "Upload the photo; add name and date if the form prints them below the photo.", "Download the JPG — exact pixels, inside the KB range, ready for the form."],
  "bulk-student-photos": ["Add the whole class's photos — pick files or a full folder; HEIC works too.", "Match names from the Excel sheet (or type them) and choose sheets or separate files.", "Download the named A4 sheets or the ZIP of separate student files and print."],
  "signature-maker": ["Upload a photo of the signature on plain white paper.", "The background is cleaned and the signature is cropped — adjust the cleaning level if needed.", "Download the JPG at the form's size (140×60, 10–20 KB) and upload it to the form."],
  "photo-signature-joiner": ["Upload the photo and the signature photo separately.", "Choose the layout (photo above, signature below) and set a KB limit if the form has one.", "Download the one combined image and upload it to the form."],
  "image-to-pdf": ["Add the photos — marksheets, certificates, any documents. More can be added anytime.", "Fix the order with ◀ ▶, remove mistakes with ✕, pick A4 / 4×6 / fit and name the PDF.", "Press Make PDF and download — the final size is shown before you submit it anywhere."],
  "pdf-compress": ["Upload the PDF — scanned documents and photo PDFs shrink the most.", "Pick a quality level: High keeps it clear, Low makes it smallest.", "Press Compress, check the new size, and download the smaller PDF."],
  "image-compressor": ["Upload the photo you want to send or upload.", "Move the quality slider and watch the size change live; pick JPG or PNG.", "Download the smaller photo — if it ever comes out larger, the tool warns you."],
  "file-converter": ["Upload the image — JPG, PNG or WebP.", "Pick the format you need: JPG for forms, PNG for transparency, WebP for small size.", "Download the converted image — same photo, new format."],
  "file-tools": ["Choose what to do: merge or split a PDF, resize / rotate an image, or clean up text.", "Add the file and set the pages, size or angle the job needs.", "Download the finished file — everything happens in your browser."],
  "qr-code-maker": ["Pick the QR type: UPI payment, Wi-Fi, or a link / text.", "Fill the details — UPI ID for payment, network name and password for Wi-Fi.", "Download the print-ready PNG and put it on the counter."],
  "receipt-bill-maker": ["Write the shop / school name and add the items with amounts.", "Check the total — it adds up as you type.", "Download the receipt image — print it or send it on WhatsApp."],
  "print-cost-calculator": ["Set your cafe's rates once — per page, per photo set, per lamination.", "Enter the job: pages, copies, photo sets, forms filled.", "Read the exact total and charge the customer — no mental maths, no mistakes."],
  "age-calculator": ["Enter the child's date of birth.", "Press Calculate age — you get today's age plus the age on 31 March and 31 December.", "Read the Class 1 verdict: eligible if the child is 6 or more on 31 March of the admission year."],
  "marks-percentage-calculator": ["Enter each subject's full marks and obtained marks (rows can be added or removed).", "Press Calculate — total, percentage, division and grade appear together.", "Use the converter below for CGPA ↔ percentage (CBSE × 9.5)."],
  "online-form-photo": ["Upload the photo — JPG, PNG or HEIC, straight from the phone gallery.", "Pick the form (Passport Seva, IBPS, NEET, PAN, Visa…) — the pixel size, KB range and background set themselves; add the name + date strip if the form prints one.", "Press Download digital photo — exact pixels, inside the KB range, ready to upload to the form."],
  "document-auto-crop": ["Upload a photo of the document — Aadhaar, certificate, any paper page, taken from above.", "Check the four corners — they are found automatically; drag any dot that is off the edge.", "Pick the look (original or B&W scan) and download the straightened page as JPG or PDF."],
};

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

      <ScrollReveal>{renderToolComponent(tool.slug)}</ScrollReveal>

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
            <p style={{ margin: 0, fontSize: 14, color: "var(--ink2)" }} data-i18n={`how_${tool.slug}_1`}>
              {STEPS[tool.slug]?.[0] ?? "Select or drop your file into the tool box above."}
            </p>
          </div>
          <div style={{ background: "var(--surface2)", padding: 14, borderRadius: 8 }}>
            <strong style={{ display: "block", marginBottom: 6, color: "var(--brand)" }} data-i18n="howStepLbl2">
              Step 2
            </strong>
            <p style={{ margin: 0, fontSize: 14, color: "var(--ink2)" }} data-i18n={`how_${tool.slug}_2`}>
              {STEPS[tool.slug]?.[1] ?? "Adjust settings like size, quality, or dimensions as needed."}
            </p>
          </div>
          <div style={{ background: "var(--surface2)", padding: 14, borderRadius: 8 }}>
            <strong style={{ display: "block", marginBottom: 6, color: "var(--brand)" }} data-i18n="howStepLbl3">
              Step 3
            </strong>
            <p style={{ margin: 0, fontSize: 14, color: "var(--ink2)" }} data-i18n={`how_${tool.slug}_3`}>
              {STEPS[tool.slug]?.[2] ?? "Download your processed file instantly — completely free!"}
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