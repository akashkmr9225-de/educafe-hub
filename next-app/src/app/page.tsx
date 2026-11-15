import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, Intro, ToolNav } from "@/components/sites/educafehub/Hero";
import { PassportTool, ExactKbTool } from "@/components/sites/educafehub/PhotoTools1";
import { SignatureTool, JoinerTool } from "@/components/sites/educafehub/PhotoTools2";
import {
  ImageToPdfTool,
  PdfCompressTool,
  ImageCompressorTool,
} from "@/components/sites/educafehub/PdfTools";
import { AgeTool, MarksTool } from "@/components/sites/educafehub/Calculators";
import { FileToolsSection } from "@/components/sites/educafehub/FileTools";
import { QrTool } from "@/components/sites/educafehub/QrTool";
import { BulkTool } from "@/components/sites/educafehub/Bulk";
import { ExamPhotoTool, ReceiptTool, PrintCostTool } from "@/components/sites/educafehub/ExamReceipt";
import { LoginSection, TasksSection, CapacitySection } from "@/components/sites/educafehub/Account";
import { LinksSection, OwnerNotesSection } from "@/components/sites/educafehub/Links";
import { LegalSection, Footer } from "@/components/sites/educafehub/Legal";

export default function Home() {
  return (
    <div className="wrap" id="top">
      <noscript>
        <div style={{ background: "var(--saffron-bg)", color: "var(--warn)", border: "1px solid var(--warn)", borderRadius: 12, padding: "14px 18px", marginTop: 16, fontWeight: 600 }}>
          JavaScript is off in this browser, so the tools cannot run. Please enable JavaScript and
          reload. / JavaScript बंद है, इसलिए टूल नहीं चलेंगे — कृपया JavaScript चालू करके पेज दोबारा
          खोलें।
        </div>
      </noscript>
      <LanguageBar />
      <Intro />
      <ToolNav />
      <PassportTool />
      <ExactKbTool />
      <SignatureTool />
      <JoinerTool />
      <ImageToPdfTool />
      <PdfCompressTool />
      <ImageCompressorTool />
      <AgeTool />
      <MarksTool />
      <FileToolsSection />
      <QrTool />
      <BulkTool />
      <ExamPhotoTool />
      <ReceiptTool />
      <PrintCostTool />
      <LoginSection />
      <TasksSection />
      <CapacitySection />
      <LinksSection />
      <OwnerNotesSection />
      <LegalSection />
      <Footer />
      <div className="toast" id="toast" role="status" aria-live="polite">
        <span className="tick">✓</span>
        <span id="toastTxt" />
      </div>
      <a className="totop" href="#top" aria-label="Back to top">
        ↑ Top
      </a>
      <EduCafeRuntime />
    </div>
  );
}
