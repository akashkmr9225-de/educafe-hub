export {};

declare global {
  interface JsPdfDoc {
    internal: { pageSize: { getWidth(): number; getHeight(): number } };
    addPage(format?: string | [number, number], orientation?: string): void;
    addImage(
      data: string,
      format: string,
      x: number,
      y: number,
      width: number,
      height: number,
    ): void;
    save(name: string): void;
    output(type: "blob"): Blob;
  }

  interface JsPdfNamespace {
    jsPDF: new (opts?: {
      unit?: string;
      format?: string | [number, number];
      orientation?: string;
    }) => JsPdfDoc;
  }

  interface PdfViewport {
    width: number;
    height: number;
  }

  interface PdfPage {
    getViewport(opts: { scale: number }): PdfViewport;
    render(opts: {
      canvasContext: CanvasRenderingContext2D;
      viewport: PdfViewport;
    }): { promise: Promise<void> };
  }

  interface PdfDocument {
    numPages: number;
    getPage(n: number): Promise<PdfPage>;
  }

  interface PdfJsNamespace {
    GlobalWorkerOptions: { workerSrc: string };
    getDocument(opts: { data: ArrayBuffer }): { promise: Promise<PdfDocument> };
  }

  interface QrCodeOptions {
    text: string;
    width: number;
    height: number;
    colorDark: string;
    colorLight: string;
    correctLevel: number;
  }

  interface QrCodeCtor {
    new (el: HTMLElement, opts: QrCodeOptions): unknown;
    CorrectLevel: { L: number; M: number; Q: number; H: number };
  }

  interface ZipArchive {
    file(name: string, data: Blob | string): void;
    generateAsync(opts: { type: "blob" }): Promise<Blob>;
  }

  interface JsZipCtor {
    new (): ZipArchive;
  }

  type Heic2Any = (opts: {
    blob: Blob;
    toType?: string;
    quality?: number;
  }) => Promise<Blob | Blob[]>;

  interface XlsxWorkbook {
    SheetNames: string[];
    Sheets: Record<string, unknown>;
  }

  interface XlsxNamespace {
    read(data: ArrayBuffer, opts: { type: "array" }): XlsxWorkbook;
    utils: {
      sheet_to_json(
        ws: unknown,
        opts: { header: 1; defval: string; raw: true },
      ): unknown[][];
    };
  }

  interface PsdLayer {
    name?: string;
    hidden?: boolean;
    left: number;
    top: number;
    width: number;
    height: number;
    canvas?: HTMLCanvasElement;
    children?: PsdLayer[];
  }

  interface PsdDoc {
    width: number;
    height: number;
    canvas?: HTMLCanvasElement;
    children?: PsdLayer[];
    imageResources?: { resolutionInfo?: { horizontalResolution?: number } };
  }

  interface AgPsdNamespace {
    readPsd(
      buf: ArrayBuffer,
      opts: {
        useImageData: boolean;
        skipLayerImageData: boolean;
        skipCompositeImageData: boolean;
      },
    ): PsdDoc;
  }

  interface ImglyModule {
    removeBackground?: (file: Blob, cfg: Record<string, unknown>) => Promise<Blob>;
    default?: (file: Blob, cfg: Record<string, unknown>) => Promise<Blob>;
  }

  interface Window {
    jspdf?: JsPdfNamespace;
    pdfjsLib?: PdfJsNamespace;
    QRCode?: QrCodeCtor;
    JSZip?: JsZipCtor;
    heic2any?: Heic2Any;
    XLSX?: XlsxNamespace;
    agPsd?: AgPsdNamespace;
  }
}
