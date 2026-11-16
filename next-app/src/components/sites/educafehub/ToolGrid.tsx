import { TOOLS } from "@/data/tool-registry";

// Big, instantly-readable symbols (Sir's direction 2026-11-16: a new visitor must
// know in one second what each tool does). One emoji per tool + a generic fallback.
const ICONS: Record<string, string> = {
  "passport-photo": "📸",
  "exact-kb-photo": "🎯",
  "exam-form-photo": "🪪",
  "bulk-student-photos": "🎓",
  "signature-maker": "\u270D\uFE0F",
  "photo-signature-joiner": "🧩",
  "image-to-pdf": "📄",
  "pdf-compress": "🗜\uFE0F",
  "image-compressor": "🖼\uFE0F",
  "file-converter": "🔄",
  "file-tools": "🗂\uFE0F",
  "qr-code-maker": "🔳",
  "receipt-bill-maker": "🧾",
  "print-cost-calculator": "🖨\uFE0F",
  "age-calculator": "🎂",
  "marks-percentage-calculator": "💯",
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
          <a key={t.slug} className="toolbox" href={`/tools/${t.slug}/`} style={{ animationDelay: `${Math.min(i, 15) * 35}ms` }}>
            <span className="tb-no">Tool {i + 1}</span>
            <span className="tb-ic" aria-hidden="true" style={{ "--tc": COLORS[t.slug] || "#0F766E" } as React.CSSProperties}>
              {ICONS[t.slug] || "🧰"}
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
