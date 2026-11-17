import Image from "next/image";
import Link from "next/link";

export function Logo({ size = 42, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/educafehub/logo.svg"
      alt="EduCafe Hub logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}

export function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label="EduCafe Hub, home">
      {/* Inline copy of public/educafehub/logo.svg so the Wi-Fi mark can pulse (see .wm-wifi-* in educafe.css). Footer/favicon keep using the file. */}
      <svg className="wm-logo" viewBox="0 0 64 64" role="img" aria-label="EduCafe Hub logo">
        <defs>
          <linearGradient id="wmLogoGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0e7a63" />
            <stop offset="1" stopColor="#074537" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="url(#wmLogoGrad)" />
        <rect x="1" y="1" width="62" height="62" rx="13" fill="none" stroke="#ffffff" strokeOpacity=".28" strokeWidth="2" />
        <path className="wm-wifi-arc2" d="M23.5 15 Q32 6.5 40.5 15" fill="none" stroke="#ffb37a" strokeWidth="3" strokeLinecap="round" />
        <path className="wm-wifi-arc1" d="M27.8 18.6 Q32 14.2 36.2 18.6" fill="none" stroke="#ffb37a" strokeWidth="3" strokeLinecap="round" />
        <circle className="wm-wifi-dot" cx="32" cy="22" r="2.5" fill="#ffb37a" />
        <path d="M32 46.5 C28.5 43.2 22 41.6 16 42.4 V26.4 C22 25.4 28.5 27 32 30.4 C35.5 27 42 25.4 48 26.4 V42.4 C42 41.6 35.5 43.2 32 46.5 Z" fill="#ffffff" />
        <path d="M32 30.4 V46.5" stroke="#0a5546" strokeWidth="2.4" />
        <path d="M20.5 31.5 C23.8 30.9 26.8 31.6 29.3 33.6 M20.5 36.8 C23.8 36.2 26.8 36.9 29.3 38.9 M43.5 31.5 C40.2 30.9 37.2 31.6 34.7 33.6 M43.5 36.8 C40.2 36.2 37.2 36.9 34.7 38.9" stroke="#0a5546" strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
      <span>
        Edu<span className="wm-cafe">Cafe</span> Hub
      </span>
      <span className="wm-dom">educafehub.com</span>
      <span className="wm-tag" data-i18n="wmTag">One stop for school & cyber cafe work</span>
    </Link>
  );
}

export function FootBrand() {
  return (
    <Link href="/" className="foot-brand" aria-label="EduCafe Hub, home">
      <Logo size={36} />
      <h3>EduCafe Hub</h3>
    </Link>
  );
}
