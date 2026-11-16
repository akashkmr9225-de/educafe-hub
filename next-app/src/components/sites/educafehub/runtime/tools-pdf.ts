import {
  $,
  selGroup,
  ctx2d,
  downloadBlob,
  fmtKB,
  fmtSize,
  input,
  loadImg,
  parsePages,
  setHTML,
  setMsg,
  wireDrop,
  wireDropMulti,
} from "./helpers";
import { T } from "./state";

interface ImageToPdfState {
  files: File[];
  size: string;
}

export function initImageToPdf(): void {
  const pdf: ImageToPdfState = { files: [], size: "a4" };
  selGroup("pdfSize", (v) => {
    pdf.size = v;
  });
  function renderPdfThumbs(): void {
    $("pdfName").textContent = pdf.files.length
      ? T("pdfSelPhotos").replace("{n}", String(pdf.files.length))
      : "";
    (input("pdfGo") as HTMLButtonElement).disabled = !pdf.files.length;
    const hint = $("pdfThumbsHint");
    if (hint) hint.style.display = pdf.files.length > 1 ? "block" : "none";
    const box = $("pdfThumbs");
    box.innerHTML = "";
    pdf.files.forEach((f, ix) => {
      const wrap = document.createElement("div");
      wrap.style.cssText = "position:relative;width:74px;height:74px;flex:none";
      const im = document.createElement("img");
      im.src = URL.createObjectURL(f);
      im.alt = f.name;
      im.title = f.name;
      im.style.cssText =
        "width:74px;height:74px;object-fit:cover;border-radius:8px;border:1px solid var(--line)";
      wrap.appendChild(im);
      const mk = (txt: string, label: string, right: string, fn: () => void) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = txt;
        b.title = label;
        b.setAttribute("aria-label", label);
        b.style.cssText = `position:absolute;top:3px;right:${right};width:20px;height:20px;border-radius:6px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font-size:11px;line-height:1;display:grid;place-items:center;cursor:pointer;padding:0`;
        b.addEventListener("click", fn);
        wrap.appendChild(b);
      };
      mk("✕", T("pdfRemove"), "3px", () => {
        pdf.files.splice(ix, 1);
        renderPdfThumbs();
      });
      if (ix > 0)
        mk("◀", T("pdfMoveBack"), "26px", () => {
          const t = pdf.files[ix - 1];
          pdf.files[ix - 1] = pdf.files[ix];
          pdf.files[ix] = t;
          renderPdfThumbs();
        });
      if (ix < pdf.files.length - 1)
        mk("▶", T("pdfMoveFwd"), "49px", () => {
          const t = pdf.files[ix + 1];
          pdf.files[ix + 1] = pdf.files[ix];
          pdf.files[ix] = t;
          renderPdfThumbs();
        });
      box.appendChild(wrap);
    });
  }
  function pdfAddFiles(files: File[]): void {
    const bad: string[] = [];
    let added = 0;
    files.forEach((f) => {
      const okType = f.type.startsWith("image/") || /\.(jpe?g|png|webp|hei[cf]|bmp|gif)$/i.test(f.name);
      if (!okType) {
        bad.push(f.name);
        return;
      }
      if (pdf.files.some((x) => x.name === f.name && x.size === f.size)) return;
      pdf.files.push(f);
      added++;
    });
    if (bad.length) {
      const names = bad.slice(0, 3).join(", ") + (bad.length > 3 ? ` +${bad.length - 3}` : "");
      setMsg("pdfMsg", T("pdfSkipped").replace("{names}", names), "warn");
    } else if (added) {
      $("pdfMsg").textContent = "";
    }
    renderPdfThumbs();
  }
  wireDropMulti("pdfDrop", "pdfFiles", pdfAddFiles);

  input("pdfGo").addEventListener("click", async function (this: HTMLButtonElement, e: Event) {
    if (!pdf.files.length) return;
    if (!window.jspdf) {
      setMsg("pdfMsg", T("libPdfMissing"), "warn");
      return;
    }
    const btn = e.currentTarget as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = T("pdfMaking");
    try {
      const JsPDF = window.jspdf.jsPDF;
      let doc: JsPdfDoc | null = null;
      let pages = 0;
      let failed = 0;
      for (let i = 0; i < pdf.files.length; i++) {
        let r: Awaited<ReturnType<typeof loadImg>>;
        try {
          r = await loadImg(pdf.files[i]);
        } catch {
          failed++;
          continue;
        }
        const img = r.img;
        const fmt: string | number[] =
          pdf.size === "fit"
            ? [img.naturalWidth / 3.78, img.naturalHeight / 3.78]
            : pdf.size === "4x6"
              ? [101.6, 152.4]
              : "a4";
        const orient =
          pdf.size !== "fit" && img.naturalWidth > img.naturalHeight ? "landscape" : "portrait";
        if (!doc) doc = new JsPDF({ unit: "mm", format: fmt, orientation: orient });
        else doc.addPage(fmt, orient);
        const pw = doc.internal.pageSize.getWidth();
        const ph = doc.internal.pageSize.getHeight();
        const margin = pdf.size === "fit" ? 0 : 10;
        const aw = pw - 2 * margin;
        const ah = ph - 2 * margin;
        const sc = Math.min(aw / img.naturalWidth, ah / img.naturalHeight);
        const dw = img.naturalWidth * sc;
        const dh = img.naturalHeight * sc;
        const cv = document.createElement("canvas");
        const maxPx = 1800;
        const csc = Math.min(1, maxPx / Math.max(img.naturalWidth, img.naturalHeight));
        cv.width = Math.round(img.naturalWidth * csc);
        cv.height = Math.round(img.naturalHeight * csc);
        const cx = ctx2d(cv);
        cx.fillStyle = "#fff";
        cx.fillRect(0, 0, cv.width, cv.height);
        cx.drawImage(img, 0, 0, cv.width, cv.height);
        doc.addImage(cv.toDataURL("image/jpeg", 0.9), "JPEG", (pw - dw) / 2, (ph - dh) / 2, dw, dh);
        URL.revokeObjectURL(r.url);
        pages++;
      }
      if (!doc || pages === 0) throw new Error("no readable photos");
      const blob = doc.output("blob");
      const name =
        (input("pdfNameInput").value || "documents").replace(/[\\/:*?"<>|]+/g, "").trim() || "documents";
      downloadBlob(blob, `${name}-${Date.now().toString(36)}.pdf`);
      if (failed > 0) {
        setMsg(
          "pdfMsg",
          T("pdfSomeFailed").replace("{f}", String(failed)).replace("{n}", String(pages)),
          "warn",
        );
      } else {
        setMsg(
          "pdfMsg",
          T("pdfDone").replace("{n}", String(pages)).replace("{size}", fmtSize(blob.size)),
          "good",
        );
      }
    } catch {
      setMsg("pdfMsg", T("pdfFail"), "warn");
    }
    btn.disabled = false;
    btn.textContent = T("pdfGo");
  });
}
interface PdfCompressState {
  file: File | null;
  level: string;
}

export function initPdfCompress(): void {
  const pc: PdfCompressState = { file: null, level: "med" };
  function pcShowStat(): void {
    if (!pc.file) return;
    setHTML(
      "pcStat",
      `<span>${T("pcOrigSize").replace("{size}", fmtSize(pc.file.size))}</span><span>${T("pcLevelLine").replace("{lvl}", T(pc.level === "high" ? "pcLvlNameHigh" : pc.level === "low" ? "pcLvlNameLow" : "pcLvlNameMed"))}</span>`,
    );
  }
  selGroup("pcLevel", (v) => {
    pc.level = v;
    pcShowStat();
  });
  wireDrop("pcDrop", "pcFile", (f) => {
    if (!/pdf$/i.test(f.name) && f.type !== "application/pdf") {
      setMsg("pcMsg", T("pcNotPdf"), "warn");
      return;
    }
    pc.file = f;
    $("pcName").textContent = `✔ ${f.name}`;
    pcShowStat();
    (input("pcGo") as HTMLButtonElement).disabled = false;
    $("pcMsg").textContent = "";
    $("pcDownload").style.display = "none";
  });
  input("pcGo").addEventListener("click", async function (this: HTMLButtonElement, e: Event) {
    if (!pc.file) return;
    if (!window.pdfjsLib || !window.jspdf) {
      setMsg(
        "pcMsg",
        T("libPdfMissing"),
        "warn",
      );
      return;
    }
    const btn = e.currentTarget as HTMLButtonElement;
    btn.disabled = true;
    try {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      const buf = await pc.file.arrayBuffer();
      const pdfDoc = await window.pdfjsLib.getDocument({ data: buf }).promise;
      const conf = (
        {
          high: { dpi: 200, q: 0.85 },
          med: { dpi: 150, q: 0.72 },
          low: { dpi: 100, q: 0.58 },
        } as Record<string, { dpi: number; q: number }>
      )[pc.level];
      const JsPDF = window.jspdf.jsPDF;
      let out: JsPdfDoc | null = null;
      for (let p = 1; p <= pdfDoc.numPages; p++) {
        btn.textContent = T("pdfPageOf").replace("{p}", String(p)).replace("{n}", String(pdfDoc.numPages));
        const page = await pdfDoc.getPage(p);
        const base = page.getViewport({ scale: 1 });
        const vp = page.getViewport({ scale: conf.dpi / 72 });
        const cv = document.createElement("canvas");
        cv.width = Math.round(vp.width);
        cv.height = Math.round(vp.height);
        const cx = ctx2d(cv);
        cx.fillStyle = "#fff";
        cx.fillRect(0, 0, cv.width, cv.height);
        await page.render({ canvasContext: cx, viewport: vp }).promise;
        const wmm = (base.width * 25.4) / 72;
        const hmm = (base.height * 25.4) / 72;
        const orient = wmm > hmm ? "landscape" : "portrait";
        if (p === 1) out = new JsPDF({ unit: "mm", format: [wmm, hmm] as number[], orientation: orient });
        else out?.addPage([wmm, hmm] as number[], orient);
        out?.addImage(cv.toDataURL("image/jpeg", conf.q), "JPEG", 0, 0, wmm, hmm);
      }
      if (!out) throw new Error("PDF init failed");
      const blob = out.output("blob");
      const url = URL.createObjectURL(blob);
      const dl = $("pcDownload") as HTMLAnchorElement;
      dl.href = url;
      dl.setAttribute("download", pc.file.name.replace(/\.pdf$/i, "") + "-compressed-" + Date.now().toString(36) + ".pdf");
      dl.style.display = "inline-flex";
      const saved = Math.round((1 - blob.size / pc.file.size) * 100);
      setHTML(
        "pcStat",
        `<span>${T("kbStatBefore")}: ${fmtSize(pc.file.size)}</span><span class='good'>${T("kbStatNow")}: ${fmtSize(blob.size)}</span><span>${T("pcPages").replace("{n}", String(pdfDoc.numPages))}</span>${saved > 0 ? `<span class='good'>${T("pcSmaller").replace("{p}", String(saved))}</span>` : `<span>${T("pcSameSize")}</span>`}`,
      );
      setMsg(
        "pcMsg",
        saved > 0
          ? T("pcDone")
          : T("pcNotSmaller"),
        saved > 0 ? "good" : "warn",
      );
    } catch {
      setMsg(
        "pcMsg",
        T("pcReadFail"),
        "warn",
      );
    }
    btn.disabled = false;
    btn.textContent = T("pcGo");
  });
}

async function renderPdfPages(
  file: File,
  pagesWanted: ((total: number) => number[]) | null,
  docRef: { out: JsPdfDoc | null },
): Promise<JsPdfDoc> {
  if (!window.pdfjsLib || !window.jspdf) throw new Error("PDF library missing");
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const buf = await file.arrayBuffer();
  const pdfDoc = await window.pdfjsLib.getDocument({ data: buf }).promise;
  let pages: number[];
  if (pagesWanted) pages = pagesWanted(pdfDoc.numPages);
  else {
    pages = [];
    for (let i = 1; i <= pdfDoc.numPages; i++) pages.push(i);
  }
  const JsPDF = window.jspdf.jsPDF;
  for (let idx = 0; idx < pages.length; idx++) {
    const pno = pages[idx];
    const page = await pdfDoc.getPage(pno);
    const base = page.getViewport({ scale: 1 });
    const vp = page.getViewport({ scale: 150 / 72 });
    const cv = document.createElement("canvas");
    cv.width = Math.round(vp.width);
    cv.height = Math.round(vp.height);
    const cx = ctx2d(cv);
    cx.fillStyle = "#fff";
    cx.fillRect(0, 0, cv.width, cv.height);
    await page.render({ canvasContext: cx, viewport: vp }).promise;
    const wmm = (base.width * 25.4) / 72;
    const hmm = (base.height * 25.4) / 72;
    const orient = wmm > hmm ? "landscape" : "portrait";
    if (!docRef.out) docRef.out = new JsPDF({ unit: "mm", format: [wmm, hmm] as number[], orientation: orient });
    else docRef.out.addPage([wmm, hmm] as number[], orient);
    docRef.out!.addImage(cv.toDataURL("image/jpeg", 0.8), "JPEG", 0, 0, wmm, hmm);
  }
  if (!docRef.out) throw new Error("PDF init failed");
  return docRef.out;
}

export function initFileTools(): void {
  let fsFileObj: File | null = null;
  wireDrop("fsDrop", "fsFile", (f) => {
    fsFileObj = f;
    $("fsName").textContent = `✔ ${f.name}`;
    (input("fsGo") as HTMLButtonElement).disabled = false;
  });
  input("fsGo").addEventListener("click", async () => {
    if (!fsFileObj || !window.pdfjsLib || !window.jspdf) {
      setMsg("fsMsg", T("libPdfMissingShort"));
      return;
    }
    const ref: { out: JsPdfDoc | null } = { out: null };
    const spec = input("fsPages").value;
    try {
      const out = await renderPdfPages(fsFileObj, (total) => parsePages(spec, total), ref);
      out.save("split.pdf");
      setMsg("fsMsg", T("fsDone"));
    } catch {
      setMsg("fsMsg", T("fsFail"));
    }
  });

  let fmFilesArr: File[] = [];
  function fmSetFiles(files: File[]): void {
    fmFilesArr = files;
    $("fmName").textContent = fmFilesArr.length
    ? T("fmSelPdfs").replace("{n}", String(fmFilesArr.length))
    : "";
    (input("fmGo") as HTMLButtonElement).disabled = fmFilesArr.length < 1;
  }
  wireDropMulti("fmDrop", "fmFiles", fmSetFiles);
  input("fmGo").addEventListener("click", async () => {
    if (!fmFilesArr.length || !window.pdfjsLib || !window.jspdf) {
      setMsg("fmMsg", T("libPdfMissingShort"));
      return;
    }
    const ref: { out: JsPdfDoc | null } = { out: null };
    try {
      for (let i = 0; i < fmFilesArr.length; i++) {
        await renderPdfPages(fmFilesArr[i], null, ref);
      }
      ref.out?.save("merged.pdf");
      setMsg("fmMsg", T("fmDone"));
    } catch {
      setMsg("fmMsg", T("fmFail"));
    }
  });

  const fi: {
    img: HTMLImageElement | null;
    file: File | null;
    rot: number;
    flipH: number;
    flipV: number;
    fmt: string;
  } = { img: null, file: null, rot: 0, flipH: 1, flipV: 1, fmt: "image/jpeg" };
  selGroup("fiFmt", (v) => {
    fi.fmt = v;
  });
  wireDrop("fiDrop", "fiFile", (f) => {
    fi.file = f;
    loadImg(f).then((r) => {
      fi.img = r.img;
      fi.rot = 0;
      fi.flipH = 1;
      fi.flipV = 1;
      $("fiName").textContent = `✔ ${f.name} · ${fmtKB(f.size)}`;
      input("fiW").value = String(r.img.naturalWidth);
      input("fiH").value = String(r.img.naturalHeight);
      (input("fiGo") as HTMLButtonElement).disabled = false;
      fiRender();
    });
  });
  $("fiRotL").addEventListener("click", () => {
    fi.rot = (fi.rot + 270) % 360;
    fiRender();
  });
  $("fiRotR").addEventListener("click", () => {
    fi.rot = (fi.rot + 90) % 360;
    fiRender();
  });
  $("fiFlipH").addEventListener("click", () => {
    fi.flipH *= -1;
    fiRender();
  });
  $("fiFlipV").addEventListener("click", () => {
    fi.flipV *= -1;
    fiRender();
  });
  $("fiGo").addEventListener("click", () => {
    fiRender();
  });
  async function fiRender(): Promise<void> {
    if (!fi.img) return;
    let w = parseInt(input("fiW").value, 10);
    let h = parseInt(input("fiH").value, 10);
    const pct = parseFloat(input("fiPct").value);
    if (!isNaN(pct) && pct > 0) {
      w = Math.round((fi.img.naturalWidth * pct) / 100);
      h = Math.round((fi.img.naturalHeight * pct) / 100);
    }
    if (!(w > 0)) w = fi.img.naturalWidth;
    if (!(h > 0)) h = fi.img.naturalHeight;
    const swap = fi.rot === 90 || fi.rot === 270;
    const cv = document.createElement("canvas");
    cv.width = swap ? h : w;
    cv.height = swap ? w : h;
    const ctx = ctx2d(cv);
    if (fi.fmt === "image/jpeg") {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, cv.width, cv.height);
    }
    ctx.translate(cv.width / 2, cv.height / 2);
    ctx.rotate((fi.rot * Math.PI) / 180);
    ctx.scale(fi.flipH, fi.flipV);
    ctx.drawImage(fi.img, -w / 2, -h / 2, w, h);
    const blob = await new Promise<Blob | null>((res) => cv.toBlob(res, fi.fmt, 0.92));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    ($("fiImg") as HTMLImageElement).src = url;
    $("fiPreview").classList.add("show");
    setHTML(
      "fiStat",
      `<span class='good'>${fmtKB(blob.size)}</span><span>${cv.width}×${cv.height} px</span><span>${fi.fmt.replace("image/", "").toUpperCase()}</span>`,
    );
    const dl = $("fiDownload") as HTMLAnchorElement;
    dl.href = url;
    dl.style.display = "inline-flex";
    dl.setAttribute(
      "download",
      `edited-image.${fi.fmt === "image/png" ? "png" : fi.fmt === "image/webp" ? "webp" : "jpg"}`,
    );
  }

  const ftTa = input("ftText");
  function ftUpdate(): void {
    const v = ftTa.value;
    const words = v.trim() ? v.trim().split(/\s+/).length : 0;
    const lines = v ? v.split(/\n/).length : 0;
    setHTML(
      "ftStat",
      `<span>${T("ftWords").replace("{n}", String(words))}</span><span>${T("ftChars").replace("{n}", String(v.length))}</span><span>${T("ftLines").replace("{n}", String(lines))}</span>`,
    );
  }
  ftTa.addEventListener("input", ftUpdate);
  $("ftUpper").addEventListener("click", () => {
    ftTa.value = ftTa.value.toUpperCase();
    ftUpdate();
  });
  $("ftLower").addEventListener("click", () => {
    ftTa.value = ftTa.value.toLowerCase();
    ftUpdate();
  });
  $("ftTitle").addEventListener("click", () => {
    ftTa.value = ftTa.value.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
    ftUpdate();
  });
  $("ftDedup").addEventListener("click", () => {
    const seen: Record<string, number> = {};
    const out: string[] = [];
    ftTa.value.split(/\n/).forEach((l) => {
      if (!seen[l]) {
        seen[l] = 1;
        out.push(l);
      }
    });
    ftTa.value = out.join("\n");
    ftUpdate();
    $("ftMsg").textContent = T("ftDup");
  });
  $("ftCopy").addEventListener("click", () => {
    ftTa.select();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      void navigator.clipboard.writeText(ftTa.value);
    } else {
      document.execCommand("copy");
    }
    $("ftMsg").textContent = T("ftCopyDone");
  });
}

interface ConverterState {
  img: HTMLImageElement | null;
  file: File | null;
  fmt: string;
}

export function initConverter(): void {
  const fc: ConverterState = { img: null, file: null, fmt: "image/jpeg" };
  selGroup("fcFmt", (v) => {
    fc.fmt = v;
  });
  wireDrop("fcDrop", "fcFile", (f) => {
    fc.file = f;
    loadImg(f)
      .then((r) => {
        fc.img = r.img;
        $("fcName").textContent = `✔ ${f.name} · ${fmtKB(f.size)}`;
        (input("fcGo") as HTMLButtonElement).disabled = false;
        $("fcMsg").textContent = "";
      })
      .catch(() => {
        setMsg("fcMsg", T("fileNotImage"), "warn");
      });
  });
  $("fcGo").addEventListener("click", () => {
    if (!fc.img) return;
    const cv = document.createElement("canvas");
    cv.width = fc.img.naturalWidth;
    cv.height = fc.img.naturalHeight;
    const ctx = ctx2d(cv);
    if (fc.fmt === "image/jpeg") {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, cv.width, cv.height);
    }
    ctx.drawImage(fc.img, 0, 0);
    cv.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const ext = fc.fmt === "image/png" ? "png" : fc.fmt === "image/webp" ? "webp" : "jpg";
        ($("fcImg") as HTMLImageElement).src = url;
        $("fcPreview").classList.add("show");
        setHTML(
          "fcStat",
          `<span>${T("kbStatBefore")}: ${fmtKB(fc.file ? fc.file.size : 0)}</span><span class='good'>${T("kbStatNow")}: ${fmtKB(blob.size)}</span><span>${ext.toUpperCase()} · ${cv.width}×${cv.height} px</span>`,
        );
        const dl = $("fcDownload") as HTMLAnchorElement;
        dl.href = url;
        dl.style.display = "inline-flex";
        dl.setAttribute("download", `converted.${ext}`);
        setMsg("fcMsg", T("fcDone"), "good");
      },
      fc.fmt,
      0.92,
    );
  });
}
