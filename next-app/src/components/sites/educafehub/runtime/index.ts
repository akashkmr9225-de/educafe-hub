import { ensureCoreLibs } from "./helpers";
import { setLang, store } from "./state";
import { initAppShell } from "./app-shell";
import { initDocCrop } from "./tool-doccrop";
import { initReceipt } from "./tool-receipt";

import { initConverter, initFileTools, initImageToPdf, initPdfCompress } from "./tools-pdf";
import { initMarks } from "./tools-calc";
import {
  initCompressor,
  initJoiner,
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
    run("doc-crop", initDocCrop);
    run("kb", initKb);
    run("signature", initSignature);
    run("joiner", initJoiner);
    run("image-to-pdf", initImageToPdf);
    run("pdf-compress", initPdfCompress);
    run("compressor", initCompressor);
    run("marks", initMarks);
    run("file-tools", initFileTools);
    run("converter", initConverter);
    run("receipt", initReceipt);
    run("app-shell", initAppShell);
  })();

  inits.set(root, promise);
  return promise;
}
