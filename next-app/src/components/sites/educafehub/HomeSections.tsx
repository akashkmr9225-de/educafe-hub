import site from "@/content/site.json";

// Homepage sections added 2026-11-16 under Sir's approved landing-page brief
// (landing-page-design skill): how it works, FAQ, final call to action.
// Copy lives in i18n.json / site.json as EN+HI pairs, like the rest of the site.

const STEPS = [
  { t: "how1T", d: "how1D", fb: "1. Pick your tool", fd: "18 free tools for the jobs a school office and cyber cafe do every day." },
  { t: "how2T", d: "how2D", fb: "2. Add your photo or file", fd: "Everything runs on this device. Your file is never uploaded to any server." },
  { t: "how3T", d: "how3D", fb: "3. Download and print", fd: "The finished file is ready in seconds, sized exactly as the form asks." },
] as const;

export function HowItWorks() {
  return (
    <section aria-label="How it works">
      <div className="sec-head">
        <h2 data-i18n="sections.howItWorks">How it works</h2>
      </div>
      <div className="owner">
        {STEPS.map((s) => (
          <div className="card" key={s.t}>
            <h3 data-i18n={s.t}>{s.fb}</h3>
            <p data-i18n={s.d}>{s.fd}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FaqHome() {
  return (
    <section aria-label="Frequently asked questions">
      <div className="sec-head">
        <h2 data-i18n="faq.title">FAQ</h2>
      </div>
      <div className="faqhome">
        {site.faq.items.map((it, i) => (
          <details className="faqitem" key={i}>
            <summary>
              <span className="en-only">{it.q.en}</span>
              <span className="hi-only">{it.q.hi}</span>
            </summary>
            <p>
              <span className="en-only">{it.a.en}</span>
              <span className="hi-only">{it.a.hi}</span>
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Gateway() {
  return (
    <section aria-label="Choose your work">
      <div className="sec-head">
        <h2>
          <span className="en-only">What do you need today?</span>
          <span className="hi-only">आज आपको क्या चाहिए?</span>
        </h2>
      </div>
      <div className="owner">
        <div className="card">
          <h3>
            <span className="en-only">School</span>
            <span className="hi-only">स्कूल</span>
          </h3>
          <p>
            <span className="en-only">
              The EduCafe School ERP first, then all the school tools below it.
            </span>
            <span className="hi-only">
              पहले एडुकैफ़े स्कूल ERP, फिर नीचे सभी स्कूल टूल।
            </span>
          </p>
          <p style={{ marginTop: 14 }}>
            <a className="btn" href="/school-erp/">
              <span className="en-only">Open School</span>
              <span className="hi-only">स्कूल खोलें</span>
            </a>
          </p>
        </div>
        <div className="card">
          <h3>
            <span className="en-only">Cyber Cafe</span>
            <span className="hi-only">साइबर कैफ़े</span>
          </h3>
          <p>
            <span className="en-only">
              Only the tools. Passport photos, resize, PDF and the daily cafe jobs.
            </span>
            <span className="hi-only">
              सिर्फ़ टूल। पासपोर्ट फ़ोटो, रीसाइज़, PDF और कैफ़े के रोज़ के काम।
            </span>
          </p>
          <p style={{ marginTop: 14 }}>
            <a className="btn" href="/cyber-cafe/">
              <span className="en-only">Open Cyber Cafe</span>
              <span className="hi-only">साइबर कैफ़े खोलें</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="finalcta" aria-label="Get started">
      <p className="finalcta-t" data-i18n="finalCtaT">
        Start with the job in front of you. It is free, and it takes seconds.
      </p>
      <a className="btn" href="#tools" data-i18n="heroCta">
        See all 12 tools
      </a>
    </section>
  );
}
