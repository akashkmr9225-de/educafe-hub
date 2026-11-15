const DIRECTORY_ATTRS: Record<string, string> = { webkitdirectory: "", directory: "" };

export function BulkTool() {
  return (
    <section id="bulk">
      <div className="sec-head">
        <span className="no">Tool 11</span>
        <h2 data-i18n="bkTitle">Bulk Student Photos — a whole class at once</h2>
      </div>
      <p className="sec-sub" data-i18n="bkDesc">Add a whole class's photos together — a folder works too, and so do iPhone HEIC photos. Each photo can print with its name (and a date) underneath, as A4 sheets or as one separate file per student — the Photo FIX way, right here in the browser.</p>
      <div className="card">
        <div className="grid2">
          <div>
            <div className="drop" id="bkDrop" tabIndex={0} role="button" data-i18n-aria="ariaBkDrop" aria-label="Upload many photos">
              <div className="big" data-i18n="bkDropBig">
                👥 Drop many photos here or click to choose
              </div>
              <p data-i18n="bkDropSub">JPG / PNG / HEIC — the file name becomes the student's name (you can change it). Photos auto-rotate.</p>
              <input type="file" id="bkFiles" accept="image/*,.heic,.heif" multiple />
            </div>
            <div className="btnrow" style={{ marginTop: 10 }}>
              <button type="button" className="btn ghost small" id="bkFolderBtn" data-i18n="bkFolderBtn">
                📁 Choose a whole folder
              </button>
              <input
                type="file"
                id="bkFolder"
                multiple
                style={{ display: "none" }}
                {...DIRECTORY_ATTRS}
              />
              <button
                type="button"
                className="btn ghost small"
                id="bkClear"
                style={{ display: "none" }}
                data-i18n="bkClearBtn"
              >
                Remove all photos
              </button>
            </div>
            <div className="fname" id="bkName" />
            <div className="field" style={{ marginTop: 16 }}>
              <label className="fl" data-i18n="bkPresetLabel">
                Photo size
              </label>
              <div className="chips" id="bkPreset">
                <button
                  type="button"
                  className="chip saf"
                  data-v="35x45"
                  aria-pressed="true"
                  data-i18n="ppPresetPassport"
                >
                  Passport — 35 × 45 mm
                </button>
                <button
                  type="button"
                  className="chip"
                  data-v="51x51"
                  aria-pressed="false"
                  data-i18n="ppPresetPan"
                >
                  PAN / OCI — 51 × 51 mm
                </button>
                <button
                  type="button"
                  className="chip"
                  data-v="50.8x50.8"
                  aria-pressed="false"
                  data-i18n="ppPresetUs"
                >
                  US — 2 × 2 inch
                </button>
                <button
                  type="button"
                  className="chip"
                  data-v="custom"
                  aria-pressed="false"
                  data-i18n="ppPresetCustom"
                >
                  Custom
                </button>
              </div>
              <div className="num2" id="bkCustomRow" style={{ display: "none", marginTop: 8 }}>
                <input
                  type="number"
                  id="bkCW"
                  min={10}
                  max={100}
                  defaultValue={35}
                  data-i18n-aria="ariaCustomW" aria-label="Custom width mm"
                />
                <span aria-hidden="true">×</span>
                <input
                  type="number"
                  id="bkCH"
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
              <label className="fl" data-i18n="bkDpiLabel">
                Print quality (DPI)
              </label>
              <div className="chips" id="bkDpi">
                <button type="button" className="chip saf" data-v="300" aria-pressed="true">
                  300 DPI
                </button>
                <button type="button" className="chip" data-v="450" aria-pressed="false">
                  450 DPI
                </button>
                <button type="button" className="chip" data-v="600" aria-pressed="false">
                  600 DPI
                </button>
              </div>
            </div>
            <div className="field">
              <label className="fl" data-i18n="ppModeLabel">
                How the photo fills its box
              </label>
              <div className="chips" id="bkMode">
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
              <label className="fl" data-i18n="bkSpaceLabel">
                Sheet spacing (mm)
              </label>
              <div className="num2">
                <span className="hint" style={{ margin: 0 }} data-i18n="bkGapL">
                  Cutting gap
                </span>
                <input type="number" id="bkGap" min={0} max={10} step="0.5" defaultValue={3} />
                <span className="hint" style={{ margin: 0 }} data-i18n="bkMarginL">
                  Outer margin
                </span>
                <input type="number" id="bkMargin" min={0} max={15} step="0.5" defaultValue={5} />
              </div>
            </div>
            <div className="field">
              <label className="fl" data-i18n="bkNameDateLabel">Name & date under each photo</label>
              <div className="num2">
                <button
                  type="button"
                  className="chip"
                  id="bkLabels"
                  aria-pressed="true"
                  data-i18n="bkNameOn"
                >
                  Name below photo
                </button>
                <button
                  type="button"
                  className="chip"
                  id="bkDateOn"
                  aria-pressed="false"
                  data-i18n="bkDateOn"
                >
                  Date below photo
                </button>
                <button
                  type="button"
                  className="chip"
                  id="bkGuides"
                  aria-pressed="true"
                  data-i18n="ppGuides"
                >
                  Cutting guides
                </button>
                <input type="color" id="bkBg" defaultValue="#ffffff" data-i18n-aria="ariaBg" aria-label="Background colour" />
              </div>
              <div className="num2" style={{ marginTop: 8 }}>
                <span className="hint" style={{ margin: 0 }} data-i18n="bkDateAllL">
                  Common date (change it per photo in its thumbnail below)
                </span>
                <input type="date" id="bkDate" />
              </div>
              <div className="num2" style={{ marginTop: 8 }}>
                <select id="bkDateFmt" data-i18n-aria="ariaDateFmt" aria-label="Date format">
                  <option value="dmy">DD/MM/YYYY</option>
                  <option value="dmy-">DD-MM-YYYY</option>
                  <option value="mdy">MM/DD/YYYY</option>
                  <option value="dmon">12 Mar 2025</option>
                  <option value="dmonf">12 March 2025</option>
                  <option value="ymd">YYYY-MM-DD</option>
                </select>
                <input
                  type="text"
                  className="nm"
                  id="bkDatePrefix"
                  placeholder="Prefix — e.g. Date: / DOB:"
                  data-i18n-ph="bkDatePrefixPh"
                />
              </div>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 17 }} data-i18n="bkGenT">Generate & download</h3>
            <div className="btnrow">
              <button className="btn" id="bkGenerate" disabled data-i18n="bkGenBtn">
                Make A4 sheets
              </button>
              <button
                className="btn ghost small"
                id="bkPdf"
                style={{ display: "none" }}
                data-i18n="bkPdfBtn"
              >
                ⬇ All sheets as PDF
              </button>
              <button
                className="btn ghost small"
                id="bkZip"
                style={{ display: "none" }}
                data-i18n="bkZipBtn"
              >
                ⬇ Sheets as ZIP
              </button>
            </div>
            <div className="stat" id="bkLayout">
              <span data-i18n="bkLayoutWait">
                Layout: the photos-per-sheet count appears here once you add photos
              </span>
            </div>
            <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "18px 0" }} />
            <div className="field">
              <label className="fl" data-i18n="bkIndFmtLabel">Each student's separate file — format</label>
              <div className="chips" id="bkIndFmt">
                <button
                  type="button"
                  className="chip saf"
                  data-v="orig"
                  aria-pressed="true"
                  data-i18n="bkFmtOrig"
                >
                  Original format
                </button>
                <button type="button" className="chip" data-v="image/jpeg" aria-pressed="false">
                  JPG
                </button>
                <button type="button" className="chip" data-v="image/png" aria-pressed="false">
                  PNG
                </button>
                <button type="button" className="chip" data-v="image/webp" aria-pressed="false">
                  WebP
                </button>
              </div>
            </div>
            <div className="field">
              <label className="fl" data-i18n="bkStripLabel">
                What goes in the file?
              </label>
              <div className="chips" id="bkStrip">
                <button
                  type="button"
                  className="chip"
                  data-v="photo"
                  aria-pressed="false"
                  data-i18n="bkStripPhoto"
                >
                  Photo only
                </button>
                <button
                  type="button"
                  className="chip saf"
                  data-v="strip"
                  aria-pressed="true"
                  data-i18n="bkStripStrip"
                >
                  With name/date strip
                </button>
              </div>
            </div>
            <div className="field">
              <label className="fl" data-i18n="bkSizeRuleLabel">
                File size rule (works best on JPG)
              </label>
              <div className="num2">
                <select id="bkSzMode" data-i18n-aria="ariaSzMode" aria-label="Size rule">
                  <option value="none" data-i18n="bkSzNone">
                    No limit — best quality
                  </option>
                  <option value="under" data-i18n="bkSzUnder">
                    Under (smaller than)
                  </option>
                  <option value="atleast" data-i18n="bkSzAtLeast">
                    At least (bigger than)
                  </option>
                  <option value="between" data-i18n="bkSzBetween">
                    Between (min and max)
                  </option>
                </select>
                <input type="number" id="bkSz1" min={1} defaultValue={50} data-i18n-aria="ariaSz1" aria-label="Size value 1" />
                <input
                  type="number"
                  id="bkSz2"
                  min={1}
                  defaultValue={100}
                  data-i18n-aria="ariaSz2" aria-label="Size value 2"
                  style={{ display: "none" }}
                />
                <select id="bkSzUnit" data-i18n-aria="ariaSzUnit" aria-label="Size unit">
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
                </select>
              </div>
            </div>
            <div className="btnrow">
              <button className="btn saf" id="bkIndBtn" disabled data-i18n="bkIndBtn">
                ⬇ Download all photos (ZIP)
              </button>
            </div>
            <div className="msg" id="bkMsg" />
            <p className="hint" data-i18n="bkHint">
              Each file keeps its original name and is made at the exact preset size. To download
              just one photo, tap ⬇ on its thumbnail.
            </p>
          </div>
        </div>
        <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "20px 0" }} />
        <h3 style={{ fontSize: 17 }} data-i18n="bkMoreT">Template, Excel names & AI portraits</h3>
        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <div className="field">
              <label className="fl" data-i18n="bkLayoutModeL">
                Layout mode
              </label>
              <div className="chips" id="bkLayoutMode">
                <button
                  type="button"
                  className="chip saf"
                  data-v="grid"
                  aria-pressed="true"
                  data-i18n="bkModeGrid"
                >
                  Standard A4 grid
                </button>
                <button
                  type="button"
                  className="chip"
                  data-v="psd"
                  aria-pressed="false"
                  data-i18n="bkModePsd"
                >
                  Custom PSD template
                </button>
              </div>
            </div>
            <div id="bkPsdBox" hidden>
              <div className="drop" id="bkPsdDrop" tabIndex={0} role="button" data-i18n-aria="ariaBkPsd" aria-label="Upload PSD template">
                <div className="big" data-i18n="psdDropBig">
                  🗂 Drop a .psd template or click to choose
                </div>
                <p data-i18n="psdDropSub">Name the placeholder layers “photo”, “slot1”, “photo2”… — any layer whose name contains photo, slot or placeholder becomes a photo slot; layers named name or label receive the student's name (and date, if on).</p>
                <input type="file" id="bkPsdFile" accept=".psd" />
              </div>
              <div className="fname" id="bkPsdName" />
              <div className="stat" id="bkPsdStat" />
            </div>
            <div className="field" style={{ marginTop: 16 }}>
              <label className="fl" data-i18n="xlTitle">Names & Excel match — auto-rename</label>
              <p className="hint" style={{ marginTop: 0 }} data-i18n="xlDesc">
                Upload the class list (Excel or CSV) with the correct full names in one column.
                Photos with short or incomplete names are matched and renamed automatically; close
                matches are shown for you to confirm — nothing is renamed silently.
              </p>
              <div className="drop" id="bkXlDrop" tabIndex={0} role="button" data-i18n-aria="ariaBkXl" aria-label="Upload Excel or CSV name list">
                <div className="big" data-i18n="xlDropBig">
                  📄 Drop the Excel / CSV list or click to choose
                </div>
                <input type="file" id="bkXlFile" accept=".xlsx,.xls,.csv" />
              </div>
              <div className="fname" id="bkXlName" />
            </div>
            <div id="bkXlBox" hidden>
              <div className="field">
                <label className="fl" htmlFor="bkXlSheet" data-i18n="xlSheetL">
                  Sheet
                </label>
                <select id="bkXlSheet" />
              </div>
              <div className="field">
                <label className="fl" htmlFor="bkXlCol" data-i18n="xlColL">
                  Column with the full names
                </label>
                <select id="bkXlCol" />
              </div>
              <div className="num2">
                <button type="button" className="chip" id="bkXlHeader" aria-pressed="true" data-i18n="xlHeader">
                  First row is a heading
                </button>
                <button type="button" className="chip" id="bkKeepNums" aria-pressed="true" data-i18n="bkKeepNums">
                  Keep the numbers before names (001 Akash)
                </button>
              </div>
              <div className="field" style={{ marginTop: 12 }}>
                <label className="fl" data-i18n="xlStrictL">
                  Matching
                </label>
                <div className="chips" id="bkXlStrict">
                  <button type="button" className="chip" data-v="strict" aria-pressed="false" data-i18n="xlStrict">
                    Strict — only when very sure
                  </button>
                  <button type="button" className="chip saf" data-v="balanced" aria-pressed="true" data-i18n="xlBalanced">
                    Balanced — recommended
                  </button>
                  <button type="button" className="chip" data-v="loose" aria-pressed="false" data-i18n="xlLoose">
                    Loose — match more, check more
                  </button>
                </div>
              </div>
              <div className="btnrow">
                <button className="btn" id="bkXlRun" data-i18n="xlRunBtn">Match & rename</button>
                <button
                  className="btn ghost small"
                  id="bkXlUndo"
                  style={{ display: "none" }}
                  data-i18n="xlUndoBtn"
                >
                  Undo all renaming
                </button>
              </div>
              <div className="stat" id="bkXlStat" />
              <div id="bkMatchList" style={{ marginTop: 10 }} />
            </div>
            <div className="msg" id="bkXlMsg" />
          </div>
          <div>
            <div className="field">
              <label className="fl" data-i18n="aiTitle">
                AI portrait processing — on this device
              </label>
              <p className="hint" style={{ marginTop: 0 }} data-i18n="aiDesc">Removes each student's background and frames a clean portrait, right here in the browser — photos are never sent to a server. The AI engine (model + WASM, about 40 MB) loads only when you press the button below, the first time only.</p>
              <div className="num2">
                <button type="button" className="chip" id="bkAiCrop" aria-pressed="true" data-i18n="aiAutoCrop">
                  Auto-crop empty space above the head
                </button>
                <button type="button" className="chip" id="bkAiPortrait" aria-pressed="true" data-i18n="aiPortrait">
                  Smart portrait framing (preset size)
                </button>
              </div>
            </div>
            <div className="field">
              <label className="fl" htmlFor="bkAiModel" data-i18n="aiModelL">
                AI model
              </label>
              <select id="bkAiModel">
                <option value="isnet_fp16" data-i18n="aiModelHigh">
                  High quality — recommended
                </option>
                <option value="isnet" data-i18n="aiModelBest">
                  Best quality — slowest, biggest download
                </option>
                <option value="isnet_quint8" data-i18n="aiModelFast">
                  Fast — smaller model, rougher edges
                </option>
              </select>
            </div>
            <div className="btnrow">
              <button className="btn" id="bkAiRun" disabled data-i18n="aiRunBtn">Remove backgrounds & create portraits</button>
              <button
                className="btn saf small"
                id="bkAiZip"
                style={{ display: "none" }}
                data-i18n="aiZipBtn"
              >
                ⬇ Download processed PNGs (ZIP)
              </button>
            </div>
            <div className="msg" id="bkAiMsg" />
            <p className="hint" data-i18n="aiNote">
              After processing, the cut-out portraits (on the background colour chosen above)
              replace the photos in the thumbnails, so sheets and separate files use them
              automatically. Check each face once — AI edges can be imperfect.
            </p>
          </div>
        </div>
        <div className="bthumbs" id="bkThumbs" />
        <div className="bsheets" id="bkSheets" />
      </div>
    </section>
  );
}
