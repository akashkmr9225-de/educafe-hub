import { TOOLS } from "@/data/tool-registry";

const ICONS: Record<string, string> = {
  "passport-photo": "📸",
  "exact-kb-photo": "🗜️",
  "signature-maker": "✍️",
  "photo-signature-joiner": "🧾",
  "image-to-pdf": "📄",
  "pdf-compress": "🗜️",
  "image-compressor": "🖼️",
  "age-calculator": "🎂",
  "marks-percentage-calculator": "🧮",
  "file-tools": "📁",
  "file-converter": "🔄",
  "qr-code-maker": "🔳",
  "bulk-student-photos": "👥",
  "exam-form-photo": "📝",
  "receipt-bill-maker": "🧾",
  "print-cost-calculator": "🖨️",
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
            <span className="tb-ic" aria-hidden="true">
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
