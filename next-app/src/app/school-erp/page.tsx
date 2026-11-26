import type { Metadata } from "next";
import { EduCafeRuntime } from "@/components/sites/educafehub/EduCafeRuntime";
import { LanguageBar, AuthProvider } from "@/components/sites/educafehub/Hero";
import { Footer } from "@/components/sites/educafehub/Legal";
import { ToolGrid } from "@/components/sites/educafehub/ToolGrid";

export const metadata: Metadata = {
  title: "School ERP | EduCafe Hub",
  description:
    "EduCafe School ERP: students, admissions, attendance, fees, staff and payroll, exams, certificates, timetable, library, transport, accounts and government reports for UDISE+, APAAR and RTE, in English and Hindi.",
  openGraph: {
    type: "website",
    siteName: "EduCafe Hub",
    url: "https://educafehub.pages.dev/school-erp/",
    title: "EduCafe School ERP | EduCafe Hub",
    description:
      "One system for the whole school office: students, attendance, fees, exams, certificates and government reports, in English and Hindi.",
    images: [
      {
        url: "https://educafehub.pages.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "EduCafe School ERP",
      },
    ],
  },
};

const MODULES = [
  { en: "Students", hi: "छात्र", ed: "Full student records with PEN and APAAR details, class and section wise.", hd: "PEN और APAAR विवरण के साथ पूरे छात्र रिकॉर्ड, कक्षा और सेक्शन अनुसार।" },
  { en: "Admissions", hi: "प्रवेश", ed: "Enquiries and new admissions in a simple step by step flow.", hd: "पूछताछ और नए प्रवेश, आसान चरणों में।" },
  { en: "Attendance", hi: "उपस्थिति", ed: "Daily student and staff attendance with monthly summaries.", hd: "छात्रों और कर्मचारियों की रोज़ की उपस्थिति, मासिक सारांश के साथ।" },
  { en: "Fees", hi: "शुल्क", ed: "Fee heads, fee structure, collection and receipts in one place.", hd: "शुल्क मद, शुल्क संरचना, वसूली और रसीदें एक ही जगह।" },
  { en: "Staff and Payroll", hi: "कर्मचारी और वेतन", ed: "Staff records, leaves and salary payments.", hd: "कर्मचारी रिकॉर्ड, छुट्टियाँ और वेतन भुगतान।" },
  { en: "Exams and Reports", hi: "परीक्षा और रिपोर्ट", ed: "Exams, marks entry and report cards.", hd: "परीक्षाएँ, अंक प्रविष्टि और रिपोर्ट कार्ड।" },
  { en: "Certificates", hi: "प्रमाणपत्र", ed: "Transfer certificates and other school certificates.", hd: "स्थानांतरण प्रमाणपत्र और अन्य स्कूल प्रमाणपत्र।" },
  { en: "Timetable", hi: "समय सारणी", ed: "Class timetables and substitutions.", hd: "कक्षा समय सारणी और प्रतिस्थापन।" },
  { en: "Library", hi: "पुस्तकालय", ed: "Books, issues and returns.", hd: "पुस्तकें, जारी करना और वापसी।" },
  { en: "Transport", hi: "परिवहन", ed: "Routes, stops and student transport lists.", hd: "मार्ग, पड़ाव और छात्र परिवहन सूचियाँ।" },
  { en: "Accounts", hi: "लेखा", ed: "School income and expense ledger.", hd: "स्कूल की आय और व्यय का खाता।" },
  { en: "Gate and Visitors", hi: "गेट और आगंतुक", ed: "Visitor entries and student gate passes.", hd: "आगंतुक प्रविष्टियाँ और छात्र गेट पास।" },
  { en: "Inventory", hi: "भंडार", ed: "Stock items and movements.", hd: "भंडार सामग्री और आवाजाही।" },
  { en: "Government Reports", hi: "सरकारी रिपोर्ट", ed: "UDISE+, APAAR and RTE data kept ready for government portals.", hd: "UDISE+, APAAR और RTE का डेटा सरकारी पोर्टल के लिए तैयार।" },
  { en: "Notices", hi: "सूचनाएँ", ed: "School notices for staff and parents.", hd: "कर्मचारियों और अभिभावकों के लिए स्कूल सूचनाएँ।" },
  { en: "School Setup", hi: "स्कूल सेटअप", ed: "School name, UDISE code, board and session set once, used everywhere.", hd: "स्कूल का नाम, UDISE कोड, बोर्ड और सत्र एक बार सेट करें, हर जगह उपयोग होगा।" },
] as const;

const STEPS = [
  { en: "1. Tell us your school", hi: "1. अपने स्कूल की जानकारी दें", ed: "Message us on WhatsApp or email with your school name and UDISE code.", hd: "WhatsApp या ईमेल पर अपने स्कूल का नाम और UDISE कोड भेजें।" },
  { en: "2. We set up your school", hi: "2. हम आपका स्कूल सेट करते हैं", ed: "Classes, sections and fee structure are set up for your school.", hd: "आपके स्कूल के लिए कक्षाएँ, सेक्शन और शुल्क संरचना सेट की जाती है।" },
  { en: "3. Start your daily work", hi: "3. रोज़ का काम शुरू करें", ed: "Add students and start attendance, fees and reports from day one.", hd: "छात्र जोड़ें और पहले दिन से उपस्थिति, शुल्क और रिपोर्ट शुरू करें।" },
] as const;

export default function Page() {
  return (
    <AuthProvider>
      <div className="wrap" id="top">
        <LanguageBar />
        <section aria-label="EduCafe School ERP">
          <div className="sec-head">
            <h2>
              <span className="en-only">EduCafe School ERP</span>
              <span className="hi-only">एडुकैफ़े स्कूल ERP</span>
            </h2>
          </div>
          <p>
            <span className="en-only">
              One system for the whole school office. Student records, admissions, attendance,
              fees, exams, certificates and the data government portals ask for, in English and
              Hindi.
            </span>
            <span className="hi-only">
              पूरे स्कूल कार्यालय के लिए एक ही प्रणाली। छात्र रिकॉर्ड, प्रवेश, उपस्थिति, शुल्क,
              परीक्षा, प्रमाणपत्र और सरकारी पोर्टल के लिए चाहिए डेटा, अंग्रेज़ी और हिंदी में।
            </span>
          </p>
          <div className="owner">
            {MODULES.map((m) => (
              <div className="card" key={m.en}>
                <h3>
                  <span className="en-only">{m.en}</span>
                  <span className="hi-only">{m.hi}</span>
                </h3>
                <p>
                  <span className="en-only">{m.ed}</span>
                  <span className="hi-only">{m.hd}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
        <ToolGrid />
        <section aria-label="How to start">
          <div className="sec-head">
            <h2>
              <span className="en-only">How to start</span>
              <span className="hi-only">कैसे शुरू करें</span>
            </h2>
          </div>
          <div className="owner">
            {STEPS.map((s) => (
              <div className="card" key={s.en}>
                <h3>
                  <span className="en-only">{s.en}</span>
                  <span className="hi-only">{s.hi}</span>
                </h3>
                <p>
                  <span className="en-only">{s.ed}</span>
                  <span className="hi-only">{s.hd}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="finalcta" aria-label="Contact">
          <p className="finalcta-t">
            <span className="en-only">Bring your school office into one system.</span>
            <span className="hi-only">अपने स्कूल कार्यालय को एक ही प्रणाली में लाएँ।</span>
          </p>
          <a className="btn" href="https://wa.me/918787479225" target="_blank" rel="noopener">
            <span className="en-only">WhatsApp: +91 87874 79225</span>
            <span className="hi-only">WhatsApp: +91 87874 79225</span>
          </a>{" "}
          <a className="btn ghost" href="mailto:educafehub@gmail.com">
            educafehub@gmail.com
          </a>
        </section>
        <Footer />
        <EduCafeRuntime />
      </div>
    </AuthProvider>
  );
}
