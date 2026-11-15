export function QrTool() {
  return (
    <section id="qr">
      <div className="sec-head">
        <span className="no">Tool 10</span>
        <h2 data-i18n="qrTitle">QR Code Maker — UPI, Wi-Fi, Link</h2>
      </div>
      <p className="sec-sub" data-i18n="qrDesc">
        Dukaan ke counter ke liye payment QR, Wi-Fi QR ya kisi link ka QR — banao, print karo,
        counter par lagao. Koi sign-up nahi, QR yahin browser mein banta hai.
      </p>
      <div className="card">
        <div className="grid2">
          <div>
            <div className="field">
              <label className="fl" data-i18n="qrTypeLabel">
                What kind of QR?
              </label>
              <div className="chips" id="qrType">
                <button type="button" className="chip saf" data-v="upi" aria-pressed="true" data-i18n="qrTypeUpi">
                  UPI payment
                </button>
                <button type="button" className="chip" data-v="link" aria-pressed="false" data-i18n="qrTypeLink">
                  Link / text
                </button>
                <button type="button" className="chip" data-v="wifi" aria-pressed="false" data-i18n="qrTypeWifi">
                  Wi-Fi
                </button>
              </div>
            </div>
            <div id="qrFldUpi">
              <div className="field">
                <label className="fl" htmlFor="qrUpiId" data-i18n="qrUpiIdLabel">
                  UPI ID (VPA)
                </label>
                <input type="text" id="qrUpiId" placeholder="yourname@okhdfcbank" autoComplete="off" />
              </div>
              <div className="field">
                <label className="fl" htmlFor="qrUpiName" data-i18n="qrUpiNameLabel">
                  Name shown to the payer
                </label>
                <input type="text" id="qrUpiName" placeholder="e.g. EduCafe Hub" autoComplete="off" />
              </div>
              <div className="field">
                <label className="fl" htmlFor="qrUpiAmt" data-i18n="qrUpiAmtLabel">
                  Fixed amount ₹ (optional — blank means the payer types it)
                </label>
                <input type="number" id="qrUpiAmt" min={1} step="0.01" placeholder="e.g. 50" />
              </div>
            </div>
            <div id="qrFldLink" hidden>
              <div className="field">
                <label className="fl" htmlFor="qrText" data-i18n="qrTextLabel">
                  Link or text for the QR
                </label>
                <input type="text" id="qrText" placeholder="https://…" autoComplete="off" />
              </div>
            </div>
            <div id="qrFldWifi" hidden>
              <div className="field">
                <label className="fl" htmlFor="qrWifiSsid" data-i18n="qrWifiSsidLabel">
                  Wi-Fi name (SSID)
                </label>
                <input type="text" id="qrWifiSsid" placeholder="e.g. CafeWiFi" autoComplete="off" />
              </div>
              <div className="field">
                <label className="fl" htmlFor="qrWifiPass" data-i18n="qrWifiPassLabel">
                  Wi-Fi password
                </label>
                <input type="text" id="qrWifiPass" autoComplete="off" />
              </div>
              <div className="field">
                <label className="fl" data-i18n="qrWifiSecLabel">
                  Security type
                </label>
                <div className="chips" id="qrWifiSec">
                  <button type="button" className="chip saf" data-v="WPA" aria-pressed="true">
                    WPA / WPA2
                  </button>
                  <button type="button" className="chip" data-v="WEP" aria-pressed="false">
                    WEP
                  </button>
                  <button type="button" className="chip" data-v="nopass" aria-pressed="false" data-i18n="qrWifiOpen">
                    Open (no password)
                  </button>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="fl" data-i18n="qrSizeLabel">
                Print size
              </label>
              <div className="chips" id="qrSize">
                <button type="button" className="chip" data-v="256" aria-pressed="false">
                  256 px
                </button>
                <button type="button" className="chip saf" data-v="512" aria-pressed="true">
                  512 px
                </button>
                <button type="button" className="chip" data-v="1024" aria-pressed="false">
                  1024 px
                </button>
              </div>
            </div>
            <div className="btnrow">
              <button className="btn" id="qrGo" data-i18n="qrGo">
                QR banao
              </button>
              <a className="btn saf" id="qrDownload" style={{ display: "none" }} download="qr-code.png">
                ⬇ Download PNG
              </a>
            </div>
            <div className="msg" id="qrMsg" />
          </div>
          <div>
            <div className="preview" id="qrPreview">
              <div className="sheetwrap" style={{ background: "#fff" }}>
                <div id="qrOut" style={{ display: "inline-block", lineHeight: 0 }} />
              </div>
              <div className="stat" id="qrStat" />
            </div>
            <p className="hint" data-i18n="qrHint">
              Print tip: for a counter stand, the 1024 px size stays sharp. Always scan-test the
              printed QR with your own phone before a customer pays — a wrong UPI ID sends money to
              someone else.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
