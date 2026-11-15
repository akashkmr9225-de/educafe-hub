import {
  $,
  c2b,
  chipGroup,
  ctx2d,
  downloadBlob,
  drawContain,
  drawCover,
  input,
  loadImg,
  loadScriptOnce,
  padJpeg,
  setMsg,
  toTargetKB,
  wireDrop,
} from "./helpers";

interface BkItem {
  id: number;
  img: HTMLImageElement;
  file: File;
  aiCanvas: HTMLCanvasElement | null;
  name: string;
  origName: string;
  date: string;
  fileType: string;
}

interface BkTemplate {
  slots: PsdLayer[];
  nameSlots: PsdLayer[];
  w: number;
  h: number;
  comp: HTMLCanvasElement;
  dpi: number;
}

interface BkMatch {
  status: "auto" | "review" | "none";
  cands: { i: number; s: number }[];
  row: number;
  s1: number;
}

interface BkXl {
  rows: string[][];
  names: string[];
  strict: string;
  header: boolean;
  keepNums: boolean;
}

interface BkState {
  items: BkItem[];
  seq: number;
  wmm: number;
  hmm: number;
  dpi: number;
  mode: string;
  labels: boolean;
  dateOn: boolean;
  guides: boolean;
  fmt: string;
  strip: string;
  sheets: HTMLCanvasElement[];
  layoutMode: string;
  template: BkTemplate | null;
  xl: BkXl;
  aiCrop: boolean;
  aiPortrait: boolean;
}

const BK_RULES: Record<string, { auto: number; gap: number; review: number }> = {
  strict: { auto: 0.92, gap: 0.15, review: 0.7 },
  balanced: { auto: 0.8, gap: 0.12, review: 0.62 },
  loose: { auto: 0.7, gap: 0.07, review: 0.5 },
};

const BK_AI_CONFIGS: { device: string; publicPath: string }[] = [
  { device: "gpu", publicPath: "https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/" },
  { device: "cpu", publicPath: "https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/" },
  { device: "cpu", publicPath: "https://cdn.jsdelivr.net/npm/@imgly/background-removal-data@1.7.0/dist/" },
  { device: "cpu", publicPath: "https://unpkg.com/@imgly/background-removal-data@1.7.0/dist/" },
];

const dynImport = new Function("u", "return import(u)") as (u: string) => Promise<ImglyModule>;

export function initBulk(): void {
  const bk: BkState = {
    items: [],
    seq: 0,
    wmm: 35,
    hmm: 45,
    dpi: 300,
    mode: "fill",
    labels: true,
    dateOn: false,
    guides: true,
    fmt: "orig",
    strip: "strip",
    sheets: [],
    layoutMode: "grid",
    template: null,
    xl: { rows: [], names: [], strict: "balanced", header: true, keepNums: true },
    aiCrop: true,
    aiPortrait: true,
  };

  function bkToggle(id: string, key: "labels" | "dateOn" | "guides"): void {
    const el = $(id);
    el.addEventListener("click", function (this: HTMLElement) {
      const on = this.getAttribute("aria-pressed") !== "true";
      this.setAttribute("aria-pressed", on ? "true" : "false");
      bk[key] = on;
      bkLayoutInfo();
    });
  }
  bkToggle("bkLabels", "labels");
  bkToggle("bkDateOn", "dateOn");
  bkToggle("bkGuides", "guides");

  chipGroup("bkPreset", (v) => {
    if (v === "custom") {
      $("bkCustomRow").style.display = "flex";
      bk.wmm = parseFloat(input("bkCW").value) || 35;
      bk.hmm = parseFloat(input("bkCH").value) || 45;
    } else {
      $("bkCustomRow").style.display = "none";
      const p = v.split("x");
      bk.wmm = parseFloat(p[0]);
      bk.hmm = parseFloat(p[1]);
    }
    bkLayoutInfo();
  });
  input("bkCW").addEventListener("input", function (this: HTMLInputElement) {
    bk.wmm = parseFloat(this.value) || 35;
    bkLayoutInfo();
  });
  input("bkCH").addEventListener("input", function (this: HTMLInputElement) {
    bk.hmm = parseFloat(this.value) || 45;
    bkLayoutInfo();
  });
  chipGroup("bkDpi", (v) => {
    bk.dpi = parseInt(v, 10);
    bkLayoutInfo();
  });
  chipGroup("bkMode", (v) => {
    bk.mode = v;
  });
  chipGroup("bkIndFmt", (v) => {
    bk.fmt = v;
  });
  chipGroup("bkStrip", (v) => {
    bk.strip = v;
  });
  input("bkGap").addEventListener("input", bkLayoutInfo);
  input("bkMargin").addEventListener("input", bkLayoutInfo);
  input("bkSzMode").addEventListener("change", function (this: HTMLSelectElement) {
    $("bkSz2").style.display = this.value === "between" ? "" : "none";
  });

  function bkCellMm(): { w: number; h: number; labH: number; dateH: number } {
    const labH = bk.labels ? 5 : 0;
    const dateH = bk.dateOn && bk.labels ? 4 : 0;
    return { w: bk.wmm, h: bk.hmm + labH + dateH, labH, dateH };
  }

  function bkLayoutInfo(): number {
    if (bk.layoutMode === "psd" && bk.template) {
      const perT = bk.template.slots.length;
      const boxT = $("bkLayout");
      if (bk.items.length) {
        boxT.innerHTML = `<span class='good'>${bk.items.length} photos</span><span>Layout: ${perT} photo slots per template page</span><span>${Math.ceil(bk.items.length / perT)} page(s)</span>`;
      } else {
        boxT.innerHTML = `<span>Layout: ${perT} photo slots per template page</span>`;
      }
      return perT;
    }
    const cell = bkCellMm();
    const gap = parseFloat(input("bkGap").value) || 0;
    const mar = parseFloat(input("bkMargin").value) || 0;
    function lay(W: number, H: number): number {
      return (
        Math.max(1, Math.floor((W - 2 * mar + gap) / (cell.w + gap))) *
        Math.max(1, Math.floor((H - 2 * mar + gap) / (cell.h + gap)))
      );
    }
    const per = Math.max(lay(210, 297), lay(297, 210));
    const box = $("bkLayout");
    if (bk.items.length) {
      box.innerHTML = `<span class='good'>${bk.items.length} photos</span><span>Layout: ${per} photos per A4 sheet</span><span>${Math.ceil(bk.items.length / per)} sheet(s)</span><span>${bk.wmm}×${bk.hmm} mm · ${bk.dpi} DPI</span>`;
    } else {
      box.innerHTML = `<span>Layout: ${per} photos per A4 sheet</span><span>${bk.wmm}×${bk.hmm} mm · ${bk.dpi} DPI</span>`;
    }
    return per;
  }

  function bkFmtDate(iso: string): string {
    if (!iso) return "";
    const p = iso.split("-");
    if (p.length !== 3) return iso;
    const y = p[0];
    const m = parseInt(p[1], 10);
    const d = parseInt(p[2], 10);
    const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const MONF = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const f = input("bkDateFmt").value;
    const dd = `0${d}`.slice(-2);
    const mm = `0${m}`.slice(-2);
    if (f === "dmy-") return `${dd}-${mm}-${y}`;
    if (f === "mdy") return `${mm}/${dd}/${y}`;
    if (f === "dmon") return `${d} ${MON[m - 1]} ${y}`;
    if (f === "dmonf") return `${d} ${MONF[m - 1]} ${y}`;
    if (f === "ymd") return `${y}-${mm}-${dd}`;
    return `${dd}/${mm}/${y}`;
  }

  function bkDrawCell(
    ctx: CanvasRenderingContext2D,
    it: BkItem,
    x: number,
    y: number,
    MM: number,
  ): void {
    const pw = bk.wmm * MM;
    const ph = bk.hmm * MM;
    const cell = bkCellMm();
    const bgc = input("bkBg").value || "#ffffff";
    if (bk.mode === "fit") {
      ctx.fillStyle = bgc;
      ctx.fillRect(x, y, pw, ph);
      drawContain(ctx, it.img, x, y, pw, ph);
    } else {
      drawCover(ctx, it.img, x, y, pw, ph, 1, 0.25);
    }
    let cy = y + ph;
    ctx.textAlign = "center";
    if (bk.labels && cell.labH) {
      const lh = cell.labH * MM;
      ctx.fillStyle = bgc;
      ctx.fillRect(x, cy, pw, lh);
      ctx.fillStyle = "#202124";
      ctx.font = `700 ${Math.round(lh * 0.52)}px sans-serif`;
      ctx.fillText(it.name || "", x + pw / 2, cy + lh * 0.72, pw - 6);
      cy += lh;
    }
    if (bk.dateOn && bk.labels && cell.dateH) {
      const dh = cell.dateH * MM;
      const ds = bkFmtDate(it.date || input("bkDate").value);
      ctx.fillStyle = bgc;
      ctx.fillRect(x, cy, pw, dh);
      if (ds) {
        ctx.fillStyle = "#44403c";
        ctx.font = `600 ${Math.round(dh * 0.5)}px sans-serif`;
        ctx.fillText((input("bkDatePrefix").value || "") + ds, x + pw / 2, cy + dh * 0.7, pw - 6);
      }
      cy += dh;
    }
    ctx.textAlign = "left";
    if (bk.guides) {
      ctx.strokeStyle = "#b9b2a0";
      ctx.lineWidth = Math.max(1, MM * 0.15);
      ctx.strokeRect(x, y, pw, cell.h * MM);
    }
  }

  function bkRenderSheets(): number {
    if (bk.layoutMode === "psd") return bkRenderTemplateSheets();
    const MM = bk.dpi / 25.4;
    const cell = bkCellMm();
    const gap = (parseFloat(input("bkGap").value) || 0) * MM;
    const mar = (parseFloat(input("bkMargin").value) || 0) * MM;
    const cellW = cell.w * MM;
    const cellH = cell.h * MM;
    function lay(W: number, H: number): { cols: number; rows: number; cap: number } {
      const cols = Math.max(1, Math.floor((W - 2 * mar + gap) / (cellW + gap)));
      const rows = Math.max(1, Math.floor((H - 2 * mar + gap) / (cellH + gap)));
      return { cols, rows, cap: cols * rows };
    }
    const AW = Math.round(210 * MM);
    const AH = Math.round(297 * MM);
    const L1 = lay(AW, AH);
    const L2 = lay(AH, AW);
    let L = L1;
    let W = AW;
    let H = AH;
    if (L2.cap > L1.cap) {
      L = L2;
      W = AH;
      H = AW;
    }
    bk.sheets = [];
    for (let s = 0; s < bk.items.length; s += L.cap) {
      const cv = document.createElement("canvas");
      cv.width = W;
      cv.height = H;
      const ctx = ctx2d(cv);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
      const chunk = bk.items.slice(s, s + L.cap);
      const rowsUsed = Math.ceil(chunk.length / L.cols);
      const blockW = L.cols * cellW + (L.cols - 1) * gap;
      const blockH = rowsUsed * cellH + (rowsUsed - 1) * gap;
      const x0 = (W - blockW) / 2;
      const y0 = (H - blockH) / 2;
      chunk.forEach((it, i) => {
        const cx = x0 + (i % L.cols) * (cellW + gap);
        const cyy = y0 + Math.floor(i / L.cols) * (cellH + gap);
        bkDrawCell(ctx, it, cx, cyy, MM);
      });
      bk.sheets.push(cv);
    }
    const box = $("bkSheets");
    box.innerHTML = "";
    bk.sheets.forEach((cv) => box.appendChild(cv));
    $("bkPdf").style.display = bk.sheets.length ? "inline-flex" : "none";
    $("bkZip").style.display = bk.sheets.length ? "inline-flex" : "none";
    return bk.sheets.length;
  }

  async function bkPhotoCanvas(it: BkItem, withStrip: boolean): Promise<HTMLCanvasElement> {
    const MM = bk.dpi / 25.4;
    const cell = bkCellMm();
    const cv = document.createElement("canvas");
    cv.width = Math.round(bk.wmm * MM);
    cv.height = Math.round((withStrip ? cell.h : bk.hmm) * MM);
    const ctx = ctx2d(cv);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cv.width, cv.height);
    if (withStrip) {
      bkDrawCell(ctx, it, 0, 0, MM);
    } else if (bk.mode === "fit") {
      ctx.fillStyle = input("bkBg").value || "#ffffff";
      ctx.fillRect(0, 0, cv.width, cv.height);
      drawContain(ctx, it.img, 0, 0, cv.width, cv.height);
    } else {
      drawCover(ctx, it.img, 0, 0, cv.width, cv.height, 1, 0.25);
    }
    return cv;
  }

  function bkSafeName(it: BkItem): string {
    return (it.name || "photo").replace(/[^\w\- ]+/g, "").trim() || `photo-${it.id}`;
  }

  async function bkIndividualBlob(it: BkItem): Promise<{ blob: Blob; ext: string }> {
    const cv = await bkPhotoCanvas(it, bk.strip === "strip");
    let mime = bk.fmt;
    let ext = "jpg";
    if (mime === "orig") mime = it.fileType || "image/jpeg";
    if (mime === "image/png") ext = "png";
    else if (mime === "image/webp") ext = "webp";
    else {
      mime = "image/jpeg";
      ext = "jpg";
    }
    const mode = input("bkSzMode").value;
    const unit = input("bkSzUnit").value === "MB" ? 1024 : 1;
    const v1 = (parseFloat(input("bkSz1").value) || 50) * unit;
    const v2 = (parseFloat(input("bkSz2").value) || 100) * unit;
    let blob: Blob;
    if (mode === "under" && mime === "image/jpeg") {
      blob = await toTargetKB(cv, v1);
    } else if (mode === "between" && mime === "image/jpeg") {
      blob = await toTargetKB(cv, Math.max(v1, v2));
      if (blob.size < v1 * 1024) blob = await padJpeg(blob, v1 * 1024);
    } else {
      blob = await new Promise<Blob>((res) => {
        cv.toBlob((b) => res(b as Blob), mime, 0.95);
      });
      if (mode === "atleast" && mime === "image/jpeg" && blob.size < v1 * 1024) {
        blob = await padJpeg(blob, v1 * 1024);
      }
    }
    return { blob, ext };
  }

  function bkAddFiles(fileList: FileList | null): void {
    const files = Array.from(fileList || []).filter(
      (f) => /image|hei[cf]/i.test(f.type) || /\.(jpe?g|png|webp|hei[cf])$/i.test(f.name),
    );
    if (!files.length) return;
    const msg = $("bkMsg");
    msg.textContent = "Loading photos…";
    msg.className = "msg";
    let done = 0;
    files.forEach((f) => {
      loadImg(f)
        .then((r) => {
          const base =
            f.name
              .replace(/\.[^.]+$/, "")
              .replace(/^\d+[\s._-]+/, "")
              .trim() || f.name;
          bk.items.push({
            id: ++bk.seq,
            img: r.img,
            file: f,
            aiCanvas: null,
            name: base,
            origName: base,
            date: "",
            fileType: /png/i.test(f.type) ? "image/png" : /webp/i.test(f.type) ? "image/webp" : "image/jpeg",
          });
        })
        .catch(() => undefined)
        .then(() => {
          done++;
          if (done === files.length) {
            bkRenderThumbs();
            bkLayoutInfo();
            msg.textContent = `✔ ${bk.items.length} photos ready — check the names, then make sheets or download separate files.`;
            msg.className = "msg good";
          }
        });
    });
  }

  function bkButtons(): void {
    const has = bk.items.length > 0;
    (input("bkGenerate") as HTMLButtonElement).disabled = !has;
    (input("bkIndBtn") as HTMLButtonElement).disabled = !has;
    (input("bkAiRun") as HTMLButtonElement).disabled = !has;
    $("bkClear").style.display = has ? "inline-flex" : "none";
    $("bkName").textContent = has ? `✔ ${bk.items.length} photos loaded` : "";
    if (!has) {
      $("bkSheets").innerHTML = "";
      bk.sheets = [];
      $("bkPdf").style.display = "none";
      $("bkZip").style.display = "none";
    }
  }

  function bkRenderThumbs(): void {
    const box = $("bkThumbs");
    box.innerHTML = "";
    bk.items.forEach((it) => {
      const d = document.createElement("div");
      d.className = "bthumb";
      const im = document.createElement("img");
      im.src = it.img.src;
      im.alt = it.name;
      d.appendChild(im);
      const ni = document.createElement("input");
      ni.type = "text";
      ni.value = it.name;
      ni.placeholder = "Name / ID";
      ni.setAttribute("aria-label", "Student name");
      ni.addEventListener("input", function (this: HTMLInputElement) {
        it.name = this.value;
      });
      d.appendChild(ni);
      const di = document.createElement("input");
      di.type = "date";
      di.value = it.date || "";
      di.setAttribute("aria-label", "Date for this student");
      di.addEventListener("input", function (this: HTMLInputElement) {
        it.date = this.value;
      });
      d.appendChild(di);
      const row = document.createElement("div");
      row.className = "trow";
      const dl = document.createElement("button");
      dl.type = "button";
      dl.className = "btn saf small";
      dl.textContent = "⬇";
      dl.setAttribute("aria-label", "Download this photo");
      dl.addEventListener("click", async () => {
        const r = await bkIndividualBlob(it);
        downloadBlob(r.blob, `${bkSafeName(it)}.${r.ext}`);
      });
      const rm = document.createElement("button");
      rm.type = "button";
      rm.className = "btn ghost small";
      rm.textContent = "✕";
      rm.setAttribute("aria-label", "Remove this photo");
      rm.addEventListener("click", () => {
        bk.items = bk.items.filter((x) => x.id !== it.id);
        bkRenderThumbs();
        bkLayoutInfo();
        bkButtons();
      });
      row.appendChild(dl);
      row.appendChild(rm);
      d.appendChild(row);
      box.appendChild(d);
    });
    bkButtons();
  }

  $("bkDrop").addEventListener("click", () => input("bkFiles").click());
  $("bkDrop").addEventListener("keydown", (e) => {
    const key = (e as KeyboardEvent).key;
    if (key === "Enter" || key === " ") {
      e.preventDefault();
      input("bkFiles").click();
    }
  });
  ["dragover", "dragenter"].forEach((ev) => {
    $("bkDrop").addEventListener(ev, (e) => {
      e.preventDefault();
      $("bkDrop").classList.add("over");
    });
  });
  ["dragleave", "drop"].forEach((ev) => {
    $("bkDrop").addEventListener(ev, (e) => {
      e.preventDefault();
      $("bkDrop").classList.remove("over");
    });
  });
  $("bkDrop").addEventListener("drop", (e) => {
    const files = (e as DragEvent).dataTransfer?.files;
    if (files && files.length) bkAddFiles(files);
  });
  input("bkFiles").addEventListener("change", function (this: HTMLInputElement) {
    bkAddFiles(this.files);
    this.value = "";
  });
  $("bkFolderBtn").addEventListener("click", () => input("bkFolder").click());
  input("bkFolder").addEventListener("change", function (this: HTMLInputElement) {
    bkAddFiles(this.files);
    this.value = "";
  });
  $("bkClear").addEventListener("click", () => {
    bk.items = [];
    bkRenderThumbs();
    bkLayoutInfo();
  });
  $("bkGenerate").addEventListener("click", () => {
    if (!bk.items.length) return;
    const n = bkRenderSheets();
    const msg = $("bkMsg");
    msg.textContent = `✔ ${n} A4 sheet(s) ready — see the preview below, then download the PDF or ZIP.`;
    msg.className = "msg good";
    bkLayoutInfo();
  });
  $("bkPdf").addEventListener("click", () => {
    if (!bk.sheets.length || !window.jspdf) return;
    const JsPDF = window.jspdf.jsPDF;
    const geom = (cv: HTMLCanvasElement) => {
      let wmm: number;
      let hmm: number;
      if (bk.layoutMode === "psd" && bk.template) {
        wmm = (bk.template.w / bk.template.dpi) * 25.4;
        hmm = (bk.template.h / bk.template.dpi) * 25.4;
      } else {
        const land = cv.width > cv.height;
        wmm = land ? 297 : 210;
        hmm = land ? 210 : 297;
      }
      return {
        wmm,
        hmm,
        orient: wmm > hmm ? "landscape" : "portrait",
        fmt: [wmm, hmm] as [number, number],
      };
    };
    const first = geom(bk.sheets[0]);
    const doc = new JsPDF({ unit: "mm", format: first.fmt, orientation: first.orient });
    doc.addImage(bk.sheets[0].toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, first.wmm, first.hmm);
    for (let i = 1; i < bk.sheets.length; i++) {
      const g = geom(bk.sheets[i]);
      doc.addPage(g.fmt, g.orient);
      doc.addImage(bk.sheets[i].toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, g.wmm, g.hmm);
    }
    doc.save("student-photo-sheets.pdf");
  });
  $("bkZip").addEventListener("click", async () => {
    if (!bk.sheets.length || !window.JSZip) return;
    const zip = new window.JSZip();
    for (let i = 0; i < bk.sheets.length; i++) {
      zip.file(`sheet-${i + 1}.jpg`, await c2b(bk.sheets[i], 0.92));
    }
    downloadBlob(await zip.generateAsync({ type: "blob" }), "student-photo-sheets.zip");
  });
  $("bkIndBtn").addEventListener("click", async function (this: HTMLButtonElement, e: Event) {
    if (!bk.items.length || !window.JSZip) return;
    const btn = e.currentTarget as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = "Making ZIP…";
    const zip = new window.JSZip();
    const used: Record<string, number> = {};
    for (let i = 0; i < bk.items.length; i++) {
      const it = bk.items[i];
      const r = await bkIndividualBlob(it);
      let nm = bkSafeName(it);
      if (used[nm]) nm = `${nm}-${it.id}`;
      used[nm] = 1;
      zip.file(`${nm}.${r.ext}`, r.blob);
    }
    downloadBlob(await zip.generateAsync({ type: "blob" }), "student-photos.zip");
    btn.disabled = false;
    btn.textContent = "⬇ Download all photos (ZIP)";
    const msg = $("bkMsg");
    msg.textContent = "✔ ZIP downloaded — one file per student, each with its own name.";
    msg.className = "msg good";
  });

  chipGroup("bkLayoutMode", (v) => {
    bk.layoutMode = v;
    $("bkPsdBox").hidden = v !== "psd";
    bk.sheets = [];
    $("bkSheets").innerHTML = "";
    $("bkPdf").style.display = "none";
    $("bkZip").style.display = "none";
    bkLayoutInfo();
  });

  function bkFlattenLayers(children: PsdLayer[] | undefined, out: PsdLayer[]): PsdLayer[] {
    (children || []).forEach((l) => {
      out.push(l);
      if (l.children) bkFlattenLayers(l.children, out);
    });
    return out;
  }

  wireDrop("bkPsdDrop", "bkPsdFile", async (f) => {
    const stat = $("bkPsdStat");
    $("bkPsdName").textContent = `✔ ${f.name}`;
    stat.innerHTML = "<span>Reading template…</span>";
    try {
      if (!window.agPsd) {
        await loadScriptOnce("https://cdn.jsdelivr.net/npm/ag-psd@34.2.0/dist/bundle.js");
      }
      if (!window.agPsd) throw new Error("ag-psd missing");
      const buf = await f.arrayBuffer();
      const psd = window.agPsd.readPsd(buf, {
        useImageData: true,
        skipLayerImageData: false,
        skipCompositeImageData: false,
      });
      const flat = bkFlattenLayers(psd.children, []);
      const slots = flat
        .filter((l) => l && l.name && /photo|slot|placeholder/i.test(l.name) && !l.hidden)
        .sort((a, b) => a.top - b.top || a.left - b.left);
      const nameSlots = flat
        .filter((l) => l && l.name && /\bname\b|label|caption/i.test(l.name) && !l.hidden)
        .sort((a, b) => a.top - b.top || a.left - b.left);
      if (!slots.length) {
        stat.innerHTML =
          "<span>⚠ No photo slot layers found — rename the layers so the name includes photo, slot or placeholder.</span>";
        bk.template = null;
        return;
      }
      let comp = psd.canvas || null;
      if (!comp) {
        comp = document.createElement("canvas");
        comp.width = psd.width;
        comp.height = psd.height;
        const cx = ctx2d(comp);
        cx.fillStyle = "#ffffff";
        cx.fillRect(0, 0, psd.width, psd.height);
        flat.forEach((l) => {
          if (!l.hidden && l.canvas) cx.drawImage(l.canvas, l.left, l.top);
        });
      }
      let dpi = 300;
      try {
        const ri = psd.imageResources?.resolutionInfo;
        if (ri && ri.horizontalResolution) dpi = Math.round(ri.horizontalResolution);
      } catch {
        dpi = 300;
      }
      bk.template = { slots, nameSlots, w: psd.width, h: psd.height, comp, dpi: dpi || 300 };
      stat.innerHTML = `<span class='good'>${slots.length} photo slots</span><span>${nameSlots.length} name layers</span><span>${psd.width}×${psd.height} px · ${bk.template.dpi} DPI</span>`;
      bkLayoutInfo();
    } catch {
      stat.innerHTML =
        "<span>⚠ This PSD could not be read — it may be corrupt or use an unsupported feature.</span>";
      bk.template = null;
    }
  });

  function bkRenderTemplateSheets(): number {
    const box = $("bkSheets");
    box.innerHTML = "";
    bk.sheets = [];
    if (!bk.template) {
      setMsg(
        "bkMsg",
        "Upload a PSD template first — template sheets cannot be made without one.",
        "warn",
      );
      return 0;
    }
    const T = bk.template;
    const per = T.slots.length;
    const bgc = input("bkBg").value || "#ffffff";
    for (let s = 0; s < bk.items.length; s += per) {
      const cv = document.createElement("canvas");
      cv.width = T.w;
      cv.height = T.h;
      const ctx = ctx2d(cv);
      ctx.drawImage(T.comp, 0, 0);
      const chunk = bk.items.slice(s, s + per);
      chunk.forEach((it, i) => {
        const sl = T.slots[i];
        if (!sl) return;
        ctx.save();
        ctx.beginPath();
        ctx.rect(sl.left, sl.top, sl.width, sl.height);
        ctx.clip();
        ctx.fillStyle = bgc;
        ctx.fillRect(sl.left, sl.top, sl.width, sl.height);
        if (bk.mode === "fit") drawContain(ctx, it.img, sl.left, sl.top, sl.width, sl.height);
        else drawCover(ctx, it.img, sl.left, sl.top, sl.width, sl.height, 1, 0.25);
        ctx.restore();
        if (bk.guides) {
          ctx.strokeStyle = "#b9b2a0";
          ctx.lineWidth = 2;
          ctx.strokeRect(sl.left, sl.top, sl.width, sl.height);
        }
        const ns = T.nameSlots[i];
        if (ns && bk.labels) {
          ctx.fillStyle = bgc;
          ctx.fillRect(ns.left, ns.top, ns.width, ns.height);
          ctx.fillStyle = "#202124";
          ctx.textAlign = "center";
          const hasDate = bk.dateOn;
          const ds = hasDate ? bkFmtDate(it.date || input("bkDate").value) : "";
          ctx.font = `700 ${Math.round(ns.height * (hasDate && ds ? 0.34 : 0.5))}px sans-serif`;
          ctx.fillText(
            it.name || "",
            ns.left + ns.width / 2,
            ns.top + ns.height * (hasDate && ds ? 0.4 : 0.68),
            ns.width - 4,
          );
          if (hasDate && ds) {
            ctx.font = `600 ${Math.round(ns.height * 0.26)}px sans-serif`;
            ctx.fillStyle = "#44403c";
            ctx.fillText(
              (input("bkDatePrefix").value || "") + ds,
              ns.left + ns.width / 2,
              ns.top + ns.height * 0.82,
              ns.width - 4,
            );
          }
          ctx.textAlign = "left";
        }
      });
      bk.sheets.push(cv);
      box.appendChild(cv);
    }
    $("bkPdf").style.display = bk.sheets.length ? "inline-flex" : "none";
    $("bkZip").style.display = bk.sheets.length ? "inline-flex" : "none";
    return bk.sheets.length;
  }

  function bkNorm(s: string): string {
    return (s || "")
      .toString()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/^[\s(\[#]*\d+[\s)\].\-_:#]*/, "")
      .replace(/[^\p{L}\p{M}\s]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function bkStripNum(s: string): string {
    const t = (s || "").replace(/^[\s(\[#]*\d+[\s)\].\-_:#]*/, "").trim();
    return /\p{L}/u.test(t) ? t : s || "";
  }
  function bkLev(a: string, b: string): number {
    if (a === b) return 0;
    const m = a.length;
    const n = b.length;
    if (!m) return n;
    if (!n) return m;
    let prev: number[] = [];
    let cur: number[] = new Array(n + 1);
    for (let i = 0; i <= n; i++) prev.push(i);
    for (let i = 1; i <= m; i++) {
      cur[0] = i;
      for (let j = 1; j <= n; j++) {
        cur[j] = Math.min(
          prev[j] + 1,
          cur[j - 1] + 1,
          prev[j - 1] + (a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1),
        );
      }
      const t = prev;
      prev = cur;
      cur = t;
    }
    return prev[n];
  }
  function bkSim(a: string, b: string): number {
    const L = Math.max(a.length, b.length);
    return L ? 1 - bkLev(a, b) / L : 1;
  }
  function bkTokScore(p: string, e: string): number {
    if (p === e) return 1;
    if (p.length === 1) return e[0] === p ? 0.8 : 0;
    if (e.indexOf(p) === 0) return 0.9;
    if (e.length >= 3 && p.indexOf(e) === 0) return 0.85;
    if (p.length >= 4 && e.length >= 4) {
      const s = bkSim(p, e);
      if (s >= 0.75) return s * 0.9;
    }
    return 0;
  }
  function bkPairScore(pn: string, en: string): number {
    if (!pn || !en) return 0;
    if (pn === en) return 1;
    const pt = pn.split(" ");
    const et = en.split(" ");
    if (pt.slice().sort().join(" ") === et.slice().sort().join(" ")) return 0.985;
    const used: Record<number, number> = {};
    let sum = 0;
    let usedCount = 0;
    pt.forEach((p) => {
      let best = 0;
      let bi = -1;
      et.forEach((e, i) => {
        if (used[i]) return;
        const s = bkTokScore(p, e);
        if (s > best) {
          best = s;
          bi = i;
        }
      });
      if (bi >= 0) {
        used[bi] = 1;
        usedCount++;
        sum += best;
      }
    });
    const avg = sum / pt.length;
    const cov = usedCount / et.length;
    return Math.max(avg * (0.72 + 0.28 * cov), bkSim(pn, en) * 0.97);
  }

  function bkComputeMatches(photoNames: string[], excelNames: string[], level: string): BkMatch[] {
    const R = BK_RULES[level] || BK_RULES.balanced;
    const E = excelNames.map((n) => {
      const k = bkNorm(n);
      const f: Record<string, number> = {};
      k.split(" ").forEach((w) => {
        if (w) f[w[0]] = 1;
      });
      return { k, f };
    });
    const out: BkMatch[] = [];
    photoNames.forEach((pn0) => {
      const k = bkNorm(pn0);
      const pf = k.split(" ").map((w) => w[0]);
      let c: { i: number; s: number }[] = [];
      if (k) {
        E.forEach((e, i) => {
          let share = false;
          pf.forEach((f) => {
            if (e.f[f]) share = true;
          });
          if (!e.k || !share) return;
          const s = bkPairScore(k, e.k);
          if (s >= 0.4) c.push({ i, s });
        });
      }
      c.sort((a, b) => b.s - a.s);
      c = c.slice(0, 6);
      const s1 = c.length ? c[0].s : 0;
      const s2 = c.length > 1 ? c[1].s : 0;
      const status: BkMatch["status"] =
        (s1 >= R.auto && s1 - s2 >= R.gap) || (s1 >= 0.999 && s2 < 0.999)
          ? "auto"
          : s1 >= R.review
            ? "review"
            : "none";
      out.push({ status, cands: c, row: c.length ? c[0].i : -1, s1 });
    });
    const claimed: Record<number, number> = {};
    out
      .map((_, i) => i)
      .sort((a, b) => out[b].s1 - out[a].s1)
      .forEach((i) => {
        const o = out[i];
        if (o.status !== "auto") return;
        if (claimed[o.row]) o.status = "review";
        else claimed[o.row] = 1;
      });
    return out;
  }

  function bkLooksHeader(row: string[]): boolean {
    return (row || []).some(
      (c) =>
        !!c &&
        /name|student|pupil|roll|s\.?\s?no|sr\.?\s?no|class|admission|dob|date|section|father|mother/i.test(c) &&
        !/\d{3,}/.test(c),
    );
  }

  function bkGuessCol(rows: string[][], hasHeader: boolean): number {
    const data = rows.slice(hasHeader ? 1 : 0, 60);
    let w = 0;
    rows.slice(0, 60).forEach((r) => {
      w = Math.max(w, r.length);
    });
    let best = 0;
    let bs = -9;
    for (let c = 0; c < w; c++) {
      const cells = data.map((r) => r[c] || "").filter(Boolean);
      if (!cells.length) continue;
      const s =
        cells.filter((x) => /\p{L}{2,}/u.test(x) && !/^\d/.test(x)).length / data.length;
      const hd = hasHeader ? rows[0][c] || "" : "";
      let adj = s;
      if (/student|pupil/i.test(hd) && /name/i.test(hd)) adj += 2;
      else if (/name/i.test(hd) && !/father|mother|guardian|parent|school|class/i.test(hd)) adj += 1.5;
      else if (/father|mother|guardian|parent|school|class|section|address/i.test(hd)) adj -= 3;
      if (adj > bs) {
        bs = adj;
        best = c;
      }
    }
    return best;
  }

  let bkWb: XlsxWorkbook | null = null;

  function bkXlLoadSheet(): void {
    if (!bkWb || !window.XLSX) return;
    const ws = bkWb.Sheets[input("bkXlSheet").value];
    bk.xl.rows = window.XLSX.utils
      .sheet_to_json(ws, { header: 1, defval: "", raw: true })
      .map((r) => r.map((c) => (c == null ? "" : String(c).trim())));
    const hasH = bkLooksHeader(bk.xl.rows[0] || []);
    bk.xl.header = hasH;
    $("bkXlHeader").setAttribute("aria-pressed", hasH ? "true" : "false");
    bkXlFillCols();
  }

  function bkXlFillCols(): void {
    const rows = bk.xl.rows;
    const colSel = input("bkXlCol");
    colSel.innerHTML = "";
    let w = 0;
    rows.slice(0, 60).forEach((r) => {
      w = Math.max(w, r.length);
    });
    for (let c = 0; c < w; c++) {
      const o = document.createElement("option");
      o.value = String(c);
      const head = bk.xl.header ? rows[0][c] || "" : "";
      o.textContent = `Column ${String.fromCharCode(65 + c)}${head ? ` — ${head}` : ""}`;
      colSel.appendChild(o);
    }
    colSel.value = String(bkGuessCol(rows, bk.xl.header));
  }

  wireDrop("bkXlDrop", "bkXlFile", async (f) => {
    const msg = $("bkXlMsg");
    $("bkXlName").textContent = `✔ ${f.name}`;
    try {
      if (!window.XLSX) {
        await loadScriptOnce("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js");
      }
      if (!window.XLSX) throw new Error("xlsx missing");
      const buf = await f.arrayBuffer();
      bkWb = window.XLSX.read(buf, { type: "array" });
      const sel = input("bkXlSheet");
      sel.innerHTML = "";
      bkWb.SheetNames.forEach((n) => {
        const o = document.createElement("option");
        o.value = n;
        o.textContent = n;
        sel.appendChild(o);
      });
      $("bkXlBox").hidden = false;
      bkXlLoadSheet();
      msg.textContent = "";
    } catch {
      setMsg("bkXlMsg", "This file could not be read as Excel/CSV — check the file and try again.", "warn");
    }
  });

  input("bkXlSheet").addEventListener("change", bkXlLoadSheet);
  $("bkXlHeader").addEventListener("click", function (this: HTMLElement) {
    bk.xl.header = this.getAttribute("aria-pressed") !== "true";
    this.setAttribute("aria-pressed", bk.xl.header ? "true" : "false");
    bkXlFillCols();
  });
  $("bkKeepNums").addEventListener("click", function (this: HTMLElement) {
    bk.xl.keepNums = this.getAttribute("aria-pressed") !== "true";
    this.setAttribute("aria-pressed", bk.xl.keepNums ? "true" : "false");
  });
  chipGroup("bkXlStrict", (v) => {
    bk.xl.strict = v;
  });

  function bkApplyName(it: BkItem, excelName: string): void {
    let applied = excelName;
    if (bk.xl.keepNums) {
      const m = (it.origName || "").match(/^[\s(\[#]*(\d+)[\s)\].\-_:#]+/);
      if (m) applied = `${m[1]} ${excelName}`;
    } else {
      applied = bkStripNum(excelName);
    }
    it.name = applied;
  }

  function bkRenderMatchList(matches: BkMatch[]): void {
    const list = $("bkMatchList");
    list.innerHTML = "";
    matches.forEach((m, i) => {
      if (m.status !== "review") return;
      const it = bk.items[i];
      const row = document.createElement("div");
      row.className = "num2";
      row.style.marginTop = "8px";
      const lab = document.createElement("span");
      lab.className = "hint";
      lab.style.margin = "0";
      lab.textContent = `${it.origName} →`;
      const sel = document.createElement("select");
      sel.setAttribute("aria-label", `Pick the correct name for ${it.origName}`);
      const keep = document.createElement("option");
      keep.value = "";
      keep.textContent = `Keep my name: ${it.origName}`;
      sel.appendChild(keep);
      m.cands.forEach((c) => {
        const o = document.createElement("option");
        o.value = bk.xl.names[c.i];
        o.textContent = `${bk.xl.names[c.i]} · ${Math.round(c.s * 100)}%`;
        sel.appendChild(o);
      });
      sel.addEventListener("change", function (this: HTMLSelectElement) {
        if (this.value) {
          bkApplyName(it, this.value);
          bkRenderThumbs();
          lab.textContent = `${it.origName} → ✔ ${it.name}`;
        }
      });
      row.appendChild(lab);
      row.appendChild(sel);
      list.appendChild(row);
    });
  }

  $("bkXlRun").addEventListener("click", () => {
    const msg = $("bkXlMsg");
    const stat = $("bkXlStat");
    if (!bk.items.length) {
      setMsg("bkXlMsg", "Add the student photos first, then match names.", "warn");
      return;
    }
    const col = parseInt(input("bkXlCol").value, 10) || 0;
    const names = bk.xl.rows
      .slice(bk.xl.header ? 1 : 0)
      .map((r) => (r[col] || "").trim())
      .filter(Boolean);
    bk.xl.names = names;
    if (!names.length) {
      setMsg("bkXlMsg", "No names found in that column — pick another column.", "warn");
      return;
    }
    const matches = bkComputeMatches(
      bk.items.map((it) => it.name),
      names,
      bk.xl.strict,
    );
    let auto = 0;
    let review = 0;
    let none = 0;
    matches.forEach((m, i) => {
      const it = bk.items[i];
      if (m.status === "auto") {
        bkApplyName(it, names[m.row]);
        auto++;
      } else if (m.status === "review") review++;
      else none++;
    });
    bkRenderThumbs();
    bkRenderMatchList(matches);
    stat.innerHTML = `<span class='good'>Auto-renamed: ${auto}</span><span>Needs your check: ${review}</span><span>No match: ${none}</span><span>Names in list: ${names.length}</span>`;
    $("bkXlUndo").style.display = "inline-flex";
    msg.textContent =
      "✔ Matching done. Auto-renamed photos are final; the “needs check” ones are listed below — pick the right name for each.";
    msg.className = "msg good";
  });

  $("bkXlUndo").addEventListener("click", function (this: HTMLElement) {
    bk.items.forEach((it) => {
      it.name = it.origName;
    });
    bkRenderThumbs();
    $("bkMatchList").innerHTML = "";
    $("bkXlStat").innerHTML = "";
    this.style.display = "none";
    setMsg("bkXlMsg", "✔ All renaming undone — original file names are back.", "good");
  });

  let bkImglyFn: ((file: Blob, cfg: Record<string, unknown>) => Promise<Blob>) | null = null;

  async function bkLoadImgly(): Promise<(file: Blob, cfg: Record<string, unknown>) => Promise<Blob>> {
    if (bkImglyFn) return bkImglyFn;
    const urls = [
      "https://esm.sh/@imgly/background-removal@1.7.0?bundle",
      "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/+esm",
      "https://esm.run/@imgly/background-removal@1.7.0",
      "https://unpkg.com/@imgly/background-removal@1.7.0/dist/index.mjs",
    ];
    for (const u of urls) {
      try {
        const mod = await dynImport(u);
        const fn = mod.removeBackground || mod.default;
        if (typeof fn === "function") {
          bkImglyFn = fn;
          return fn;
        }
      } catch {
        continue;
      }
    }
    throw new Error("engine missing");
  }

  $("bkAiCrop").addEventListener("click", function (this: HTMLElement) {
    bk.aiCrop = this.getAttribute("aria-pressed") !== "true";
    this.setAttribute("aria-pressed", bk.aiCrop ? "true" : "false");
  });
  $("bkAiPortrait").addEventListener("click", function (this: HTMLElement) {
    bk.aiPortrait = this.getAttribute("aria-pressed") !== "true";
    this.setAttribute("aria-pressed", bk.aiPortrait ? "true" : "false");
  });

  function bkAlphaBBox(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
  ): { x: number; y: number; w: number; h: number } | null {
    const d = ctx.getImageData(0, 0, w, h).data;
    let minX = w;
    let minY = h;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (d[(y * w + x) * 4 + 3] > 12) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    return maxX < 0 ? null : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
  }

  function bkAiFinish(img: HTMLImageElement): HTMLCanvasElement {
    const cv = document.createElement("canvas");
    cv.width = img.naturalWidth;
    cv.height = img.naturalHeight;
    const ctx = ctx2d(cv);
    ctx.drawImage(img, 0, 0);
    const bb = bkAlphaBBox(ctx, cv.width, cv.height);
    let work = cv;
    if (bb && (bk.aiCrop || bk.aiPortrait)) {
      const padX = Math.round(bb.w * 0.12);
      const padTop = Math.round(bb.h * 0.08);
      const padBot = Math.round(bb.h * 0.05);
      let x0 = Math.max(0, bb.x - padX);
      let x1 = Math.min(cv.width, bb.x + bb.w + padX);
      let y0 = Math.max(0, bb.y - padTop);
      let y1 = Math.min(cv.height, bb.y + bb.h + padBot);
      if (bk.aiPortrait) {
        const ratio = bk.wmm / bk.hmm;
        let cw = x1 - x0;
        let ch = cw / ratio;
        if (ch > y1 - y0) {
          ch = y1 - y0;
          cw = ch * ratio;
          const cxm = (x0 + x1) / 2;
          x0 = Math.max(0, Math.round(cxm - cw / 2));
          x1 = Math.min(cv.width, x0 + cw);
        } else {
          y1 = y0 + ch;
          if (y1 > cv.height) {
            y1 = cv.height;
            y0 = y1 - ch;
          }
        }
      }
      const c2 = document.createElement("canvas");
      c2.width = Math.max(1, Math.round(x1 - x0));
      c2.height = Math.max(1, Math.round(y1 - y0));
      ctx2d(c2).drawImage(cv, x0, y0, c2.width, c2.height, 0, 0, c2.width, c2.height);
      work = c2;
    }
    const out = document.createElement("canvas");
    out.width = work.width;
    out.height = work.height;
    const octx = ctx2d(out);
    octx.fillStyle = input("bkBg").value || "#ffffff";
    octx.fillRect(0, 0, out.width, out.height);
    octx.drawImage(work, 0, 0);
    return out;
  }

  $("bkAiRun").addEventListener("click", async function (this: HTMLButtonElement, e: Event) {
    const msg = $("bkAiMsg");
    const btn = e.currentTarget as HTMLButtonElement;
    if (!bk.items.length) return;
    btn.disabled = true;
    msg.textContent =
      "AI engine loading… the first run downloads the model and WASM (about 40 MB) — keep this tab open.";
    msg.className = "msg";
    let fn: (file: Blob, cfg: Record<string, unknown>) => Promise<Blob>;
    try {
      fn = await bkLoadImgly();
    } catch {
      setMsg(
        "bkAiMsg",
        "The AI engine could not load — check the internet connection and try again. Nothing was changed.",
        "warn",
      );
      btn.disabled = false;
      return;
    }
    const model = input("bkAiModel").value;
    let done = 0;
    let failed = 0;
    for (let i = 0; i < bk.items.length; i++) {
      const it = bk.items[i];
      msg.textContent = `Processing ${i + 1} / ${bk.items.length} — ${it.name}…`;
      let outBlob: Blob | null = null;
      for (let c = 0; c < BK_AI_CONFIGS.length && !outBlob; c++) {
        try {
          const cfg: Record<string, unknown> = {};
          const base = BK_AI_CONFIGS[c];
          cfg.device = base.device;
          cfg.publicPath = base.publicPath;
          cfg.model = model;
          cfg.output = { format: "image/png", quality: 1 };
          outBlob = await fn(it.file, cfg);
        } catch {
          outBlob = null;
        }
      }
      if (!outBlob) {
        failed++;
        continue;
      }
      try {
        const r = await loadImg(outBlob);
        it.aiCanvas = bkAiFinish(r.img);
        const flat = await new Promise<Blob>((res) => {
          it.aiCanvas?.toBlob((b) => res(b as Blob), "image/png");
        });
        const r2 = await loadImg(flat);
        it.img = r2.img;
        done++;
      } catch {
        failed++;
      }
    }
    bkRenderThumbs();
    $("bkAiZip").style.display = bk.items.some((x) => x.aiCanvas) ? "inline-flex" : "none";
    msg.textContent = `✔ AI portraits done: ${done} processed${failed ? `, ${failed} could not be processed — their original photos are unchanged.` : "."} Sheets and separate files now use the portraits.`;
    msg.className = `msg ${failed ? "warn" : "good"}`;
    btn.disabled = false;
  });

  $("bkAiZip").addEventListener("click", async () => {
    if (!window.JSZip) return;
    const zip = new window.JSZip();
    const used: Record<string, number> = {};
    for (let i = 0; i < bk.items.length; i++) {
      const it = bk.items[i];
      if (!it.aiCanvas) continue;
      const blob = await new Promise<Blob>((res) => {
        it.aiCanvas?.toBlob((b) => res(b as Blob), "image/png");
      });
      let nm = bkSafeName(it);
      if (used[nm]) nm = `${nm}-${it.id}`;
      used[nm] = 1;
      zip.file(`${nm}.png`, blob);
    }
    downloadBlob(await zip.generateAsync({ type: "blob" }), "ai-portraits.zip");
  });

  bkLayoutInfo();
}
