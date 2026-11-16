const DIRECTORY_ATTRS: Record<string, string> = { webkitdirectory: '', directory: '' };

export function PassportTool() {
  return (
    <section id="passport">
      <div className="sec-head">
        <span className="no">Tool 1</span>
        <h2 data-i18n="t1Title">Passport Photo Sheet Maker</h2>
      </div>
      <p className="sec-sub" data-i18n="t1Desc">Upload one photo, download a print-ready sheet — 300 DPI, correct passport size (35 × 45 mm). The busiest tool in any cafe.</p>
      <div className="card">
        <div className="field" style={{ marginBottom: 16 }}>
          <label className="fl" data-i18n="ppModeSwitchLabel">Mode</label>
          <div className="chips" id="ppModeSwitch">
            <button type="button" className="chip saf" data-v="single" aria-pressed="true" data-i18n="ppModeSingle">Single photo</button>
            <button type="button" className="chip" data-v="bulk" aria-pressed="false" data-i18n="ppModeBulk">Bulk — many students</button>
          </div>
        </div>
        <div id="ppSinglePanel">
          <div className="grid2">
            <div>
              <div
                className="drop"
                id="ppDrop"
                tabIndex={0}
                role="button"
                data-i18n-aria="ariaPpDrop" aria-label="Upload photo for passport sheet"
              >
                <div className="big" data-i18n="ppDropBig">
                  📷 Drop a photo here or click to choose
                </div>
                <p data-i18n="ppDropSub">
                  JPG / PNG — a straight, front-facing student photo works best
                </p>
                <input type="file" id="ppFile" accept="image/*" />
              </div>
              <div className="fname" id="ppName" />
              <div className="field" style={{ marginTop: 16 }}>
                <label className="fl" data-i18n="ppPaperLabel">
                  Paper size
                </label>
                <select id="ppPaperSel" className="sel" data-i18n-aria="ariaPaper" aria-label="Paper size">
                  <option value="4x6" data-i18n="ppPaper4x6">4 × 6 inch (photo paper)</option>
                  <option value="5x7" data-i18n="ppPaper5x7">5 × 7 inch (photo paper)</option>
                  <option value="6x8" data-i18n="ppPaper6x8">6 × 8 inch (photo paper)</option>
                  <option value="8x10" data-i18n="ppPaper8x10">8 × 10 inch (photo paper)</option>
                  <option value="a5" data-i18n="ppPaperA5">A5</option>
                  <option value="a6" data-i18n="ppPaperA6">A6</option>
                  <option value="a4" data-i18n="ppPaperA4">A4</option>
                  <option value="a3" data-i18n="ppPaperA3">A3</option>
                  <option value="letter" data-i18n="ppPaperLetter">Letter</option>
                  <option value="legal" data-i18n="ppPaperLegal">Legal</option>
                </select>
              </div>
              <div className="field">
                <label className="fl" data-i18n="ppPaperTypeLabel">Paper type</label>
                <select id="ppPaperType" className="sel">
                  <option value="glossy" data-i18n="ppTypeGlossy">Glossy paper</option>
                  <option value="matte" data-i18n="ppTypeMatte">Matte paper</option>
                  <option value="satin" data-i18n="ppTypeSatin">Satin paper</option>
                  <option value="plain" data-i18n="ppTypePlain">Plain paper</option>
                </select>
              </div>
              <div className="field">
                <label className="fl" data-i18n="ppCopiesLabel">
                  How many copies?
                </label>
                <div className="num2" style={{ alignItems: "center", gap: 8 }}>
                  <input type="number" id="ppCopiesInput" min="1" max="500" defaultValue={8} className="nm" style={{ width: 80 }} />
                  <span className="hint" id="ppCopiesNote" data-i18n="ppCopiesNote">Max 8 fit on 4×6 inch paper</span>
                </div>
              </div>
              <div className="field">
                <label className="fl" data-i18n="ppQualityLabel">
                  Print quality
                </label>
                <select id="ppQuality" className="sel" data-i18n-aria="ariaQuality" aria-label="Print quality" defaultValue="300">
                  <option value="600" data-i18n="ppQualityHighest">Highest — 600 DPI</option>
                  <option value="300" data-i18n="ppQualityHigh">High — 300 DPI</option>
                  <option value="200" data-i18n="ppQualityMed">Normal — 200 DPI</option>
                  <option value="150" data-i18n="ppQualityLow">Draft — 150 DPI</option>
                </select>
              </div>
              <div className="field">
                <label className="fl" data-i18n="ppPresetLabel">
                  Photo size
                </label>
                <select id="ppPreset" className="sel" defaultValue="35x45">
                  <option value="35x45" data-i18n="ppPresetPassport">Passport — 35 × 45 mm</option>
                  <option value="51x51" data-i18n="ppPresetPan">PAN / OCI — 51 × 51 mm</option>
                  <option value="50.8x50.8" data-i18n="ppPresetUs">US — 2 × 2 inch</option>
                  <option value="custom" data-i18n="ppPresetCustom">Custom</option>
                </select>
                <div className="num2" id="ppCustomRow" style={{ display: "none", marginTop: 8 }}>
                  <input
                    type="number"
                    id="ppCW"
                    min={10}
                    max={100}
                    defaultValue={35}
                    data-i18n-aria="ariaCustomW" aria-label="Custom width mm"
                  />
                  <span aria-hidden="true">×</span>
                  <input
                    type="number"
                    id="ppCH"
                    min={10}
                    max={120}
                    defaultValue={45}
                    data-i18n-aria="ariaCustomH" aria-label="Custom height mm"
                  />
                  <span className="hint" style={{ margin: 0 }}>
                    mm
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="fl" data-i18n="ppModeLabel">
                  How the photo fills its box
                </label>
                <div className="chips" id="ppMode">
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
                <label className="fl" data-i18n="ppExtraLabel">
                  Guides, background & name label
                </label>
                <div className="num2">
                  <button
                    type="button"
                    className="chip"
                    id="ppGuides"
                    aria-pressed="true"
                    data-i18n="ppGuides"
                  >
                    Cutting guides
                  </button>
                  <button
                    type="button"
                    className="chip"
                    id="ppLabels"
                    aria-pressed="true"
                    data-i18n="ppLabels"
                  >
                    Name under photo
                  </button>
                  <input type="color" id="ppBg" defaultValue="#ffffff" data-i18n-aria="ariaBg" aria-label="Background colour" />
                </div>
                <input
                  type="text"
                  className="nm"
                  id="ppLabelText"
                  placeholder="Name / ID to print"
                  data-i18n-ph="ppLabelPh"
                  style={{ marginTop: 8, maxWidth: 260 }}
                />
                <p className="hint" style={{ marginTop: 4 }} data-i18n="ppBgHint">
                  The colour fills the empty space in Fit mode and sits behind the name label.
                </p>
              </div>
              <div className="field">
                <label className="fl" data-i18n="ppCropLabel">
                  Crop the photo — adjust with the two sliders
                </label>
                <input type="range" id="ppZoom" min={100} max={260} defaultValue={100} />
                <input
                  type="range"
                  id="ppY"
                  min={0}
                  max={100}
                  defaultValue={18}
                  style={{ marginTop: 6 }}
                />
                <p className="hint" style={{ marginTop: 2 }} data-i18n="ppCropHint">
                  First slider = zoom, second = move the photo up/down. Keep the head at the top and
                  the shoulders in the frame.
                </p>
              </div>
              <div className="field">
                <label className="fl" data-i18n="ppDocPresetLabel">Online form preset — digital photo</label>
                <select id="ppDocPreset" className="sel">
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
                <div className="btnrow" style={{ marginTop: 8 }}>
                  <button type="button" className="btn" id="ppDocDownload" disabled data-i18n="ppDocDownloadBtn">⬇ Download digital photo</button>
                  <button type="button" className="btn ghost" id="ppBgRemove" disabled data-i18n="ppBgRemoveBtn">Remove background</button>
                </div>
                <p className="hint" id="ppDocInfo" />
              </div>
              <div className="field">
                <label className="fl" data-i18n="ppStripLabel">Name + date strip</label>
                <div className="num2">
                  <button type="button" className="chip" id="ppStrip" aria-pressed="false" data-i18n="ppStripToggle">Print name + date at the bottom</button>
                </div>
                <div className="num2" style={{ marginTop: 8, gap: 8 }}>
                  <input type="text" id="ppStripName" className="nm" placeholder="Candidate name" data-i18n-ph="ppStripNamePh" style={{ flex: 1 }} />
                  <input type="date" id="ppStripDate" className="nm" />
                </div>
              </div>
              <div className="field">
                <label className="fl" data-i18n="ppAdjustLabel">Brightness &amp; contrast</label>
                <div className="num2" style={{ gap: 10, alignItems: "center" }}>
                  <span className="hint" style={{ margin: 0 }} data-i18n="ppBrightLabel">Brightness</span>
                  <input type="range" id="ppBright" min="50" max="150" defaultValue="100" style={{ flex: 1 }} />
                </div>
                <div className="num2" style={{ gap: 10, alignItems: "center", marginTop: 6 }}>
                  <span className="hint" style={{ margin: 0 }} data-i18n="ppContrastLabel">Contrast</span>
                  <input type="range" id="ppContrast" min="50" max="150" defaultValue="100" style={{ flex: 1 }} />
                  <button type="button" className="btn ghost small" id="ppAdjReset" data-i18n="ppAdjResetBtn">Reset</button>
                </div>
              </div>
              <div className="btnrow">
                <button className="btn" id="ppGenerate" data-i18n="ppGenerateBtn">🖨️ Generate sheet</button>
                <button className="btn saf" id="ppDownload" disabled data-i18n="ppDownload">⬇ Download sheet (JPG)</button>
              </div>
              <div className="msg" id="ppMsg" />
            </div>
            <div>
              <div className="preview show">
                <div className="sheetwrap">
                  <canvas
                    id="ppCanvas"
                    width={1200}
                    height={1800}
                    style={{ maxHeight: 520, width: "auto", maxWidth: "100%" }}
                  />
                </div>
                <div className="stat" id="ppStat">
                  <span data-i18n="ppStatWait">The sheet will appear here as soon as you upload a photo</span>
                </div>
              </div>
              <p className="hint" data-i18n="ppPrintHint">
                When printing, choose “Actual size / 100%” in the printer settings — not “Fit to
                page”, or the size will change. A light outline on each photo makes cutting easier.
              </p>
            </div>
          </div>
        </div>
        <div id="ppBulkPanel" style={{ display: "none" }}>
          <div className="grid2">
            <div>
              <div
                className="drop"
                id="ppBulkDrop"
                tabIndex={0}
                role="button"
                data-i18n-aria="ariaPpBulkDrop" aria-label="Upload multiple photos for bulk passport sheets"
              >
                <div className="big" data-i18n="ppBulkDropBig">
                  👥 Drop many photos here or click to choose
                </div>
                <p data-i18n="ppBulkDropSub">
                  JPG / PNG / HEIC — up to 200 photos, file name becomes student name
                </p>
                <input type="file" id="ppBulkFiles" accept="image/*" multiple />
              </div>
              <div className="btnrow" style={{ marginTop: 10 }}>
                <button type="button" className="btn ghost small" id="ppFolderBtn" data-i18n="ppFolderBtn">
                  📁 Choose a whole folder
                </button>
                <input type="file" id="ppFolder" multiple style={{ display: 'none' }} {...DIRECTORY_ATTRS} />
              </div>
              <div className="fname" id="ppBulkName" />
              <div className="field" style={{ marginTop: 16 }}>
                <label className="fl" data-i18n="ppPaperLabel">
                  Paper size
                </label>
                <select id="ppBulkPaperSel" className="sel" data-i18n-aria="ariaPaper" aria-label="Paper size">
                  <option value="4x6" data-i18n="ppPaper4x6">4 × 6 inch (photo paper)</option>
                  <option value="5x7" data-i18n="ppPaper5x7">5 × 7 inch (photo paper)</option>
                  <option value="6x8" data-i18n="ppPaper6x8">6 × 8 inch (photo paper)</option>
                  <option value="8x10" data-i18n="ppPaper8x10">8 × 10 inch (photo paper)</option>
                  <option value="a5" data-i18n="ppPaperA5">A5</option>
                  <option value="a6" data-i18n="ppPaperA6">A6</option>
                  <option value="a4" data-i18n="ppPaperA4">A4</option>
                  <option value="a3" data-i18n="ppPaperA3">A3</option>
                  <option value="letter" data-i18n="ppPaperLetter">Letter</option>
                  <option value="legal" data-i18n="ppPaperLegal">Legal</option>
                </select>
              </div>
              <div className="field">
                <label className="fl" data-i18n="ppQualityLabel">
                  Print quality
                </label>
                <select id="ppBulkQuality" className="sel" data-i18n-aria="ariaQuality" aria-label="Print quality" defaultValue="300">
                  <option value="600" data-i18n="ppQualityHighest">Highest — 600 DPI</option>
                  <option value="300" data-i18n="ppQualityHigh">High — 300 DPI</option>
                  <option value="200" data-i18n="ppQualityMed">Normal — 200 DPI</option>
                  <option value="150" data-i18n="ppQualityLow">Draft — 150 DPI</option>
                </select>
              </div>
              <div className="field">
                <label className="fl" data-i18n="ppPaperTypeLabel">Paper type</label>
                <select id="ppBulkPaperType" className="sel">
                  <option value="glossy" data-i18n="ppTypeGlossy">Glossy paper</option>
                  <option value="matte" data-i18n="ppTypeMatte">Matte paper</option>
                  <option value="satin" data-i18n="ppTypeSatin">Satin paper</option>
                  <option value="plain" data-i18n="ppTypePlain">Plain paper</option>
                </select>
              </div>
              <div className="field">
                <label className="fl" data-i18n="ppPresetLabel">
                  Photo size
                </label>
                <select id="ppBulkPreset" className="sel" defaultValue="35x45">
                  <option value="35x45" data-i18n="ppPresetPassport">Passport — 35 × 45 mm</option>
                  <option value="51x51" data-i18n="ppPresetPan">PAN / OCI — 51 × 51 mm</option>
                  <option value="50.8x50.8" data-i18n="ppPresetUs">US — 2 × 2 inch</option>
                  <option value="custom" data-i18n="ppPresetCustom">Custom</option>
                </select>
                <div className="num2" id="ppBulkCustomRow" style={{ display: "none", marginTop: 8 }}>
                  <input
                    type="number"
                    id="ppBulkCW"
                    min={10}
                    max={100}
                    defaultValue={35}
                    data-i18n-aria="ariaCustomW" aria-label="Custom width mm"
                  />
                  <span aria-hidden="true">×</span>
                  <input
                    type="number"
                    id="ppBulkCH"
                    min={10}
                    max={120}
                    defaultValue={45}
                    data-i18n-aria="ariaCustomH" aria-label="Custom height mm"
                  />
                  <span className="hint" style={{ margin: 0 }}>
                    mm
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="fl" data-i18n="ppExtraLabel">
                  Guides, background & name label
                </label>
                <div className="num2">
                  <button
                    type="button"
                    className="chip"
                    id="ppBulkGuides"
                    aria-pressed="true"
                    data-i18n="ppGuides"
                  >
                    Cutting guides
                  </button>
                  <button
                    type="button"
                    className="chip saf"
                    id="ppBulkLabels"
                    aria-pressed="true"
                    data-i18n="ppLabels"
                  >
                    Name under photo
                  </button>
                  <input type="color" id="ppBulkBg" defaultValue="#ffffff" data-i18n-aria="ariaBg" aria-label="Background colour" />
                </div>
              </div>
              <div className="field">
                <label className="fl" data-i18n="ppBulkExcelLabel">
                  Excel name matching
                </label>
                <div className="btnrow" style={{ gap: 8, flexWrap: "wrap" }}>
                  <button type="button" className="btn" id="ppBulkXlTemplate" data-i18n="ppBulkXlTemplate">📥 Download name template (Excel)</button>
                  <button type="button" className="btn" id="ppBulkXlUpload" data-i18n="ppBulkXlUpload">📤 Upload filled Excel</button>
                </div>
                <input type="file" id="ppBulkXlFile" accept=".xlsx,.xls,.csv" style={{ display: "none" }} />
                <p className="hint" id="ppBulkXlStatus" style={{ marginTop: 8 }} />
              </div>
              <div className="btnrow">
                <button className="btn" id="ppBulkGenerate" data-i18n="ppGenerateBtn">🖨️ Generate sheet</button>
                <button className="btn" id="ppBulkPdf" disabled data-i18n="ppBulkPdf">⬇ Download all pages (PDF)</button>
                <button className="btn saf" id="ppBulkPageJpg" disabled data-i18n="ppBulkPageJpg">⬇ Current page (JPG)</button>
              </div>
              <div className="msg" id="ppBulkMsg" />
            </div>
            <div>
              <div className="preview show">
                <div className="sheetwrap">
                  <canvas
                    id="ppBulkCanvas"
                    width={1200}
                    height={1800}
                    style={{ maxHeight: 520, width: "auto", maxWidth: "100%" }}
                  />
                </div>
                <div className="stat" id="ppBulkStat" />
                <div className="btnrow" id="ppBulkNav" style={{ display: "none", marginTop: 8, justifyContent: "center", gap: 8 }}>
                  <button className="btn" id="ppBulkPrev" disabled data-i18n="ppBulkPrev">‹ Prev</button>
                  <span className="hint" id="ppBulkPageInfo" style={{ alignSelf: "center" }} />
                  <button className="btn" id="ppBulkNext" disabled data-i18n="ppBulkNext">Next ›</button>
                </div>
              </div>
              <p className="hint" data-i18n="ppPrintHint">
                When printing, choose “Actual size / 100%” in the printer settings — not “Fit to
                page”, or the size will change. A light outline on each photo makes cutting easier.
              </p>
            </div>
          </div>
          <div className="field" style={{ marginTop: 16 }}>
            <label className="fl" data-i18n="ppBulkNamesLabel">Names (click to edit)</label>
            <div className="btnrow" style={{ marginBottom: 8 }}>
              <button type="button" className="btn ghost small" id="ppBulkClear" disabled data-i18n="ppBulkClear">Clear all</button>
            </div>
            <div id="ppBulkThumbs" className="bthumbs" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExactKbTool() {
  return (
    <section id="kb">
      <div className="sec-head">
        <span className="no">Tool 2</span>
        <h2 data-i18n="t2Title">Photo Resize — in Exact KB</h2>
      </div>
      <p className="sec-sub" data-i18n="t2Desc">Online forms ask for “photo under 50 KB” and reject everything else — set the target KB here and get a photo that fits exactly.</p>
      <div className="card">
        <div className="field">
          <label className="fl" data-i18n="ppModeSwitchLabel">
            Mode
          </label>
          <div className="chips" id="kbModeSwitch">
            <button type="button" className="chip saf" data-v="single" aria-pressed="true" data-i18n="kbModeSingle">
              Single photo
            </button>
            <button type="button" className="chip" data-v="bulk" aria-pressed="false" data-i18n="kbModeBulk">
              Many photos
            </button>
          </div>
        </div>
        <div id="kbSinglePanel">
        <div className="grid2">
          <div>
            <div
              className="drop"
              id="kbDrop"
              tabIndex={0}
              role="button"
              data-i18n-aria="ariaKbDrop" aria-label="Upload photo to resize in KB"
            >
              <div className="big" data-i18n="kbDropBig">
                🗜️ Upload a photo
              </div>
              <p data-i18n="kbDropSub">A photo or a signature — both work</p>
              <input type="file" id="kbFile" accept="image/*" />
            </div>
            <div className="fname" id="kbName" />
            <div className="field" style={{ marginTop: 16 }}>
              <label className="fl" data-i18n="kbTargetLabel">Target size (KB)</label>
              <div className="num2" style={{ gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <input type="number" id="kbTargetNum" min={1} max={20000} defaultValue={50} style={{ width: 90 }} />
                <select id="kbTargetUnit" className="sel" style={{ width: "auto", minWidth: 80 }}>
                  <option value="kb" data-i18n="kbUnitKB">KB</option>
                  <option value="mb" data-i18n="kbUnitMB">MB</option>
                </select>
              </div>
              <select id="kbPresets" className="sel" style={{ marginTop: 8 }} defaultValue="50:kb">
                <option value="" disabled data-i18n="kbPresetCustom">Custom size</option>
                <option value="20:kb">20 KB</option>
                <option value="50:kb">50 KB</option>
                <option value="100:kb">100 KB</option>
                <option value="200:kb">200 KB</option>
                <option value="1:mb">1 MB</option>
                <option value="2:mb">2 MB</option>
                <option value="5:mb">5 MB</option>
              </select>
            </div>
            <div className="field">
              <label className="fl" data-i18n="kbFormatLabel">
                Output format
              </label>
              <select id="kbFormat" className="sel" data-i18n-aria="ariaOutFormat" aria-label="Output format">
                <option value="jpg" data-i18n="kbFmtJPG">JPG</option>
                <option value="png" data-i18n="kbFmtPNG">PNG</option>
                <option value="webp" data-i18n="kbFmtWebP">WebP</option>
              </select>
              <p className="hint" style={{ marginTop: 4 }} data-i18n="kbFormatHint">JPG & WebP fit the target by quality. PNG fits by reducing dimensions.</p>
            </div>
            <div className="field">
              <label className="fl" data-i18n="kbModeLabel">
                Size rule — some forms give a range, not just a limit
              </label>
              <select id="kbMode" className="sel" defaultValue="exact">
                <option value="exact" data-i18n="kbModeExact">Exact size</option>
                <option value="under" data-i18n="kbModeUnder">Under the size</option>
                <option value="atleast" data-i18n="kbModeAtLeast">At least the size</option>
                <option value="between" data-i18n="kbModeBetween">Between two sizes</option>
              </select>
              <div className="num2" id="kbMaxRow" style={{ display: "none", marginTop: 8 }}>
                <label className="fl" htmlFor="kbMax" style={{ margin: 0 }} data-i18n="kbMaxLabel">Maximum size (KB)</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="number" id="kbMaxNum" min={1} max={20000} defaultValue={100} style={{ width: 90 }} />
                  <select id="kbMaxUnit" className="sel" style={{ width: "auto", minWidth: 80 }}>
                    <option value="kb" data-i18n="kbUnitKB">KB</option>
                    <option value="mb" data-i18n="kbUnitMB">MB</option>
                  </select>
                </div>
              </div>
              <p className="hint" id="kbBetweenNote" style={{ marginTop: 4 }} />
              <p className="hint" style={{ marginTop: 4 }} id="kbModeHint" data-i18n="kbHintExact">The downloaded photo will be exactly the size you chose — a smaller photo is padded up inside the file, a bigger one is compressed down. The photo itself does not change.</p>
            </div>
            <div className="field">
              <label className="fl" htmlFor="kbDim" data-i18n="kbDimLabel">
                Pixel size the form wants (optional) — e.g. 200 × 230
              </label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="number" id="kbW" min={10} placeholder="Width px" data-i18n-ph="kbWPh" />
                <span aria-hidden="true">×</span>
                <input type="number" id="kbH" min={10} placeholder="Height px" data-i18n-ph="kbHPh" />
              </div>
            </div>
            <p className="hint" id="kbDimNote" style={{ marginTop: 4 }} />
            <div className="msg" id="kbMsg" />
          </div>
          <div>
            <div className="preview show" id="kbPreview">
              <img id="kbImg" alt="Resized photo preview" />
              <div className="stat" id="kbStat" />
              <p className="hint" id="kbPngNote" style={{ display: "none", marginTop: 8 }} data-i18n="kbPngNote" />
              <div className="btnrow" style={{ marginTop: 10 }}>
                <button type="button" className="btn primary" id="kbGo" data-i18n="kbGoBtn">
                  Resize photo
                </button>
                <a
                  className="btn"
                  id="kbDownload"
                  href="#"
                  download
                  style={{ opacity: 0.5, pointerEvents: "none" }}
                  data-i18n="kbDownloadBtn"
                >
                  ⬇ Download photo
                </a>
              </div>
            </div>
            <p className="hint" data-i18n="kbHint">How it works: pick a size rule above. Under keeps the photo below the target; At least raises it to the target; Between keeps it between the two sizes. Large photos are reduced in dimensions first, automatically.</p>
          </div>
        </div>
          </div>
        <div id="kbBulkPanel" style={{ display: "none" }}>
          <h3 data-i18n="kbBatchTitle">Bulk Resize — many photos at once</h3>
          <div className="drop" id="kbBatchDrop" tabIndex={0} role="button" data-i18n-aria="ariaKbBatchDrop" aria-label="Drop many photos">
            <div className="big" data-i18n="kbBatchDrop">
              👥 Drop many photos here
            </div>
            <input type="file" id="kbBatchFile" accept="image/*" multiple />
          </div>
          <div className="fname" id="kbBatchCount" />
          <div className="field" style={{ marginTop: 16 }}>
            <label className="fl" data-i18n="kbTargetSetting">Target settings for all</label>
            <div className="num2" style={{ gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <input type="number" id="kbBTargetNum" min={1} max={20000} defaultValue={50} style={{ width: 90 }} />
              <select id="kbBTargetUnit" className="sel" style={{ width: "auto", minWidth: 80 }}>
                <option value="kb" data-i18n="kbUnitKB">KB</option>
                <option value="mb" data-i18n="kbUnitMB">MB</option>
              </select>
            </div>
            <select id="kbBPresets" className="sel" style={{ marginTop: 8 }} defaultValue="50:kb">
              <option value="" disabled data-i18n="kbPresetCustom">Custom size</option>
              <option value="20:kb">20 KB</option>
              <option value="50:kb">50 KB</option>
              <option value="100:kb">100 KB</option>
              <option value="200:kb">200 KB</option>
              <option value="1:mb">1 MB</option>
              <option value="2:mb">2 MB</option>
              <option value="5:mb">5 MB</option>
            </select>
          </div>
          <div className="field">
            <label className="fl" data-i18n="kbFormatLabel">
              Output format
            </label>
            <select id="kbBFormat" className="sel" data-i18n-aria="ariaOutFormat" aria-label="Output format">
              <option value="jpg" data-i18n="kbFmtJPG">JPG</option>
              <option value="png" data-i18n="kbFmtPNG">PNG</option>
              <option value="webp" data-i18n="kbFmtWebP">WebP</option>
            </select>
          </div>
          <div className="field">
            <label className="fl" data-i18n="kbModeLabel">Size rule — some forms give a range, not just a limit</label>
            <select id="kbBMode" className="sel" defaultValue="exact">
              <option value="exact" data-i18n="kbModeExact">Exact size</option>
              <option value="under" data-i18n="kbModeUnder">Under the size</option>
              <option value="atleast" data-i18n="kbModeAtLeast">At least the size</option>
              <option value="between" data-i18n="kbModeBetween">Between two sizes</option>
            </select>
            <div className="num2" id="kbBMaxRow" style={{ display: "none", marginTop: 8 }}>
              <label className="fl" htmlFor="kbBMaxNum" style={{ margin: 0 }} data-i18n="kbMaxLabel">Maximum size (KB)</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="number" id="kbBMaxNum" min={1} max={20000} defaultValue={100} style={{ width: 90 }} />
                <select id="kbBMaxUnit" className="sel" style={{ width: "auto", minWidth: 80 }}>
                  <option value="kb" data-i18n="kbUnitKB">KB</option>
                  <option value="mb" data-i18n="kbUnitMB">MB</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="fl" htmlFor="kbBW" data-i18n="kbDimLabel">Pixel size the form wants (optional) — e.g. 200 × 230</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="number" id="kbBW" min={10} placeholder="Width px" data-i18n-ph="kbWPh" />
              <span aria-hidden="true">×</span>
              <input type="number" id="kbBH" min={10} placeholder="Height px" data-i18n-ph="kbHPh" />
            </div>
          </div>
          <div className="btnrow" style={{ marginTop: 10 }}>
            <button type="button" className="btn primary" id="kbBatchGo" data-i18n="kbBatchGo">
              Resize all photos
            </button>
            <a
              className="btn"
              id="kbBatchZip"
              href="#"
              download
              style={{ display: "none" }}
              data-i18n="kbDownloadAll"
            >
              ⬇ Download all as ZIP
            </a>
          </div>
          <div className="msg" id="kbBatchMsg" />
          <div className="stat" id="kbBatchProgress" />
          <h4 data-i18n="kbResultGrid" style={{ marginTop: 14 }}>
            Results
          </h4>
          <div id="kbBatchResults" />
        </div>
        
      </div>
    </section>
  );
}