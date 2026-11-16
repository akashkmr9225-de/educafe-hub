// Drawn icon set for the Register (Design Brief, Option A): one family of
// simple line pictograms, object plus action, 24px grid, 1.8px stroke,
// square caps. Colour comes from CSS (currentColor = accent).

const P: Record<string, React.ReactNode> = {
  "passport-photo": (
    <>
      <rect x="4" y="3" width="16" height="18" />
      <circle cx="12" cy="10" r="2.6" />
      <path d="M7.5 17c.8-2.2 2.4-3.2 4.5-3.2s3.7 1 4.5 3.2" />
    </>
  ),
  "exact-kb-photo": (
    <>
      <rect x="3" y="5" width="18" height="14" />
      <path d="M12 8.5v5M9.7 11.2L12 13.5l2.3-2.3" />
      <path d="M8 16.5h8" />
    </>
  ),
  "exam-form-photo": (
    <>
      <rect x="3" y="5" width="18" height="14" />
      <rect x="6" y="8.5" width="5" height="6" />
      <path d="M14 9.5h4M14 13h4" />
    </>
  ),
  "bulk-student-photos": (
    <>
      <rect x="7" y="7" width="13" height="13" />
      <path d="M4 17V4h13" />
      <circle cx="13.5" cy="11.5" r="1.8" />
      <path d="M10 17c.6-1.6 1.9-2.4 3.5-2.4s2.9.8 3.5 2.4" />
    </>
  ),
  "signature-maker": (
    <>
      <path d="M3 16.5c2.5-7.5 4.2-7.5 5-2.5.6 3.4 1.6 3.4 3 .5 1-2 2.4-4.5 4-4.5" />
      <path d="M3 20.5h18" />
    </>
  ),
  "photo-signature-joiner": (
    <>
      <rect x="3" y="6" width="8" height="12" />
      <circle cx="7" cy="10.5" r="1.5" />
      <path d="M5 15.5c.5-1.2 1.2-1.8 2-1.8s1.5.6 2 1.8" />
      <path d="M14.5 15.5c1.8-5 3-5 3.6-1.8.4 2.3 1.1 2.3 2 .4" />
      <path d="M13.5 18.5H21" />
    </>
  ),
  "image-to-pdf": (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <rect x="9" y="12" width="6" height="5" />
      <path d="M9 15.5l2-2 1.5 1.5 1-1 1.5 1.5" />
    </>
  ),
  "pdf-compress": (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M12 10v5M9.8 12.8L12 15l2.2-2.2M9 18.5h6" />
    </>
  ),
  "image-compressor": (
    <>
      <rect x="3" y="5" width="18" height="14" />
      <path d="M8 9.5l2.5 2.5M16 9.5L13.5 12M8 14.5L10.5 12M16 14.5L13.5 12" />
    </>
  ),
  "file-converter": (
    <>
      <path d="M4 7.5h12.5L13.5 4.5" />
      <path d="M20 16.5H7.5l3 3" />
    </>
  ),
  "file-tools": (
    <>
      <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <circle cx="12" cy="13" r="2.2" />
      <path d="M12 9.5v1.3M12 15.2v1.3M8.5 13h1.3M14.2 13h1.3" />
    </>
  ),
  "qr-code-maker": (
    <>
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <path d="M14 14h2.5v2.5H14zM17.5 17.5H20V20h-2.5z" />
    </>
  ),
  "receipt-bill-maker": (
    <>
      <path d="M6 3h12v18l-2-1.4L14 21l-2-1.4L10 21l-2-1.4L6 21z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  "print-cost-calculator": (
    <>
      <path d="M7 8V3h10v5" />
      <rect x="4" y="8" width="16" height="8" />
      <rect x="7" y="13" width="10" height="8" />
      <path d="M9.5 17h5" />
    </>
  ),
  "age-calculator": (
    <>
      <rect x="3" y="5" width="18" height="16" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <circle cx="12" cy="15" r="1.4" />
    </>
  ),
  "marks-percentage-calculator": (
    <>
      <circle cx="7" cy="7" r="2.4" />
      <circle cx="17" cy="17" r="2.4" />
      <path d="M18 5L6 19" />
    </>
  ),
};

export function ToolIcon({ slug }: { slug: string }) {
  return (
    <span className="tb-ic" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
        {P[slug] || <rect x="4" y="4" width="16" height="16" />}
      </svg>
    </span>
  );
}
