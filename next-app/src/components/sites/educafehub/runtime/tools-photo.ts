import {
  $,
  AI_BG_CONFIGS,
  c2b,
  canvas,
  chipGroup, selGroup,
  ctx2d,
  downloadBlob,
  drawContain,
  drawCover,
  fmtKB,
  fmtSize,
  input,
  loadImg,
  loadImgly,
  loadScriptOnce,
  makeZip,
  padJpeg,
  setHTML,
  setMsg,
  toTargetKB,
  wireDrop,
} from "./helpers";
import { T, onLangChange, pulse } from "./state";

interface PassportState {
  img: HTMLImageElement | null;
  paper: string;
  copies: number;
  wmm: number;
  hmm: number;
  mode: string;
  guides: boolean;
  labels: boolean;
  quality: number;
  file: File | null;
  bright: number;
  contrast: number;
  strip: boolean;
  bgRemoved: boolean;
}

const PAPER_SIZES: Record<string, { w: number; h: number }> = {
  "4x6": { w: 101.6, h: 152.4 },
  "6x8": { w: 152.4, h: 203.2 },
  "8x10": { w: 203.2, h: 254 },
  "5x7": { w: 127, h: 177.8 },
  a5: { w: 148, h: 210 },
  a4: { w: 210, h: 297 },
  a3: { w: 297, h: 420 },
  a6: { w: 105, h: 148 },
  letter: { w: 215.9, h: 279.4 },
  legal: { w: 215.9, h: 355.6 },
};

export function initPassport(): void {
  const pp: PassportState = {
    img: null,
    paper: "4x6",
    copies: 8,
    wmm: 35,
    hmm: 45,
    mode: "fill",
    guides: true,
    labels: true,
    quality: 300,
    file: null,
    bright: 100,
    contrast: 100,
    strip: false,
    bgRemoved: false,
  };

  const paperSel = input("ppPaperSel");
  pp.paper = paperSel.value || "4x6";
  paperSel.addEventListener("change", () => {
    pp.paper = paperSel.value;
    renderPP();
  });

  const copiesInput = input("ppCopiesInput");
  pp.copies = parseInt(copiesInput.value, 10) || 8;
  copiesInput.addEventListener("input", () => {
    pp.copies = parseInt(copiesInput.value, 10) || 1;
    renderPP();
  });

  const qualitySel = input("ppQuality");
  pp.quality = parseInt(qualitySel.value, 10) || 300;
  qualitySel.addEventListener("change", () => {
    pp.quality = parseInt(qualitySel.value, 10) || 300;
    renderPP();
  });
  input("ppPaperType").addEventListener("change", () => renderPP());
  $("ppGenerate").addEventListener("click", () => {
    if (!pp.img) {
      setMsg("ppMsg", T("ppGenNeedPhoto"), "warn");
      return;
    }
    renderPP();
    $("ppCanvas").scrollIntoView({ behavior: "smooth", block: "nearest" });
    setMsg("ppMsg", T("ppGenDone"), "good");
  });
  selGroup("ppPreset", (v) => {
    if (v === "custom") {
      $("ppCustomRow").style.display = "flex";
      pp.wmm = parseFloat(input("ppCW").value) || 35;
      pp.hmm = parseFloat(input("ppCH").value) || 45;
    } else {
      $("ppCustomRow").style.display = "none";
      const p = v.split("x");
      pp.wmm = parseFloat(p[0]);
      pp.hmm = parseFloat(p[1]);
    }
    renderPP();
  });
  input("ppCW").addEventListener("input", () => {
    pp.wmm = parseFloat(input("ppCW").value) || 35;
    renderPP();
  });
  input("ppCH").addEventListener("input", () => {
    pp.hmm = parseFloat(input("ppCH").value) || 45;
    renderPP();
  });
  pp.mode =
    chipGroup("ppMode", (v) => {
      pp.mode = v;
      renderPP();
    }) || "fill";
  $("ppGuides").addEventListener("click", function (this: HTMLElement) {
    pp.guides = this.getAttribute("aria-pressed") !== "true";
    this.setAttribute("aria-pressed", pp.guides ? "true" : "false");
    renderPP();
  });
  function syncLabelInput(): void {
    const li = input("ppLabelText") as HTMLInputElement;
    li.disabled = !pp.labels;
    li.style.opacity = pp.labels ? "1" : "0.5";
  }
  $("ppLabels").addEventListener("click", function (this: HTMLElement) {
    pp.labels = this.getAttribute("aria-pressed") !== "true";
    this.setAttribute("aria-pressed", pp.labels ? "true" : "false");
    syncLabelInput();
    renderPP();
  });
  syncLabelInput();
  input("ppBg").addEventListener("input", renderPP);
  input("ppLabelText").addEventListener("input", renderPP);
  input("ppZoom").addEventListener("input", renderPP);
  input("ppY").addEventListener("input", renderPP);

  wireDrop("ppDrop", "ppFile", (f) => {
    loadImg(f)
      .then((r) => {
        pp.img = r.img;
        pp.file = f;
        pp.bgRemoved = false;
        $("ppName").textContent = `✔ ${f.name}`;
        (input("ppDownload") as HTMLButtonElement).disabled = false;
        syncDocButtons();
        $("ppMsg").textContent = "";
        renderPP();
      })
      .catch(() => {
        const isHeic = /hei[cf]/i.test(f.type) || /\.hei[cf]$/i.test(f.name);
        setMsg("ppMsg", T(isHeic ? "ppHeicFail" : "fileNotImage"), "warn");
      });
  });

  function renderPP(): void {
    const cv = canvas("ppCanvas");
    const ctx = ctx2d(cv);
    const paperSize = PAPER_SIZES[pp.paper] || PAPER_SIZES["4x6"];
    const DPI = Math.min(pp.quality, Math.floor(8000 / (Math.max(paperSize.w, paperSize.h) / 25.4)));
    const MM = DPI / 25.4;
    let paperW = Math.round(paperSize.w * MM);
    let paperH = Math.round(paperSize.h * MM);
    const pw = pp.wmm * MM;
    const ph = pp.hmm * MM;
    const labH = pp.labels ? 5 * MM : 0;
    const cellH = ph + labH;
    const gap = 3 * MM;
    const margin = 4 * MM;

    function layout(W: number, H: number) {
      const cols = Math.max(1, Math.floor((W - 2 * margin + gap) / (pw + gap)));
      const rows = Math.max(1, Math.floor((H - 2 * margin + gap) / (cellH + gap)));
      return { cols, rows, cap: cols * rows };
    }

    const L1 = layout(paperW, paperH);
    const L2 = layout(paperH, paperW);
    let L = L1;
    let W = paperW;
    let H = paperH;
    if (L2.cap > L1.cap) {
      L = L2;
      W = paperH;
      H = paperW;
    }
    const copies = Math.min(pp.copies, L.cap);
    const rows = Math.ceil(copies / L.cols);
    let cols = L.cols;
    if (rows === 1) cols = copies;
    const blockW = cols * pw + (cols - 1) * gap;
    const blockH = rows * cellH + (rows - 1) * gap;
    cv.width = W;
    cv.height = H;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    const x0 = (W - blockW) / 2;
    const y0 = (H - blockH) / 2;
    const zoom = parseInt(input("ppZoom").value, 10) / 100;
    const ysh = parseInt(input("ppY").value, 10) / 100;
    const bgc = input("ppBg").value || "#ffffff";
    let label = (input("ppLabelText").value || "").trim();
    if (pp.strip) {
      const spName = (input("ppStripName") as HTMLInputElement).value.trim();
      const spRaw = (input("ppStripDate") as HTMLInputElement).value;
      const spDate = spRaw ? spRaw.split("-").reverse().join("/") : "";
      const parts = [spName || label, spDate].filter(Boolean);
      if (parts.length) label = parts.join("  •  ");
    }
    let n = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (n >= copies) break;
        n++;
        const x = x0 + c * (pw + gap);
        const y = y0 + r * (cellH + gap);
        if (pp.img) {
          ctx.filter = "brightness(" + pp.bright + "%) contrast(" + pp.contrast + "%)";
          if (pp.mode === "fit") {
            ctx.fillStyle = bgc;
            ctx.fillRect(x, y, pw, ph);
            drawContain(ctx, pp.img, x, y, pw, ph);
          } else {
            drawCover(ctx, pp.img, x, y, pw, ph, zoom, ysh);
          }
          ctx.filter = "none";
        } else {
          ctx.fillStyle = "#e8e2d2";
          ctx.fillRect(x, y, pw, ph);
          ctx.fillStyle = "#8a8271";
          ctx.font = "600 34px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("PHOTO", x + pw / 2, y + ph / 2);
          ctx.textAlign = "left";
        }
        if (pp.labels) {
          ctx.fillStyle = bgc;
          ctx.fillRect(x, y + ph, pw, labH);
          if (label) {
            ctx.fillStyle = "#202124";
            ctx.font = `700 ${Math.round(labH * 0.52)}px sans-serif`;
            ctx.textAlign = "center";
            ctx.fillText(label, x + pw / 2, y + ph + labH * 0.72, pw - 6);
            ctx.textAlign = "left";
          }
        }
        if (pp.guides) {
          ctx.strokeStyle = "#b9b2a0";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, pw, cellH);
        }
      }
    }
    const paperNames: Record<string, string> = {
      "4x6": "4×6 inch",
      "5x7": "5×7 inch",
      "6x8": "6×8 inch",
      "8x10": "8×10 inch",
      a5: "A5",
      a6: "A6",
      a4: "A4",
      a3: "A3",
      letter: "Letter",
      legal: "Legal",
    };
    const paperLabel = paperNames[pp.paper] || pp.paper.toUpperCase();
    const typeLabel = T("ppType" + (input("ppPaperType").value || "glossy").replace(/^./, (c) => c.toUpperCase()));
    setHTML(
      "ppStat",
      `<span>${T("ppSheetWord").replace("{paper}", paperLabel)}</span><span class='good'>${T("bkPhotosN").replace("{n}", String(copies))}</span><span>${pp.wmm}×${pp.hmm} mm · ${DPI} DPI · ${W}×${H} px</span><span>${typeLabel}</span>${pp.quality > DPI ? `<span>${T("ppQualityCapped")}</span>` : ""}${pp.copies > L.cap ? `<span>${T("ppMaxFit").replace("{cap}", String(L.cap)).replace("{paper}", paperLabel)}</span>` : ""}`,
    );
    if (pp.copies > L.cap) {
      const copiesInput = input("ppCopiesInput");
      copiesInput.max = String(L.cap);
      setMsg(
        "ppMsg",
        T("ppCapNote").replace("{cap}", String(L.cap)).replace("{paper}", paperLabel).replace("{cap}", String(L.cap)),
        "warn",
      );
      const note = $("ppCopiesNote");
      note.textContent = T("ppMaxFit").replace("{cap}", String(L.cap)).replace("{paper}", paperLabel);
    } else if (pp.img) {
      $("ppMsg").textContent = "";
      const note = $("ppCopiesNote");
      note.textContent = T("ppMaxFit").replace("{cap}", String(L.cap)).replace("{paper}", paperLabel);
    }
  }

  renderPP();

  input("ppDownload").addEventListener("click", async () => {
    if (!pp.img) return;
    const blob = await c2b(canvas("ppCanvas"), 0.95);
    downloadBlob(blob, `passport-sheet-${pp.paper}-${pp.copies}copies-${pp.quality}dpi-${Date.now().toString(36)}.jpg`);
    setMsg(
      "ppMsg",
      T("ppSheetDone"),
      "good",
    );
  });

  // ---- PASSPORT3: document presets, name+date strip, brightness/contrast, background removal ----
  interface DocPreset { w: number; h: number; minKB: number; maxKB: number; bg: string; file: string }
  const DOC_PRESETS: Record<string, DocPreset> = {
    "passport-seva": { w: 630, h: 810, minKB: 10, maxKB: 250, bg: "#ffffff", file: "passport-seva" },
    ibps: { w: 200, h: 230, minKB: 20, maxKB: 50, bg: "#f2f2f2", file: "ibps" },
    sbi: { w: 200, h: 230, minKB: 20, maxKB: 50, bg: "#f2f2f2", file: "sbi" },
    oci: { w: 600, h: 600, minKB: 0, maxKB: 200, bg: "#f2f2f2", file: "oci" },
    dl: { w: 420, h: 525, minKB: 10, maxKB: 20, bg: "#f2f2f2", file: "dl" },
    neet: { w: 413, h: 531, minKB: 10, maxKB: 200, bg: "#ffffff", file: "neet" },
  };
  
  function docPreset(): DocPreset | null {
    const v = ($("ppDocPreset") as HTMLSelectElement).value;
    return DOC_PRESETS[v] || null;
  }
  function syncDocButtons(): void {
    (input("ppDocDownload") as HTMLButtonElement).disabled = !(pp.img && docPreset());
    (input("ppBgRemove") as HTMLButtonElement).disabled = !pp.img;
  }
  function stripParts(): { name: string; date: string } {
    const raw = (input("ppStripDate") as HTMLInputElement).value;
    const date = raw ? raw.split("-").reverse().join("/") : "";
    const name = (input("ppStripName") as HTMLInputElement).value.trim() || (input("ppLabelText").value || "").trim();
    return { name, date };
  }
  async function ppEncodeInRange(cv: HTMLCanvasElement, minKB: number, maxKB: number): Promise<Blob> {
    const max = maxKB * 1024;
    let blob = await kbEncode(cv, "image/jpeg", 0.92);
    if (blob.size > max) {
      let lo = 0.08, hi = 0.92;
      for (let i = 0; i < 9; i++) {
        const mid = (lo + hi) / 2;
        const b = await kbEncode(cv, "image/jpeg", mid);
        if (b.size <= max) { blob = b; lo = mid; } else { hi = mid; }
      }
    }
    if (minKB > 0 && blob.size < minKB * 1024) {
      const target = Math.round((minKB + Math.max(1, (maxKB - minKB) * 0.1)) * 1024);
      blob = await padJpeg(blob, target);
    }
    return blob;
  }
  ($("ppDocPreset") as HTMLSelectElement).addEventListener("change", () => {
    if (($("ppDocPreset") as HTMLSelectElement).value === "neet" && !pp.strip) {
      pp.strip = true;
      $("ppStrip").setAttribute("aria-pressed", "true");
      renderPP();
    }
    syncDocButtons();
  });
  $("ppStrip").addEventListener("click", function (this: HTMLElement) {
    pp.strip = this.getAttribute("aria-pressed") !== "true";
    this.setAttribute("aria-pressed", pp.strip ? "true" : "false");
    renderPP();
  });
  input("ppStripName").addEventListener("input", renderPP);
  input("ppStripDate").addEventListener("input", renderPP);
  input("ppBright").addEventListener("input", () => { pp.bright = parseInt(input("ppBright").value, 10) || 100; renderPP(); });
  input("ppContrast").addEventListener("input", () => { pp.contrast = parseInt(input("ppContrast").value, 10) || 100; renderPP(); });
  $("ppAdjReset").addEventListener("click", () => {
    pp.bright = 100; pp.contrast = 100;
    (input("ppBright") as HTMLInputElement).value = "100";
    (input("ppContrast") as HTMLInputElement).value = "100";
    renderPP();
  });
  $("ppDocDownload").addEventListener("click", async () => {
    const P = docPreset();
    if (!P || !pp.img) return;
    const cv = document.createElement("canvas");
    cv.width = P.w; cv.height = P.h;
    const ctx = ctx2d(cv);
    ctx.fillStyle = P.bg;
    ctx.fillRect(0, 0, P.w, P.h);
    const stripH = pp.strip ? Math.max(30, Math.round(P.h * 0.12)) : 0;
    const ph = P.h - stripH;
    ctx.save();
    ctx.filter = "brightness(" + pp.bright + "%) contrast(" + pp.contrast + "%)";
    if (pp.mode === "fit") drawContain(ctx, pp.img, 0, 0, P.w, ph);
    else drawCover(ctx, pp.img, 0, 0, P.w, ph, 1, 0.25);
    ctx.restore();
    if (stripH) {
      const sp = stripParts();
      const lines = [sp.name, sp.date].filter(Boolean);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, ph, P.w, stripH);
      ctx.fillStyle = "#111111";
      ctx.textAlign = "center";
      ctx.font = "700 " + Math.round(stripH * (lines.length > 1 ? 0.3 : 0.42)) + "px sans-serif";
      lines.forEach((ln, i) => {
        ctx.fillText(ln, P.w / 2, ph + stripH * (lines.length > 1 ? (i === 0 ? 0.4 : 0.8) : 0.64), P.w - 10);
      });
      ctx.textAlign = "left";
    }
    const blob = await ppEncodeInRange(cv, P.minKB, P.maxKB);
    const base = pp.file ? pp.file.name.replace(/\.[^.]+$/, "") : "photo";
    downloadBlob(blob, P.file + "-" + base + "-" + Date.now().toString(36) + ".jpg");
    setMsg("ppMsg", T("ppDocDone").replace("{kb}", (blob.size / 1024).toFixed(1)).replace("{w}", String(P.w)).replace("{h}", String(P.h)), "good");
    $("ppDocInfo").textContent = pp.bgRemoved ? "" : T("ppDocBgNote");
  });
  $("ppBgRemove").addEventListener("click", async function (this: HTMLButtonElement) {
    if (!pp.file) { setMsg("ppMsg", T("ppGenNeedPhoto"), "warn"); return; }
    this.disabled = true;
    setMsg("ppMsg", T("ppBgWorking"), "");
    try {
      const fn = await loadImgly();
      let out: Blob | null = null;
      for (let c = 0; c < AI_BG_CONFIGS.length && !out; c++) {
        try {
          out = await fn(pp.file, { device: AI_BG_CONFIGS[c].device, publicPath: AI_BG_CONFIGS[c].publicPath, model: "isnet_fp16", output: { format: "image/png", quality: 1 } });
        } catch { out = null; }
      }
      if (!out) throw new Error("ai failed");
      const r = await loadImg(out);
      const P = docPreset();
      const fill = P ? P.bg : (input("ppBg").value || "#ffffff");
      const cv = document.createElement("canvas");
      cv.width = r.img.naturalWidth; cv.height = r.img.naturalHeight;
      const ctx = ctx2d(cv);
      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(r.img, 0, 0);
      const flat = await kbEncode(cv, "image/png", 1);
      const r2 = await loadImg(flat);
      pp.img = r2.img;
      pp.bgRemoved = true;
      renderPP();
      setMsg("ppMsg", T("ppBgDone"), "good");
    } catch {
      setMsg("ppMsg", T("ppBgFail"), "warn");
    }
    syncDocButtons();
  });
  syncDocButtons();

  chipGroup("ppModeSwitch", (v) => {
    const singlePanel = $("ppSinglePanel");
    const bulkPanel = $("ppBulkPanel");
    if (v === "bulk") {
      singlePanel.style.display = "none";
      bulkPanel.style.display = "block";
      initPassportBulk();
    } else {
      singlePanel.style.display = "block";
      bulkPanel.style.display = "none";
    }
  });
}

interface BulkPhotoItem {
  id: number;
  img: HTMLImageElement;
  file: File;
  name: string;
  origName: string;
  objectUrl: string;
}

interface BulkState {
  items: BulkPhotoItem[];
  seq: number;
  paper: string;
  quality: number;
  wmm: number;
  hmm: number;
  mode: string;
  guides: boolean;
  labels: boolean;
  bgColor: string;
  sheets: HTMLCanvasElement[];
  currentPage: number;
  xlMap: Map<string, string>;
}

export function initPassportBulk(): void {
  if ((window as any).ppBulkInited) return;
  (window as any).ppBulkInited = true;

  const pb: BulkState = {
    items: [],
    seq: 0,
    paper: "4x6",
    quality: 300,
    wmm: 35,
    hmm: 45,
    mode: "fill",
    guides: true,
    labels: true,
    bgColor: "#ffffff",
    sheets: [],
    currentPage: 0,
    xlMap: new Map(),
  };

  function getPaperSize(paper: string): { w: number; h: number } {
    return PAPER_SIZES[paper] || PAPER_SIZES["4x6"];
  }

  function computeLayout(): { cols: number; rows: number; cap: number; W: number; H: number } {
    const paperSize = getPaperSize(pb.paper);
    const DPI = Math.min(pb.quality, Math.floor(8000 / (Math.max(paperSize.w, paperSize.h) / 25.4)));
    const MM = DPI / 25.4;
    let paperW = Math.round(paperSize.w * MM);
    let paperH = Math.round(paperSize.h * MM);
    const pw = pb.wmm * MM;
    const ph = pb.hmm * MM;
    const labH = pb.labels ? 5 * MM : 0;
    const cellH = ph + labH;
    const gap = 3 * MM;
    const margin = 4 * MM;

    function lay(W: number, H: number) {
      const cols = Math.max(1, Math.floor((W - 2 * margin + gap) / (pw + gap)));
      const rows = Math.max(1, Math.floor((H - 2 * margin + gap) / (cellH + gap)));
      return { cols, rows, cap: cols * rows };
    }

    const L1 = lay(paperW, paperH);
    const L2 = lay(paperH, paperW);
    let L = L1;
    let W = paperW;
    let H = paperH;
    if (L2.cap > L1.cap) {
      L = L2;
      W = paperH;
      H = paperW;
    }
    return { cols: L.cols, rows: L.rows, cap: L.cap, W, H };
  }

  function renderThumbs(): void {
    const box = $("ppBulkThumbs");
    box.innerHTML = "";
    pb.items.forEach((it) => {
      const d = document.createElement("div");
      d.className = "bthumb";
      d.style.display = "flex";
      d.style.flexDirection = "column";
      d.style.alignItems = "center";
      d.style.gap = "4px";
      const im = document.createElement("img");
      im.src = it.objectUrl;
      im.alt = it.name;
      im.style.width = "100%";
      im.style.height = "100px";
      im.style.objectFit = "cover";
      im.style.borderRadius = "4px";
      d.appendChild(im);
      const ni = document.createElement("input");
      ni.type = "text";
      ni.value = it.name;
      ni.placeholder = "Name / ID";
      ni.style.width = "100%";
      ni.style.fontSize = "12px";
      ni.style.padding = "2px 6px";
      ni.style.border = "1px solid #ccc";
      ni.style.borderRadius = "4px";
      let nameTimer: ReturnType<typeof setTimeout> | undefined;
      ni.addEventListener("input", () => {
        it.name = ni.value;
        if (nameTimer) clearTimeout(nameTimer);
        nameTimer = setTimeout(() => renderSheets(), 300);
      });
      d.appendChild(ni);
      const rb = document.createElement("button");
      rb.type = "button";
      rb.className = "btn ghost small";
      rb.style.fontSize = "12px";
      rb.style.padding = "2px 8px";
      rb.textContent = "✕ " + T("ppThumbRemove");
      rb.addEventListener("click", () => {
        const ix = pb.items.indexOf(it);
        if (ix >= 0) {
          URL.revokeObjectURL(it.objectUrl);
          pb.items.splice(ix, 1);
        }
        renderThumbs();
        renderSheets();
        $("ppBulkName").textContent = pb.items.length ? T("bkLoadedN").replace("{n}", String(pb.items.length)) : "";
      });
      d.appendChild(rb);
      box.appendChild(d);
    });
    (input("ppBulkClear") as HTMLButtonElement).disabled = pb.items.length === 0;
  }

  function renderSheets(): void {
    const layout = computeLayout();
    const paperSize = getPaperSize(pb.paper);
    const DPI = Math.min(pb.quality, Math.floor(8000 / (Math.max(paperSize.w, paperSize.h) / 25.4)));
    const MM = DPI / 25.4;
    let paperW = Math.round(paperSize.w * MM);
    let paperH = Math.round(paperSize.h * MM);
    const { cols, rows, cap, W, H } = layout;
    const pw = pb.wmm * MM;
    const ph = pb.hmm * MM;
    const labH = pb.labels ? 5 * MM : 0;
    const cellH = ph + labH;
    const gap = 3 * MM;
    const margin = 4 * MM;

    pb.sheets = [];
    for (let s = 0; s < pb.items.length; s += cap) {
      const cv = document.createElement("canvas");
      cv.width = W;
      cv.height = H;
      const ctx = ctx2d(cv);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
      const chunk = pb.items.slice(s, s + cap);
      const rowsUsed = Math.ceil(chunk.length / cols);
      const blockW = cols * pw + (cols - 1) * gap;
      const blockH = rowsUsed * cellH + (rowsUsed - 1) * gap;
      const x0 = (W - blockW) / 2;
      const y0 = (H - blockH) / 2;
      chunk.forEach((it, i) => {
        const cx = x0 + (i % cols) * (pw + gap);
        const cy = y0 + Math.floor(i / cols) * (cellH + gap);
        if (pb.mode === "fit") {
          ctx.fillStyle = pb.bgColor;
          ctx.fillRect(cx, cy, pw, ph);
          drawContain(ctx, it.img, cx, cy, pw, ph);
        } else {
          drawCover(ctx, it.img, cx, cy, pw, ph, 1, 0.25);
        }
        if (pb.labels) {
          ctx.fillStyle = pb.bgColor;
          ctx.fillRect(cx, cy + ph, pw, labH);
          ctx.fillStyle = "#202124";
          ctx.font = `700 ${Math.round(labH * 0.52)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(it.name || "", cx + pw / 2, cy + ph + labH * 0.72, pw - 6);
          ctx.textAlign = "left";
        }
        if (pb.guides) {
          ctx.strokeStyle = "#b9b2a0";
          ctx.lineWidth = 2;
          ctx.strokeRect(cx, cy, pw, cellH);
        }
      });
      pb.sheets.push(cv);
    }
    showPage(0);
    updateNav();
  }

  function showPage(pageIdx: number): void {
    if (pb.sheets.length === 0) return;
    pb.currentPage = Math.max(0, Math.min(pageIdx, pb.sheets.length - 1));
    const cv = pb.sheets[pb.currentPage];
    const targetCv = canvas("ppBulkCanvas");
    const targetCtx = ctx2d(targetCv);
    targetCv.width = cv.width;
    targetCv.height = cv.height;
    targetCtx.drawImage(cv, 0, 0);
    const paperNames: Record<string, string> = {
      "4x6": "4×6 inch",
      "5x7": "5×7 inch",
      "6x8": "6×8 inch",
      "8x10": "8×10 inch",
      a5: "A5",
      a6: "A6",
      a4: "A4",
      a3: "A3",
      letter: "Letter",
      legal: "Legal",
    };
    const paperLabel = paperNames[pb.paper] || pb.paper.toUpperCase();
    const effDpiBulk = Math.min(pb.quality, Math.floor(8000 / (Math.max(getPaperSize(pb.paper).w, getPaperSize(pb.paper).h) / 25.4)));
    const typeLabelB = T("ppType" + (input("ppPaperType").value || "glossy").replace(/^./, (c) => c.toUpperCase()));
    setHTML(
      "ppBulkStat",
      `<span>${T("ppSheetWord").replace("{paper}", paperLabel)}</span><span class='good'>${T("ppBulkStatPage").replace("{p}", String(pb.currentPage + 1)).replace("{n}", String(pb.sheets.length))}</span><span>${T("bkPhotosN").replace("{n}", String(pb.items.length))} · ${pb.wmm}×${pb.hmm} mm · ${effDpiBulk} DPI</span><span>${typeLabelB}</span>${pb.quality > effDpiBulk ? `<span>${T("ppQualityCapped")}</span>` : ""}`,
    );
    const pageInfo = $("ppBulkPageInfo");
    pageInfo.textContent = T("ppPageInfo").replace("{p}", String(pb.currentPage + 1)).replace("{n}", String(pb.sheets.length)).replace("{c}", String(pb.items.length));
  }

  function updateNav(): void {
    const prevBtn = input("ppBulkPrev");
    const nextBtn = input("ppBulkNext");
    const nav = $("ppBulkNav");
    if (pb.sheets.length > 1) {
      nav.style.display = "flex";
    } else {
      nav.style.display = "none";
    }
    prevBtn.disabled = pb.currentPage === 0;
    nextBtn.disabled = pb.currentPage >= pb.sheets.length - 1;
    (input("ppBulkPdf") as HTMLButtonElement).disabled = pb.sheets.length === 0;
    (input("ppBulkPageJpg") as HTMLButtonElement).disabled = pb.sheets.length === 0;
  }

  function syncSharedControls(): void {
    pb.paper = input("ppPaperSel").value;
    pb.quality = parseInt(input("ppQuality").value, 10) || 300;
    const preset = ($("ppBulkPreset") as unknown as HTMLSelectElement).value || "35x45";
    if (preset === "custom") {
      pb.wmm = parseFloat(input("ppBulkCW").value) || 35;
      pb.hmm = parseFloat(input("ppBulkCH").value) || 45;
    } else {
      const p = preset.split("x");
      pb.wmm = parseFloat(p[0]);
      pb.hmm = parseFloat(p[1]);
    }
    pb.mode = $("ppMode").querySelector<HTMLElement>('[aria-pressed="true"]')?.getAttribute("data-v") || "fill";
    pb.guides = input("ppBulkGuides").getAttribute("aria-pressed") === "true";
    pb.labels = input("ppBulkLabels").getAttribute("aria-pressed") === "true";
    pb.bgColor = input("ppBulkBg").value || "#ffffff";
  }

  input("ppBulkPaperSel").addEventListener("change", () => {
    input("ppPaperSel").value = input("ppBulkPaperSel").value;
    syncSharedControls();
    renderSheets();
  });
  input("ppBulkQuality").addEventListener("change", () => {
    input("ppQuality").value = input("ppBulkQuality").value;
    syncSharedControls();
    renderSheets();
  });
  input("ppBulkPaperType").addEventListener("change", () => {
    input("ppPaperType").value = input("ppBulkPaperType").value;
    renderSheets();
  });
  $("ppBulkGenerate").addEventListener("click", () => {
    if (!pb.items.length) {
      setMsg("ppBulkMsg", T("ppGenNeedPhotos"), "warn");
      return;
    }
    syncSharedControls();
    renderSheets();
    $("ppBulkCanvas").scrollIntoView({ behavior: "smooth", block: "nearest" });
    setMsg("ppBulkMsg", T("ppGenDone"), "good");
  });

  selGroup("ppBulkPreset", (v) => {
    if (v === "custom") {
      $("ppBulkCustomRow").style.display = "flex";
      pb.wmm = parseFloat(input("ppBulkCW").value) || 35;
      pb.hmm = parseFloat(input("ppBulkCH").value) || 45;
    } else {
      $("ppBulkCustomRow").style.display = "none";
      const p = v.split("x");
      pb.wmm = parseFloat(p[0]);
      pb.hmm = parseFloat(p[1]);
    }
    ($("ppPreset") as unknown as HTMLSelectElement).value = v;
    syncSharedControls();
    renderSheets();
  });
  input("ppBulkCW").addEventListener("input", () => {
    pb.wmm = parseFloat(input("ppBulkCW").value) || 35;
    syncSharedControls();
    renderSheets();
  });
  input("ppBulkCH").addEventListener("input", () => {
    pb.hmm = parseFloat(input("ppBulkCH").value) || 45;
    syncSharedControls();
    renderSheets();
  });

  input("ppBulkGuides").addEventListener("click", function (this: HTMLElement) {
    pb.guides = this.getAttribute("aria-pressed") !== "true";
    this.setAttribute("aria-pressed", pb.guides ? "true" : "false");
    const g = input("ppGuides");
    g.setAttribute("aria-pressed", pb.guides ? "true" : "false");
    syncSharedControls();
    renderSheets();
  });
  input("ppBulkLabels").addEventListener("click", function (this: HTMLElement) {
    pb.labels = this.getAttribute("aria-pressed") !== "true";
    this.setAttribute("aria-pressed", pb.labels ? "true" : "false");
    const l = input("ppLabels");
    l.setAttribute("aria-pressed", pb.labels ? "true" : "false");
    syncSharedControls();
    renderSheets();
  });
  input("ppBulkBg").addEventListener("input", () => {
    pb.bgColor = input("ppBulkBg").value || "#ffffff";
    input("ppBg").value = pb.bgColor;
    syncSharedControls();
    renderSheets();
  });

  const bulkDrop = $("ppBulkDrop");
  const bulkFiles = input("ppBulkFiles");
  const bulkName = $("ppBulkName");
  const bulkMsg = $("ppBulkMsg");

  function addFiles(fileList: FileList | null): void {
    const all = Array.from(fileList || []);
    const isPhoto = (f: File) => /image|hei[cf]/i.test(f.type) || /\.(jpe?g|png|webp|hei[cf])$/i.test(f.name);
    const skipped = all.filter((f) => !isPhoto(f)).length;
    let files = all.filter(isPhoto);
    if (!files.length) {
      if (all.length) setMsg("ppBulkMsg", T("ppBulkNoPhotos"), "warn");
      return;
    }
    let capped = false;
    const room = 200 - pb.items.length;
    if (files.length > room) {
      files = files.slice(0, Math.max(0, room));
      capped = true;
    }
    if (!files.length) {
      setMsg("ppBulkMsg", T("ppBulkCap"), "warn");
      return;
    }
    bulkMsg.textContent = T("ppBulkLoading").replace("{n}", String(files.length));
    bulkMsg.className = "msg";
    let done = 0;
    let heicFailed = 0;
    files.forEach((f) => {
      const isHeic = /hei[cf]/i.test(f.type) || /\.hei[cf]$/i.test(f.name);
      loadImg(f)
        .then((r) => {
          const base = f.name.replace(/\.[^.]+$/, "").trim() || f.name;
          const url = URL.createObjectURL(f);
          pb.items.push({
            id: ++pb.seq,
            img: r.img,
            file: f,
            name: base,
            origName: base,
            objectUrl: url,
          });
        })
        .catch(() => {
          if (isHeic) heicFailed++;
        })
        .then(() => {
          done++;
          if (done === files.length) {
            renderThumbs();
            renderSheets();
            bulkName.textContent = T("bkLoadedN").replace("{n}", String(pb.items.length));
            if (heicFailed > 0) {
              setMsg("ppBulkMsg", T("ppHeicFail"), "warn");
            } else if (capped) {
              setMsg("ppBulkMsg", T("ppBulkCap"), "warn");
            } else if (skipped > 0) {
              setMsg(
                "ppBulkMsg",
                T("ppBulkReady").replace("{n}", String(pb.items.length)) + " " + T("ppBulkSkipped").replace("{n}", String(skipped)),
                "warn",
              );
            } else {
              bulkMsg.textContent = T("ppBulkReady").replace("{n}", String(pb.items.length));
              bulkMsg.className = "msg good";
            }
          }
        });
    });
  }
  $("ppBulkClear").addEventListener("click", () => {
    pb.items.forEach((it) => URL.revokeObjectURL(it.objectUrl));
    pb.items = [];
    renderThumbs();
    renderSheets();
    bulkName.textContent = "";
    setMsg("ppBulkMsg", "", "");
  });

  bulkDrop.addEventListener("click", () => bulkFiles.click());
  bulkDrop.addEventListener("keydown", (e) => {
    const key = (e as KeyboardEvent).key;
    if (key === "Enter" || key === " ") {
      e.preventDefault();
      bulkFiles.click();
    }
  });
  ["dragover", "dragenter"].forEach((ev) => {
    bulkDrop.addEventListener(ev, (e) => {
      e.preventDefault();
      bulkDrop.classList.add("over");
    });
  });
  ["dragleave", "drop"].forEach((ev) => {
    bulkDrop.addEventListener(ev, (e) => {
      e.preventDefault();
      bulkDrop.classList.remove("over");
    });
  });
  bulkDrop.addEventListener("drop", (e) => {
    const files = (e as DragEvent).dataTransfer?.files;
    if (files && files.length) addFiles(files);
  });
  bulkFiles.addEventListener("change", function (this: HTMLInputElement) {
    addFiles(this.files);
    this.value = "";
  });
  $("ppFolderBtn").addEventListener("click", () => input("ppFolder").click());
  input("ppFolder").addEventListener("change", function (this: HTMLInputElement) {
    addFiles(this.files);
    this.value = "";
  });

  input("ppBulkPrev").addEventListener("click", () => {
    showPage(pb.currentPage - 1);
    updateNav();
  });
  input("ppBulkNext").addEventListener("click", () => {
    showPage(pb.currentPage + 1);
    updateNav();
  });

  input("ppBulkXlTemplate").addEventListener("click", async () => {
    try {
      if (!window.XLSX) {
        await loadScriptOnce("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js");
      }
      const XLSX = window.XLSX as XlsxNamespace;
      const wb = XLSX.utils.book_new();
      const data: string[][] = [["Photo file name", "Name"]];
      for (let i = 0; i < 20; i++) data.push(["", ""]);
      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "Names");
      const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      downloadBlob(new Blob([buf]), "passport-name-template.xlsx");
      setMsg("ppBulkMsg", T("ppTplDone"), "good");
    } catch {
      setMsg("ppBulkMsg", T("ppTplFail"), "warn");
    }
  });

  input("ppBulkXlUpload").addEventListener("click", () => input("ppBulkXlFile").click());
  input("ppBulkXlFile").addEventListener("change", async function (this: HTMLInputElement) {
    const file = this.files?.[0];
    if (!file) return;
    const status = $("ppBulkXlStatus");
    status.textContent = T("ppXlReading");
    status.className = "hint";
    try {
      if (!window.XLSX) {
        await loadScriptOnce("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js");
      }
      const XLSX = window.XLSX as XlsxNamespace;
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "", raw: true }) as string[][];
      pb.xlMap.clear();
      const entries: { file: string; name: string; used: boolean }[] = [];
      rows.slice(1).forEach((r) => {
        const file = String(r[0] ?? "").trim();
        const name = String(r[1] ?? "").trim();
        if (name) {
          entries.push({ file, name, used: false });
          if (file) pb.xlMap.set(file.toLowerCase(), name);
        }
      });
      let matched = 0;
      pb.items.forEach((it) => {
        const hit = pb.xlMap.get(it.origName.toLowerCase());
        if (hit) {
          it.name = hit;
          matched++;
          const e = entries.find((x) => !x.used && x.file.toLowerCase() === it.origName.toLowerCase());
          if (e) e.used = true;
        }
      });
      pb.items.forEach((it, ix) => {
        if (pb.xlMap.has(it.origName.toLowerCase())) return;
        const e = entries[ix] && !entries[ix].used ? entries[ix] : entries.find((x) => !x.used);
        if (e) {
          it.name = e.name;
          e.used = true;
          matched++;
        }
      });
      renderThumbs();
      renderSheets();
      const okMatch = matched > 0;
      status.textContent = T("ppXlMatched").replace("{m}", String(matched)).replace("{n}", String(pb.items.length));
      status.className = okMatch ? "hint good" : "hint warn";
      setMsg("ppBulkMsg", T("ppBulkXlDone").replace("{m}", String(matched)).replace("{n}", String(pb.items.length)), okMatch ? "good" : "warn");
    } catch {
      status.textContent = T("ppXlFail");
      status.className = "hint warn";
      setMsg("ppBulkMsg", T("ppBulkXlInvalid"), "warn");
    }
    this.value = "";
  });

  input("ppBulkPageJpg").addEventListener("click", async () => {
    if (pb.sheets.length === 0) return;
    const cv = pb.sheets[pb.currentPage];
    const blob = await c2b(cv, 0.95);
    const paperNames: Record<string, string> = {
      "4x6": "4x6",
      "5x7": "5x7",
      a5: "a5",
      a4: "a4",
      a3: "a3",
      letter: "letter",
      legal: "legal",
    };
    const paperLabel = paperNames[pb.paper] || pb.paper;
    downloadBlob(blob, `passport-sheet-${paperLabel}-page${pb.currentPage + 1}-${pb.quality}dpi-${Date.now().toString(36)}.jpg`);
    setMsg("ppBulkMsg", T("ppBulkPageJpgDone"), "good");
  });

  input("ppBulkPdf").addEventListener("click", async () => {
    if (pb.sheets.length === 0) return;
    const btn = input("ppBulkPdf");
    btn.disabled = true;
    btn.textContent = T("pdfMaking");
    setMsg("ppBulkMsg", T("ppBulkPdfGen"), "");
    try {
      if (!window.jspdf) {
        await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      }
      const jspdf = window.jspdf as JsPdfNamespace;
      const JsPDF = jspdf.jsPDF;
      const paperNames: Record<string, string> = {
        "4x6": "4x6",
        "5x7": "5x7",
        a5: "a5",
        a4: "a4",
        a3: "a3",
        letter: "letter",
        legal: "legal",
      };
      const paperLabel = paperNames[pb.paper] || pb.paper;
      const paperSize = getPaperSize(pb.paper);
      const first = pb.sheets[0];
      const land = first.width > first.height;
      const wmm = land ? paperSize.h : paperSize.w;
      const hmm = land ? paperSize.w : paperSize.h;
      const doc = new JsPDF({ unit: "mm", format: [wmm, hmm], orientation: land ? "landscape" : "portrait" });
      doc.addImage(pb.sheets[0].toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, wmm, hmm);
      for (let i = 1; i < pb.sheets.length; i++) {
        doc.addPage([wmm, hmm], land ? "landscape" : "portrait");
        doc.addImage(pb.sheets[i].toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, wmm, hmm);
      }
      doc.save(`passport-sheets-${paperLabel}-${Date.now().toString(36)}.pdf`);
      setMsg("ppBulkMsg", T("ppBulkPdfDone").replace("{n}", String(pb.sheets.length)), "good");
    } catch {
      setMsg("ppBulkMsg", T("ppBulkPdfFail"), "warn");
    }
    btn.disabled = false;
    btn.textContent = T("ppBulkPdf");
  });

  syncSharedControls();
}

interface KbState {
  img: HTMLImageElement | null;
  file: File | null;
  target: number;
  mode: string;
  format: string;
}

function kbEncode(cv: HTMLCanvasElement, mime: string, q: number): Promise<Blob> {
  return new Promise((res) => {
    cv.toBlob((b) => res(b as Blob), mime, q);
  });
}

async function kbFitToTargetKB(
  cv: HTMLCanvasElement,
  targetKB: number,
  format: string,
): Promise<{ blob: Blob; fittedByDims: boolean }> {
  if (format === "png") {
    const target = targetKB * 1024;
    let cur = cv;
    let best = await kbEncode(cur, "image/png", 1);
    if (best.size <= target) return { blob: best, fittedByDims: false };
    let fittedByDims = false;
    let scale = 0.9;
    while (scale >= 0.1) {
      const c2 = document.createElement("canvas");
      c2.width = Math.max(1, Math.round(cur.width * scale));
      c2.height = Math.max(1, Math.round(cur.height * scale));
      ctx2d(c2).drawImage(cur, 0, 0, c2.width, c2.height);
      best = await kbEncode(c2, "image/png", 1);
      cur = c2;
      fittedByDims = true;
      if (best.size <= target) break;
      scale -= 0.1;
    }
    return { blob: best, fittedByDims };
  }
  const mime = format === "webp" ? "image/webp" : "image/jpeg";
  const target = targetKB * 1024;
  let best = await kbEncode(cv, mime, 0.92);
  if (best.size <= target) return { blob: best, fittedByDims: false };
  let lo = 0.08;
  let hi = 0.92;
  for (let i = 0; i < 9; i++) {
    const mid = (lo + hi) / 2;
    const b = await kbEncode(cv, mime, mid);
    if (b.size <= target) {
      best = b;
      lo = mid;
    } else {
      hi = mid;
    }
  }
  if (best.size <= target) return { blob: best, fittedByDims: false };
  let scale = 0.85;
  while (scale > 0.25) {
    const c2 = document.createElement("canvas");
    c2.width = Math.round(cv.width * scale);
    c2.height = Math.round(cv.height * scale);
    ctx2d(c2).drawImage(cv, 0, 0, c2.width, c2.height);
    const b2 = await kbEncode(c2, mime, 0.85);
    if (b2.size <= target) return { blob: b2, fittedByDims: true };
    scale -= 0.12;
  }
  return { blob: best, fittedByDims: false };
}

export function initKb(): void {
  const kb: KbState = { img: null, file: null, target: 50, mode: "exact", format: "jpg" };
  let kbTimer: ReturnType<typeof setTimeout> | null = null;

  function kbTargetKB(): number {
    const unit = input("kbTargetUnit").value;
    const n = parseFloat(input("kbTargetNum").value) || 50;
    return unit === "mb" ? Math.round(n * 1024) : Math.max(1, Math.round(n));
  }

  function kbMaxKB(): number {
    const unit = input("kbMaxUnit").value;
    const n = parseFloat(input("kbMaxNum").value) || 100;
    return unit === "mb" ? Math.round(n * 1024) : Math.max(1, Math.round(n));
  }

  function kbFixBetween(): number {
    let mx = kbMaxKB();
    const t = kbTargetKB();
    if (mx <= t) {
      mx = t + 50;
      input("kbMaxNum").value = String(mx);
      input("kbMaxUnit").value = "kb";
      $("kbBetweenNote").textContent = T("kbMaxFixed").replace("{max}", `${mx} KB`);
    } else {
      $("kbBetweenNote").textContent = "";
    }
    return mx;
  }

  function fmtTarget(target: number): string {
    return target % 1024 === 0 && target >= 1024 && input("kbTargetUnit").value === "mb"
      ? `${Math.round(target / 1024)} MB`
      : `${target} KB`;
  }

  function syncKbChips(): void {
    const num = input("kbTargetNum").value;
    const unit = input("kbTargetUnit").value;
    const sel = $("kbPresets") as unknown as HTMLSelectElement;
    const want = `${num}:${unit}`;
    sel.value = Array.from(sel.options).some((o) => o.value === want) ? want : "";
  }

  function scheduleKbRender(): void {
    if (!kb.img) return;
    if (kbTimer) clearTimeout(kbTimer);
    kbTimer = setTimeout(() => kbRender(), 180);
  }

  async function kbRender(): Promise<void> {
    if (!kb.img) return;
    const img = kb.img;
    const target = kbTargetKB();
    const format = (input("kbFormat").value || "jpg").toLowerCase();
    kb.format = format;
    const w = parseInt(input("kbW").value, 10);
    const h = parseInt(input("kbH").value, 10);
    let cw = w > 0 ? w : img.naturalWidth;
    let ch = h > 0 ? h : img.naturalHeight;
    if (!(w > 0 && h > 0)) {
      const maxSide = 1600;
      const sc = Math.min(1, maxSide / Math.max(cw, ch));
      cw = Math.round(cw * sc);
      ch = Math.round(ch * sc);
    }
    $("kbDimNote").textContent =
      (w > 0) !== (h > 0) ? T("kbDimOneMsg") : w > 0 && h > 0 ? T("kbDimCropMsg") : "";
    const cv = document.createElement("canvas");
    cv.width = cw;
    cv.height = ch;
    const ctx = ctx2d(cv);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, cw, ch);
    drawCover(ctx, img, 0, 0, cw, ch, 1, 0.5);
    let blob: Blob;
    let fittedByDims = false;
    let ok = true;
    const ruleTxt = (kb.mode === "exact" ? "= " : "") + fmtTarget(target);
    const mime = format === "png" ? "image/png" : format === "webp" ? "image/webp" : "image/jpeg";
    if (kb.mode === "exact") {
      const r = await kbFitToTargetKB(cv, target, format);
      blob = r.blob;
      fittedByDims = r.fittedByDims;
      if (format === "jpg" && blob.size < target * 1024) blob = await padJpeg(blob, target * 1024);
      ok = format === "jpg" ? blob.size <= target * 1024 && target * 1024 - blob.size < 4 : blob.size <= target * 1024;
    } else if (kb.mode === "atleast") {
      blob = await kbEncode(cv, mime, 0.95);
      if (blob.size < target * 1024 && format !== "png") blob = await padJpeg(blob, target * 1024);
      ok = blob.size >= target * 1024;
    } else if (kb.mode === "between") {
      const mx = kbFixBetween();
      const r = await kbFitToTargetKB(cv, mx, format);
      blob = r.blob;
      fittedByDims = r.fittedByDims;
      if (blob.size < target * 1024 && format !== "png") blob = await padJpeg(blob, target * 1024);
      ok = blob.size >= target * 1024 && blob.size <= mx * 1024;
    } else {
      const r = await kbFitToTargetKB(cv, target, format);
      blob = r.blob;
      fittedByDims = r.fittedByDims;
      ok = blob.size <= target * 1024;
    }
    const url = URL.createObjectURL(blob);
    ($("kbImg") as HTMLImageElement).src = url;
    $("kbPreview").classList.add("show");
    setHTML(
      "kbStat",
      `<span>${T("kbStatBefore")}: ${fmtKB(kb.file ? kb.file.size : 0)}</span><span class='good'>${T("kbStatNow")}: ${fmtKB(blob.size)}</span><span>${T("kbStatRule")}: ${ruleTxt}</span><span>${cw}×${ch} px</span>`,
    );
    const dl = $("kbDownload") as HTMLAnchorElement;
    const ext = format === "png" ? "png" : format === "webp" ? "webp" : "jpg";
    const base = kb.file ? kb.file.name.replace(/\.[^.]+$/, "") : "resized-photo";
    dl.href = url;
    dl.download = `${base}-resized.${ext}`;
    dl.style.opacity = ok ? "1" : "0.5";
    dl.style.pointerEvents = ok ? "auto" : "none";
    setMsg(
      "kbMsg",
      ok
        ? T("kbOkMsg").replace("{size}", fmtKB(blob.size)).replace("{rule}", ruleTxt)
        : T("kbFailMsg"),
      ok ? "good" : "warn",
    );
  }

  selGroup("kbPresets", (v) => {
    if (!v) return;
    const [num, unit] = v.split(":");
    input("kbTargetNum").value = num;
    input("kbTargetUnit").value = unit || "kb";
    kb.target = unit === "mb" ? parseInt(num, 10) * 1024 : parseInt(num, 10);
    scheduleKbRender();
  });
  kb.mode =
    selGroup("kbMode", (v) => {
      kb.mode = v;
      $("kbMaxRow").style.display = v === "between" ? "flex" : "none";
      $("kbModeHint").textContent =
        v === "atleast" ? T("kbHintAtLeast") : v === "between" ? T("kbBetweenHint") : v === "under" ? T("kbHintUnder") : T("kbHintExact");
      if (v === "between") kbFixBetween();
      else $("kbBetweenNote").textContent = "";
      scheduleKbRender();
    }) || "exact";
  input("kbTargetNum").addEventListener("input", () => {
    kb.target = kbTargetKB();
    syncKbChips();
    if (kb.mode === "between") kbFixBetween();
    scheduleKbRender();
  });
  input("kbTargetUnit").addEventListener("change", () => {
    kb.target = kbTargetKB();
    syncKbChips();
    scheduleKbRender();
  });
  input("kbFormat").addEventListener("change", () => {
    scheduleKbRender();
  });
  $("kbGo").addEventListener("click", () => {
    if (!kb.img) {
      setMsg("kbMsg", T("kbNeedPhoto"), "warn");
      return;
    }
    kbRender();
  });
  input("kbMaxNum").addEventListener("input", () => {
    if (kb.mode === "between") kbFixBetween();
    scheduleKbRender();
  });
  input("kbMaxUnit").addEventListener("change", () => scheduleKbRender());
  input("kbW").addEventListener("input", () => scheduleKbRender());
  input("kbH").addEventListener("input", () => scheduleKbRender());

  wireDrop("kbDrop", "kbFile", (f) => {
    kb.file = f;
    loadImg(f)
      .then((r) => {
        kb.img = r.img;
        $("kbName").textContent = T("kbFileLine").replace("{name}", f.name).replace("{size}", fmtKB(f.size));
        $("kbMsg").textContent = "";
        kbRender();
      })
      .catch(() => {
        setMsg("kbMsg", T("fileNotImage"), "warn");
      });
  });

  // ---- Tool 2 bulk mode ----
  interface KbBItem {
    name: string;
    blob: Blob;
    size: number;
  }
  const kbB: { files: File[]; results: KbBItem[] } = { files: [], results: [] };
  let kbBMode = "exact";

  chipGroup("kbModeSwitch", (v) => {
    $("kbSinglePanel").style.display = v === "bulk" ? "none" : "";
    $("kbBulkPanel").style.display = v === "bulk" ? "" : "none";
  });

  function kbBTargetKB(): number {
    const unit = input("kbBTargetUnit").value;
    const n2 = parseFloat(input("kbBTargetNum").value) || 50;
    return unit === "mb" ? Math.round(n2 * 1024) : Math.max(1, Math.round(n2));
  }
  function kbBMaxKB(): number {
    const unit = input("kbBMaxUnit").value;
    const n2 = parseFloat(input("kbBMaxNum").value) || 100;
    return unit === "mb" ? Math.round(n2 * 1024) : Math.max(1, Math.round(n2));
  }
  function syncKbBChips(): void {
    const num = input("kbBTargetNum").value;
    const unit = input("kbBTargetUnit").value;
    const sel = $("kbBPresets") as unknown as HTMLSelectElement;
    const want = `${num}:${unit}`;
    sel.value = Array.from(sel.options).some((o) => o.value === want) ? want : "";
  }
  selGroup("kbBPresets", (v) => {
    if (!v) return;
    const [num, unit] = v.split(":");
    input("kbBTargetNum").value = num;
    input("kbBTargetUnit").value = unit || "kb";
  });
  selGroup("kbBMode", (v) => {
    kbBMode = v;
    $("kbBMaxRow").style.display = v === "between" ? "flex" : "none";
  });
  input("kbBTargetNum").addEventListener("input", syncKbBChips);
  input("kbBTargetUnit").addEventListener("change", syncKbBChips);

  function kbBSetFiles(list: File[]): void {
    const imgs = list.filter((f) => f.type.startsWith("image/") || /\.hei[cf]$/i.test(f.name));
    if (imgs.length > 200) {
      kbB.files = imgs.slice(0, 200);
      setMsg("kbBatchMsg", T("kbBatchTooMany"), "warn");
    } else {
      kbB.files = imgs;
    }
    $("kbBatchCount").textContent = kbB.files.length ? T("bkPhotosN").replace("{n}", String(kbB.files.length)) : "";
  }
  const kbBFileInput = input("kbBatchFile") as HTMLInputElement;
  kbBFileInput.addEventListener("change", () => {
    if (kbBFileInput.files) kbBSetFiles(Array.from(kbBFileInput.files));
  });
  const kbBDrop = $("kbBatchDrop");
  kbBDrop.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).id === "kbBatchFile") return;
    kbBFileInput.click();
  });
  kbBDrop.addEventListener("dragover", (e) => {
    e.preventDefault();
    kbBDrop.classList.add("over");
  });
  kbBDrop.addEventListener("dragleave", () => kbBDrop.classList.remove("over"));
  kbBDrop.addEventListener("drop", (e) => {
    e.preventDefault();
    kbBDrop.classList.remove("over");
    const files = (e as DragEvent).dataTransfer?.files;
    if (files && files.length) kbBSetFiles(Array.from(files));
  });

  async function kbProcessOne(f: File): Promise<KbBItem> {
    const r = await loadImg(f);
    const img = r.img;
    const target = kbBTargetKB();
    const format = (input("kbBFormat").value || "jpg").toLowerCase();
    const w = parseInt(input("kbBW").value, 10);
    const h = parseInt(input("kbBH").value, 10);
    let cw = w > 0 ? w : img.naturalWidth;
    let ch = h > 0 ? h : img.naturalHeight;
    if (!(w > 0 && h > 0)) {
      const sc = Math.min(1, 1600 / Math.max(cw, ch));
      cw = Math.round(cw * sc);
      ch = Math.round(ch * sc);
    }
    const cv = document.createElement("canvas");
    cv.width = cw;
    cv.height = ch;
    const ctx = ctx2d(cv);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, cw, ch);
    drawCover(ctx, img, 0, 0, cw, ch, 1, 0.5);
    const mime = format === "png" ? "image/png" : format === "webp" ? "image/webp" : "image/jpeg";
    let blob: Blob;
    if (kbBMode === "exact") {
      const rr = await kbFitToTargetKB(cv, target, format);
      blob = rr.blob;
      if (format === "jpg" && blob.size < target * 1024) blob = await padJpeg(blob, target * 1024);
    } else if (kbBMode === "atleast") {
      blob = await kbEncode(cv, mime, 0.95);
      if (blob.size < target * 1024 && format !== "png") blob = await padJpeg(blob, target * 1024);
    } else if (kbBMode === "between") {
      let mx = kbBMaxKB();
      if (mx <= target) mx = target + 50;
      const rr = await kbFitToTargetKB(cv, mx, format);
      blob = rr.blob;
      if (blob.size < target * 1024 && format !== "png") blob = await padJpeg(blob, target * 1024);
    } else {
      const rr = await kbFitToTargetKB(cv, target, format);
      blob = rr.blob;
    }
    const ext = format === "png" ? "png" : format === "webp" ? "webp" : "jpg";
    const base = f.name.replace(/\.[^.]+$/, "");
    return { name: `${base}-resized.${ext}`, blob, size: f.size };
  }

  function kbBEsc(t: string): string {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  $("kbBatchGo").addEventListener("click", async () => {
    if (!kbB.files.length) {
      setMsg("kbBatchMsg", T("kbBatchEmpty"), "warn");
      return;
    }
    const btn = $("kbBatchGo") as HTMLButtonElement;
    btn.disabled = true;
    kbB.results = [];
    setHTML("kbBatchResults", "");
    ($("kbBatchZip") as HTMLAnchorElement).style.display = "none";
    const used = new Set<string>();
    let okCount = 0;
    for (let i = 0; i < kbB.files.length; i++) {
      const f = kbB.files[i];
      setHTML(
        "kbBatchProgress",
        T("kbProgress").replace("{current}", String(i + 1)).replace("{total}", String(kbB.files.length)),
      );
      try {
        const item = await kbProcessOne(f);
        let nm = item.name;
        let k = 2;
        while (used.has(nm)) {
          nm = item.name.replace(/(\.[^.]+)$/, ` (${k})$1`);
          k++;
        }
        used.add(nm);
        item.name = nm;
        kbB.results.push(item);
        okCount++;
        const url = URL.createObjectURL(item.blob);
        const row = `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #e5e7eb"><span>${kbBEsc(item.name)} \u2014 ${fmtKB(item.size)} \u2192 ${fmtKB(item.blob.size)}</span><a href="${url}" download="${kbBEsc(item.name)}">\u2B07</a></div>`;
        $("kbBatchResults").insertAdjacentHTML("beforeend", row);
      } catch {
        const row = `<div style="padding:6px 0;border-bottom:1px solid #e5e7eb"><span>${kbBEsc(f.name)} \u2014 ${kbBEsc(T("kbFailed").replace("{reason}", "resize failed"))}</span></div>`;
        $("kbBatchResults").insertAdjacentHTML("beforeend", row);
      }
    }
    setHTML(
      "kbBatchProgress",
      T("kbBatchDone").replace("{ok}", String(okCount)).replace("{total}", String(kbB.files.length)),
    );
    if (kbB.results.length) {
      const zip = await makeZip(kbB.results.map((r2) => ({ name: r2.name, blob: r2.blob })));
      const za = $("kbBatchZip") as HTMLAnchorElement;
      za.href = URL.createObjectURL(zip);
      za.download = "resized-photos.zip";
      za.style.display = "inline-flex";
    }
    btn.disabled = false;
  });
}

interface SignatureState {
  img: HTMLImageElement | null;
  file: File | null;
  size: string;
}

export function initSignature(): void {
  const sg: SignatureState = { img: null, file: null, size: "300x120" };
  selGroup("sgSize", (v) => {
    sg.size = v;
    scheduleSgRender();
  });
  function sgLevelLabel(v: number): string {
    return `(${v < 160 ? T("sgLevelLight") : v < 215 ? T("sgLevelMedium") : T("sgLevelStrong")} · ${v})`;
  }
  let sgTimer: ReturnType<typeof setTimeout> | null = null;
  function scheduleSgRender(): void {
    if (!sg.img) return;
    if (sgTimer) clearTimeout(sgTimer);
    sgTimer = setTimeout(() => sgRender(), 200);
  }
  input("sgTh").addEventListener("input", function (this: HTMLInputElement) {
    const v = parseInt(this.value, 10);
    $("sgThVal").textContent = sgLevelLabel(v);
    scheduleSgRender();
  });
  $("sgThVal").textContent = sgLevelLabel(parseInt(input("sgTh").value, 10) || 205);
  onLangChange(() => {
    $("sgThVal").textContent = sgLevelLabel(parseInt(input("sgTh").value, 10) || 205);
  });
  wireDrop("sgDrop", "sgFile", (f) => {
    sg.file = f;
    loadImg(f)
      .then((r) => {
        sg.img = r.img;
        $("sgName").textContent = `✔ ${f.name}`;
        (input("sgGo") as HTMLButtonElement).disabled = false;
        sgRender();
      })
      .catch(() => {
        setMsg("sgMsg", T("fileNotImage"), "warn");
      });
  });

  async function sgRender(): Promise<void> {
    if (!sg.img) return;
    const btn = input("sgGo") as HTMLButtonElement;
    btn.disabled = true;
    const th = parseInt(input("sgTh").value, 10);
    const cleaned = cleanSignatureLocal(sg.img, th);
    let out = cleaned;
    if (sg.size !== "orig") {
      const parts = sg.size.split("x");
      const tw = parseInt(parts[0], 10);
      const thh = parseInt(parts[1], 10);
      out = document.createElement("canvas");
      out.width = tw;
      out.height = thh;
      const ctx = ctx2d(out);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, tw, thh);
      const sc = Math.min(tw / cleaned.width, thh / cleaned.height) * 0.92;
      const dw = cleaned.width * sc;
      const dh = cleaned.height * sc;
      ctx.drawImage(cleaned, (tw - dw) / 2, (thh - dh) / 2, dw, dh);
    }
    const blob = await c2b(out, 0.92);
    const url = URL.createObjectURL(blob);
    ($("sgImg") as HTMLImageElement).src = url;
    $("sgPreview").classList.add("show");
    setHTML("sgStat", `<span class='good'>${fmtKB(blob.size)}</span><span>${out.width}×${out.height} px</span>`);
    const dl = $("sgDownload") as HTMLAnchorElement;
    dl.href = url;
    dl.download = `${sg.file ? sg.file.name.replace(/\.[^.]+$/, "") : "signature"}-signature.jpg`;
    dl.style.display = "inline-flex";
    setMsg("sgMsg", T("sgDoneMsg"), "good");
    btn.disabled = false;
  }

  input("sgGo").addEventListener("click", () => {
    sgRender();
  });
}

function cleanSignatureLocal(img: HTMLImageElement, threshold: number): HTMLCanvasElement {
  const maxSide = 1200;
  const sc = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const cv = document.createElement("canvas");
  cv.width = Math.round(img.naturalWidth * sc);
  cv.height = Math.round(img.naturalHeight * sc);
  const ctx = ctx2d(cv);
  ctx.drawImage(img, 0, 0, cv.width, cv.height);
  const d = ctx.getImageData(0, 0, cv.width, cv.height);
  const px = d.data;
  let minX = cv.width;
  let minY = cv.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < cv.height; y++) {
    for (let x = 0; x < cv.width; x++) {
      const i = (y * cv.width + x) * 4;
      const lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
      if (lum >= threshold) {
        px[i] = 255;
        px[i + 1] = 255;
        px[i + 2] = 255;
      } else {
        const f = Math.max(0, lum - 30) / (threshold - 30);
        const v = Math.round(235 * f);
        px[i] = Math.min(px[i], v);
        px[i + 1] = Math.min(px[i + 1], v);
        px[i + 2] = Math.min(px[i + 2], v + 8);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  ctx.putImageData(d, 0, 0);
  if (maxX < 0) return cv;
  const pad = 8;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(cv.width - 1, maxX + pad);
  maxY = Math.min(cv.height - 1, maxY + pad);
  const out = document.createElement("canvas");
  out.width = maxX - minX + 1;
  out.height = maxY - minY + 1;
  const octx = ctx2d(out);
  octx.fillStyle = "#fff";
  octx.fillRect(0, 0, out.width, out.height);
  octx.drawImage(cv, minX, minY, out.width, out.height, 0, 0, out.width, out.height);
  return out;
}

export function initJoiner(): void {
  const jn: {
    photo: HTMLImageElement | null;
    sign: HTMLImageElement | null;
    layout: string;
    photoFile: File | null;
    signFile: File | null;
  } = {
    photo: null,
    sign: null,
    layout: "v",
    photoFile: null,
    signFile: null,
  };
  chipGroup("jnLayout", (v) => {
    jn.layout = v;
  });
  function jnThLabel(): void {
    const v = parseInt(input("jnTh").value, 10) || 205;
    $("jnThVal").textContent = `(${v < 160 ? T("sgLevelLight") : v < 215 ? T("sgLevelMedium") : T("sgLevelStrong")} · ${v})`;
  }
  input("jnTh").addEventListener("input", jnThLabel);
  jnThLabel();
  onLangChange(jnThLabel);
  function jnReady(): void {
    (input("jnGo") as HTMLButtonElement).disabled = !(jn.photo && jn.sign);
    if (!jn.photo) setMsg("jnMsg", T("jnNeedPhoto"), "warn");
    else if (!jn.sign) setMsg("jnMsg", T("jnNeedSign"), "warn");
    else if (
      jn.photoFile &&
      jn.signFile &&
      jn.photoFile.name === jn.signFile.name &&
      jn.photoFile.size === jn.signFile.size
    )
      setMsg("jnMsg", T("jnSameFile"), "warn");
    else setMsg("jnMsg", T("jnReadyMsg"), "good");
  }
  jnReady();
  wireDrop("jnPhotoDrop", "jnPhotoFile", (f) => {
    jn.photoFile = f;
    loadImg(f)
      .then((r) => {
        jn.photo = r.img;
        $("jnPhotoName").textContent = `✔ ${f.name}`;
        jnReady();
      })
      .catch(() => {
        setMsg("jnMsg", T("fileNotImage"), "warn");
      });
  });
  wireDrop("jnSignDrop", "jnSignFile", (f) => {
    jn.signFile = f;
    loadImg(f)
      .then((r) => {
        jn.sign = r.img;
        $("jnSignName").textContent = `✔ ${f.name}`;
        jnReady();
      })
      .catch(() => {
        setMsg("jnMsg", T("fileNotImage"), "warn");
      });
  });
  input("jnGo").addEventListener("click", async () => {
    if (!jn.photo || !jn.sign) return;
    const signC = cleanSignatureLocal(jn.sign, parseInt(input("jnTh").value, 10) || 205);
    const out = document.createElement("canvas");
    let ctx: CanvasRenderingContext2D;
    if (jn.layout === "v") {
      out.width = 700;
      out.height = 900 + 360;
      ctx = ctx2d(out);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, out.width, out.height);
      drawCover(ctx, jn.photo, 0, 0, 700, 900, 1, 0.2);
      const sc = Math.min(660 / signC.width, 320 / signC.height);
      ctx.drawImage(
        signC,
        (700 - signC.width * sc) / 2,
        900 + (360 - signC.height * sc) / 2,
        signC.width * sc,
        signC.height * sc,
      );
    } else {
      out.width = 1160;
      out.height = 700;
      ctx = ctx2d(out);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, out.width, out.height);
      drawCover(ctx, jn.photo, 0, 0, 546, 700, 1, 0.2);
      const sc2 = Math.min(560 / signC.width, 420 / signC.height);
      ctx.drawImage(
        signC,
        580 + (560 - signC.width * sc2) / 2,
        (700 - signC.height * sc2) / 2,
        signC.width * sc2,
        signC.height * sc2,
      );
    }
    const kbLim = parseInt(input("jnKb").value, 10);
    const blob = kbLim > 0 ? await toTargetKB(out, kbLim) : await c2b(out, 0.92);
    const url = URL.createObjectURL(blob);
    ($("jnImg") as HTMLImageElement).src = url;
    $("jnPreview").classList.add("show");
    setHTML("jnStat", `<span class='good'>${fmtKB(blob.size)}</span><span>${out.width}×${out.height} px</span>`);
    const dl = $("jnDownload") as HTMLAnchorElement;
    dl.href = url;
    dl.download = `${jn.photoFile ? jn.photoFile.name.replace(/\.[^.]+$/, "") : "photo"}-with-signature.jpg`;
    dl.style.display = "inline-flex";
    if (kbLim > 0 && blob.size > kbLim * 1024) {
      setMsg(
        "jnMsg",
        T("jnOverLimit").replace("{size}", fmtKB(blob.size)).replace("{limit}", `${kbLim} KB`),
        "warn",
      );
    } else {
      setMsg("jnMsg", T("jnDoneMsg"), "good");
    }
  });
}

interface CompressorState {
  img: HTMLImageElement | null;
  file: File | null;
  dim: number;
}

export function initCompressor(): void {
  const cp: CompressorState = { img: null, file: null, dim: 1920 };
  selGroup("cpDim", (v) => {
    cp.dim = parseInt(v, 10);
    cpRender();
  });
  input("cpQ").addEventListener("input", function (this: HTMLInputElement) {
    $("cpQVal").textContent = `— ${this.value}%`;
    cpRender();
  });
  let cpTimer: ReturnType<typeof setTimeout> | null = null;
  function cpRender(): void {
    if (!cp.img) return;
    if (cpTimer) clearTimeout(cpTimer);
    cpTimer = setTimeout(async () => {
      const img = cp.img;
      if (!img) return;
      const maxSide = cp.dim > 0 ? cp.dim : Math.max(img.naturalWidth, img.naturalHeight);
      const sc = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const cv = document.createElement("canvas");
      cv.width = Math.round(img.naturalWidth * sc);
      cv.height = Math.round(img.naturalHeight * sc);
      ctx2d(cv).drawImage(img, 0, 0, cv.width, cv.height);
      const q = parseInt(input("cpQ").value, 10) / 100;
      const fmt = input("cpFormat") ? input("cpFormat").value : "jpg";
      const cx = cv.getContext("2d") as CanvasRenderingContext2D;
      if (fmt === "jpg") {
        cx.fillStyle = "#ffffff";
        cx.fillRect(0, 0, cv.width, cv.height);
        cx.drawImage(img, 0, 0, cv.width, cv.height);
      }
      const blob = fmt === "png" ? await kbEncode(cv, "image/png", 1) : await c2b(cv, q);
      const url = URL.createObjectURL(blob);
      ($("cpImg") as HTMLImageElement).src = url;
      $("cpPreview").classList.add("show");
      const saved = cp.file ? Math.round((1 - blob.size / cp.file.size) * 100) : 0;
      setHTML(
        "cpStat",
        `<span>${T("kbStatBefore")}: ${cp.file ? fmtSize(cp.file.size) : "—"}</span><span class='good'>${T("kbStatNow")}: ${fmtSize(blob.size)}</span>${cp.file ? (blob.size > cp.file.size ? `<span style="color:var(--warn)">${T("cpLarger")}</span>` : saved > 0 ? `<span class='good'>${T("pcSmaller").replace("{p}", String(saved))}</span>` : "") : ""}<span>${cv.width}×${cv.height} px</span>`,
      );
      const dl = $("cpDownload") as HTMLAnchorElement;
      dl.href = url;
      const base = cp.file ? cp.file.name.replace(/\.[^.]+$/, "") : "photo";
      dl.setAttribute("download", `${base}-compressed-${Date.now().toString(36)}.${fmt === "png" ? "png" : "jpg"}`);
      dl.style.display = "inline-flex";
    }, 180);
  }
  wireDrop("cpDrop", "cpFile", (f) => {
    cp.file = f;
    loadImg(f)
      .then((r) => {
        cp.img = r.img;
        $("cpName").textContent = `✔ ${f.name} · ${fmtKB(f.size)}`;
        $("cpMsg").textContent = "";
        cpRender();
      })
      .catch(() => {
        cp.img = null;
        setMsg("cpMsg", T(/\.hei[cf]$/i.test(f.name) ? "ppHeicFail" : "fileNotImage"), "warn");
      });
  });
  input("cpFormat").addEventListener("change", cpRender);
}

const EX: Record<string, { w: number; h: number; min: number; max: number }> = {
  ssc: { w: 200, h: 230, min: 20, max: 50 },
  upsc: { w: 350, h: 350, min: 20, max: 300 },
  bank: { w: 200, h: 230, min: 20, max: 50 },
  bpsc: { w: 250, h: 350, min: 20, max: 50 },
};

export function initExamPhoto(): void {
  let exPreset = "ssc";
  let exImg: HTMLImageElement | null = null;
  selGroup("exPreset", (v) => {
    exPreset = v;
    if (exImg) exRender();
  });
  wireDrop("exDrop", "exFile", (f) => {
    $("exName").textContent = f.name;
    loadImg(f)
      .then((r) => {
        exImg = r.img;
        exRender();
      })
      .catch(() => {
        setMsg("exMsg", T("exNoPhoto"), "warn");
      });
  });
  function exRender(): void {
    const P = EX[exPreset];
    if (!exImg) return;
    const name = input("exNameIn").value.trim();
    const dateV = input("exDateIn").value;
    const stripH = name ? Math.max(36, Math.round(P.h * 0.24)) : 0;
    const cv = canvas("exCanvas");
    cv.width = P.w;
    cv.height = P.h + stripH;
    const cx = ctx2d(cv);
    cx.fillStyle = "#fff";
    cx.fillRect(0, 0, cv.width, cv.height);
    drawCover(cx, exImg, 0, 0, P.w, P.h, 1, 0.3);
    if (stripH) {
      cx.fillStyle = "#fff";
      cx.fillRect(0, P.h, P.w, stripH);
      cx.fillStyle = "#111";
      cx.textAlign = "center";
      cx.font = `700 ${Math.max(13, Math.round(P.w * 0.075))}px 'Public Sans',sans-serif`;
      cx.fillText(name, P.w / 2, P.h + Math.round(stripH * 0.44));
      if (dateV) {
        cx.font = `500 ${Math.max(11, Math.round(P.w * 0.06))}px 'Public Sans',sans-serif`;
        const dp = dateV.split("-");
        cx.fillText(`${dp[2]}-${dp[1]}-${dp[0]}`, P.w / 2, P.h + Math.round(stripH * 0.82));
      }
    }
    $("exPreview").classList.add("show");
    setHTML(
      "exStat",
      `<span>${P.w}×${P.h} px</span><span>${EX[exPreset].min}–${EX[exPreset].max} KB</span>`,
    );
  }
  input("exNameIn").addEventListener("input", () => {
    if (exImg) exRender();
  });
  input("exDateIn").addEventListener("change", () => {
    if (exImg) exRender();
  });
  input("exGo").addEventListener("click", async function (this: HTMLButtonElement) {
    if (!exImg) {
      setMsg("exMsg", T("exNoPhoto"), "warn");
      return;
    }
    exRender();
    const P = EX[exPreset];
    const cv = canvas("exCanvas");
    let blob: Blob = await c2b(cv, 0.95);
    const qs = [0.95, 0.92, 0.88, 0.84, 0.8, 0.75, 0.7, 0.6, 0.5, 0.4, 0.3];
    for (let i = 0; i < qs.length; i++) {
      blob = await c2b(cv, qs[i]);
      if (blob.size <= P.max * 1024) break;
    }
    if (blob.size < P.min * 1024) blob = await padJpeg(blob, P.min * 1024 + 512);
    downloadBlob(blob, `exam-photo-${exPreset}.jpg`);
    setMsg("exMsg", `${T("exReady")} · ${fmtKB(blob.size)}`, "good");
    pulse(this);
  });

  input("exDateIn").value = new Date().toISOString().slice(0, 10);
}
