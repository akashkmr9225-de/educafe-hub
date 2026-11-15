import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./educafe.css";

export const metadata: Metadata = {
  title: "EduCafe Hub — School & Cyber Cafe",
  description:
    "Free in-browser tools for schools and cyber cafes — passport photo sheets, exact-KB photo & signature resize, image to PDF, PDF compress, QR code maker, age & marks calculators, plus 31 official daily links. Optional sign in stays on your device; files are never uploaded. English / हिंदी.",
  icons: {
    icon: [{ url: "/educafehub/logo.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    title: "EduCafe Hub — School & Cyber Cafe",
    description:
      "Passport photos, exact-KB resize, signatures, PDFs, QR codes and calculators — free, in your browser, in English and Hindi. Plus 31 official daily links.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a4a3e" },
    { media: "(prefers-color-scheme: dark)", color: "#0a352b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Public+Sans:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600&display=swap"
        />
        {children}
      </body>
    </html>
  );
}
