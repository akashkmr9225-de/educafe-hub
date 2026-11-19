import {
  $,
  canvas,
  chipGroup,
  c2b,
  ctx2d,
  downloadBlob,
  fmtSize,
  loadImg,
  setHTML,
  setMsg,
  wireDrop,
} from "./helpers";
import { playSound } from "./sound";
import { T } from "./state";

interface Pt {
  x: number;
  y: number;
}

interface DcState {
  img: HTMLImageElement | null;
  file: File | null;
  work: HTMLCanvasElement | null; // working copy, long side capped at 2600 px
  corners: Pt[]; // TL, TR, BR, BL in working-copy pixels
  mode: string; // "orig" | "bw"
  out: HTMLCanvasElement | null; // last warped result
  blob: Blob | null; // last warped result as JPG
}

const dist = (a: Pt, b: Pt): number => Math.hypot(a.x - b.x, a.y - b.y);
const polyArea = (p: Pt[]): number => {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const a = p[i];
    const b = p[(i + 1) % p.length];
    s += a.x * b.y - b.x * a.y;
  }
  return Math.abs(s) / 2;
};

function convexHull(pts: Pt[]): Pt[] {
  if (pts.length < 4) return pts.slice();
  const p = pts.slice().sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (o: Pt, a: Pt, b: Pt): number =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower: Pt[] = [];
  for (const pt of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], pt) <= 0)
      lower.pop();
    lower.push(pt);
  }
  const upper: Pt[] = [];
  for (let i = p.length - 1; i >= 0; i--) {
    const pt = p[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], pt) <= 0)
      upper.pop();
    upper.push(pt);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

/**
 * Find the document's four corners in the source photo, or null when no
 * convincing page-shaped region exists. Method: downscale, Otsu threshold,
 * take the largest connected region on the side opposite the photo's border,
 * then read the corners off its convex hull. Deliberately simple — the user
 * can always drag the corners right.
 */
function detectCorners(img: HTMLImageElement): Pt[] | null {
  const MAX = 480;
  const sc = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(2, Math.round(img.naturalWidth * sc));
  const h = Math.max(2, Math.round(img.naturalHeight * sc));
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = ctx2d(cv);
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  const n = w * h;
  const gray = new Float32Array(n);
  const hist = new Float32Array(256);
  for (let i = 0; i < n; i++) {
    const g = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
    gray[i] = g;
    hist[Math.min(255, Math.round(g))]++;
  }
  let sum = 0;
  for (let t = 0; t < 256; t++) sum += t * hist[t];
  let sumB = 0;
  let wB = 0;
  let best = -1;
  let thr = 127;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (!wB) continue;
    const wF = n - wB;
    if (!wF) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > best) {
      best = between;
      thr = t;
    }
  }
  const fg = new Uint8Array(n);
  for (let i = 0; i < n; i++) fg[i] = gray[i] > thr ? 1 : 0;
  // The page is whichever side (bright/dark) the photo's border mostly is NOT.
  let borderBright = 0;
  let borderCount = 0;
  for (let x = 0; x < w; x++) {
    borderBright += fg[x] + fg[(h - 1) * w + x];
    borderCount += 2;
  }
  for (let y = 0; y < h; y++) {
    borderBright += fg[y * w] + fg[y * w + w - 1];
    borderCount += 2;
  }
  if (borderBright / borderCount > 0.5) {
    for (let i = 0; i < n; i++) fg[i] = fg[i] ? 0 : 1;
  }
  // Largest connected component (iterative flood fill).
  const label = new Int32Array(n).fill(-1);
  const stack: number[] = [];
  let bestLabel = -1;
  let bestSize = 0;
  let cur = 0;
  for (let s = 0; s < n; s++) {
    if (!fg[s] || label[s] >= 0) continue;
    let size = 0;
    stack.length = 0;
    stack.push(s);
    label[s] = cur;
    while (stack.length) {
      const p = stack.pop() as number;
      size++;
      const px = p % w;
      const py = (p / w) | 0;
      if (px > 0 && fg[p - 1] && label[p - 1] < 0) {
        label[p - 1] = cur;
        stack.push(p - 1);
      }
      if (px < w - 1 && fg[p + 1] && label[p + 1] < 0) {
        label[p + 1] = cur;
        stack.push(p + 1);
      }
      if (py > 0 && fg[p - w] && label[p - w] < 0) {
        label[p - w] = cur;
        stack.push(p - w);
      }
      if (py < h - 1 && fg[p + w] && label[p + w] < 0) {
        label[p + w] = cur;
        stack.push(p + w);
      }
    }
    if (size > bestSize) {
      bestSize = size;
      bestLabel = cur;
    }
    cur++;
  }
  if (bestLabel < 0) return null;
  const frac = bestSize / n;
  if (frac < 0.08 || frac > 0.97) return null;
  const pts: Pt[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      if (label[p] !== bestLabel) continue;
      if (
        x === 0 ||
        y === 0 ||
        x === w - 1 ||
        y === h - 1 ||
        label[p - 1] !== bestLabel ||
        label[p + 1] !== bestLabel ||
        label[p - w] !== bestLabel ||
        label[p + w] !== bestLabel
      ) {
        pts.push({ x, y });
      }
    }
  }
  const hull = convexHull(pts);
  if (hull.length < 4) return null;
  let tl = hull[0];
  let tr = hull[0];
  let br = hull[0];
  let bl = hull[0];
  for (const p of hull) {
    if (p.x + p.y < tl.x + tl.y) tl = p;
    if (p.x + p.y > br.x + br.y) br = p;
    if (p.x - p.y > tr.x - tr.y) tr = p;
    if (p.x - p.y < bl.x - bl.y) bl = p;
  }
  const quad = [tl, tr, br, bl];
  const minGap = 0.08 * Math.min(w, h);
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      if (dist(quad[i], quad[j]) < minGap) return null;
    }
  }
  if (polyArea(quad) < 0.5 * bestSize) return null;
  return quad.map((p) => ({ x: p.x / sc, y: p.y / sc }));
}

function insetQuad(w: number, h: number): Pt[] {
  const mx = w * 0.07;
  const my = h * 0.07;
  return [
    { x: mx, y: my },
    { x: w - mx, y: my },
    { x: w - mx, y: h - my },
    { x: mx, y: h - my },
  ];
}

/** Homography mapping destination pixels (0..w, 0..h) onto the source quad. */
function homography(w: number, h: number, s: Pt[]): number[] | null {
  const d: Pt[] = [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ];
  const A: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const { x, y } = d[i];
    const sx = s[i].x;
    const sy = s[i].y;
    A.push([x, y, 1, 0, 0, 0, -sx * x, -sx * y, sx]);
    A.push([0, 0, 0, x, y, 1, -sy * x, -sy * y, sy]);
  }
  for (let col = 0, row = 0; col < 8 && row < 8; col++, row++) {
    let piv = row;
    for (let r = row + 1; r < 8; r++) {
      if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
    }
    if (Math.abs(A[piv][col]) < 1e-12) return null;
    const tmp = A[row];
    A[row] = A[piv];
    A[piv] = tmp;
    const div = A[row][col];
    for (let j = col; j < 9; j++) A[row][j] /= div;
    for (let r = 0; r < 8; r++) {
      if (r === row) continue;
      const f = A[r][col];
      if (!f) continue;
      for (let j = col; j < 9; j++) A[r][j] -= f * A[row][j];
    }
  }
  return [A[0][8], A[1][8], A[2][8], A[3][8], A[4][8], A[5][8], A[6][8], A[7][8]];
}

function applyH(H: number[], x: number, y: number): Pt {
  const wgt = H[6] * x + H[7] * y + 1;
  return {
    x: (H[0] * x + H[1] * y + H[2]) / wgt,
    y: (H[3] * x + H[4] * y + H[5]) / wgt,
  };
}

function drawTri(
  ctx: CanvasRenderingContext2D,
  img: HTMLCanvasElement,
  s0: Pt,
  s1: Pt,
  s2: Pt,
  d0: Pt,
  d1: Pt,
  d2: Pt,
): void {
  // Grow the destination triangle a touch so neighbours overlap, not gap.
  const cx = (d0.x + d1.x + d2.x) / 3;
  const cy = (d0.y + d1.y + d2.y) / 3;
  const grow = (p: Pt): Pt => ({ x: cx + (p.x - cx) * 1.05, y: cy + (p.y - cy) * 1.05 });
  const e0 = grow(d0);
  const e1 = grow(d1);
  const e2 = grow(d2);
  const denom = s0.x * (s1.y - s2.y) + s1.x * (s2.y - s0.y) + s2.x * (s0.y - s1.y);
  if (Math.abs(denom) < 1e-9) return;
  const a = (e0.x * (s1.y - s2.y) + e1.x * (s2.y - s0.y) + e2.x * (s0.y - s1.y)) / denom;
  const b = (e0.x * (s2.x - s1.x) + e1.x * (s0.x - s2.x) + e2.x * (s1.x - s0.x)) / denom;
  const c =
    (e0.x * (s1.x * s2.y - s2.x * s1.y) +
      e1.x * (s2.x * s0.y - s0.x * s2.y) +
      e2.x * (s0.x * s1.y - s1.x * s0.y)) /
    denom;
  const d = (e0.y * (s1.y - s2.y) + e1.y * (s2.y - s0.y) + e2.y * (s0.y - s1.y)) / denom;
  const e = (e0.y * (s2.x - s1.x) + e1.y * (s0.x - s2.x) + e2.y * (s1.x - s0.x)) / denom;
  const f =
    (e0.y * (s1.x * s2.y - s2.x * s1.y) +
      e1.y * (s2.x * s0.y - s0.x * s2.y) +
      e2.y * (s0.x * s1.y - s1.x * s0.y)) /
    denom;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(e0.x, e0.y);
  ctx.lineTo(e1.x, e1.y);
  ctx.lineTo(e2.x, e2.y);
  ctx.closePath();
  ctx.clip();
  ctx.transform(a, d, b, e, c, f);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

function applyBw(cv: HTMLCanvasElement): void {
  const ctx = ctx2d(cv);
  const d = ctx.getImageData(0, 0, cv.width, cv.height);
  const px = d.data;
  for (let i = 0; i < px.length; i += 4) {
    let g = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
    g = (g - 128) * 1.18 + 128;
    if (g > 205) g = 255;
    const v = g < 0 ? 0 : g > 255 ? 255 : Math.round(g);
    px[i] = v;
    px[i + 1] = v;
    px[i + 2] = v;
  }
  ctx.putImageData(d, 0, 0);
}

/** Perspective-straighten the quad region of `work` into a flat page. */
function warp(work: HTMLCanvasElement, corners: Pt[], mode: string): HTMLCanvasElement | null {
  const [tl, tr, br, bl] = corners;
  let W = Math.round(Math.max(dist(tl, tr), dist(bl, br)));
  let H = Math.round(Math.max(dist(tl, bl), dist(tr, br)));
  if (W < 40 || H < 40) return null;
  const cap = 2400 / Math.max(W, H);
  if (cap < 1) {
    W = Math.round(W * cap);
    H = Math.round(H * cap);
  }
  const Hm = homography(W, H, corners);
  if (!Hm) return null;
  const out = document.createElement("canvas");
  out.width = W;
  out.height = H;
  const ctx = ctx2d(out);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  const CELL = 48;
  const cols = Math.max(1, Math.ceil(W / CELL));
  const rows = Math.max(1, Math.ceil(H / CELL));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = (c * W) / cols;
      const x1 = ((c + 1) * W) / cols;
      const y0 = (r * H) / rows;
      const y1 = ((r + 1) * H) / rows;
      const s00 = applyH(Hm, x0, y0);
      const s10 = applyH(Hm, x1, y0);
      const s11 = applyH(Hm, x1, y1);
      const s01 = applyH(Hm, x0, y1);
      drawTri(ctx, work, s00, s10, s11, { x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 });
      drawTri(ctx, work, s00, s11, s01, { x: x0, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 });
    }
  }
  if (mode === "bw") applyBw(out);
  return out;
}

export function initDocCrop(): void {
  if (!document.getElementById("dcCanvas")) return;
  const st: DcState = { img: null, file: null, work: null, corners: [], mode: "orig", out: null, blob: null };
  const handles = [$("dcH0"), $("dcH1"), $("dcH2"), $("dcH3")];
  let renderTimer: ReturnType<typeof setTimeout> | null = null;
  let renderSeq = 0;

  function syncButtons(): void {
    const has = !!st.img;
    ($("dcReset") as HTMLButtonElement).disabled = !has;
    ($("dcJpg") as HTMLButtonElement).disabled = !st.blob;
    ($("dcPdf") as HTMLButtonElement).disabled = !st.out;
  }

  function positionHandles(): void {
    if (!st.work) return;
    st.corners.forEach((p, i) => {
      handles[i].style.left = `${(p.x / (st.work as HTMLCanvasElement).width) * 100}%`;
      handles[i].style.top = `${(p.y / (st.work as HTMLCanvasElement).height) * 100}%`;
    });
  }

  function drawEditor(): void {
    if (!st.work) return;
    const cv = canvas("dcCanvas");
    const ctx = ctx2d(cv);
    ctx.drawImage(st.work, 0, 0, cv.width, cv.height);
    if (st.corners.length === 4) {
      const sx = cv.width / st.work.width;
      const sy = cv.height / st.work.height;
      ctx.beginPath();
      st.corners.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x * sx, p.y * sy);
        else ctx.lineTo(p.x * sx, p.y * sy);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(15,118,110,0.10)";
      ctx.fill();
      ctx.strokeStyle = "#0F766E";
      ctx.lineWidth = Math.max(2, cv.width / 300);
      ctx.stroke();
    }
    positionHandles();
  }

  function renderResult(): void {
    if (!st.work || st.corners.length !== 4) return;
    const out = warp(st.work, st.corners, st.mode);
    const outCv = canvas("dcOut");
    if (!out) {
      st.out = null;
      st.blob = null;
      setMsg("dcMsg", T("dcBadCorners"), "warn");
      syncButtons();
      return;
    }
    st.out = out;
    outCv.width = out.width;
    outCv.height = out.height;
    ctx2d(outCv).drawImage(out, 0, 0);
    const seq = ++renderSeq;
    void c2b(out, 0.92).then((blob) => {
      if (seq !== renderSeq) return; // a newer render already superseded this one
      st.blob = blob;
      setHTML(
        "dcStat",
        `<span>${out.width} × ${out.height} px</span><span>${fmtSize(blob.size)}</span>`,
      );
      playSound("success");
      syncButtons();
    });
    syncButtons();
  }

  function scheduleRender(): void {
    if (renderTimer) clearTimeout(renderTimer);
    renderTimer = setTimeout(renderResult, 120);
  }

  function setCorners(corners: Pt[], detected: boolean): void {
    st.corners = corners;
    setMsg("dcMsg", detected ? "" : T("dcFallback"), detected ? "" : "warn");
    $("dcInfo").textContent = detected ? T("dcDetected") : "";
    drawEditor();
    renderResult();
  }

  function autoCorners(): { corners: Pt[]; detected: boolean } {
    if (!st.img || !st.work) return { corners: [], detected: false };
    const wsc = st.work.width / st.img.naturalWidth;
    const det = detectCorners(st.img);
    if (det) {
      return { corners: det.map((p) => ({ x: p.x * wsc, y: p.y * wsc })), detected: true };
    }
    return { corners: insetQuad(st.work.width, st.work.height), detected: false };
  }

  wireDrop("dcDrop", "dcFile", (f) => {
    void (async () => {
      try {
        const r = await loadImg(f);
        st.img = r.img;
        st.file = f;
        const wsc = Math.min(1, 2600 / Math.max(r.img.naturalWidth, r.img.naturalHeight));
        const work = document.createElement("canvas");
        work.width = Math.max(2, Math.round(r.img.naturalWidth * wsc));
        work.height = Math.max(2, Math.round(r.img.naturalHeight * wsc));
        ctx2d(work).drawImage(r.img, 0, 0, work.width, work.height);
        st.work = work;
        ($("dcDropImg") as HTMLImageElement).src = r.url;
        $("dcDrop").classList.add("hasimg");
        setHTML("dcName", "📄 " + f.name);
        const dispScale = Math.min(680 / work.width, 520 / work.height, 1);
        const ed = canvas("dcCanvas");
        ed.width = Math.round(work.width * dispScale);
        ed.height = Math.round(work.height * dispScale);
        ($("dcStage") as HTMLElement).hidden = false;
        const ac = autoCorners();
        setCorners(ac.corners, ac.detected);
      } catch {
        setMsg("dcMsg", T("dcLoadFail"), "warn");
      }
    })();
  });

  // Drag a corner: pointer capture on the handle itself (Modern Web Guidance).
  handles.forEach((handle, i) => {
    handle.addEventListener("pointerdown", (e) => {
      if ((e as PointerEvent).button !== 0 || !st.work) return;
      handle.setPointerCapture((e as PointerEvent).pointerId);
    });
    handle.addEventListener("pointermove", (e) => {
      if (!st.work || !handle.hasPointerCapture((e as PointerEvent).pointerId)) return;
      const rect = canvas("dcCanvas").getBoundingClientRect();
      const work = st.work as HTMLCanvasElement;
      const x = (((e as PointerEvent).clientX - rect.left) / rect.width) * work.width;
      const y = (((e as PointerEvent).clientY - rect.top) / rect.height) * work.height;
      st.corners[i] = {
        x: Math.min(work.width, Math.max(0, x)),
        y: Math.min(work.height, Math.max(0, y)),
      };
      drawEditor();
      scheduleRender();
    });
    handle.addEventListener("keydown", (e) => {
      if (!st.work) return;
      const key = (e as KeyboardEvent).key;
      const work = st.work as HTMLCanvasElement;
      const step = ((e as KeyboardEvent).shiftKey ? 0.05 : 0.01) * work.width;
      const p = { ...st.corners[i] };
      if (key === "ArrowLeft") p.x -= step;
      else if (key === "ArrowRight") p.x += step;
      else if (key === "ArrowUp") p.y -= step;
      else if (key === "ArrowDown") p.y += step;
      else return;
      e.preventDefault();
      p.x = Math.min(work.width, Math.max(0, p.x));
      p.y = Math.min(work.height, Math.max(0, p.y));
      st.corners[i] = p;
      drawEditor();
      scheduleRender();
    });
  });

  $("dcReset").addEventListener("click", () => {
    const ac = autoCorners();
    if (ac.corners.length === 4) setCorners(ac.corners, ac.detected);
  });

  chipGroup("dcMode", (v) => {
    st.mode = v;
    renderResult();
  });

  function baseName(): string {
    return st.file ? st.file.name.replace(/\.[^.]+$/, "") : "document";
  }

  $("dcJpg").addEventListener("click", () => {
    if (!st.blob || !st.out) return;
    downloadBlob(st.blob, `document-crop-${baseName()}.jpg`);
    setMsg(
      "dcMsg",
      T("dcDoneJpg")
        .replace("{w}", String(st.out.width))
        .replace("{h}", String(st.out.height))
        .replace("{kb}", (st.blob.size / 1024).toFixed(1)),
      "good",
    );
  });

  $("dcPdf").addEventListener("click", () => {
    if (!st.out) return;
    if (!window.jspdf) {
      setMsg("dcMsg", T("libPdfMissing"), "warn");
      return;
    }
    const out = st.out;
    const orient = out.width > out.height ? "landscape" : "portrait";
    const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a4", orientation: orient });
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const margin = 10;
    const sc = Math.min((pw - 2 * margin) / out.width, (ph - 2 * margin) / out.height);
    const dw = out.width * sc;
    const dh = out.height * sc;
    doc.addImage(
      out.toDataURL("image/jpeg", 0.92),
      "JPEG",
      (pw - dw) / 2,
      (ph - dh) / 2,
      dw,
      dh,
    );
    downloadBlob(doc.output("blob") as Blob, `document-crop-${baseName()}.pdf`);
    setMsg("dcMsg", T("dcDonePdf"), "good");
  });

  syncButtons();
}
