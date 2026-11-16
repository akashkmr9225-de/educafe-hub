export function AgeTool() {
  return (
    <section id="age">
      <div className="sec-head">
        <span className="no">Tool 15</span>
        <h2 data-i18n="t8Title">Age Calculator — for Admission</h2>
      </div>
      <p className="sec-sub" data-i18n="t8Desc">Enter the date of birth — get today's age plus the age on admission cut-off dates (31 March / 31 December).</p>
      <div className="card">
        <div className="grid2">
          <div>
            <div className="field">
              <label className="fl" htmlFor="ageDob" data-i18n="ageDobLabel">
                Date of Birth
              </label>
              <input type="date" id="ageDob" />
            </div>
            <div className="field">
              <label className="fl" htmlFor="ageOn" data-i18n="ageOnLabel">
                Age on which date? (default: today)
              </label>
              <input type="date" id="ageOn" />
            </div>
            <div className="btnrow" style={{ marginTop: 4 }}>
              <button className="btn" id="ageGo" data-i18n="ageGo">Calculate age</button>
            </div>
            <div className="msg" id="ageMsg" />
            <p className="hint" data-i18n="ageClass1Rule">
              Class 1 rule: the child should be 6 years or older on 31 March of the admission year.
            </p>
          </div>
          <div>
            <div className="result-big" id="ageBig">
              —
            </div>
            <p className="hint" id="ageLine" style={{ marginTop: 0 }} data-i18n="ageHintLine">
              Pick a date of birth and press “Calculate age”.
            </p>
            <dl className="kv" id="ageKv" style={{ display: "none" }}>
              <div>
                <dt data-i18n="ageOnMar">On 31 March</dt>
                <dd id="ageMar">—</dd>
              </div>
              <div>
                <dt data-i18n="ageOnDec">On 31 December</dt>
                <dd id="ageDec">—</dd>
              </div>
              <div>
                <dt data-i18n="ageDaysL">Total days</dt>
                <dd id="ageDays">—</dd>
              </div>
              <div>
                <dt data-i18n="ageNextL">Next birthday</dt>
                <dd id="ageNext">—</dd>
              </div>
            </dl>
            <div className="msg" id="ageClass1" style={{ display: "none" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

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
