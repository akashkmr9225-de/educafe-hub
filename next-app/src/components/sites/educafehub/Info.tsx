export function SchoolSection() {
  return (
    <section id="school">
      <p className="crumb">
        <a href="#top" data-i18n="crumbHome">
          Home
        </a>{" "}
        › <span data-i18n="schBadge">School</span>
      </p>
      <div className="sec-head">
        <span className="no">🏫</span>
        <h2 data-i18n="schTitle">Buddha World School — Vaishali, Bihar</h2>
      </div>
      <p className="sec-sub" data-i18n="schDesc">
        For parents and students: how admission works, what to bring, and how to reach the school
        office.
      </p>
      <div className="guidegrid">
        <div className="card">
          <h3 data-i18n="schAboutT">About the school</h3>
          <p data-i18n="schAboutD">
            Buddha World School, Vaishali (Bihar) — classes I to X. Head of School: Dr Sarika
            Malhotra.
          </p>
        </div>
        <div className="card">
          <h3 data-i18n="schAdmT">Admission — 4 simple steps</h3>
          <ol className="steps">
            <li data-i18n="schS1">
              Visit the school office or contact us and ask for the admission form.
            </li>
            <li data-i18n="schS2">Fill the form and attach the documents listed below.</li>
            <li data-i18n="schS3">
              The office checks the documents and confirms the class and seat.
            </li>
            <li data-i18n="schS4">
              Pay the admission fee at the office and collect the fee receipt — admission is done.
            </li>
          </ol>
        </div>
        <div className="card">
          <h3 data-i18n="schDocT">Documents to bring</h3>
          <p data-i18n="schDocD">
            Student&apos;s Aadhaar card, birth certificate, 4 passport-size photos, previous class
            report card and Transfer Certificate (TC) if changing school, and a parent&apos;s
            Aadhaar card. Carry originals for checking — the office keeps photocopies.
          </p>
        </div>
        <div className="card">
          <h3 data-i18n="schFeeT">Fees</h3>
          <p>
            <span data-i18n="schFeeD">
              The fee chart for this session will be added here. Till then, please confirm the
              exact fee at the school office before paying anywhere else.
            </span>{" "}
            <span className="ph" data-i18n="schPh">
              To be added
            </span>
          </p>
        </div>
        <div className="card">
          <h3 data-i18n="schContactT">School office contact</h3>
          <div className="crow">
            <span className="addr">+91 90000 00000</span>
            <span className="ph" data-i18n="schPh2">
              Placeholder — real number to be added
            </span>
          </div>
          <div className="btnrow">
            <a className="btn small" href="tel:+919000000000" data-i18n="schCallB">
              Call the school
            </a>
            <a
              className="btn ghost small"
              href="https://wa.me/919000000000"
              target="_blank"
              rel="noopener"
              data-i18n="cafeWaB"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NoticesSection() {
  return (
    <section id="notices">
      <p className="crumb">
        <a href="#top" data-i18n="crumbHome">
          Home
        </a>{" "}
        › <span data-i18n="notBadge">Notices</span>
      </p>
      <div className="sec-head">
        <span className="no">📢</span>
        <h2 data-i18n="notTitle">Notices &amp; announcements</h2>
      </div>
      <p className="sec-sub" data-i18n="notDesc">
        Admission dates, holidays, exam dates and office notices — newest first, each with its
        date. No scrolling ticker, nothing hidden.
      </p>
      <div className="card">
        <div className="notice">
          <span className="ndate" data-i18n="not1Date">
            Date
          </span>
          <div>
            <h3>
              <span data-i18n="not1T">Example notice — admissions open</span>{" "}
              <span className="ph" data-i18n="notSample">
                Sample
              </span>
            </h3>
            <p data-i18n="not1D">
              This is a sample entry showing how a notice will look. Real notices from the school
              office will replace it.
            </p>
          </div>
        </div>
        <p className="hint" data-i18n="notNote">
          Parents: always confirm dates at the school office as well — a notice here never
          replaces the office notice board.
        </p>
      </div>
    </section>
  );
}

const RATES: Array<{ svc: string; det: string }> = [
  { svc: "svc1", det: "det1" },
  { svc: "svc2", det: "det2" },
  { svc: "svc3", det: "det3" },
  { svc: "svc4", det: "det4" },
  { svc: "svc5", det: "det5" },
  { svc: "svc6", det: "det6" },
  { svc: "svc7", det: "det7" },
  { svc: "svc8", det: "det8" },
];

const RATE_LABELS: Record<string, [string, string]> = {
  svc1: ["Black &amp; white print", "Black & white print"],
  svc2: ["Colour print", "Colour print"],
  svc3: ["Photocopy (Xerox)", "Photocopy (Xerox)"],
  svc4: ["Scanning", "Scanning"],
  svc5: ["Passport photos", "Passport photos"],
  svc6: ["Lamination", "Lamination"],
  svc7: ["Online form filling", "Online form filling"],
  svc8: ["Print from WhatsApp or pen drive", "Print from WhatsApp or pen drive"],
};

const DETAIL_LABELS: Record<string, string> = {
  det1: "Per page, A4",
  det2: "Per page, A4",
  det3: "Per page",
  det4: "Per page — PDF sent to your phone or email",
  det5: "Printed set, ready in minutes — make the sheet with Tool 1 below",
  det6: "Per document",
  det7: "Government, exam and job forms, with printout",
  det8: "Send the file, collect the printout",
};

export function CafeSection() {
  return (
    <section id="cafe">
      <p className="crumb">
        <a href="#top" data-i18n="crumbHome">
          Home
        </a>{" "}
        › <span data-i18n="cafeBadge">Cafe</span>
      </p>
      <div className="sec-head">
        <span className="no">🖥️</span>
        <h2 data-i18n="cafeTitle">Cyber Cafe — services &amp; rates</h2>
      </div>
      <p className="sec-sub" data-i18n="cafeDesc">
        Counter services with the rate list in one place. Rates marked “to be added” are
        placeholders — the real counter rates go here as soon as the owner sets them.
      </p>
      <div className="card">
        <table className="rates">
          <thead>
            <tr>
              <th data-i18n="cafeSvcH">Service</th>
              <th data-i18n="cafeDetH">Details</th>
              <th className="rate" data-i18n="cafeRateH">
                Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {RATES.map((row) => (
              <tr key={row.svc}>
                <td data-i18n={row.svc}>{RATE_LABELS[row.svc][1]}</td>
                <td className="det" data-i18n={row.det}>
                  {DETAIL_LABELS[row.det]}
                </td>
                <td className="rate">
                  <span className="ph" data-i18n="cafeRatePh">
                    To add
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="grid2" style={{ marginTop: 18 }}>
          <div>
            <h3 style={{ fontSize: 17, marginBottom: 6 }} data-i18n="cafeTimeT">
              Timings
            </h3>
            <p style={{ margin: 0, color: "var(--ink2)", fontSize: 15 }}>
              <span data-i18n="cafeTimeD">
                Counter timings will be added here by the owner.
              </span>{" "}
              <span className="ph" data-i18n="schPh">
                To be added
              </span>
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 17, marginBottom: 6 }} data-i18n="cafeContactT">
              Quick contact
            </h3>
            <div className="btnrow" style={{ marginTop: 2 }}>
              <a className="btn saf small" href="tel:+919000000000" data-i18n="cafeCallB">
                Call now
              </a>
              <a
                className="btn ghost small"
                href="https://wa.me/919000000000"
                target="_blank"
                rel="noopener"
                data-i18n="cafeWaB"
              >
                WhatsApp us
              </a>
              <a
                className="btn ghost small"
                href="https://www.google.com/maps/search/?api=1&query=Buddha+World+School+Vaishali+Bihar"
                target="_blank"
                rel="noopener"
                data-i18n="cafeDirB"
              >
                Get directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
