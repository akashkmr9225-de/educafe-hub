import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, Intro, AuthProvider } from "@/components/sites/educafehub/Hero";
import { ToolGrid } from "@/components/sites/educafehub/ToolGrid";
import { LinksSection } from "@/components/sites/educafehub/Links";
import { Footer } from "@/components/sites/educafehub/Legal";

export default function Home() {
  return (
    <AuthProvider>
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
        <ToolGrid />
        <LinksSection />
        <Footer />
        <div className="toast" id="toast" role="status" aria-live="polite">
          <span className="tick">✓</span>
          <span id="toastTxt" />
        </div>
        <a className="totop" href="#top" data-i18n-aria="ariaTop" aria-label="Back to top" data-i18n="totopLbl">
          ↑ Top
        </a>
        <EduCafeRuntime />
      </div>
    </AuthProvider>
  );
}
