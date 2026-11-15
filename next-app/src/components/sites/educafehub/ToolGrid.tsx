import { TOOLS } from "@/data/tool-registry";
import type { ReactNode } from "react";

// Premium line icons (inline SVG, stroke = currentColor) — one per tool.
const ICONS: Record<string, ReactNode> = {
  "passport-photo": (
    <>
      <rect x="2.5" y="7.5" width="19" height="12" rx="2" />
      <path d="M8.5 7.5 10.2 4.5h3.6l1.7 3" />
      <circle cx="12" cy="13.2" r="3.3" />
    </>
  ),
  "exact-kb-photo": (
    <>
      <rect x="2.5" y="9" width="19" height="6.5" rx="1.2" />
      <path d="M6.5 9v3M10.5 9v3.8M14.5 9v3M18.5 9v3.8" />
    </>
  ),
  "exam-form-photo": (
    <>
      <rect x="5.5" y="4.5" width="13" height="17" rx="2" />
      <rect x="9" y="2.5" width="6" height="3.4" rx="1" />
      <circle cx="12" cy="11" r="2.1" />
      <path d="M8.3 17.2c.7-1.9 2.1-2.8 3.7-2.8s3 .9 3.7 2.8" />
    </>
  ),
  "bulk-student-photos": (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.2 19.5c.7-3.2 3-4.8 5.8-4.8s5.1 1.6 5.8 4.8" />
      <path d="M15.5 5.9a3.2 3.2 0 0 1 0 5.9M17.8 14.9c1.9.6 3 1.9 3.4 4.6" />
    </>
  ),
  "signature-maker": (
    <>
      <path d="M3 16.5c1.8-5.5 3.6-8.6 5.4-8.6 1.6 0 1.2 2.6-.2 5.1-1.2 2.1-2.6 3.9-1.1 3.9 1.9 0 3.2-3.6 4.6-3.6 1 0 1.4 1 1.2 2.2" />
      <path d="M3 20.5h18" />
    </>
  ),
  "photo-signature-joiner": (
    <>
      <rect x="2.5" y="5" width="8" height="14" rx="1.6" />
      <rect x="13.5" y="5" width="8" height="14" rx="1.6" />
      <path d="M12 10.2v3.6M10.2 12h3.6" />
    </>
  ),
  "image-to-pdf": (
    <>
      <path d="M14 2.8H6.5A1.5 1.5 0 0 0 5 4.3v15.4A1.5 1.5 0 0 0 6.5 21.2h11a1.5 1.5 0 0 0 1.5-1.5V8.2Z" />
      <path d="M14 2.8v5.4h5" />
      <circle cx="9.6" cy="13" r="1.1" />
      <path d="M7.8 18l2.8-3.2 2.1 2.4 1.6-1.7 1.9 2.5" />
    </>
  ),
  "pdf-compress": (
    <>
      <path d="M21 3.5 14.5 10M21 8.5V3.5h-5M3 20.5 9.5 14M3 15.5v5h5" />
    </>
  ),
  "image-compressor": (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M5 17.5 9.5 12.5l3 3L16 12l3 3.2" />
    </>
  ),
  "file-converter": (
    <>
      <path d="M16.5 6.5H4M13 3l3.5 3.5L13 10" />
      <path d="M7.5 17.5H20M11 14l-3.5 3.5L11 21" />
    </>
  ),
  "file-tools": (
    <>
      <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h5l2 2.5h8A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5Z" />
    </>
  ),
  "qr-code-maker": (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <path d="M13.5 13.5h3v3h-3zM20.5 13.5v.01M13.5 20.5v.01M17.5 17.5h3v3h-3z" />
    </>
  ),
  "receipt-bill-maker": (
    <>
      <path d="M5.5 3h13v17.2l-2.2-1.5-2.1 1.5-2.2-1.5-2.2 1.5-2.1-1.5-2.2 1.5Z" />
      <path d="M8.7 8h6.6M8.7 12h6.6" />
    </>
  ),
  "print-cost-calculator": (
    <>
      <path d="M7 8V3.5h10V8" />
      <rect x="3" y="8" width="18" height="7.5" rx="1.8" />
      <rect x="7" y="13" width="10" height="7.5" />
      <path d="M9.5 17h5" />
    </>
  ),
  "age-calculator": (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 9.8h17M8 2.8v3.6M16 2.8v3.6" />
      <path d="m9 15.8 2.2 2.2 4-4.2" />
    </>
  ),
  "marks-percentage-calculator": (
    <>
      <circle cx="7" cy="7" r="2.4" />
      <circle cx="17" cy="17" r="2.4" />
      <path d="M17.5 4.5 6.5 19.5" />
    </>
  ),
};

const FALLBACK_ICON: ReactNode = (
  <>
    <rect x="3" y="8" width="18" height="11" rx="2" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </>
);

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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                focusable="false"
              >
                {ICONS[t.slug] || FALLBACK_ICON}
              </svg>
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
