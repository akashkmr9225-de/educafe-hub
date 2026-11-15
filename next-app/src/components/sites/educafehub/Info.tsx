const RATES: Array<{ svc: string; det: string }> = [
  { svc: "cafeSection.services.0.service", det: "cafeSection.services.0.details" },
  { svc: "cafeSection.services.1.service", det: "cafeSection.services.1.details" },
  { svc: "cafeSection.services.2.service", det: "cafeSection.services.2.details" },
  { svc: "cafeSection.services.3.service", det: "cafeSection.services.3.details" },
  { svc: "cafeSection.services.4.service", det: "cafeSection.services.4.details" },
  { svc: "cafeSection.services.5.service", det: "cafeSection.services.5.details" },
  { svc: "cafeSection.services.6.service", det: "cafeSection.services.6.details" },
  { svc: "cafeSection.services.7.service", det: "cafeSection.services.7.details" },
];

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
        <h2 data-i18n="cafeSection.title">Cyber Cafe — services & rates</h2>
      </div>
      <p className="sec-sub" data-i18n="cafeSection.desc">
        Counter services with the rate list in one place. Rates marked "to be added" are
        placeholders — the real counter rates go here as soon as the owner sets them.
      </p>
      <div className="card">
        <table className="rates">
          <thead>
            <tr>
              <th data-i18n="cafeSection.tableHeaders.service">Service</th>
              <th data-i18n="cafeSection.tableHeaders.details">Details</th>
              <th className="rate" data-i18n="cafeSection.tableHeaders.rate">
                Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {RATES.map((row) => (
              <tr key={row.svc}>
                <td data-i18n={row.svc}>{row.svc}</td>
                <td className="det" data-i18n={row.det}>
                  {row.det}
                </td>
                <td className="rate">
                  <span className="ph" data-i18n="cafeSection.services.0.ratePlaceholder">
                    To add
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="grid2" style={{ marginTop: 18 }}>
          <div>
            <h3 style={{ fontSize: 17, marginBottom: 6 }} data-i18n="cafeSection.timings.title">
              Timings
            </h3>
            <p style={{ margin: 0, color: "var(--ink2)", fontSize: 15 }}>
              <span data-i18n="cafeSection.timings.desc">
                Counter timings will be added here by the owner.
              </span>
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 17, marginBottom: 6 }} data-i18n="cafeSection.quickContact.title">
              Quick contact
            </h3>
            <div className="btnrow" style={{ marginTop: 2 }}>
              <a className="btn saf small" href="tel:+919000000000" data-i18n="cafeSection.quickContact.call">
                Call now
              </a>
              <a
                className="btn ghost small"
                href="https://wa.me/919000000000"
                target="_blank"
                rel="noopener"
                data-i18n="cafeSection.quickContact.whatsapp"
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
