export function PassportTool() {
  return (
    <section id="passport">
      <div className="sec-head">
        <span className="no">Tool 1</span>
        <h2 data-i18n="t1Title">Passport Photo Sheet Maker</h2>
      </div>
      <p className="sec-sub" data-i18n="t1Desc">
        Ek photo upload karo, print-ready sheet download karo — 300 DPI, sahi passport size (35 ×
        45 mm). Cafe mein sabse zyada chalne wala tool.
      </p>
      <div className="card">
        <div className="grid2">
          <div>
            <div
              className="drop"
              id="ppDrop"
              tabIndex={0}
              role="button"
              aria-label="Upload photo for passport sheet"
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
              <div className="chips" id="ppPaper">
                <button
                  type="button"
                  className="chip"
                  data-v="4x6"
                  aria-pressed="true"
                  data-i18n="ppPaper4x6"
                >
                  4 × 6 inch (photo paper)
                </button>
                <button type="button" className="chip" data-v="a4" aria-pressed="false">
                  A4
                </button>
              </div>
            </div>
            <div className="field">
              <label className="fl" data-i18n="ppCopiesLabel">
                How many copies?
              </label>
              <div className="chips" id="ppCopies">
                <button type="button" className="chip" data-v="4" aria-pressed="false">
                  4
                </button>
                <button type="button" className="chip" data-v="6" aria-pressed="false">
                  6
                </button>
                <button
                  type="button"
                  className="chip saf"
                  data-v="8"
                  aria-pressed="true"
                >
                  8
                </button>
                <button type="button" className="chip" data-v="12" aria-pressed="false">
                  12
                </button>
                <button
                  type="button"
                  className="chip"
                  data-v="30"
                  aria-pressed="false"
                  data-i18n="ppCopies30"
                >
                  30 (A4 full)
                </button>
              </div>
            </div>
            <div className="field">
              <label className="fl" data-i18n="ppPresetLabel">
                Photo size
              </label>
              <div className="chips" id="ppPreset">
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
              <div className="num2" id="ppCustomRow" style={{ display: "none", marginTop: 8 }}>
                <input
                  type="number"
                  id="ppCW"
                  min={10}
                  max={100}
                  defaultValue={35}
                  aria-label="Custom width mm"
                />
                <span aria-hidden="true">×</span>
                <input
                  type="number"
                  id="ppCH"
                  min={10}
                  max={120}
                  defaultValue={45}
                  aria-label="Custom height mm"
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
                Guides, background &amp; name label
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
                  aria-pressed="false"
                  data-i18n="ppLabels"
                >
                  Name under photo
                </button>
                <input type="color" id="ppBg" defaultValue="#ffffff" aria-label="Background colour" />
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
            <div className="btnrow">
              <button className="btn saf" id="ppDownload" disabled data-i18n="ppDownload">
                ⬇ Sheet download karo (JPG, 300 DPI)
              </button>
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
                <span>Photo upload karte hi sheet yahan banegi</span>
              </div>
            </div>
            <p className="hint" data-i18n="ppPrintHint">
              When printing, choose “Actual size / 100%” in the printer settings — not “Fit to
              page”, or the size will change. A light outline on each photo makes cutting easier.
            </p>
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
        <h2 data-i18n="t2Title">Photo Resize — Exact KB Mein</h2>
      </div>
      <p className="sec-sub" data-i18n="t2Desc">
        Online form “photo 50 KB se kam” maangta hai aur photo reject ho jati hai — yahan target KB
        set karo, photo bilkul usi size ke andar bankar milegi.
      </p>
      <div className="card">
        <div className="grid2">
          <div>
            <div
              className="drop"
              id="kbDrop"
              tabIndex={0}
              role="button"
              aria-label="Upload photo to resize in KB"
            >
              <div className="big" data-i18n="kbDropBig">
                🗜️ Upload a photo
              </div>
              <p data-i18n="kbDropSub">A photo or a signature — both work</p>
              <input type="file" id="kbFile" accept="image/*" />
            </div>
            <div className="fname" id="kbName" />
            <div className="field" style={{ marginTop: 16 }}>
              <label className="fl" data-i18n="kbTargetLabel">
                Target size (KB)
              </label>
              <div className="chips" id="kbPresets">
                <button type="button" className="chip" data-v="20" aria-pressed="false">
                  20 KB
                </button>
                <button type="button" className="chip saf" data-v="50" aria-pressed="true">
                  50 KB
                </button>
                <button type="button" className="chip" data-v="100" aria-pressed="false">
                  100 KB
                </button>
                <button type="button" className="chip" data-v="200" aria-pressed="false">
                  200 KB
                </button>
              </div>
            </div>
            <div className="field">
              <label className="fl" htmlFor="kbCustom" data-i18n="kbCustomLabel">
                Or type your own size (KB)
              </label>
              <input type="number" id="kbCustom" min={5} max={2000} placeholder="e.g. 40" />
            </div>
            <div className="field">
              <label className="fl" data-i18n="kbModeLabel">
                Size rule — some forms give a range, not just a limit
              </label>
              <div className="chips" id="kbMode">
                <button
                  type="button"
                  className="chip saf"
                  data-v="under"
                  aria-pressed="true"
                  data-i18n="kbModeUnder"
                >
                  Under the size
                </button>
                <button
                  type="button"
                  className="chip"
                  data-v="atleast"
                  aria-pressed="false"
                  data-i18n="kbModeAtLeast"
                >
                  At least the size
                </button>
                <button
                  type="button"
                  className="chip"
                  data-v="between"
                  aria-pressed="false"
                  data-i18n="kbModeBetween"
                >
                  Between two sizes
                </button>
              </div>
              <div className="num2" id="kbMaxRow" style={{ display: "none", marginTop: 8 }}>
                <label className="fl" htmlFor="kbMax" style={{ margin: 0 }} data-i18n="kbMaxLabel">
                  Maximum size (KB)
                </label>
                <input type="number" id="kbMax" min={10} max={4000} defaultValue={100} />
              </div>
              <p className="hint" style={{ marginTop: 4 }} data-i18n="kbModeHint">
                “At least” first raises quality, then adds harmless padding inside the JPG file —
                the photo itself does not change.
              </p>
            </div>
            <div className="field">
              <label className="fl" htmlFor="kbDim" data-i18n="kbDimLabel">
                Pixel size the form wants (optional) — e.g. 200 × 230
              </label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="number" id="kbW" min={10} placeholder="Width px" />
                <span aria-hidden="true">×</span>
                <input type="number" id="kbH" min={10} placeholder="Height px" />
              </div>
            </div>
            <div className="btnrow">
              <button className="btn" id="kbGo" disabled data-i18n="kbGo">
                Resize karo
              </button>
              <a
                className="btn saf"
                id="kbDownload"
                style={{ display: "none" }}
                download="resized-photo.jpg"
              >
                ⬇ Download
              </a>
            </div>
            <div className="msg" id="kbMsg" />
          </div>
          <div>
            <div className="preview" id="kbPreview">
              <img id="kbImg" alt="Resized photo preview" />
              <div className="stat" id="kbStat" />
            </div>
            <p className="hint" data-i18n="kbHint">
              How it works: the tool adjusts quality step by step to land as close as possible to
              the target — but always under it. If the photo is very large, its dimensions are
              reduced first, automatically.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
