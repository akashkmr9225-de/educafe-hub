export function ExamPhotoTool() {
  return (
    <section id="exam">
      <div className="sec-head">
        <span className="no">Tool 3</span>
        <h2 data-i18n="exTitle">Exam-Form Photo — exact size + KB</h2>
      </div>
      <p className="sec-sub" data-i18n="exDesc">
        Pick the exam, add the photo — you get a JPG of the exact pixel size and KB range that form
        asks for, with the name and date printed below when needed.
      </p>
      <div className="card">
        <div className="grid2">
          <div>
            <div className="field">
              <label className="fl" data-i18n="exPresetL">
                Choose the exam
              </label>
              <select id="exPreset" className="sel" defaultValue="ssc">
                <option value="ssc" data-i18n="exP1">SSC CGL / CHSL — 200×230 px · 20–50 KB</option>
                <option value="upsc" data-i18n="exP2">UPSC — 350×350 px · 20–300 KB</option>
                <option value="bank" data-i18n="exP3">Bank (IBPS / SBI) — 200×230 px · 20–50 KB</option>
                <option value="bpsc" data-i18n="exP4">Bihar SSC / BPSC — 250×350 px · 20–50 KB</option>
              </select>
            </div>
            <div className="drop" id="exDrop" tabIndex={0} role="button" data-i18n-aria="ariaExDrop" aria-label="Upload photo">
              <div className="big" data-i18n="exDropT">
                Drop the photo here or tap to choose
              </div>
              <p data-i18n="exDropD">JPG / PNG / HEIC — processed on this device only</p>
              <input type="file" id="exFile" accept="image/*,.heic,.heif" />
              <div className="fname" id="exName" />
            </div>
            <div className="field" style={{ marginTop: 16 }}>
              <label className="fl" htmlFor="exNameIn" data-i18n="exNameL">
                Name printed below photo (optional)
              </label>
              <input type="text" id="exNameIn" autoComplete="off" />
            </div>
            <div className="field">
              <label className="fl" htmlFor="exDateIn" data-i18n="exDateL">
                Date printed below photo
              </label>
              <input type="date" id="exDateIn" />
            </div>
            <div className="btnrow">
              <button className="btn" id="exGo" data-i18n="exGo">⬇ Make & download exam photo</button>
            </div>
            <div className="msg" id="exMsg" />
            <p className="hint" data-i18n="exNote">
              Always confirm the exact photo size and KB in the official exam notification —
              portals change rules.
            </p>
          </div>
          <div>
            <div className="preview" id="exPreview">
              <div className="sheetwrap">
                <canvas id="exCanvas" width={200} height={230} />
              </div>
              <div className="stat" id="exStat" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReceiptTool() {
  return (
    <section id="receipt">
      <div className="sec-head">
        <span className="no">Tool 13</span>
        <h2 data-i18n="rcTitle">Receipt / Bill Maker</h2>
      </div>
      <p className="sec-sub" data-i18n="rcDesc">
        A cafe bill or a school fee receipt in seconds — type the items, download a clean receipt
        image to print or send on WhatsApp.
      </p>
      <div className="card">
        <div className="authgrid">
          <div className="field">
            <label className="fl" htmlFor="rcShop" data-i18n="rcShopL">
              Shop / school name (printed on top)
            </label>
            <input type="text" id="rcShop" autoComplete="off" />
          </div>
          <div className="field">
            <label className="fl" htmlFor="rcCust" data-i18n="rcCustL">
              Customer / student name
            </label>
            <input type="text" id="rcCust" autoComplete="off" />
          </div>
          <div className="field">
            <label className="fl" htmlFor="rcNo" data-i18n="rcNoL">
              Receipt no.
            </label>
            <input type="text" id="rcNo" />
          </div>
          <div className="field">
            <label className="fl" htmlFor="rcDate" data-i18n="rcDateL">
              Date
            </label>
            <input type="date" id="rcDate" />
          </div>
        </div>
        <div id="rcItems" />
        <div className="btnrow" style={{ marginTop: 2 }}>
          <button className="btn ghost small" id="rcAdd" data-i18n="rcAddItem">
            ＋ Add item
          </button>
        </div>
        <div className="field" style={{ marginTop: 14 }}>
          <label className="fl" data-i18n="rcPayL">
            Payment
          </label>
          <select id="rcPay" className="sel" defaultValue="Cash">
            <option value="Cash" data-i18n="rcPayCash">Cash</option>
            <option value="UPI" data-i18n="rcPayUpi">UPI</option>
            <option value="Card" data-i18n="rcPayCard">Card</option>
          </select>
        </div>
        <div className="result-big">
          <span data-i18n="rcTotalL">Total</span>: ₹<span id="rcTotal">0</span>
        </div>
        <div className="btnrow">
          <button className="btn" id="rcGo" data-i18n="rcGo">
            ⬇ Download receipt (PNG)
          </button>
          <button className="btn ghost" id="rcCopy" data-i18n="rcCopy">
            Copy as text
          </button>
        </div>
        <div className="msg" id="rcMsg" />
      </div>
    </section>
  );
}

const COST_ROWS: Array<{ id: string; rateId: string; labelKey: string; label: string; rate: number }> = [
  { id: "pcBw", rateId: "pcBwR", labelKey: "pcBwL", label: "B/W print / photocopy pages", rate: 3 },
  { id: "pcCol", rateId: "pcColR", labelKey: "pcColL", label: "Colour print pages", rate: 10 },
  { id: "pcPh", rateId: "pcPhR", labelKey: "pcPhotoL", label: "Passport photo sets", rate: 40 },
  { id: "pcLam", rateId: "pcLamR", labelKey: "pcLamL", label: "Laminations", rate: 30 },
  { id: "pcFm", rateId: "pcFmR", labelKey: "pcFormL", label: "Online forms filled", rate: 50 },
];

export function PrintCostTool() {
  return (
    <section id="printcost">
      <div className="sec-head">
        <span className="no">Tool 14</span>
        <h2 data-i18n="pcTitle">Print Cost Calculator</h2>
      </div>
      <p className="sec-sub" data-i18n="pcDesc">
        Counter maths without mistakes — enter the counts, see exactly what to charge.
      </p>
      <div className="card">
        <div className="pcrow" aria-hidden="true">
          <span />
          <span className="pch" data-i18n="pcCountL">
            Nos.
          </span>
          <span className="pch" data-i18n="pcRateL">
            Rate ₹
          </span>
        </div>
        {COST_ROWS.map((row) => (
          <div className="pcrow" key={row.id}>
            <label className="fl" htmlFor={row.id} style={{ margin: 0 }} data-i18n={row.labelKey}>
              {row.label}
            </label>
            <input type="number" id={row.id} min={0} defaultValue={0} />
            <input
              type="number"
              id={row.rateId}
              min={0}
              defaultValue={row.rate}
              aria-label={row.label}
            />
          </div>
        ))}
        <p className="hint" data-i18n="pcRateNote">
          Rates are examples — change them to your counter rates; the total updates as you type.
        </p>
        <div className="kv" id="pcBreak" />
        <div className="result-big">
          <span data-i18n="pcTotalL">Total to charge</span>: ₹<span id="pcTotal">0</span>
        </div>
      </div>
    </section>
  );
}
