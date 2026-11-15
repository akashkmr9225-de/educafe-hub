export function ConverterCard() {
  return (
    <div className="card" id="converter" style={{ scrollMarginTop: 20 }}>
      <h3 data-i18n="convTitle">🔄 File Converter — JPG · PNG · WebP</h3>
      <p className="hint" data-i18n="convDesc">
        Convert a photo or image to another format right here in the browser — the quick version
        of what Filee does on the desktop, for the three formats forms ask for most. Nothing is
        uploaded.
      </p>
      <div
        className="drop"
        id="fcDrop"
        tabIndex={0}
        role="button"
        data-i18n-aria="ariaFcDrop" aria-label="Upload image to convert"
        style={{ marginTop: 12 }}
      >
        <div className="big" data-i18n="convDropBig">
          🖼️ Drop an image here or click to choose
        </div>
        <input type="file" id="fcFile" accept="image/*" />
      </div>
      <div className="fname" id="fcName" />
      <div className="field" style={{ marginTop: 14 }}>
        <label className="fl" data-i18n="convFmtLabel">
          Convert to
        </label>
        <div className="chips" id="fcFmt">
          <button type="button" className="chip saf" data-v="image/jpeg" aria-pressed="true">
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
      <div className="btnrow">
        <button className="btn" id="fcGo" disabled data-i18n="convBtn">
          Convert now
        </button>
        <a className="btn saf" id="fcDownload" style={{ display: "none" }} data-i18n="dlDownload">
          ⬇ Download
        </a>
      </div>
      <div className="msg" id="fcMsg" />
      <div className="preview" id="fcPreview">
        <img id="fcImg" alt="Converted image preview" />
        <div className="stat" id="fcStat" />
      </div>
      <p className="hint" data-i18n="convNote">
        JPG is smallest for photos; PNG keeps sharp edges and transparency; WebP is best for
        websites.
      </p>
    </div>
  );
}

export function FileToolsSection() {
  return (
    <section id="filetools">
      <div className="sec-head">
        <span className="no">File</span>
        <h2 data-i18n="ftTitle">File Tools — PDF, Image & Text (Filee style)</h2>
      </div>
      <p className="sec-sub" data-i18n="ftDesc">Browser file tools like the open-source Filee — PDF split/merge, image resize, format convert, rotate/flip and text tools. Everything runs in your browser; nothing is uploaded.</p>
      <div className="grid2" style={{ marginBottom: 18 }}>
        <ConverterCard />
        <div className="card">
          <h3 data-i18n="fileeTitle">💻 Filee — the free desktop app for heavy files</h3>
          <p style={{ color: "var(--ink2)", fontSize: 14.5 }} data-i18n="fileeDesc">
            Filee is a free, open-source desktop app (Windows / Mac / Linux) that converts 260+
            file formats — Word, Excel, video, audio, e-books, HEIC photos — fully offline, with no
            uploads. A desktop app cannot run inside a website, so use Filee alongside this hub:
          </p>
          <ul style={{ margin: "8px 0 0", paddingLeft: 20, color: "var(--ink2)", fontSize: 14.5 }}>
            <li data-i18n="filee1">
              Install Filee once on the cafe / school PC — search “Filee” on GitHub and download it
              from its official open-source repository.
            </li>
            <li data-i18n="filee2">
              Use the converter on this page for quick JPG / PNG / WebP jobs in the browser.
            </li>
            <li data-i18n="filee3">
              Use Filee at the counter for the big jobs a browser cannot do — DOCX → PDF, video
              files, HEIC photos from phones.
            </li>
          </ul>
          <p className="hint" data-i18n="fileeNote">
            Both stay free and private: files are converted on your own computer and are never
            uploaded anywhere.
          </p>
        </div>
      </div>
      <div className="grid2">
        <div className="card">
          <h3 data-i18n="ftPdfTitle">📄 PDF Split & Merge</h3>
          <p className="hint" data-i18n="ftPdfDesc">Split: make a new PDF from selected pages of one PDF. Merge: join 2 or more PDFs into one (pages are rendered as images).</p>
          <div className="field">
            <label className="fl" data-i18n="ftSplitLabel">Split — choose a PDF</label>
            <div className="drop" id="fsDrop" tabIndex={0} role="button">
              <div className="big" data-i18n="ftFsDropBig">📄 Drop a PDF or click</div>
              <input type="file" id="fsFile" accept="application/pdf,.pdf" />
            </div>
            <div className="fname" id="fsName" />
          </div>
          <div className="field">
            <label className="fl" htmlFor="fsPages" data-i18n="ftPagesLabel">Pages (e.g. 1,3,5-7) — blank = all</label>
            <input type="text" id="fsPages" placeholder="1,3,5-7" />
          </div>
          <div className="btnrow">
            <button className="btn" id="fsGo" disabled data-i18n="ftSplitBtn">Make split PDF</button>
          </div>
          <div className="msg" id="fsMsg" />
          <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "18px 0" }} />
          <div className="field">
            <label className="fl" data-i18n="ftMergeLabel">Merge — choose 2+ PDFs</label>
            <div className="drop" id="fmDrop" tabIndex={0} role="button">
              <div className="big" data-i18n="ftFmDropBig">📚 Drop PDFs or click</div>
              <input type="file" id="fmFiles" accept="application/pdf,.pdf" multiple />
            </div>
            <div className="fname" id="fmName" />
          </div>
          <div className="btnrow">
            <button className="btn saf" id="fmGo" disabled data-i18n="ftMergeBtn">Merge into one PDF</button>
          </div>
          <div className="msg" id="fmMsg" />
        </div>
        <div className="card">
          <h3 data-i18n="ftImgTitle">🖼️ Image Resize, Convert, Rotate</h3>
          <div className="drop" id="fiDrop" tabIndex={0} role="button">
            <div className="big" data-i18n="ftFiDropBig">🖼️ Drop an image or click</div>
            <input type="file" id="fiFile" accept="image/*" />
          </div>
          <div className="fname" id="fiName" />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <div className="field" style={{ flex: 1 }}>
              <label className="fl" htmlFor="fiW" data-i18n="ftFiW">
                Width px
              </label>
              <input type="number" id="fiW" min={1} placeholder="800" />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="fl" htmlFor="fiH" data-i18n="ftFiH">
                Height px
              </label>
              <input type="number" id="fiH" min={1} placeholder="600" />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="fl" htmlFor="fiPct" data-i18n="ftFiPct">
                % scale
              </label>
              <input type="number" id="fiPct" min={1} max={400} placeholder="50" />
            </div>
          </div>
          <div className="field">
            <label className="fl" data-i18n="ftFmtLabel">
              Format
            </label>
            <div className="chips" id="fiFmt">
              <button type="button" className="chip saf" data-v="image/jpeg" aria-pressed="true">
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
          <div className="btnrow">
            <button className="btn ghost small" id="fiRotL" type="button" data-i18n="ftRotL">
              ⟲ 90° Left
            </button>
            <button className="btn ghost small" id="fiRotR" type="button" data-i18n="ftRotR">
              ⟳ 90° Right
            </button>
            <button className="btn ghost small" id="fiFlipH" type="button" data-i18n="ftFlipH">
              ↔ Flip H
            </button>
            <button className="btn ghost small" id="fiFlipV" type="button" data-i18n="ftFlipV">
              ↕ Flip V
            </button>
          </div>
          <div className="btnrow">
            <button className="btn" id="fiGo" disabled data-i18n="ftApplyBtn">Apply & Preview</button>
            <a className="btn saf" id="fiDownload" style={{ display: "none" }} data-i18n="ftDlBtn">
              ⬇ Download
            </a>
          </div>
          <div className="msg" id="fiMsg" />
          <div className="preview" id="fiPreview">
            <img id="fiImg" alt="Edited image preview" />
            <div className="stat" id="fiStat" />
          </div>
        </div>
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <h3 data-i18n="ftTextTitle">🔤 Text Tools — Counter, Case, Remove Duplicates</h3>
        <div className="field" style={{ marginTop: 10 }}>
          <label className="fl" htmlFor="ftText" data-i18n="ftTextLabel">Paste your text here</label>
          <textarea className="ta" id="ftText" placeholder="Type or paste text here…" data-i18n-ph="ftTextPh" />
        </div>
        <div className="stat" id="ftStat">
          <span data-i18n="ftWordsZ">Words: 0</span>
          <span data-i18n="ftCharsZ">Characters: 0</span>
          <span data-i18n="ftLinesZ">Lines: 0</span>
        </div>
        <div className="btnrow">
          <button className="btn ghost small" id="ftUpper" type="button" data-i18n="ftUpper">
            UPPERCASE
          </button>
          <button className="btn ghost small" id="ftLower" type="button" data-i18n="ftLower">
            lowercase
          </button>
          <button className="btn ghost small" id="ftTitle" type="button" data-i18n="ftTitleCase">
            Title Case
          </button>
          <button className="btn ghost small" id="ftDedup" type="button" data-i18n="ftDedupBtn">Remove duplicate lines</button>
          <button className="btn ghost small" id="ftCopy" type="button" data-i18n="ftCopyBtn">
            Copy text
          </button>
        </div>
        <div className="msg" id="ftMsg" />
      </div>
    </section>
  );
}
