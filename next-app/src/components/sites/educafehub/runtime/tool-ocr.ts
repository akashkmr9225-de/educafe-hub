import {
  $,
  chipGroup,
  downloadBlob,
  loadImg,
  loadScriptOnce,
  setHTML,
  setMsg,
  wireDrop,
} from "./helpers";
import { T, showToast } from "./state";

// Tesseract.js (OCR in the browser) loads once, only when this tool is used —
// the photo itself is never uploaded; recognition runs on the device.
const TESSERACT_SRC =
  "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";

interface TessLogger {
  status: string;
  progress: number;
}
interface TessResult {
  data: { text: string };
}
declare global {
  interface Window {
    Tesseract?: {
      recognize: (
        image: File,
        langs: string,
        opts: { logger: (m: TessLogger) => void },
      ) => Promise<TessResult>;
    };
  }
}

export function initOcr(): void {
  if (!document.getElementById("ocrDrop")) return;
  let file: File | null = null;
  let lang = "eng";
  let busy = false;

  const go = $("ocrGo") as HTMLButtonElement;
  const copyBtn = $("ocrCopy") as HTMLButtonElement;
  const dlBtn = $("ocrDl") as HTMLButtonElement;
  const text = $("ocrText") as HTMLTextAreaElement;
  const prog = $("ocrProg");

  chipGroup("ocrLang", (v) => {
    lang = v;
  });

  function syncButtons(): void {
    go.disabled = !file || busy;
    const hasText = text.value.trim().length > 0;
    copyBtn.disabled = !hasText || busy;
    dlBtn.disabled = !hasText || busy;
  }

  wireDrop("ocrDrop", "ocrFile", (f) => {
    if (!/^image\//.test(f.type) && !/\.(jpe?g|png|webp|bmp)$/i.test(f.name)) {
      setMsg("ocrMsg", T("ocrErrFile"), "warn");
      return;
    }
    file = f;
    setHTML("ocrName", "📄 " + f.name);
    loadImg(f)
      .then((r) => {
        ($("ocrDropImg") as HTMLImageElement).src = r.url;
        $("ocrDrop").classList.add("hasimg");
      })
      .catch(() => {
        // preview is a nicety; OCR works from the file itself
      });
    setMsg("ocrMsg", "");
    syncButtons();
  });

  text.addEventListener("input", syncButtons);

  go.addEventListener("click", async () => {
    if (!file || busy) return;
    const f = file;
    busy = true;
    syncButtons();
    prog.hidden = false;
    prog.textContent = T("ocrLoadLib");
    setMsg("ocrMsg", "");
    try {
      await loadScriptOnce(TESSERACT_SRC);
      if (!window.Tesseract) throw new Error("tesseract missing");
      const res = await window.Tesseract.recognize(f, lang, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            prog.textContent = `${T("ocrReading")} ${Math.round((m.progress || 0) * 100)}%`;
          } else {
            prog.textContent = T("ocrPrep");
          }
        },
      });
      const out = (res.data.text || "").trim();
      text.value = out;
      if (out) {
        const words = out.split(/\s+/).filter(Boolean).length;
        $("ocrStat").textContent =
          `${words} ${T("ocrWords")} · ${out.length} ${T("ocrChars")}`;
        setMsg("ocrMsg", T("ocrDone"), "good");
        showToast(T("ocrDoneToast"));
      } else {
        $("ocrStat").textContent = T("ocrWait");
        setMsg("ocrMsg", T("ocrNoText"), "warn");
      }
    } catch {
      setMsg("ocrMsg", T("ocrErrRun"), "warn");
    } finally {
      busy = false;
      prog.hidden = true;
      syncButtons();
    }
  });

  copyBtn.addEventListener("click", async () => {
    const v = text.value;
    if (!v) return;
    try {
      await navigator.clipboard.writeText(v);
    } catch {
      text.select();
      document.execCommand("copy");
    }
    showToast(T("ocrCopied"));
  });

  dlBtn.addEventListener("click", () => {
    if (!text.value) return;
    downloadBlob(
      new Blob([text.value], { type: "text/plain;charset=utf-8" }),
      "photo-text.txt",
    );
  });
}
