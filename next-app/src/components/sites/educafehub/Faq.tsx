import siteContent from "@/content/site.json";

// Section 03, Questions: the real questions from site.json, as a plain list.
// Both languages render; CSS shows only the active one (language purity rule).
interface FaqItem {
  q: { en: string; hi: string };
  a: { en: string; hi: string };
}

export function FaqSection() {
  const faq = (siteContent as { faq: { title: { en: string; hi: string }; items: FaqItem[] } }).faq;
  return (
    <section id="faq" aria-label="Questions">
      <div className="sec-head">
        <span className="no">03</span>
        <h2>
          <span className="en-only">{faq.title.en}</span>
          <span className="hi-only">{faq.title.hi}</span>
        </h2>
      </div>
      <div>
        {faq.items.map((item, i) => (
          <div key={i} style={{ borderTop: "1px solid var(--line)", padding: "14px 0" }}>
            <h3 style={{ fontSize: "16.5px", margin: "0 0 4px" }}>
              <span className="en-only">{item.q.en}</span>
              <span className="hi-only">{item.q.hi}</span>
            </h3>
            <p style={{ margin: 0, color: "var(--ink2)", fontSize: "15px", maxWidth: "68ch" }}>
              <span className="en-only">{item.a.en}</span>
              <span className="hi-only">{item.a.hi}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
