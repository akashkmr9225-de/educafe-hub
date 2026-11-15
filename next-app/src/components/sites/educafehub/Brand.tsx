import Image from "next/image";

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
    <div className="wordmark">
      <Logo size={42} className="wm-logo" />
      <span>
        Edu<span className="wm-cafe">Cafe</span> Hub
      </span>
      <span className="wm-dom">educafehub.com</span>
      <span className="wm-tag" data-i18n="wmTag">One stop for school & cyber cafe work</span>
    </div>
  );
}

export function FootBrand() {
  return (
    <div className="foot-brand">
      <Logo size={36} />
      <h3>EduCafe Hub</h3>
    </div>
  );
}
