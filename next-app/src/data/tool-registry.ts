export type ToolCategory = "photo" | "pdf" | "calculator" | "utility" | "file";

export interface Tool {
  slug: string;
  nameEn: string;
  nameHi: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  category: ToolCategory;
  component: string;
  initFunction: string;
  sectionId: string;
}

export const TOOLS: Tool[] = [
  {
    slug: "passport-photo",
    nameEn: "Passport Photo",
    nameHi: "पासपोर्ट फ़ोटो",
    titleEn: "Passport Photo Maker 35×45mm — Print-Ready Sheet at 300 DPI",
    titleHi: "पासपोर्ट फ़ोटो मेकर 35×45 मिमी — 300 DPI पर प्रिंट के लिए तैयार शीट",
    descriptionEn:
      "Upload one photo, download a print-ready passport sheet — 300 DPI, correct passport size (35 × 45 mm). The busiest tool in any cafe.",
    descriptionHi:
      "एक फ़ोटो अपलोड करें, प्रिंट के लिए तैयार पासपोर्ट शीट डाउनलोड करें — 300 DPI, सही पासपोर्ट आकार (35 × 45 मिमी)। कैफ़े में सबसे ज़्यादा चलने वाला टूल।",
    category: "photo",
    component: "PassportTool",
    initFunction: "initPassport",
    sectionId: "passport",
  },
  {
    slug: "exact-kb-photo",
    nameEn: "Exact KB Photo",
    nameHi: "ठीक KB फ़ोटो",
    titleEn: "Resize Photo to Exact KB for Exam Forms — 20KB, 50KB, 100KB, 200KB",
    titleHi: "परीक्षा फ़ॉर्म के लिए फ़ोटो को ठीक KB में रिसाइज़ करें — 20KB, 50KB, 100KB, 200KB",
    descriptionEn:
      "Online forms ask for “photo under 50 KB” and reject everything else — set the target KB here and get a photo that fits exactly.",
    descriptionHi:
      "ऑनलाइन फ़ॉर्म कहता है “फ़ोटो 50 KB से कम” और सब रिजेक्ट हो जाता है — यहाँ लक्ष्य KB सेट करें और बिल्कुल उसी सीमा के अंदर की फ़ोटो पाएँ।",
    category: "photo",
    component: "ExactKbTool",
    initFunction: "initKb",
    sectionId: "kb",
  },
  {
    slug: "exam-form-photo",
    nameEn: "Exam Form Photo",
    nameHi: "परीक्षा फ़ॉर्म फ़ोटो",
    titleEn: "Exam-Form Photo — Exact Pixel Size & KB Range (SSC, UPSC, Bank, BPSC)",
    titleHi: "परीक्षा फ़ॉर्म फ़ोटो — सटीक पिक्सेल आकार और KB रेंज (SSC, UPSC, बैंक, BPSC)",
    descriptionEn:
      "Pick the exam, add the photo — you get a JPG of the exact pixel size and KB range that form asks for, with name and date printed below when needed.",
    descriptionHi:
      "परीक्षा चुनें, फ़ोटो जोड़ें — आपको वही JPG मिलेगा जिसका सटीक पिक्सेल आकार और KB रेंज फ़ॉर्म माँगता है, ज़रूरत पड़ने पर नाम और तारीख के साथ।",
    category: "photo",
    component: "ExamPhotoTool",
    initFunction: "initExamPhoto",
    sectionId: "exam",
  },
  {
    slug: "bulk-student-photos",
    nameEn: "Bulk Student Photos",
    nameHi: "थोक छात्र फ़ोटो",
    titleEn: "Bulk Student Photos — Whole Class Passport Sheets & Separate Files",
    titleHi: "थोक छात्र फ़ोटो — पूरी कक्षा की पासपोर्ट शीट और अलग-अलग फ़ाइलें",
    descriptionEn:
      "Add a whole class's photos together — a folder works too, and so do iPhone HEIC photos. Each photo prints with its name (and date) underneath, as A4 sheets or separate files per student.",
    descriptionHi:
      "पूरी कक्षा की फ़ोटो एक साथ जोड़ें — फ़ोल्डर भी काम करता है, और iPhone HEIC फ़ोटो भी। हर फ़ोटो अपने नाम (और तारीख) के साथ प्रिंट होती है, A4 शीट या हर छात्र की अलग फ़ाइल के रूप में।",
    category: "photo",
    component: "BulkTool",
    initFunction: "initBulk",
    sectionId: "bulk",
  },
  {
    slug: "signature-maker",
    nameEn: "Signature Maker",
    nameHi: "हस्ताक्षर मेकर",
    titleEn: "Signature Maker — Clean Background & Resize to Form Size",
    titleHi: "हस्ताक्षर मेकर — पृष्ठभूमि साफ़ करें और फ़ॉर्म आकार में रिसाइज़ करें",
    descriptionEn:
      "Upload a photo of a signature on white paper — the background is cleaned, extra area is cropped, and you download it in form size.",
    descriptionHi:
      "सफ़ेद काग़ज़ पर किए हस्ताक्षर की फ़ोटो अपलोड करें — पृष्ठभूमि साफ़ होगी, फ़ालतू हिस्सा कटेगा और फ़ॉर्म के आकार में डाउनलोड मिलेगा।",
    category: "photo",
    component: "SignatureTool",
    initFunction: "initSignature",
    sectionId: "signature",
  },
  {
    slug: "photo-signature-joiner",
    nameEn: "Photo + Signature Joiner",
    nameHi: "फ़ोटो + हस्ताक्षर जोड़ने वाला",
    titleEn: "Photo + Signature Joiner — Combine into One Image for Forms",
    titleHi: "फ़ोटो + हस्ताक्षर जोड़ने वाला — फ़ॉर्म के लिए एक इमेज में मिलाएँ",
    descriptionEn:
      "Some forms want photo on top and signature below in a single image. Upload both — one combined image is ready.",
    descriptionHi:
      "कुछ फ़ॉर्म एक ही इमेज में ऊपर फ़ोटो और नीचे हस्ताक्षर माँगते हैं। दोनों अपलोड करें — एक मिली-जुली इमेज तैयार हो जाएगी।",
    category: "photo",
    component: "JoinerTool",
    initFunction: "initJoiner",
    sectionId: "joiner",
  },
  {
    slug: "image-to-pdf",
    nameEn: "Image to PDF",
    nameHi: "इमेज → PDF",
    titleEn: "Image to PDF Converter — Multiple Photos to Single PDF (A4, 4×6, Fit)",
    titleHi: "इमेज से PDF कन्वर्टर — एकाधिक फ़ोटो को एक PDF में बदलें (A4, 4×6, फिट)",
    descriptionEn:
      "Marksheets, Aadhaar, certificates — select as many photos as you like and get one clean PDF, in the order you selected them.",
    descriptionHi:
      "अंकपत्र, आधार, प्रमाणपत्र — जितनी चाहें फ़ोटो चुनें, एक साफ़ PDF बन जाएगी, उसी क्रम में जिसमें आपने चुनी हैं।",
    category: "pdf",
    component: "ImageToPdfTool",
    initFunction: "initImageToPdf",
    sectionId: "pdf",
  },
  {
    slug: "pdf-compress",
    nameEn: "PDF Compress",
    nameHi: "PDF छोटा करें",
    titleEn: "Compress PDF — Shrink Scanned Documents & Photo PDFs",
    titleHi: "PDF कंप्रेस करें — स्कैन किए गए दस्तावेज़ और फ़ोटो PDF छोटे करें",
    descriptionEn:
      "Shrink a large PDF — works best on scanned documents and photo PDFs. Pick a quality level for portal limits like 200 KB / 500 KB.",
    descriptionHi:
      "बड़ी PDF को छोटा करें — स्कैन किए गए दस्तावेज़ों और फ़ोटो वाली PDF पर सबसे अच्छा काम करता है। पोर्टल की सीमाओं जैसे 200 KB / 500 KB के लिए क्वालिटी लेवल चुनें।",
    category: "pdf",
    component: "PdfCompressTool",
    initFunction: "initPdfCompress",
    sectionId: "pdfcompress",
  },
  {
    slug: "image-compressor",
    nameEn: "Image Compressor",
    nameHi: "इमेज कंप्रेसर",
    titleEn: "Image Compressor — Reduce Photo Size for WhatsApp & Email",
    titleHi: "इमेज कंप्रेसर — व्हाट्सऐप और ईमेल के लिए फ़ोटो का आकार घटाएँ",
    descriptionEn:
      "For WhatsApp or email — lower the quality a little and the size drops a lot. Move the slider and watch the size live.",
    descriptionHi:
      "व्हाट्सऐप या ईमेल के लिए — क्वालिटी थोड़ी कम करें और आकार बहुत घट जाता है। स्लाइडर घुमाएँ और लाइव आकार देखें।",
    category: "photo",
    component: "ImageCompressorTool",
    initFunction: "initCompressor",
    sectionId: "compress",
  },
  {
    slug: "file-converter",
    nameEn: "File Converter",
    nameHi: "फ़ाइल कन्वर्टर",
    titleEn: "File Converter — JPG, PNG, WebP Format Conversion in Browser",
    titleHi: "फ़ाइल कन्वर्टर — ब्राउज़र में JPG, PNG, WebP फॉर्मेट बदलें",
    descriptionEn:
      "Convert a photo or image to another format right here in the browser — JPG, PNG, WebP. Nothing is uploaded.",
    descriptionHi:
      "एक फ़ोटो या इमेज को दूसरे फॉर्मेट में बदलें यहीं ब्राउज़र में — JPG, PNG, WebP। कुछ भी अपलोड नहीं होता।",
    category: "file",
    component: "ConverterCard",
    initFunction: "initConverter",
    sectionId: "converter",
  },
  {
    slug: "file-tools",
    nameEn: "File Tools",
    nameHi: "फ़ाइल टूल्स",
    titleEn: "File Tools — PDF Split/Merge, Image Resize/Convert/Rotate, Text Tools",
    titleHi: "फ़ाइल टूल्स — PDF स्प्लिट/मर्ज, इमेज रिसाइज़/कन्वर्ट/रोटेट, टेक्स्ट टूल्स",
    descriptionEn:
      "Browser file tools like the open-source Filee — PDF split/merge, image resize, format convert, rotate/flip and text tools. Everything runs in your browser; nothing is uploaded.",
    descriptionHi:
      "ओपन-सोर्स Filee जैसे ब्राउज़र फ़ाइल टूल्स — PDF स्प्लिट/मर्ज, इमेज रिसाइज़, फॉर्मेट बदलें, रोटेट/फ्लिप और टेक्स्ट टूल्स। सब आपके ब्राउज़र में चलता है; कुछ भी अपलोड नहीं होता।",
    category: "file",
    component: "FileToolsSection",
    initFunction: "initFileTools",
    sectionId: "filetools",
  },
  {
    slug: "qr-code-maker",
    nameEn: "QR Code Maker",
    nameHi: "QR कोड मेकर",
    titleEn: "QR Code Maker — UPI Payment, Wi-Fi, Link (Print-Ready PNG)",
    titleHi: "QR कोड मेकर — UPI भुगतान, वाई-फाई, लिंक (प्रिंट के लिए तैयार PNG)",
    descriptionEn:
      "A payment QR for the shop counter, a Wi-Fi QR, or a QR for any link — make it, print it, put it on the counter. No sign-up, QR is made in the browser.",
    descriptionHi:
      "दुकान के काउंटर के लिए पेमेंट QR, वाई-फाई QR, या किसी लिंक का QR — बनाएँ, प्रिंट करें, काउंटर पर लगाएँ। कोई साइन-अप नहीं, QR ब्राउज़र में बनता है।",
    category: "utility",
    component: "QrTool",
    initFunction: "initQr",
    sectionId: "qr",
  },
  {
    slug: "receipt-bill-maker",
    nameEn: "Receipt / Bill Maker",
    nameHi: "रसीद / बिल मेकर",
    titleEn: "Receipt / Bill Maker — Cafe Bill or School Fee Receipt in Seconds",
    titleHi: "रसीद / बिल मेकर — कैफ़े बिल या स्कूल फ़ीस रसीद सेकंड में",
    descriptionEn:
      "A cafe bill or a school fee receipt in seconds — type the items, download a clean receipt image to print or send on WhatsApp.",
    descriptionHi:
      "कैफ़े बिल या स्कूल फ़ीस रसीद सेकंड में — आइटम टाइप करें, साफ़ रसीद इमेज डाउनलोड करें प्रिंट या व्हाट्सऐप पर भेजने के लिए।",
    category: "utility",
    component: "ReceiptTool",
    initFunction: "initReceipt",
    sectionId: "receipt",
  },
  {
    slug: "print-cost-calculator",
    nameEn: "Print Cost Calculator",
    nameHi: "प्रिंट लागत कैलकुलेटर",
    titleEn: "Print Cost Calculator — Counter Maths Without Mistakes",
    titleHi: "प्रिंट लागत कैलकुलेटर — बिना गलती के काउंटर का हिसाब",
    descriptionEn:
      "Counter maths without mistakes — enter the counts, see exactly what to charge for B/W prints, colour prints, passport photos, laminations, and form filling.",
    descriptionHi:
      "काउंटर का हिसाब बिना गलती के — संख्या दर्ज करें, देखें B/W प्रिंट, कलर प्रिंट, पासपोर्ट फ़ोटो, लैमिनेशन और फ़ॉर्म भरने के लिए क्या चार्ज करना है।",
    category: "calculator",
    component: "PrintCostTool",
    initFunction: "initPrintCost",
    sectionId: "printcost",
  },
  {
    slug: "age-calculator",
    nameEn: "Age Calculator",
    nameHi: "उम्र कैलकुलेटर",
    titleEn: "Age Calculator for School Admission — Today + 31 March / 31 December Cutoffs",
    titleHi: "स्कूल एडमिशन के लिए उम्र कैलकुलेटर — आज + 31 मार्च / 31 दिसंबर कटऑफ",
    descriptionEn:
      "Enter the date of birth — get today's age plus the age on admission cut-off dates (31 March / 31 December).",
    descriptionHi:
      "जन्म तिथि दर्ज करें — आज की उम्र के साथ एडमिशन की कटऑफ तारीखों (31 मार्च / 31 दिसंबर) पर उम्र भी पाएँ।",
    category: "calculator",
    component: "AgeTool",
    initFunction: "initAge",
    sectionId: "age",
  },
  {
    slug: "marks-percentage-calculator",
    nameEn: "Marks & Percentage Calculator",
    nameHi: "अंक और प्रतिशत कैलकुलेटर",
    titleEn: "Marks & Percentage Calculator — Total, Division, Grade & CGPA Converter",
    titleHi: "अंक और प्रतिशत कैलकुलेटर — कुल, डिवीजन, ग्रेड और CGPA कन्वर्टर",
    descriptionEn:
      "Enter marks for every subject — total, percentage, division and grade are automatic. A CGPA ↔ percentage converter is included.",
    descriptionHi:
      "हर विषय के अंक दर्ज करें — कुल, प्रतिशत, डिवीजन और ग्रेड अपने-आप। CGPA ↔ प्रतिशत कन्वर्टर भी शामिल है।",
    category: "calculator",
    component: "MarksTool",
    initFunction: "initMarks",
    sectionId: "marks",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getAllToolSlugs(): string[] {
  return TOOLS.map((t) => t.slug);
}