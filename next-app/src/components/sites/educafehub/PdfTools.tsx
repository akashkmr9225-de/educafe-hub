export function ImageToPdfTool() {
  return (
    <section id="pdf">
      <div className="sec-head">
        <span className="no">Tool 5</span>
        <h2 data-i18n="t5Title">Image → PDF</h2>
      </div>
      <p className="sec-sub" data-i18n="t5Desc">Marksheets, Aadhaar, certificates — select as many photos as you like and get one clean PDF, in the order you selected them.</p>
      <div className="card">
        <div className="grid2">
          <div>
            <div
              className="drop"
              id="pdfDrop"
              tabIndex={0}
              role="button"
              data-i18n-aria="ariaPdfDrop" aria-label="Upload images to make PDF"
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
              <select id="pdfSize" className="sel" defaultValue="a4">
                <option value="a4">A4</option>
                <option value="4x6">4 × 6 inch</option>
                <option value="fit" data-i18n="pdfSizeFit">Page sized to the photo</option>
              </select>
            </div>
            <div className="field">
              <label className="fl" htmlFor="pdfNameInput" data-i18n="pdfNameLabel">
                Name for the PDF
              </label>
              <input type="text" id="pdfNameInput" defaultValue="documents" />
            </div>
            <div className="btnrow">
              <button className="btn" id="pdfGo" disabled data-i18n="pdfGo">Make PDF</button>
            </div>
            <div className="msg" id="pdfMsg" />
          </div>
          <div>
            <div id="pdfThumbs" style={{ display: "flex", flexWrap: "wrap", gap: 8 }} />
            <p className="hint" id="pdfThumbsHint" style={{ display: "none" }} data-i18n="pdfThumbsHint">
              Page order = photo order. Use ◀ ▶ to fix the order, ✕ to remove a photo.
            </p>
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
      <p className="sec-sub" data-i18n="t6Desc">Shrink a large PDF — works best on scanned documents and photo PDFs. Pick a quality level for portal limits like 200 KB / 500 KB.</p>
      <div className="card">
        <div className="grid2">
          <div>
            <div
              className="drop"
              id="pcDrop"
              tabIndex={0}
              role="button"
              data-i18n-aria="ariaPcDrop" aria-label="Upload PDF to compress"
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
              <select id="pcLevel" className="sel" defaultValue="med">
                <option value="high" data-i18n="pcLvlHigh">Light — best quality (200 DPI)</option>
                <option value="med" data-i18n="pcLvlMed">Medium (150 DPI)</option>
                <option value="low" data-i18n="pcLvlLow">Smallest (100 DPI)</option>
              </select>
            </div>
            <div className="btnrow">
              <button className="btn" id="pcGo" disabled data-i18n="pcGo">Compress now</button>
              <a className="btn saf" id="pcDownload" style={{ display: "none" }} data-i18n="pcDownloadBtn">
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
      <p className="sec-sub" data-i18n="t7Desc">For WhatsApp or email — lower the quality a little and the size drops a lot. Move the slider and watch the size live.</p>
      <div className="card">
        <div className="grid2">
          <div>
            <div
              className="drop"
              id="cpDrop"
              tabIndex={0}
              role="button"
              data-i18n-aria="ariaCpDrop" aria-label="Upload image to compress"
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
              <label className="fl" htmlFor="cpFormat" data-i18n="cpFormatLabel">
                Format
              </label>
              <select id="cpFormat" defaultValue="jpg">
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
              </select>
            </div>
            <div className="field">
              <label className="fl" data-i18n="cpDimLabel">
                Largest side (px) — the photo will not exceed this
              </label>
              <select id="cpDim" className="sel" defaultValue="1920">
                <option value="0" data-i18n="cpOrigChip">Original</option>
                <option value="1920">1920</option>
                <option value="1280">1280</option>
                <option value="800">800</option>
              </select>
            </div>
            <div className="btnrow">
              <a
                className="btn saf"
                id="cpDownload"
                style={{ display: "none" }}
                download="compressed.jpg"
                data-i18n="cpDownloadBtn"
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
