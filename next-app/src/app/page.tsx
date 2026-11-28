import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, Intro, AuthProvider } from "@/components/sites/educafehub/Hero";
import { Footer } from "@/components/sites/educafehub/Legal";
import { ScrollReveal } from "@/components/sites/educafehub/ScrollReveal";
import { TaglineReveal } from "@/components/sites/educafehub/TaglineReveal";
import { Gateway } from "@/components/sites/educafehub/HomeSections";

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
        <ScrollReveal>
          <Gateway />
        </ScrollReveal>
        <div className="rv">
          <div className="sec-head">
            <h2 data-i18n="sections.tools">Tools</h2>
          </div>
          <div className="linkgrid">
            <div className="card">
              <a href="/tools/passport-photo">
                <h3>Passport Size Photo Maker Online Free</h3>
                <p>Upload a photo and download a print-ready 35×45mm sheet at 300 DPI with chosen copies paper size and background no watermark</p>
              </a>
            </div>
            <div className="card">
              <a href="/tools/exact-kb-photo">
                <h3>Exact KB Photo</h3>
                <p>Resize a photo to an exact KB size for online forms pick 20KB 50KB 100KB or any target the download is exactly that size single photo or 200 at once with pixel size when the form asks</p>
              </a>
            </div>
            <div className="card">
              <a href="/tools/signature-maker">
                <h3>Signature Maker</h3>
                <p>Signature resizer for online forms photo of a signature on paper becomes a clean white-background JPG at the form's size 10 to 20 KB ready to upload</p>
              </a>
            </div>
            <div className="card">
              <a href="/tools/photo-signature-joiner">
                <h3>Photo + Signature Joiner</h3>
                <p>Photo and signature joiner put the photo on top and the signature below in one single image for forms that ask for a combined file with optional KB limit so the form accepts it</p>
              </a>
            </div>
            <div className="card">
              <a href="/tools/image-to-pdf">
                <h3>Image to PDF</h3>
                <p>JPG to PDF converter turn photos into one clean PDF in chosen order A4 4×6 or fit-to-photo pages marksheets certificates and Aadhaar photos to PDF in seconds free</p>
              </a>
            </div>
            <div className="card">
              <a href="/tools/pdf-compress">
                <h3>PDF Compress</h3>
                <p>Compress PDF online free shrink a large PDF scanned documents and photo PDFs shrink the most pick a quality level to fit portal limits like 200 KB to 500 KB</p>
              </a>
            </div>
            <div className="card">
              <a href="/tools/image-compressor">
                <h3>Image Compressor</h3>
                <p>Image compressor reduce a photo's size for WhatsApp or email with a live quality slider watch the KB drop before you download JPG or PNG output</p>
              </a>
            </div>
            <div className="card">
              <a href="/tools/file-converter">
                <h3>File Converter</h3>
                <p>Image format converter change a photo between JPG PNG and WebP in the browser WebP to JPG for forms that refuse WebP JPG to PNG when transparency is needed</p>
              </a>
            </div>
            <div className="card">
              <a href="/tools/file-tools">
                <h3>File Tools</h3>
                <p>Merge PDF and split PDF online free plus image resize convert rotate and text tools word counter case changer duplicate-line remover all in the browser nothing uploaded</p>
              </a>
            </div>
            <div className="card">
              <a href="/tools/receipt-bill-maker">
                <h3>Receipt / Bill Maker</h3>
                <p>Receipt maker online free type the items and download a clean fee receipt or cafe bill image in seconds ready to print or send on WhatsApp</p>
              </a>
            </div>
            <div className="card">
              <a href="/tools/marks-percentage-calculator">
                <h3>Marks & Percentage Calculator</h3>
                <p>Percentage calculator from marks enter subject marks and get the total percentage division and grade plus a CGPA to percentage converter CBSE × 9.5</p>
              </a>
            </div>
            <div className="card">
              <a href="/tools/document-auto-crop">
                <h3>Document Auto Crop</h3>
                <p>Document auto crop upload a photo of any document its four corners are found automatically drag to adjust the page is straightened flat download a clean JPG or PDF Aadhaar certificates marksheets and forms</p>
              </a>
            </div>
            <div className="card">
              <a href="/tools/photo-to-text">
                <h3>Photo to Text</h3>
                <p>Photo to text converter upload a photo of any document notice or page and extract the printed text copy it or save it as a txt file works for English and Hindi right in the browser</p>
              </a>
            </div>
          </div>
        </div>
        <TaglineReveal />
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
