import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./educafe.css";

export const metadata: Metadata = {
  title: "EduCafe Hub: Free Tools for School and Cyber Cafe",
  description:
    "16 free tools that run in your browser: passport photo sheets, exact KB photo resize, signature cleaning, image to PDF, PDF compress, QR code maker, age and marks calculators, plus 31 official daily links. Files are never uploaded. English and Hindi.",
  icons: {
    icon: [{ url: "/educafehub/logo.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    title: "EduCafe Hub: Free Tools for School and Cyber Cafe",
    description:
      "Passport photos, exact KB resize, signatures, PDFs, QR codes and calculators. Free, in your browser, in English and Hindi. Plus 31 official daily links.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#FAFAF7",
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
          href="https://fonts.googleapis.com/css2?family=Hind:wght@400;500;600;700&family=Mukta:wght@600;700;800&display=swap"
        />
        {children}
      </body>
    </html>
  );
}
