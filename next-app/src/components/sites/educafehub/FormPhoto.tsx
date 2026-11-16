export function FormPhotoTool() {
  return (
    <section id="form-photo">
      <div className="sec-head">
        <span className="no">Tool 17</span>
        <h2 data-i18n="t17Title">Online Form Photo</h2>
      </div>
      <p className="sec-sub" data-i18n="t17Desc">Upload one photo, pick the form it is for, and download the digital photo at the exact pixels and KB that form asks for — ready to upload.</p>
      <div className="card">
        <div className="grid2">
          <div>
            <div
              className="drop"
              id="fpDrop"
              tabIndex={0}
              role="button"
              data-i18n-aria="ariaPpDrop" aria-label="Upload photo for online form"
            >
              <div className="big" data-i18n="ppDropBig">
                📷 Drop a photo here or click to choose
              </div>
              <p data-i18n="ppDropSub">
                JPG / PNG — a straight, front-facing student photo works best
              </p>
              <input type="file" id="fpFile" accept="image/*" />
            </div>
            <div className="fname" id="fpName" />
            <div className="field" style={{ marginTop: 16 }}>
              <label className="fl" data-i18n="ppDocPresetLabel">Online form preset — digital photo</label>
              <select id="fpPreset" className="sel" defaultValue="">
                <option value="" data-i18n="ppDocPresetNone">No preset — print sheet only</option>
                <option value="passport-seva" data-i18n="ppDocPassport">India Passport (Passport Seva) — 630×810 px, 10–250 KB, white background</option>
                <option value="ibps" data-i18n="ppDocIbps">IBPS exam — 200×230 px, 20–50 KB</option>
                <option value="sbi" data-i18n="ppDocSbi">SBI exam — 200×230 px, 20–50 KB</option>
                <option value="oci" data-i18n="ppDocOci">OCI — 600×600 px, up to 200 KB, light background (not white)</option>
                <option value="dl" data-i18n="ppDocDl">Driving Licence — 420×525 px, 10–20 KB</option>
                <option value="neet" data-i18n="ppDocNeet">NEET UG — 413×531 px, 10–200 KB, name + date strip</option>
                <option value="jee" data-i18n="ppDocJee">JEE Main — 413×531 px, 10–200 KB</option>
                <option value="upsc" data-i18n="ppDocUpsc">UPSC — 413×531 px, 20–200 KB</option>
                <option value="pan" data-i18n="ppDocPan">PAN Card — 276×197 px, up to 20 KB</option>
                <option value="visa" data-i18n="ppDocVisa">Indian Visa — 600×600 px, 10–300 KB, square photo</option>
              </select>
              <p className="hint" data-i18n="ppDocPresetNote">Specs as of Nov 2026 — check your current notice before submitting.</p>
            </div>
            <div className="field">
              <label className="fl" data-i18n="ppModeLabel">
                How the photo fills its box
              </label>
              <div className="chips" id="fpMode">
                <button
                  type="button"
                  className="chip saf"
                  data-v="fill"
                  aria-pressed="true"
                  data-i18n="ppModeFill"
                >
                  Fill (crop edges)
                </button>
                <button
                  type="button"
                  className="chip"
                  data-v="fit"
                  aria-pressed="false"
                  data-i18n="ppModeFit"
                >
                  Fit — no cropping
                </button>
              </div>
            </div>
            <div className="field">
              <label className="fl" data-i18n="ppStripLabel">Name + date strip</label>
              <div className="num2">
                <button type="button" className="chip" id="fpStrip" aria-pressed="false" data-i18n="ppStripToggle">Print name + date at the bottom</button>
              </div>
              <div className="num2" style={{ marginTop: 8, gap: 8 }}>
                <input type="text" id="fpStripName" className="nm" placeholder="Candidate name" data-i18n-ph="ppStripNamePh" style={{ flex: 1 }} />
                <input type="date" id="fpStripDate" className="nm" />
              </div>
            </div>
            <div className="field">
              <label className="fl" data-i18n="ppAdjustLabel">Brightness &amp; contrast</label>
              <div className="num2" style={{ gap: 10, alignItems: "center" }}>
                <span className="hint" style={{ margin: 0 }} data-i18n="ppBrightLabel">Brightness</span>
                <input type="range" id="fpBright" min="50" max="150" defaultValue="100" style={{ flex: 1 }} />
              </div>
              <div className="num2" style={{ gap: 10, alignItems: "center", marginTop: 6 }}>
                <span className="hint" style={{ margin: 0 }} data-i18n="ppContrastLabel">Contrast</span>
                <input type="range" id="fpContrast" min="50" max="150" defaultValue="100" style={{ flex: 1 }} />
                <button type="button" className="btn ghost small" id="fpAdjReset" data-i18n="ppAdjResetBtn">Reset</button>
              </div>
            </div>
          </div>
          <div className="prevcol">
            <div className="preview show">
              <canvas
                id="fpCanvas"
                width={413}
                height={531}
                style={{ maxHeight: 520, width: "auto", maxWidth: "100%" }}
              />
              <div className="stat" id="fpStat">
                <span data-i18n="fpWait">Your form photo will appear here</span>
              </div>
            </div>
            <div className="btnrow" style={{ marginTop: 12 }}>
              <button type="button" className="btn saf" id="fpDownload" disabled data-i18n="ppDocDownloadBtn">⬇ Download digital photo</button>
              <button type="button" className="btn ghost" id="fpBgRemove" disabled data-i18n="ppBgRemoveBtn">Remove background</button>
            </div>
            <div className="msg" id="fpMsg" />
            <p className="hint" id="fpInfo" />
          </div>
        </div>
      </div>
    </section>
  );
}
