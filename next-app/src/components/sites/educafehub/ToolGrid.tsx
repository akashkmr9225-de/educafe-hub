"use client";

import { useState } from "react";
import { TOOLS } from "@/data/tool-registry";
import { ToolIcon } from "./ToolIcons";

// One factual line per tool (English fallback; the dictionary carries both
// languages under desc_<slug> and applyText swaps the text on language change).
const DESC: Record<string, string> = {
  "passport-photo": "Passport size photos on a printed sheet, ready to cut.",
  "exact-kb-photo": "Make a photo exactly the KB size a form asks for.",
  "exam-form-photo": "Photo sized for exam and job application forms.",
  "bulk-student-photos": "Sheets of photos for a whole class, from one list.",
  "signature-maker": "Clean a signature photo: white background, tight crop.",
  "photo-signature-joiner": "Join a photo and signature into one image file.",
  "image-to-pdf": "Turn photos into one PDF file, in your order.",
  "pdf-compress": "Make a PDF file smaller so it uploads easily.",
  "image-compressor": "Shrink a photo file without losing much quality.",
  "file-converter": "Change files between JPG, PNG, WebP and PDF.",
  "file-tools": "Text counter and small file jobs in one place.",
  "qr-code-maker": "Make a QR code for a link, text or Wi-Fi.",
  "receipt-bill-maker": "Print a shop receipt or bill with your items.",
  "print-cost-calculator": "Work out printing cost by page, size and copies.",
  "age-calculator": "Exact age in years, months and days, plus 31 March age.",
  "marks-percentage-calculator": "Percentage from marks, subject by subject.",
};

export function ToolGrid() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const shown = TOOLS.map((t, i) => ({ t, i })).filter(
    ({ t }) =>
      !query ||
      t.nameEn.toLowerCase().includes(query) ||
      t.nameHi.includes(q.trim()) ||
      t.slug.replace(/-/g, " ").includes(query),
  );
  return (
    <section id="tools" aria-label="Tools">
      <div className="sec-head">
        <span className="no">01</span>
        <h2 data-i18n="gridTitle">All tools</h2>
      </div>
      <p className="sec-sub" data-i18n="gridSub">
        Each tool opens on its own page.
      </p>
      <div className="regsearch">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a tool, e.g. passport, PDF, QR"
          data-i18n-ph="toolSearchPh"
          data-i18n-aria="ariaSearchTools"
          aria-label="Search tools"
        />
      </div>
      <div className="toolgrid">
        {shown.map(({ t, i }) => (
          <a key={t.slug} className="toolbox" href={`/tools/${t.slug}/`}>
            <span className="tb-no">{String(i + 1).padStart(2, "0")}</span>
            <ToolIcon slug={t.slug} />
            <span className="tb-name">
              <span className="en-only">{t.nameEn}</span>
              <span className="hi-only">{t.nameHi}</span>
            </span>
            <span className="tb-desc" data-i18n={`desc_${t.slug}`}>
              {DESC[t.slug] || ""}
            </span>
          </a>
        ))}
      </div>
      {shown.length === 0 && (
        <p className="hint" data-i18n="toolSearchNone">
          No tool matches that name.
        </p>
      )}
    </section>
  );
}
