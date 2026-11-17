"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Scroll reveal (Sir, 2026-11-16; two-way since 2026-11-18): content stays
// hidden until it scrolls into view, rises smoothly into place, and
// reverses out when it leaves — replaying on every pass, like the section
// reveal in app-shell. IntersectionObserver, per the landing-page-design
// skill's motion rules (32px rise, base curve).
// No-JS and reduced-motion visitors always see the content.
export function ScrollReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    setArmed(true);
    const io = new IntersectionObserver(
      (es) => {
        setShown(es[0].isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={armed ? (shown ? "rv in" : "rv") : undefined}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
