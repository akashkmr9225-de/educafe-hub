import { ensureCoreLibs } from "./helpers";
import { setLang, store } from "./state";
import { initAppShell } from "./app-shell";
import { initBulk } from "./tool-bulk";
import { initDocCrop } from "./tool-doccrop";
import { initQr } from "./tool-qr";
import { initReceipt } from "./tool-receipt";
import { initAge, initMarks, initPrintCost } from "./tools-calc";
import { initConverter, initFileTools, initImageToPdf, initPdfCompress } from "./tools-pdf";
import {
  initCompressor,
  initExamPhoto,
  initJoiner,
  initFormPhoto,
  initKb,
  initPassport,
  initSignature,
} from "./tools-photo";

const inits = new WeakMap<HTMLElement, Promise<void>>();

function run(name: string, fn: () => void): void {
  try {
    fn();
  } catch (err) {
    console.error(`[educafe] ${name} failed`, err);
  }
}

export function initEduCafe(): Promise<void> {
  const root = document.getElementById("top");
  if (!root) return Promise.resolve();
  const existing = inits.get(root);
  if (existing) return existing;

  const promise = (async () => {
    // Apply the saved language first, before the library wait, so a Hindi
    // visitor sees Hindi right away instead of the English fallback text.
    try {
      setLang(store.get<string>("educafehub_lang") === "hi" ? "hi" : "en");
    } catch {
      // language application must never block the tools
    }
    await Promise.race([
      ensureCoreLibs(),
      new Promise((resolve) => setTimeout(resolve, 8000)),
    ]);
    run("passport", initPassport);
    run("form-photo", initFormPhoto);
    run("doc-crop", initDocCrop);
    run("kb", initKb);
    run("signature", initSignature);
    run("joiner", initJoiner);
    run("image-to-pdf", initImageToPdf);
    run("pdf-compress", initPdfCompress);
    run("compressor", initCompressor);
    run("age", initAge);
    run("marks", initMarks);
    run("file-tools", initFileTools);
    run("converter", initConverter);
    run("qr", initQr);
    run("bulk", initBulk);
    run("exam-photo", initExamPhoto);
    run("receipt", initReceipt);
    run("print-cost", initPrintCost);
    run("app-shell", initAppShell);
  })();

  inits.set(root, promise);
  return promise;
}
