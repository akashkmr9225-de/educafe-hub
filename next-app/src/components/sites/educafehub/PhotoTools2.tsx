export function SignatureTool() {
  return (
    <section id="signature">
      <div className="sec-head">
        <span className="no">Tool 3</span>
        <h2 data-i18n="t3Title">Signature Maker</h2>
      </div>
      <p className="sec-sub" data-i18n="t3Desc">Upload a photo of a signature on white paper — the background is cleaned, extra area is cropped, and you download it in form size.</p>
      <div className="card">
        <div className="grid2">
          <div>
            <p className="hint" data-i18n="sgTip" style={{ marginBottom: 10 }}>
              Tip: keep only the signature in the photo, not the paper edges — the crop tightens
              automatically. The output is JPG, so every form portal accepts it.
            </p>
            <div
              className="drop"
              id="sgDrop"
              tabIndex={0}
              role="button"
              data-i18n-aria="ariaSgDrop" aria-label="Upload signature photo"
            >
              <div className="big" data-i18n="sgDropBig">
                ✍️ Upload a photo of the signature
              </div>
              <p data-i18n="sgDropSub">
                Sign in blue/black pen on white paper — keep the photo straight
              </p>
              <input type="file" id="sgFile" accept="image/*" />
            </div>
            <div className="fname" id="sgName" />
            <div className="field" style={{ marginTop: 16 }}>
              <label className="fl">
                <span data-i18n="sgCleanLabel">How clean should the background be?</span>{" "}
                <span id="sgThVal">(medium · 205)</span>
              </label>
              <input type="range" id="sgTh" min={120} max={245} defaultValue={205} />
              <p className="hint" style={{ marginTop: 2 }} data-i18n="sgCleanHint">
                Slider right = whiter background. If light ink disappears, move the slider left.
              </p>
            </div>
            <div className="field">
              <label className="fl" data-i18n="sgOutputLabel">
                Output size
              </label>
              <div className="chips" id="sgSize">
                <button
                  type="button"
                  className="chip saf"
                  data-v="300x120"
                  aria-pressed="true"
                  data-i18n="sgChip300"
                >
                  300 × 120 (common form)
                </button>
                <button type="button" className="chip" data-v="400x160" aria-pressed="false">
                  400 × 160
                </button>
                <button
                  type="button"
                  className="chip"
                  data-v="orig"
                  aria-pressed="false"
                  data-i18n="sgChipOrig"
                >
                  Original (clean only)
                </button>
              </div>
            </div>
            <p className="hint" data-i18n="sgSizeHint" style={{ marginTop: 6 }}>
              Which size? Most exam forms take 300 × 120; some take 400 × 160. Original keeps your
              photo's own size, only cleaned.
            </p>
            <div className="btnrow">
              <button className="btn" id="sgGo" disabled data-i18n="sgGo">
                Make signature
              </button>
              <a
                className="btn saf"
                id="sgDownload"
                data-i18n="dlDownload"
                style={{ display: "none" }}
                download="signature.jpg"
              >
                ⬇ Download
              </a>
            </div>
            <div className="msg" id="sgMsg" />
          </div>
          <div>
            <div className="preview" id="sgPreview">
              <img id="sgImg" alt="Cleaned signature preview" />
              <div className="stat" id="sgStat" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function JoinerTool() {
  return (
    <section id="joiner">
      <div className="sec-head">
        <span className="no">Tool 4</span>
        <h2 data-i18n="t4Title">Photo + Signature Joiner</h2>
      </div>
      <p className="sec-sub" data-i18n="t4Desc">Some forms want photo on top and signature below in a single image. Upload both — one combined image is ready.</p>
      <div className="card">
        <div className="grid2">
          <div>
            <div
              className="drop"
              id="jnPhotoDrop"
              tabIndex={0}
              role="button"
              data-i18n-aria="ariaJnPhoto" aria-label="Upload photo for joiner"
            >
              <div className="big" data-i18n="jnPhotoBig">
                📷 1 — Upload the photo
              </div>
              <input type="file" id="jnPhotoFile" accept="image/*" />
            </div>
            <div className="fname" id="jnPhotoName" />
            <div
              className="drop"
              id="jnSignDrop"
              tabIndex={0}
              role="button"
              data-i18n-aria="ariaJnSign" aria-label="Upload signature for joiner"
              style={{ marginTop: 12 }}
            >
              <div className="big" data-i18n="jnSignBig">
                ✍️ 2 — Upload the signature
              </div>
              <input type="file" id="jnSignFile" accept="image/*" />
            </div>
            <div className="fname" id="jnSignName" />
            <div className="field" style={{ marginTop: 16 }}>
              <label className="fl" data-i18n="jnLayoutLabel">
                Layout
              </label>
              <div className="chips" id="jnLayout">
                <button
                  type="button"
                  className="chip saf"
                  data-v="v"
                  aria-pressed="true"
                  data-i18n="jnLayoutV"
                >
                  Photo on top, signature below (common)
                </button>
                <button type="button" className="chip" data-v="h" aria-pressed="false" data-i18n="jnLayoutSide">
                  Side-by-side
                </button>
              </div>
            </div>
            <p className="hint" data-i18n="jnSizeNote">
              Final image size — vertical: 700 × 1260 px; side-by-side: 1160 × 700 px.
            </p>
            <div className="field">
              <label className="fl">
                <span data-i18n="jnCleanLabel">Signature cleaning</span>{" "}
                <span id="jnThVal">(medium · 205)</span>
              </label>
              <input type="range" id="jnTh" min={120} max={245} defaultValue={205} />
              <p className="hint" style={{ marginTop: 2 }} data-i18n="sgCleanHint">
                Slider right = whiter background. If light ink disappears, move the slider left.
              </p>
            </div>
            <div className="field">
              <label className="fl" htmlFor="jnKb" data-i18n="jnKbLabel">
                Combined size limit (KB) — leave blank for best quality
              </label>
              <input type="number" id="jnKb" min={10} max={1000} placeholder="e.g. 100" />
            </div>
            <div className="btnrow">
              <button className="btn" id="jnGo" disabled data-i18n="jnGo">
                Join now
              </button>
              <a
                className="btn saf"
                id="jnDownload"
                data-i18n="dlDownload"
                style={{ display: "none" }}
                download="photo-with-signature.jpg"
              >
                ⬇ Download
              </a>
            </div>
            <div className="msg" id="jnMsg" />
          </div>
          <div>
            <div className="preview" id="jnPreview">
              <img id="jnImg" alt="Photo and signature combined preview" />
              <div className="stat" id="jnStat" />
            </div>
            <p className="hint" data-i18n="jnHint">
              The signature background is whitened here too (the same cleaning engine as Tool 3).
              If a signature is very light, clean it in Tool 3 first and use that file here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
