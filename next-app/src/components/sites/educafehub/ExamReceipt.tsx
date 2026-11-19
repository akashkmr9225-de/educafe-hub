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
