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
      <Logo size={42} className="wm-logo" />
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
