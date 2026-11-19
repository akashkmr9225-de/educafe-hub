import { emitDownload } from "./state";
import { playSound } from "./sound";

export function $(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el;
}

export function input(id: string): HTMLInputElement {
  return $(id) as HTMLInputElement;
}

export function canvas(id: string): HTMLCanvasElement {
  return $(id) as HTMLCanvasElement;
}

export function ctx2d(cv: HTMLCanvasElement): CanvasRenderingContext2D {
  const c = cv.getContext("2d");
  if (!c) throw new Error("Canvas 2D context unavailable");
  return c;
}

export function fmtKB(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  return `${kb >= 100 ? Math.round(kb) : kb.toFixed(1)} KB`;
}

export function fmtSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2).replace(/\.?0+$/, "")} MB`;
  return fmtKB(bytes);
}

export interface LoadedImage {
  img: HTMLImageElement;
  url: string;
}

export function loadImg(file: Blob): Promise<LoadedImage> {
  function fromBlob(blob: Blob): Promise<LoadedImage> {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => res({ img, url });
      img.onerror = () => {
        URL.revokeObjectURL(url);
        rej(new Error("Image load nahi hui"));
      };
      img.src = url;
    });
  }

  const name = file instanceof File ? file.name : "";
  const type = file.type || "";
  const isHeic = /\.hei[cf]$/i.test(name) || /hei[cf]/i.test(type);
  if (isHeic && window.heic2any) {
    return window
      .heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 })
      .then((b) => fromBlob(Array.isArray(b) ? b[0] : b))
      .catch(() => fromBlob(file));
  }
  return fromBlob(file);
}

export function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
): void {
  const sc = Math.min(dw / img.naturalWidth, dh / img.naturalHeight);
  const w = img.naturalWidth * sc;
  const h = img.naturalHeight * sc;
  ctx.drawImage(img, dx + (dw - w) / 2, dy + (dh - h) / 2, w, h);
}

export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  zoom: number,
  yShift: number,
): void {
  const scale = Math.max(dw / img.naturalWidth, dh / img.naturalHeight) * zoom;
  const sw = dw / scale;
  const sh = dh / scale;
  const sx = (img.naturalWidth - sw) / 2;
  const sy = (img.naturalHeight - sh) * yShift;
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

export async function padJpeg(blob: Blob, targetBytes: number): Promise<Blob> {
  if (blob.size >= targetBytes || !/jpeg/.test(blob.type)) return blob;
  const buf = new Uint8Array(await blob.arrayBuffer());
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return blob;
  let need = targetBytes - buf.length;
  const parts: BlobPart[] = [buf.slice(0, 2)];
  const rest = buf.slice(2);
  while (need > 0) {
    const segLen = Math.min(need, 65533);
    const seg = new Uint8Array(2 + segLen);
    seg[0] = 0xff;
    seg[1] = 0xfe;
    seg[2] = (segLen >> 8) & 255;
    seg[3] = segLen & 255;
    parts.push(seg);
    need -= 2 + segLen;
  }
  parts.push(rest);
  return new Blob(parts, { type: "image/jpeg" });
}

export function c2b(cv: HTMLCanvasElement, q: number): Promise<Blob> {
  return new Promise((res) => {
    cv.toBlob((b) => res(b as Blob), "image/jpeg", q);
  });
}

export function downloadBlob(blob: Blob, name: string): void {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 800);
  emitDownload(name);
}

export function wireDrop(
  dropId: string,
  inputId: string,
  onFile: (file: File) => void,
): void {
  const drop = $(dropId);
  const fileInput = input(inputId);
  drop.addEventListener("click", () => fileInput.click());
  drop.addEventListener("keydown", (e) => {
    const key = (e as KeyboardEvent).key;
    if (key === "Enter" || key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });
  fileInput.addEventListener("change", () => {
        if (fileInput.files && fileInput.files[0]) {
          onFile(fileInput.files[0]);
          playSound("select");
        }
      });
  ["dragover", "dragenter"].forEach((ev) => {
    drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.add("over");
    });
  });
  ["dragleave", "drop"].forEach((ev) => {
    drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.remove("over");
    });
  });
  drop.addEventListener("drop", (e) => {
        const f = (e as DragEvent).dataTransfer?.files?.[0];
        if (f) {
          onFile(f);
          playSound("select");
        }
      });
}

export function wireDropMulti(
  dropId: string,
  inputId: string,
  onFiles: (files: File[]) => void,
): void {
  const drop = $(dropId);
  const fileInput = input(inputId);
  drop.addEventListener("click", () => fileInput.click());
  drop.addEventListener("keydown", (e) => {
    const key = (e as KeyboardEvent).key;
    if (key === "Enter" || key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });
  fileInput.addEventListener("change", () => {
        if (fileInput.files && fileInput.files.length) {
          onFiles(Array.from(fileInput.files));
          playSound("select");
        }
      });
  ["dragover", "dragenter"].forEach((ev) => {
    drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.add("over");
    });
  });
  ["dragleave", "drop"].forEach((ev) => {
    drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.remove("over");
    });
  });
  drop.addEventListener("drop", (e) => {
        const files = (e as DragEvent).dataTransfer?.files;
        if (files && files.length) {
          onFiles(Array.from(files));
          playSound("select");
        }
      });
}

export function chipGroup(id: string, cb: (value: string) => void): string | null {
  const box = $(id);
  const chips = Array.from(box.querySelectorAll<HTMLElement>(".chip"));
  chips.forEach((ch) => {
    ch.addEventListener("click", () => {
      chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
      ch.setAttribute("aria-pressed", "true");
      cb(ch.getAttribute("data-v") || "");
    });
  });
  const cur = box.querySelector<HTMLElement>('[aria-pressed="true"]');
  return cur ? cur.getAttribute("data-v") : null;
}

export function selGroup(id: string, cb: (value: string) => void): string | null {
  const el = $(id) as unknown as HTMLSelectElement | null;
  if (!el) return null;
  el.addEventListener("change", () => cb(el.value));
  return el.value;
}

export async function toTargetKB(cv: HTMLCanvasElement, targetKB: number): Promise<Blob> {
  const target = targetKB * 1024;
  let best = await c2b(cv, 0.92);
  if (best.size <= target) return best;
  let lo = 0.08;
  let hi = 0.92;
  for (let i = 0; i < 9; i++) {
    const mid = (lo + hi) / 2;
    const b = await c2b(cv, mid);
    if (b.size <= target) {
      best = b;
      lo = mid;
    } else {
      hi = mid;
    }
  }
  if (best.size <= target) return best;
  let scale = 0.85;
  while (scale > 0.25) {
    const c2 = document.createElement("canvas");
    c2.width = Math.round(cv.width * scale);
    c2.height = Math.round(cv.height * scale);
    ctx2d(c2).drawImage(cv, 0, 0, c2.width, c2.height);
    const b2 = await c2b(c2, 0.85);
    if (b2.size <= target) return b2;
    scale -= 0.12;
  }
  return best;
}

export function cleanSignature(img: HTMLImageElement, threshold: number): HTMLCanvasElement {
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

export function parsePages(spec: string, total: number): number[] {
  if (!spec || !spec.trim()) {
    const all: number[] = [];
    for (let i = 1; i <= total; i++) all.push(i);
    return all;
  }
  const out: number[] = [];
  const seen: Record<number, number> = {};
  spec.split(",").forEach((part) => {
    const p = part.trim();
    if (!p) return;
    if (p.indexOf("-") > 0) {
      const ab = p.split("-");
      const s = parseInt(ab[0], 10);
      const e = parseInt(ab[1], 10);
      for (let n = s; n <= e; n++) {
        if (n >= 1 && n <= total && !seen[n]) {
          seen[n] = 1;
          out.push(n);
        }
      }
    } else {
      const v = parseInt(p, 10);
      if (v >= 1 && v <= total && !seen[v]) {
        seen[v] = 1;
        out.push(v);
      }
    }
  });
  return out.sort((a, b) => a - b);
}

const loaded: Record<string, Promise<void>> = {};

export function loadScriptOnce(src: string): Promise<void> {
  if (src in loaded) return loaded[src];
  loaded[src] = new Promise<void>((res, rej) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => res();
    s.onerror = () => rej(new Error("load failed"));
    document.head.appendChild(s);
  });
  return loaded[src];
}

export function ensureCoreLibs(): Promise<unknown[]> {
  return Promise.all([
    window.jspdf
      ? Promise.resolve()
      : loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),
    window.pdfjsLib
      ? Promise.resolve()
      : loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"),
    window.JSZip
      ? Promise.resolve()
      : loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"),
    window.heic2any
      ? Promise.resolve()
      : loadScriptOnce("https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js"),
  ]).catch(() => []);
}

export function setMsg(id: string, text: string, cls = ""): void {
  const el = $(id);
  el.textContent = text;
  el.className = cls ? `msg ${cls}` : "msg";
  if (cls === "warn" || cls === "error") {
    playSound("error");
  } else if (cls === "good") {
    playSound("success");
  }
}

export function setHTML(id: string, html: string): void {
  $(id).innerHTML = html;
}
