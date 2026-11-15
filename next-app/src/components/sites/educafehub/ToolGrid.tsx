import { TOOLS } from "@/data/tool-registry";

// Big, instantly-readable symbols (Sir's direction 2026-11-16: a new visitor must
// know in one second what each tool does). One emoji per tool + a generic fallback.
const ICONS: Record<string, string> = {
  "passport-photo": "\U0001F4F8",
  "exact-kb-photo": "\U0001F3AF",
  "exam-form-photo": "\U0001FAAA",
  "bulk-student-photos": "\U0001F393",
  "signature-maker": "\u270D\uFE0F",
  "photo-signature-joiner": "\U0001F9E9",
  "image-to-pdf": "\U0001F4C4",
  "pdf-compress": "\U0001F5DC\uFE0F",
  "image-compressor": "\U0001F5BC\uFE0F",
  "file-converter": "\U0001F504",
  "file-tools": "\U0001F5C2\uFE0F",
  "qr-code-maker": "\U0001F533",
  "receipt-bill-maker": "\U0001F9FE",
  "print-cost-calculator": "\U0001F5A8\uFE0F",
  "age-calculator": "\U0001F382",
  "marks-percentage-calculator": "\U0001F4AF",
};

const COLORS: Record<string, string> = {
  "passport-photo": "#0F766E",
  "exact-kb-photo": "#2563EB",
  "exam-form-photo": "#7C3AED",
  "bulk-student-photos": "#DB2777",
  "signature-maker": "#B45309",
  "photo-signature-joiner": "#0891B2",
  "image-to-pdf": "#DC2626",
  "pdf-compress": "#EA580C",
  "image-compressor": "#059669",
  "file-converter": "#4F46E5",
  "file-tools": "#CA8A04",
  "qr-code-maker": "#1F2937",
  "receipt-bill-maker": "#0D9488",
  "print-cost-calculator": "#9333EA",
  "age-calculator": "#E11D48",
  "marks-percentage-calculator": "#16A34A",
};


export function ToolGrid() {
  return (
    <section id="tools" aria-label="Tools">
      <div className="sec-head">
        <h2 data-i18n="gridTitle">All tools</h2>
      </div>
      <p className="sec-sub" data-i18n="gridSub">
        Tap a tool to open it — each tool opens on its own page, with nothing else around it.
      </p>
      <div className="toolgrid">
        {TOOLS.map((t, i) => (
          <a key={t.slug} className="toolbox" href={`/tools/${t.slug}/`}>
            <span className="tb-no">Tool {i + 1}</span>
            <span className="tb-ic" aria-hidden="true" style={{ "--tc": COLORS[t.slug] || "#0F766E" } as React.CSSProperties}>
              {ICONS[t.slug] || "\U0001F9F0"}
            </span>
            <span className="tb-name">
              <span className="en-only">{t.nameEn}</span>
              <span className="hi-only">{t.nameHi}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
