export function DocCropTool() {
  return (
    <section id="doc-crop">
      <div className="sec-head">
        <span className="no">Tool 18</span>
        <h2 data-i18n="t18Title">Document Auto Crop</h2>
      </div>
      <p className="sec-sub" data-i18n="t18Desc">Upload a photo of any document — Aadhaar card, certificate, marksheet, form — the four corners are found on their own, the page is straightened flat, and you download a clean copy.</p>
      <div className="card">
        <div className="grid2">
          <div>
            <div
              className="drop"
              id="dcDrop"
              tabIndex={0}
              role="button"
              data-i18n-aria="ariaDcDrop" aria-label="Upload a photo of a document"
            >
              <div className="big" data-i18n="ppDropBig">
                📷 Drop a photo here or click to choose
              </div>
              <p data-i18n="dcDropSub">
                JPG / PNG — the whole document in frame, photo taken from above
              </p>
              <img id="dcDropImg" className="dropimg" alt="" />
              <input type="file" id="dcFile" accept="image/*" />
            </div>
            <div className="fname" id="dcName" />
            <div className="field" style={{ marginTop: 16 }}>
              <label className="fl" data-i18n="dcCornersLabel">Document corners</label>
              <div className="dcstage" id="dcStage" hidden>
                <canvas id="dcCanvas" width={680} height={480} />
                <button type="button" className="dchandle" id="dcH0" data-i18n-aria="ariaDcCornerTl" aria-label="Top left corner — drag, or use arrow keys" />
                <button type="button" className="dchandle" id="dcH1" data-i18n-aria="ariaDcCornerTr" aria-label="Top right corner — drag, or use arrow keys" />
                <button type="button" className="dchandle" id="dcH2" data-i18n-aria="ariaDcCornerBr" aria-label="Bottom right corner — drag, or use arrow keys" />
                <button type="button" className="dchandle" id="dcH3" data-i18n-aria="ariaDcCornerBl" aria-label="Bottom left corner — drag, or use arrow keys" />
              </div>
              <p className="hint" data-i18n="dcDragHint">
                Drag the four corner dots onto the exact corners of the document. On a keyboard, Tab to a dot and move it with the arrow keys.
              </p>
              <div className="btnrow">
                <button type="button" className="btn ghost small" id="dcReset" disabled data-i18n="dcResetBtn">Reset corners</button>
              </div>
            </div>
            <div className="field">
              <label className="fl" data-i18n="dcModeLabel">Document look</label>
              <div className="chips" id="dcMode">
                <button
                  type="button"
                  className="chip saf"
                  data-v="orig"
                  aria-pressed="true"
                  data-i18n="dcModeOrig"
                >
                  Original photo
                </button>
                <button
                  type="button"
                  className="chip"
                  data-v="bw"
                  aria-pressed="false"
                  data-i18n="dcModeBw"
                >
                  B&amp;W scan look
                </button>
              </div>
            </div>
          </div>
          <div className="prevcol">
            <div className="preview show">
              <canvas
                id="dcOut"
                width={620}
                height={800}
                style={{ maxHeight: 520, width: "auto", maxWidth: "100%" }}
              />
              <div className="stat" id="dcStat">
                <span data-i18n="dcWait">The straightened document will appear here</span>
              </div>
            </div>
            <div className="btnrow" style={{ marginTop: 12 }}>
              <button type="button" className="btn saf" id="dcJpg" disabled data-i18n="dcJpgBtn">⬇ Download JPG</button>
              <button type="button" className="btn ghost" id="dcPdf" disabled data-i18n="dcPdfBtn">Download PDF</button>
            </div>
            <div className="msg" id="dcMsg" />
            <p className="hint" id="dcInfo" />
          </div>
        </div>
      </div>
    </section>
  );
}
