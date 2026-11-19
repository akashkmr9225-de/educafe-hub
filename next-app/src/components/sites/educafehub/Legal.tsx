import { FootBrand } from "./Brand";

const TABS = [
  { id: "priv", key: "legalTabPriv", label: "Privacy Policy", selected: true },
  { id: "terms", key: "legalTabTerms", label: "Terms of Use", selected: false },
  { id: "disc", key: "legalTabDisc", label: "Disclaimer", selected: false },
  { id: "about", key: "legalTabAbout", label: "About", selected: false },
  { id: "contact", key: "legalTabContact", label: "Contact", selected: false },
];

export function LegalSection() {
  return (
    <section id="legal">
      <div className="sec-head">
        <span className="no">§</span>
        <h2 data-i18n="legalTitle">Legal pages — Privacy, Terms, Disclaimer, About & Contact</h2>
      </div>
      <p className="sec-sub" data-i18n="legalDesc">
        The plain-language pages every real website needs — and the ones Google AdSense asks for.
        Last updated: 16 November 2026.
      </p>
      <div className="card">
        <div className="tablist" role="tablist" data-i18n-aria="ariaLegal" aria-label="Legal pages">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              className="tabbtn"
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              aria-selected={tab.selected}
              tabIndex={tab.selected ? undefined : -1}
              data-i18n={tab.key}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tabpanel" role="tabpanel" id="panel-priv" aria-labelledby="tab-priv" tabIndex={0}>
          <h3 data-i18n="privT">Privacy Policy — your files stay with you</h3>
          <ul>
            <li data-i18n="priv1">Every tool runs in your browser on this device. Photos, signatures and PDFs you open are processed here only — they are never uploaded to us or to anyone else, and we cannot see them. This includes children's photos used for school forms.</li>
            <li data-i18n="priv2">You may optionally save a small profile on this device (your name, a mobile number or email, and a School / Cyber Cafe label) It is stored only in this browser on this device — it is never sent to us or to anyone else, and signing out or clearing browser data removes it. This page sets no cookies and runs no analytics or advertising trackers.</li>
            <li data-i18n="priv3">
              If advertising (such as Google AdSense) is added later, after we move to our own
              domain, ad providers like Google may use cookies to show and measure ads. This policy
              will be updated, with a new date, before any ads go live.
            </li>
            <li data-i18n="priv4">
              The Daily Links open official third-party websites (government portals, boards,
              railways and others). Those sites have their own privacy policies and may collect
              data under them — check the policy of the site you land on.
            </li>
            <li data-i18n="priv5">
              On a shared cafe or school computer, remember that finished files you download are
              saved on that computer by your browser. If they are not yours to keep, delete them
              from the Downloads folder when the work is done.
            </li>
          </ul>
        </div>

        <div className="tabpanel" role="tabpanel" id="panel-terms" aria-labelledby="tab-terms" tabIndex={0} hidden>
          <h3 data-i18n="termsT">Terms of Use</h3>
          <ul>
            <li data-i18n="terms1">All tools are free for personal, school and shop-counter work, provided as they are. Before submitting, always check the finished photo or PDF against the form's own instructions (size, KB, format) — portals change their rules, and we cannot guarantee that a form will be accepted.</li>
            <li data-i18n="terms2">You are responsible for the files you process, and for following each official portal's own rules and deadlines.</li>
            <li data-i18n="terms3">
              Do not use these tools to forge, fake or alter official documents, certificates,
              photos or signatures, or for anything unlawful.
            </li>
            <li data-i18n="terms4">
              We may add, change or remove tools at any time. If login and saved tasks launch later,
              the extra terms for accounts will be added here first.
            </li>
          </ul>
        </div>

        <div className="tabpanel" role="tabpanel" id="panel-disc" aria-labelledby="tab-disc" tabIndex={0} hidden>
          <h3 data-i18n="discT">Disclaimer — this is not a government website</h3>
          <ul>
            <li data-i18n="disc1">
              EduCafe Hub is an independent, privately made tool page. It is NOT affiliated with,
              endorsed by, or run by the Government of India or Bihar, CBSE, UIDAI (Aadhaar),
              IRCTC / Indian Railways, SSC, UPSC, any board or university, or any website linked
              from here.
            </li>
            <li data-i18n="disc2">
              The names of those organisations are mentioned only so you can recognise the official
              service; they belong to their owners.
            </li>
            <li data-i18n="disc3">
              Information and links are given for convenience. Rules, fees and dates change — always
              confirm on the official website before acting or paying anything.
            </li>
          </ul>
        </div>

        <div className="tabpanel" role="tabpanel" id="panel-about" aria-labelledby="tab-about" tabIndex={0} hidden>
          <h3 data-i18n="aboutT">About — what EduCafe Hub is</h3>
          <ul>
            <li data-i18n="about1">
              One free page of everyday tools — passport photos, exact-KB resizing, signatures,
              PDFs and calculators — plus one-click links to the official sites a school office and
              a cyber cafe open all day.
            </li>
            <li data-i18n="about2">
              Made for students, parents, school staff and cyber-cafe operators, especially around
              Vaishali and Muzaffarpur, Bihar — but anyone can use it, free, without login.
            </li>
            <li data-i18n="about3">Why it is free: everything runs in the visitor's own browser, so there is no server bill. That is why it stays free and fast, and never collects your files.</li>
            <li data-i18n="bizLine">EduCafe Hub is run by Akash Kumar Sharma, Saraiya, Muzaffarpur, Bihar 843120, India. Email: educafehub@gmail.com · WhatsApp: +91 87874 79225.</li>
          </ul>
        </div>

        <div className="tabpanel" role="tabpanel" id="panel-contact" aria-labelledby="tab-contact" tabIndex={0} hidden>
          <h3 data-i18n="contactT">Contact — get in touch</h3>
          <p data-i18n="contactIntro">
            A question, a mistake to report, or a local business banner to place? Reach us here:
          </p>
          <div className="crow">
            <span className="lbl2" data-i18n="contactEmailL">
              Email
            </span>
            <a className="addr" href="mailto:educafehub@gmail.com">
              educafehub@gmail.com
            </a>
            
          </div>
          <div className="btnrow" style={{ marginTop: 2 }}>
            <a className="btn ghost small" href="mailto:educafehub@gmail.com" data-i18n="contactMailBtn">
              Write email
            </a>
            <button type="button" className="btn ghost small" id="ctCopy" data-i18n="contactCopyBtn">
              Copy email
            </button>
          </div>
          <div className="msg" id="ctCopyMsg" aria-live="polite" />
          <div className="crow">
            <span className="lbl2" data-i18n="contactWaL">
              WhatsApp
            </span>
            <a className="addr" href="tel:+918787479225">+91 87874 79225</a>
            
          </div>
          <div className="btnrow" style={{ marginTop: 2 }}>
            <a
              className="btn ghost small"
              href="https://wa.me/918787479225"
              target="_blank"
              rel="noopener"
              data-i18n="contactWaBtn"
            >
              Chat on WhatsApp
            </a>
          </div>
          <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "20px 0" }} />
          <h3 style={{ fontSize: 17, marginBottom: 10 }} data-i18n="contactFormT">
            Write a message — it opens in your own email app
          </h3>
          <div className="field">
            <label className="fl" htmlFor="ctName" data-i18n="contactNameL">
              Your name
            </label>
            <input type="text" id="ctName" autoComplete="name" />
          </div>
          <div className="field">
            <label className="fl" htmlFor="ctTopic" data-i18n="contactTopicL">
              Topic
            </label>
            <select id="ctTopic">
              <option data-i18n="contactTopic1">Problem with a tool</option>
              <option data-i18n="contactTopic2">Business / local ad</option>
              <option data-i18n="contactTopic3">Something else</option>
            </select>
          </div>
          <div className="field">
            <label className="fl" htmlFor="ctMsg" data-i18n="contactMsgL">
              Your message
            </label>
            <textarea className="ta" id="ctMsg" style={{ minHeight: 96 }} />
          </div>
          <div className="btnrow">
            <button type="button" className="btn" id="ctSend" data-i18n="contactSendBtn">
              Open in my email app
            </button>
          </div>
          <p className="hint" data-i18n="contactFormNote">
            This form has no server — it prepares the message in your own email app, and nothing is
            sent until you press Send there.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="fcols">
        <div>
          <FootBrand />
          <p style={{ margin: 0 }}>
            <span data-i18n="footer.aboutLine">
              Passport photos, signatures, PDFs, calculators and official links for the daily work
              of a school office and cyber cafe, all on one page.
            </span>
          </p>
        </div>
        <div>
          <h3 data-i18n="footLinksT">Quick links</h3>
          <ul>
            <li>
              <a href="/tools/passport-photo/" className="qlink">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>{" "}
                <span data-i18n="navPassport">Passport Photo</span>
              </a>
            </li>
            <li>
              <a href="/#links" className="qlink">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>{" "}
                <span data-i18n="navLinks">Daily Links</span>
              </a>
            </li>
            <li>
              <a href="/legal/#contact" className="qlink">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                  <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                  <path d="M7 21h10" />
                  <path d="M12 3v18" />
                  <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                </svg>{" "}
                <span data-i18n="navLegal">Legal & Contact</span>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 data-i18n="footContactT">Contact</h3>
          <ul>
            <li>
              <a href="mailto:educafehub@gmail.com">educafehub@gmail.com</a>
            </li>
            <li>
              <a href="tel:+918787479225">+91 87874 79225</a>
            </li>
            <li>
              <a href="https://wa.me/918787479225" target="_blank" rel="noopener" data-i18n="cafeWaB">
                WhatsApp us
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="flegal">
        <a href="/privacy/" data-i18n="footPrivacy">Privacy Policy</a>
        <span aria-hidden="true">·</span>
        <a href="/terms/" data-i18n="footTerms">Terms of Use</a>
        <span aria-hidden="true">·</span>
        <a href="/cookies/" data-i18n="footCookies">Cookie Policy</a>
        <span aria-hidden="true">·</span>
        <a href="/refund/" data-i18n="footRefund">Refund Policy</a>
        <span aria-hidden="true">·</span>
        <a href="/legal/#contact" data-i18n="footContactLink">Contact</a>
      </p>
      <p className="fcopy">© 2026 EduCafe Hub</p>
      <p data-i18n="footer.copyrightLine">
        All tools are completely free and work without any login. Always confirm a form's exact
        size/KB requirement in the form's own instructions once — every portal has different rules.
      </p>
    </footer>
  );
}

import rawDict from "@/data/i18n.json";

const EN = (rawDict as { en: Record<string, string> }).en;

const DOCS = {
  privacy: { titleKey: "privT", items: ["priv1", "priv2", "priv3", "priv4", "priv5", "priv6", "priv7"] },
  terms: { titleKey: "termsT", items: ["terms1", "terms2", "terms3", "terms4", "terms5", "terms6", "terms7"] },
  cookies: { titleKey: "ckT", items: ["ck1", "ck2", "ck3", "ck4", "ck5"] },
  refund: { titleKey: "rfT", items: ["rf1", "rf2", "rf3", "rf4"] },
} as const;

export function LegalDoc({ doc }: { doc: keyof typeof DOCS }) {
  const d = DOCS[doc];
  return (
    <section>
      <div className="sec-head">
        <span className="no">§</span>
        <h2 data-i18n={d.titleKey}>{EN[d.titleKey]}</h2>
      </div>
      <p className="sec-sub" data-i18n="docUpdated">
        {EN.docUpdated}
      </p>
      <div className="card">
        <ul>
          {d.items.map((k) => (
            <li key={k} data-i18n={k}>
              {EN[k]}
            </li>
          ))}
        </ul>
        <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "20px 0" }} />
        <p data-i18n="bizLine">{EN.bizLine}</p>
        <p>
          <a href="/legal/#contact" data-i18n="footContactLink">
            Contact
          </a>
        </p>
      </div>
    </section>
  );
}
