export function ImageToPdfTool() {
  return (
    <section id="pdf">
      <div className="sec-head">
        <span className="no">Tool 5</span>
        <h2 data-i18n="t5Title">Image → PDF</h2>
      </div>
      <p className="sec-sub" data-i18n="t5Desc">
        Marksheet, Aadhaar, certificate — kitni bhi photos select karo, ek saaf PDF ban jayegi.
        Page order wahi rahega jo select karne ka order hai.
      </p>
      <div className="card">
        <div className="grid2">
          <div>
            <div
              className="drop"
              id="pdfDrop"
              tabIndex={0}
              role="button"
              aria-label="Upload images to make PDF"
            >
              <div className="big" data-i18n="pdfDropBig">
                📄 Choose photos (several at once)
              </div>
              <p data-i18n="pdfDropSub">Use Ctrl / long-press to select several at once</p>
              <input type="file" id="pdfFiles" accept="image/*" multiple />
            </div>
            <div className="fname" id="pdfName" />
            <div className="field" style={{ marginTop: 16 }}>
              <label className="fl" data-i18n="pdfSizeLabel">
                Page size
              </label>
              <div className="chips" id="pdfSize">
                <button type="button" className="chip saf" data-v="a4" aria-pressed="true">
                  A4
                </button>
                <button type="button" className="chip" data-v="4x6" aria-pressed="false">
                  4 × 6 inch
                </button>
                <button
                  type="button"
                  className="chip"
                  data-v="fit"
                  aria-pressed="false"
                  data-i18n="pdfSizeFit"
                >
                  Page sized to the photo
                </button>
              </div>
            </div>
            <div className="field">
              <label className="fl" htmlFor="pdfNameInput" data-i18n="pdfNameLabel">
                Name for the PDF
              </label>
              <input type="text" id="pdfNameInput" defaultValue="documents" />
            </div>
            <div className="btnrow">
              <button className="btn" id="pdfGo" disabled data-i18n="pdfGo">
                PDF banao
              </button>
            </div>
            <div className="msg" id="pdfMsg" />
          </div>
          <div>
            <div id="pdfThumbs" style={{ display: "flex", flexWrap: "wrap", gap: 8 }} />
            <p className="hint" data-i18n="pdfHint">
              Every photo fits the page with a margin, so document edges are never cut. Use this
              PDF for form portals — and it is also the best file for printing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PdfCompressTool() {
  return (
    <section id="pdfcompress">
      <div className="sec-head">
        <span className="no">Tool 6</span>
        <h2 data-i18n="t6Title">PDF Compress</h2>
      </div>
      <p className="sec-sub" data-i18n="t6Desc">
        Badi PDF ko chhota karo — scanned documents aur photo-wali PDF mein sabse zyada fark padta
        hai. Form portal ki limit (jaise 200 KB / 500 KB) ke liye quality level chuno.
      </p>
      <div className="card">
        <div className="grid2">
          <div>
            <div
              className="drop"
              id="pcDrop"
              tabIndex={0}
              role="button"
              aria-label="Upload PDF to compress"
            >
              <div className="big" data-i18n="pcDropBig">
                🗜️ Upload a PDF
              </div>
              <p data-i18n="pcDropSub">
                PDF files only — scanned marksheets and certificates compress best
              </p>
              <input type="file" id="pcFile" accept="application/pdf,.pdf" />
            </div>
            <div className="fname" id="pcName" />
            <div className="field" style={{ marginTop: 16 }}>
              <label className="fl" data-i18n="pcLevelLabel">
                How much compression?
              </label>
              <div className="chips" id="pcLevel">
                <button
                  type="button"
                  className="chip"
                  data-v="high"
                  aria-pressed="false"
                  data-i18n="pcLvlHigh"
                >
                  Light — best quality (200 DPI)
                </button>
                <button type="button" className="chip saf" data-v="med" aria-pressed="true" data-i18n="pcLvlMed">
                  Medium (150 DPI)
                </button>
                <button
                  type="button"
                  className="chip"
                  data-v="low"
                  aria-pressed="false"
                  data-i18n="pcLvlLow"
                >
                  Smallest (100 DPI)
                </button>
              </div>
            </div>
            <div className="btnrow">
              <button className="btn" id="pcGo" disabled data-i18n="pcGo">
                Compress karo
              </button>
              <a className="btn saf" id="pcDownload" style={{ display: "none" }}>
                ⬇ Compressed PDF download
              </a>
            </div>
            <div className="msg" id="pcMsg" />
          </div>
          <div>
            <div className="stat" id="pcStat">
              <span data-i18n="pcStatWait">
                The PDF size will appear here once you choose a file
              </span>
            </div>
            <p className="hint" data-i18n="pcHint">
              Note: with this method every page becomes a clean image, so text in the compressed
              PDF cannot be selected or searched — but it is perfect for printing and portal
              uploads. A PDF that is already only text will not shrink much. The PDF never leaves
              this computer — compression happens in the browser too.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ImageCompressorTool() {
  return (
    <section id="compress">
      <div className="sec-head">
        <span className="no">Tool 7</span>
        <h2 data-i18n="t7Title">Image Compressor</h2>
      </div>
      <p className="sec-sub" data-i18n="t7Desc">
        WhatsApp par bhejni ho ya email — photo ki quality thodi kam karke size bahut kam. Slider
        ghumao, live size dekho.
      </p>
      <div className="card">
        <div className="grid2">
          <div>
            <div
              className="drop"
              id="cpDrop"
              tabIndex={0}
              role="button"
              aria-label="Upload image to compress"
            >
              <div className="big" data-i18n="cpDropBig">
                🖼️ Upload a photo
              </div>
              <input type="file" id="cpFile" accept="image/*" />
            </div>
            <div className="fname" id="cpName" />
            <div className="field" style={{ marginTop: 16 }}>
              <label className="fl">
                <span data-i18n="cpQualityLabel">Quality</span>{" "}
                <span id="cpQVal">— 80%</span>
              </label>
              <input type="range" id="cpQ" min={20} max={100} defaultValue={80} />
            </div>
            <div className="field">
              <label className="fl" data-i18n="cpDimLabel">
                Largest side (px) — the photo will not exceed this
              </label>
              <div className="chips" id="cpDim">
                <button
                  type="button"
                  className="chip"
                  data-v="0"
                  aria-pressed="false"
                  data-i18n="cpOrigChip"
                >
                  Original
                </button>
                <button type="button" className="chip saf" data-v="1920" aria-pressed="true">
                  1920
                </button>
                <button type="button" className="chip" data-v="1280" aria-pressed="false">
                  1280
                </button>
                <button type="button" className="chip" data-v="800" aria-pressed="false">
                  800
                </button>
              </div>
            </div>
            <div className="btnrow">
              <a
                className="btn saf"
                id="cpDownload"
                style={{ display: "none" }}
                download="compressed.jpg"
              >
                ⬇ Compressed photo download
              </a>
            </div>
            <div className="msg" id="cpMsg" />
          </div>
          <div>
            <div className="preview" id="cpPreview">
              <img id="cpImg" alt="Compressed image preview" />
              <div className="stat" id="cpStat" />
            </div>
            <p className="hint" data-i18n="cpHint">
              Need an exact KB size? Use Tool 2 — this tool is for “as small as possible at good
              quality”.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
