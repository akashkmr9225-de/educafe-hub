export function MarksTool() {
  return (
    <section id="marks">
      <div className="sec-head">
        <span className="no">Tool 16</span>
        <h2 data-i18n="t9Title">Marks & Percentage Calculator</h2>
      </div>
      <p className="sec-sub" data-i18n="t9Desc">Enter marks for every subject — total, percentage, division and grade are automatic. A CGPA ↔ percentage converter is below.</p>
      <div className="card">
        <div style={{ overflowX: "auto" }}>
          <table className="marks" id="mkTable">
            <thead>
              <tr>
                <th style={{ minWidth: 130 }} data-i18n="mkSubj">
                  Subject
                </th>
                <th data-i18n="mkMaxH">Full marks (Max)</th>
                <th data-i18n="mkObtH">Marks obtained</th>
                <th aria-label="Remove subject" data-i18n-aria="mkRemoveAria" />
              </tr>
            </thead>
            <tbody id="mkBody" />
          </table>
        </div>
        <div className="btnrow">
          <button className="btn ghost small" id="mkAdd" data-i18n="mkAdd">
            + Add subject
          </button>
          <button className="btn" id="mkGo" data-i18n="mkGo">Calculate percentage</button>
        </div>
        <div id="mkResult" style={{ display: "none" }}>
          <div className="result-big" id="mkBig">
            —
          </div>
          <dl className="kv">
            <div>
              <dt data-i18n="mkTotL">Total obtained</dt>
              <dd id="mkTot">—</dd>
            </div>
            <div>
              <dt data-i18n="mkDivL">Division</dt>
              <dd id="mkDiv">—</dd>
            </div>
            <div>
              <dt data-i18n="mkGradeL">Grade</dt>
              <dd id="mkGrade">—</dd>
            </div>
            <div>
              <dt data-i18n="mkPassL">Result</dt>
              <dd id="mkPass">—</dd>
            </div>
          </dl>
        </div>
        <div className="msg" id="mkMsg" />
        <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "22px 0" }} />
        <h3 style={{ fontSize: 18, marginBottom: 10 }} data-i18n="cgpaTitle">
          CGPA ↔ Percentage (CBSE formula: % = CGPA × 9.5)
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 12,
            maxWidth: 560,
          }}
        >
          <div className="field" style={{ margin: 0 }}>
            <label className="fl" htmlFor="cgpaIn" data-i18n="cgpaLab">
              CGPA (out of 10)
            </label>
            <input
              type="number"
              id="cgpaIn"
              step="0.1"
              min={0}
              max={10}
              placeholder="e.g. 8.4"
            />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label className="fl" htmlFor="pctIn" data-i18n="pctLab">
              Percentage
            </label>
            <input
              type="number"
              id="pctIn"
              step="0.1"
              min={0}
              max={100}
              placeholder="e.g. 79.8"
            />
          </div>
        </div>
        <p className="hint" id="cgpaOut" data-i18n="cgpaHint">
          Type a value in either box — the other fills in automatically.
        </p>
      </div>
    </section>
  );
}
