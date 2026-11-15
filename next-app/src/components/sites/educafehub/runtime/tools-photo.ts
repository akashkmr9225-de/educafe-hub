import {
  $,
  c2b,
  canvas,
  chipGroup,
  ctx2d,
  downloadBlob,
  drawContain,
  drawCover,
  fmtKB,
  input,
  loadImg,
  padJpeg,
  setHTML,
  setMsg,
  toTargetKB,
  wireDrop,
} from "./helpers";
import { T, pulse } from "./state";

interface PassportState {
  img: HTMLImageElement | null;
  paper: string;
  copies: number;
  wmm: number;
  hmm: number;
  mode: string;
  guides: boolean;
  labels: boolean;
}

export function initPassport(): void {
  const pp: PassportState = {
    img: null,
    paper: "4x6",
    copies: 8,
    wmm: 35,
    hmm: 45,
    mode: "fill",
    guides: true,
    labels: false,
  };

  pp.paper =
    chipGroup("ppPaper", (v) => {
      pp.paper = v;
      renderPP();
    }) || "4x6";
  pp.copies = parseInt(
    chipGroup("ppCopies", (v) => {
      pp.copies = parseInt(v, 10);
      renderPP();
    }) || "8",
    10,
  );
  chipGroup("ppPreset", (v) => {
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
  $("ppLabels").addEventListener("click", function (this: HTMLElement) {
    pp.labels = this.getAttribute("aria-pressed") !== "true";
    this.setAttribute("aria-pressed", pp.labels ? "true" : "false");
    renderPP();
  });
  input("ppBg").addEventListener("input", renderPP);
  input("ppLabelText").addEventListener("input", renderPP);
  input("ppZoom").addEventListener("input", renderPP);
  input("ppY").addEventListener("input", renderPP);

  wireDrop("ppDrop", "ppFile", (f) => {
    loadImg(f)
      .then((r) => {
        pp.img = r.img;
        $("ppName").textContent = `✔ ${f.name}`;
        (input("ppDownload") as HTMLButtonElement).disabled = false;
        $("ppMsg").textContent = "";
        renderPP();
      })
      .catch(() => {
        setMsg("ppMsg", "This file does not look like an image — try a JPG/PNG.", "warn");
      });
  });

  function renderPP(): void {
    const cv = canvas("ppCanvas");
    const ctx = ctx2d(cv);
    const DPI = 300;
    const MM = DPI / 25.4;
    let paperW: number;
    let paperH: number;
    if (pp.paper === "a4") {
      paperW = Math.round(210 * MM);
      paperH = Math.round(297 * MM);
    } else {
      paperW = Math.round(101.6 * MM);
      paperH = Math.round(152.4 * MM);
    }
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
    const label = (input("ppLabelText").value || "").trim();
    let n = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (n >= copies) break;
        n++;
        const x = x0 + c * (pw + gap);
        const y = y0 + r * (cellH + gap);
        if (pp.img) {
          if (pp.mode === "fit") {
            ctx.fillStyle = bgc;
            ctx.fillRect(x, y, pw, ph);
            drawContain(ctx, pp.img, x, y, pw, ph);
          } else {
            drawCover(ctx, pp.img, x, y, pw, ph, zoom, ysh);
          }
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
    const paperLabel = pp.paper === "a4" ? "A4" : "4×6 inch";
    setHTML(
      "ppStat",
      `<span>${paperLabel} sheet</span><span class='good'>${copies} photos</span><span>${pp.wmm}×${pp.hmm} mm · 300 DPI · ${W}×${H} px</span>${pp.copies > L.cap ? `<span>Max ${L.cap} fit on this paper</span>` : ""}`,
    );
    if (pp.copies > L.cap) {
      setMsg(
        "ppMsg",
        `Note: more than ${L.cap} passport photos do not fit on ${pp.paper.toUpperCase()} paper — copies set to ${L.cap}. Choose A4 if you need more.`,
        "warn",
      );
    } else if (pp.img) {
      $("ppMsg").textContent = "";
    }
  }

  renderPP();

  input("ppDownload").addEventListener("click", async () => {
    if (!pp.img) return;
    const blob = await c2b(canvas("ppCanvas"), 0.95);
    downloadBlob(blob, `passport-sheet-${pp.paper}-${pp.copies}copies.jpg`);
    setMsg(
      "ppMsg",
      "✔ Sheet downloaded — choose “Actual size / 100%” when printing.",
      "good",
    );
  });
}

interface KbState {
  img: HTMLImageElement | null;
  file: File | null;
  target: number;
  mode: string;
}

export function initKb(): void {
  const kb: KbState = { img: null, file: null, target: 50, mode: "under" };
  chipGroup("kbPresets", (v) => {
    kb.target = parseInt(v, 10);
    input("kbCustom").value = "";
  });
  kb.mode =
    chipGroup("kbMode", (v) => {
      kb.mode = v;
      $("kbMaxRow").style.display = v === "between" ? "flex" : "none";
    }) || "under";
  input("kbCustom").addEventListener("input", function (this: HTMLInputElement) {
    const v = parseInt(this.value, 10);
    if (v > 0) kb.target = v;
  });
  wireDrop("kbDrop", "kbFile", (f) => {
    kb.file = f;
    loadImg(f)
      .then((r) => {
        kb.img = r.img;
        $("kbName").textContent = `✔ ${f.name} · abhi ${fmtKB(f.size)}`;
        (input("kbGo") as HTMLButtonElement).disabled = false;
        $("kbMsg").textContent = "";
      })
      .catch(() => {
        setMsg("kbMsg", "Ye file image nahi lag rahi.", "warn");
      });
  });

  input("kbGo").addEventListener("click", async function (this: HTMLButtonElement, e: Event) {
    if (!kb.img) return;
    const btn = e.currentTarget as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = "Ban raha hai…";
    const target = kb.target;
    const w = parseInt(input("kbW").value, 10);
    const h = parseInt(input("kbH").value, 10);
    let cw = w > 0 ? w : kb.img.naturalWidth;
    let ch = h > 0 ? h : kb.img.naturalHeight;
    if (!(w > 0 && h > 0)) {
      const maxSide = 1600;
      const sc = Math.min(1, maxSide / Math.max(cw, ch));
      cw = Math.round(cw * sc);
      ch = Math.round(ch * sc);
    }
    const cv = document.createElement("canvas");
    cv.width = cw;
    cv.height = ch;
    const ctx = ctx2d(cv);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, cw, ch);
    drawCover(ctx, kb.img, 0, 0, cw, ch, 1, 0.5);
    let blob: Blob = await c2b(cv, 0.92);
    let ok = true;
    let ruleTxt = `${target} KB`;
    if (kb.mode === "atleast") {
      blob = await c2b(cv, 0.95);
      if (blob.size < target * 1024) blob = await padJpeg(blob, target * 1024);
      ok = blob.size >= target * 1024;
      ruleTxt = `≥ ${target} KB`;
    } else if (kb.mode === "between") {
      let mx = parseInt(input("kbMax").value, 10) || Math.max(target + 50, 100);
      if (mx <= target) {
        mx = target + 50;
        input("kbMax").value = String(mx);
      }
      blob = await toTargetKB(cv, mx);
      if (blob.size < target * 1024) blob = await padJpeg(blob, target * 1024);
      ok = blob.size >= target * 1024 && blob.size <= mx * 1024;
      ruleTxt = `${target}–${mx} KB`;
    } else {
      blob = await toTargetKB(cv, target);
      ok = blob.size <= target * 1024;
      ruleTxt = `≤ ${target} KB`;
    }
    const url = URL.createObjectURL(blob);
    ($("kbImg") as HTMLImageElement).src = url;
    $("kbPreview").classList.add("show");
    setHTML(
      "kbStat",
      `<span>Pehele: ${fmtKB(kb.file ? kb.file.size : 0)}</span><span class='good'>Ab: ${fmtKB(blob.size)}</span><span>Rule: ${ruleTxt}</span><span>${cw}×${ch} px</span>`,
    );
    const dl = $("kbDownload") as HTMLAnchorElement;
    dl.href = url;
    dl.style.display = "inline-flex";
    setMsg(
      "kbMsg",
      ok
        ? `✔ Ho gaya — photo ${fmtKB(blob.size)} ki hai, rule (${ruleTxt}) ke andar.`
        : "Photo is rule mein saaf nahi bachi — size thoda badha kar try karo.",
      ok ? "good" : "warn",
    );
    btn.disabled = false;
    btn.textContent = T("kbGo");
  });
}

interface SignatureState {
  img: HTMLImageElement | null;
  file: File | null;
  size: string;
}

export function initSignature(): void {
  const sg: SignatureState = { img: null, file: null, size: "300x120" };
  chipGroup("sgSize", (v) => {
    sg.size = v;
  });
  input("sgTh").addEventListener("input", function (this: HTMLInputElement) {
    const v = parseInt(this.value, 10);
    $("sgThVal").textContent = v < 160 ? "(light)" : v < 215 ? "(medium)" : "(strong)";
  });
  wireDrop("sgDrop", "sgFile", (f) => {
    sg.file = f;
    loadImg(f).then((r) => {
      sg.img = r.img;
      $("sgName").textContent = `✔ ${f.name}`;
      (input("sgGo") as HTMLButtonElement).disabled = false;
    });
  });

  input("sgGo").addEventListener("click", async () => {
    if (!sg.img) return;
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
    dl.style.display = "inline-flex";
    setMsg(
      "sgMsg",
      "✔ Signature taiyaar hai. Agar syahi zyada halki ho gayi ho to slider left karke dobara banao.",
      "good",
    );
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
  const jn: { photo: HTMLImageElement | null; sign: HTMLImageElement | null; layout: string } = {
    photo: null,
    sign: null,
    layout: "v",
  };
  chipGroup("jnLayout", (v) => {
    jn.layout = v;
  });
  function jnReady(): void {
    (input("jnGo") as HTMLButtonElement).disabled = !(jn.photo && jn.sign);
  }
  wireDrop("jnPhotoDrop", "jnPhotoFile", (f) => {
    loadImg(f).then((r) => {
      jn.photo = r.img;
      $("jnPhotoName").textContent = `✔ ${f.name}`;
      jnReady();
    });
  });
  wireDrop("jnSignDrop", "jnSignFile", (f) => {
    loadImg(f).then((r) => {
      jn.sign = r.img;
      $("jnSignName").textContent = `✔ ${f.name}`;
      jnReady();
    });
  });
  input("jnGo").addEventListener("click", async () => {
    if (!jn.photo || !jn.sign) return;
    const signC = cleanSignatureLocal(jn.sign, 205);
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
    dl.style.display = "inline-flex";
    setMsg("jnMsg", "✔ Combined image taiyaar hai.", "good");
  });
}

interface CompressorState {
  img: HTMLImageElement | null;
  file: File | null;
  dim: number;
}

export function initCompressor(): void {
  const cp: CompressorState = { img: null, file: null, dim: 1920 };
  chipGroup("cpDim", (v) => {
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
      const blob = await c2b(cv, q);
      const url = URL.createObjectURL(blob);
      ($("cpImg") as HTMLImageElement).src = url;
      $("cpPreview").classList.add("show");
      const saved = cp.file ? Math.max(0, Math.round((1 - blob.size / cp.file.size) * 100)) : 0;
      setHTML(
        "cpStat",
        `<span>Pehele: ${cp.file ? fmtKB(cp.file.size) : "—"}</span><span class='good'>Ab: ${fmtKB(blob.size)}</span>${cp.file ? `<span>${saved}% chhota</span>` : ""}<span>${cv.width}×${cv.height} px</span>`,
      );
      const dl = $("cpDownload") as HTMLAnchorElement;
      dl.href = url;
      dl.style.display = "inline-flex";
    }, 180);
  }
  wireDrop("cpDrop", "cpFile", (f) => {
    cp.file = f;
    loadImg(f).then((r) => {
      cp.img = r.img;
      $("cpName").textContent = `✔ ${f.name} · ${fmtKB(f.size)}`;
      cpRender();
    });
  });
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
  chipGroup("exPreset", (v) => {
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
