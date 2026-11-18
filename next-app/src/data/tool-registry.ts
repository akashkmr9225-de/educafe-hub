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
    titleEn: "Passport Size Photo Maker Online Free — 35×45mm Print Sheet, 300 DPI",
    titleHi: "पासपोर्ट साइज़ फ़ोटो मेकर — 35×45 मिमी प्रिंट शीट, 300 DPI",
    descriptionEn: "Make a passport size photo online free: upload one photo and download a print-ready sheet of 35 × 45 mm passport photos at 300 DPI — copies, paper size and background of your choice, no watermark.",
    descriptionHi: "एक फ़ोटो अपलोड करें और 35 × 45 मिमी पासपोर्ट फ़ोटो की प्रिंट-तैयार शीट डाउनलोड करें — 300 DPI, आपकी पसंद की प्रतियाँ, कागज़ और पृष्ठभूमि, बिना वॉटरमार्क।",
    category: "photo",
    component: "PassportTool",
    initFunction: "initPassport",
    sectionId: "passport",
  },
  {
    slug: "exact-kb-photo",
    nameEn: "Exact KB Photo",
    nameHi: "ठीक KB फ़ोटो",
    titleEn: "Photo Resizer in KB — Resize Photo to Exact 20KB, 50KB, 100KB for Online Forms",
    titleHi: "KB में फ़ोटो रीसाइज़र — ऑनलाइन फ़ॉर्म के लिए ठीक 20KB, 50KB, 100KB",
    descriptionEn: "Resize a photo to an exact KB size for online forms — pick 20 KB, 50 KB, 100 KB or any target and the download is exactly that size. Single photo or 200 at once, with pixel size (200×230) when the form asks.",
    descriptionHi: "ऑनलाइन फ़ॉर्म के लिए फ़ोटो को ठीक KB साइज़ में बदलें — 20 KB, 50 KB, 100 KB या कोई भी लक्ष्य चुनें, डाउनलोड ठीक उसी साइज़ का होगा। एक फ़ोटो या एक साथ 200, फ़ॉर्म माँगे तो पिक्सेल साइज़ (200×230) भी।",
    category: "photo",
    component: "ExactKbTool",
    initFunction: "initKb",
    sectionId: "kb",
  },
  {
    slug: "signature-maker",
    nameEn: "Signature Maker",
    nameHi: "हस्ताक्षर मेकर",
    titleEn: "Signature Resizer Online — Clean Signature for Forms, 10KB–20KB, 140×60 Size",
    titleHi: "सिग्नेचर रीसाइज़र — फ़ॉर्म के लिए साफ़ हस्ताक्षर, 10KB–20KB, 140×60 साइज़",
    descriptionEn: "Signature resizer for online forms: photo of a signature on paper becomes a clean white-background JPG at the form's size — 140×60 pixels, 10 KB–20 KB — ready to upload.",
    descriptionHi: "ऑनलाइन फ़ॉर्म के लिए सिग्नेचर रीसाइज़र: कागज़ पर हस्ताक्षर की फ़ोटो साफ़ सफ़ेद पृष्ठभूमि वाली JPG बन जाती है — फ़ॉर्म के साइज़ में, 140×60 पिक्सेल, 10 KB–20 KB — अपलोड के लिए तैयार।",
    category: "photo",
    component: "SignatureTool",
    initFunction: "initSignature",
    sectionId: "signature",
  },
  {
    slug: "photo-signature-joiner",
    nameEn: "Photo + Signature Joiner",
    nameHi: "फ़ोटो + हस्ताक्षर जोड़ने वाला",
    titleEn: "Photo and Signature Joiner Online — Merge Photo + Signature in One Image",
    titleHi: "फ़ोटो और सिग्नेचर जोड़ने वाला टूल — फ़ोटो + हस्ताक्षर एक ही इमेज में",
    descriptionEn: "Photo and signature joiner: put the photo on top and the signature below in one single image for forms that ask for a combined file — with an optional KB limit so the form accepts it.",
    descriptionHi: "फ़ोटो और सिग्नेचर जोड़ने वाला टूल: ऊपर फ़ोटो और नीचे हस्ताक्षर — एक ही इमेज में, उन फ़ॉर्मों के लिए जो संयुक्त फ़ाइल माँगते हैं — चाहें तो KB सीमा भी, ताकि फ़ॉर्म स्वीकार कर ले।",
    category: "photo",
    component: "JoinerTool",
    initFunction: "initJoiner",
    sectionId: "joiner",
  },
  {
    slug: "image-to-pdf",
    nameEn: "Image to PDF",
    nameHi: "इमेज → PDF",
    titleEn: "JPG to PDF Converter — Image to PDF Online Free, Multiple Photos to One PDF",
    titleHi: "JPG से PDF कन्वर्टर — कई फ़ोटो की एक PDF, ऑनलाइन मुफ़्त",
    descriptionEn: "JPG to PDF converter: turn photos into one clean PDF in your chosen order — A4, 4×6 or fit-to-photo pages. Marksheets, certificates and Aadhaar photos to PDF in seconds, free.",
    descriptionHi: "JPG से PDF कन्वर्टर: फ़ोटो को अपने चुने क्रम में एक साफ़ PDF में बदलें — A4, 4×6 या फ़ोटो-आकार के पेज। मार्कशीट, प्रमाणपत्र और आधार की फ़ोटो से PDF कुछ ही सेकंड में, मुफ़्त।",
    category: "pdf",
    component: "ImageToPdfTool",
    initFunction: "initImageToPdf",
    sectionId: "pdf",
  },
  {
    slug: "pdf-compress",
    nameEn: "PDF Compress",
    nameHi: "PDF छोटा करें",
    titleEn: "Compress PDF Online Free — Reduce PDF Size for Form Uploads (200KB / 500KB)",
    titleHi: "PDF कंप्रेस करें ऑनलाइन मुफ़्त — फ़ॉर्म अपलोड के लिए PDF का साइज़ घटाएँ (200KB / 500KB)",
    descriptionEn: "Compress PDF online free: shrink a large PDF — scanned documents and photo PDFs shrink the most. Pick a quality level to fit portal limits like 200 KB / 500 KB.",
    descriptionHi: "PDF कंप्रेस करें ऑनलाइन मुफ़्त: बड़ी PDF छोटी करें — स्कैन किए दस्तावेज़ और फ़ोटो PDF सबसे ज़्यादा छोटे होते हैं। 200 KB / 500 KB जैसी पोर्टल सीमाओं के लिए क्वालिटी स्तर चुनें।",
    category: "pdf",
    component: "PdfCompressTool",
    initFunction: "initPdfCompress",
    sectionId: "pdfcompress",
  },
  {
    slug: "image-compressor",
    nameEn: "Image Compressor",
    nameHi: "इमेज कंप्रेसर",
    titleEn: "Image Compressor Online Free — Reduce Photo Size Without Losing Quality",
    titleHi: "इमेज कंप्रेसर ऑनलाइन मुफ़्त — क्वालिटी खोए बिना फ़ोटो का साइज़ घटाएँ",
    descriptionEn: "Image compressor: reduce a photo's size for WhatsApp or email with a live quality slider — watch the KB drop before you download. JPG or PNG output.",
    descriptionHi: "इमेज कंप्रेसर: लाइव क्वालिटी स्लाइडर से WhatsApp या ईमेल के लिए फ़ोटो का साइज़ घटाएँ — डाउनलोड से पहले KB घटते हुए देखें। JPG या PNG आउटपुट।",
    category: "photo",
    component: "ImageCompressorTool",
    initFunction: "initCompressor",
    sectionId: "compress",
  },
  {
    slug: "file-converter",
    nameEn: "File Converter",
    nameHi: "फ़ाइल कन्वर्टर",
    titleEn: "Image Format Converter Online — JPG to PNG, PNG to JPG, WebP to JPG Free",
    titleHi: "इमेज फ़ॉर्मेट कन्वर्टर — JPG से PNG, PNG से JPG, WebP से JPG मुफ़्त",
    descriptionEn: "Image format converter: change a photo between JPG, PNG and WebP in your browser — WebP to JPG for forms that refuse WebP, JPG to PNG when you need transparency.",
    descriptionHi: "इमेज फ़ॉर्मेट कन्वर्टर: फ़ोटो को JPG, PNG और WebP के बीच अपने ब्राउज़र में ही बदलें — WebP स्वीकार न करने वाले फ़ॉर्मों के लिए WebP से JPG, पारदर्शिता चाहिए तो JPG से PNG।",
    category: "file",
    component: "ConverterCard",
    initFunction: "initConverter",
    sectionId: "converter",
  },
  {
    slug: "file-tools",
    nameEn: "File Tools",
    nameHi: "फ़ाइल टूल्स",
    titleEn: "Merge PDF & Split PDF Online Free — Plus Image Resize, Rotate and Text Tools",
    titleHi: "PDF जोड़ें और अलग करें ऑनलाइन मुफ़्त — साथ में इमेज रीसाइज़, रोटेट और टेक्स्ट टूल",
    descriptionEn: "Merge PDF and split PDF online free, plus image resize / convert / rotate and text tools (word counter, case changer, duplicate-line remover) — all in your browser, nothing uploaded.",
    descriptionHi: "PDF जोड़ें और अलग करें ऑनलाइन मुफ़्त, साथ में इमेज रीसाइज़ / कन्वर्ट / रोटेट और टेक्स्ट टूल (शब्द गिनती, केस बदलना, दोहराई पंक्तियाँ हटाना) — सब कुछ आपके ब्राउज़र में, कुछ भी अपलोड नहीं होता।",
    category: "file",
    component: "FileToolsSection",
    initFunction: "initFileTools",
    sectionId: "filetools",
  },
  {
    slug: "receipt-bill-maker",
    nameEn: "Receipt / Bill Maker",
    nameHi: "रसीद / बिल मेकर",
    titleEn: "Receipt Maker Online Free — School Fee Receipt & Cafe Bill Generator",
    titleHi: "रसीद मेकर ऑनलाइन मुफ़्त — स्कूल फ़ीस रसीद और कैफ़े बिल जेनरेटर",
    descriptionEn: "Receipt maker online free: type the items and download a clean fee receipt or cafe bill image in seconds — ready to print or send on WhatsApp.",
    descriptionHi: "रसीद मेकर ऑनलाइन मुफ़्त: मदें लिखें और कुछ ही सेकंड में साफ़ फ़ीस रसीद या कैफ़े बिल की इमेज डाउनलोड करें — छापने या WhatsApp पर भेजने के लिए तैयार।",
    category: "utility",
    component: "ReceiptTool",
    initFunction: "initReceipt",
    sectionId: "receipt",
  },
  {
    slug: "marks-percentage-calculator",
    nameEn: "Marks & Percentage Calculator",
    nameHi: "अंक और प्रतिशत कैलकुलेटर",
    titleEn: "Percentage Calculator from Marks — Total, Division, Grade & CGPA to Percentage",
    titleHi: "अंकों से प्रतिशत कैलकुलेटर — कुल, श्रेणी, ग्रेड और CGPA से प्रतिशत",
    descriptionEn: "Percentage calculator from marks: enter subject marks and get the total, percentage, division and grade — plus a CGPA to percentage converter (CBSE × 9.5).",
    descriptionHi: "अंकों से प्रतिशत कैलकुलेटर: विषयों के अंक डालें और कुल, प्रतिशत, श्रेणी और ग्रेड पाएँ — साथ में CGPA से प्रतिशत कन्वर्टर (CBSE × 9.5)।",
    category: "calculator",
    component: "MarksTool",
    initFunction: "initMarks",
    sectionId: "marks",
  },
  {
    slug: "document-auto-crop",
    nameEn: "Document Auto Crop",
    nameHi: "दस्तावेज़ ऑटो क्रॉप",
    titleEn: "Document Auto Crop Online Free — Straighten a Photo of Aadhaar, Certificate, Any Document",
    titleHi: "दस्तावेज़ ऑटो क्रॉप ऑनलाइन मुफ़्त — आधार, प्रमाणपत्र, किसी भी दस्तावेज़ की फ़ोटो सीधी करें",
    descriptionEn: "Document auto crop: upload a photo of any document and its four corners are found automatically — drag to adjust, the page is straightened flat, and you download a clean JPG or PDF. Aadhaar, certificates, marksheets and forms.",
    descriptionHi: "दस्तावेज़ ऑटो क्रॉप: किसी भी दस्तावेज़ की फ़ोटो डालें, उसके चारों कोने अपने-आप मिल जाते हैं — खींचकर ठीक करें, पेज सीधा-समतल होता है, और साफ़ JPG या PDF डाउनलोड करें। आधार, प्रमाणपत्र, मार्कशीट और फ़ॉर्म।",
    category: "photo",
    component: "DocCropTool",
    initFunction: "initDocCrop",
    sectionId: "doc-crop",
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