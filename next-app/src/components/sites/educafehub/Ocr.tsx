export function OcrTool() {
  return (
    <section id="photo-ocr">
      <div className="sec-head">
        <span className="no">Tool 13</span>
        <h2 data-i18n="t19Title">Photo to Text (OCR)</h2>
      </div>
      <p className="sec-sub" data-i18n="t19Desc">Upload a photo of any page, notice or document and get its printed text out — copy it or download it as a .txt file. English and Hindi both work.</p>
      <div className="card">
        <div className="grid2">
          <div>
            <div
              className="drop"
              id="ocrDrop"
              tabIndex={0}
              role="button"
              data-i18n-aria="ariaOcrDrop" aria-label="Upload a photo to extract text from"
            >
              <div className="big" data-i18n="ppDropBig">
                📷 Drop a photo here or click to choose
              </div>
              <p data-i18n="ocrDropSub">
                JPG / PNG — a clear, straight photo of the page
              </p>
              <img id="ocrDropImg" className="dropimg" alt="" />
              <input type="file" id="ocrFile" accept="image/*" />
            </div>
            <div className="fname" id="ocrName" />
            <div className="field" style={{ marginTop: 16 }}>
              <label className="fl" data-i18n="ocrLangLabel">Text language</label>
              <div className="chips" id="ocrLang">
                <button
                  type="button"
                  className="chip saf"
                  data-v="eng"
                  aria-pressed="true"
                  data-i18n="ocrLangEn"
                >
                  English
                </button>
                <button
                  type="button"
                  className="chip"
                  data-v="hin"
                  aria-pressed="false"
                  data-i18n="ocrLangHi"
                >
                  Hindi
                </button>
                <button
                  type="button"
                  className="chip"
                  data-v="eng+hin"
                  aria-pressed="false"
                  data-i18n="ocrLangBoth"
                >
                  English + Hindi
                </button>
              </div>
              <p className="hint" data-i18n="ocrLangHint">
                Pick the language printed in the photo. For mixed pages choose English + Hindi.
              </p>
            </div>
            <div className="btnrow">
              <button type="button" className="btn saf" id="ocrGo" disabled data-i18n="ocrGoBtn">Extract text</button>
            </div>
            <div className="stat" id="ocrProg" hidden />
            <div className="msg" id="ocrMsg" />
          </div>
          <div className="prevcol">
            <div className="field">
              <label className="fl" data-i18n="ocrTextLabel">Extracted text</label>
              <textarea
                id="ocrText"
                rows={14}
                data-i18n-aria="ariaOcrText" aria-label="Extracted text — you can edit it before copying"
              />
              <div className="stat" id="ocrStat">
                <span data-i18n="ocrWait">The text from your photo will appear here</span>
              </div>
            </div>
            <div className="btnrow" style={{ marginTop: 12 }}>
              <button type="button" className="btn saf" id="ocrCopy" disabled data-i18n="ocrCopyBtn">Copy text</button>
              <button type="button" className="btn ghost" id="ocrDl" disabled data-i18n="ocrDlBtn">⬇ Download .txt</button>
            </div>
            <p className="hint" id="ocrInfo" />
          </div>
        </div>
      </div>
    </section>
  );
}
