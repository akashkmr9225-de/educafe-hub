"use client";

import { useEffect, useRef, useState } from "react";
import I18N from "@/data/i18n.json";

// Tagline reveal (landing-page-design skill, section B11; Sir's brief,
// 2026-11-16): one large benefit statement whose words light up one by one,
// in reading order, as the section scrolls into view. Before JS arms it, and
// for reduced-motion visitors, the text shows at full colour.
const DICT = I18N as unknown as Record<string, Record<string, string>>;
const EN_WORDS = (DICT.en.taglineText ?? "").split(" ");
const HI_WORDS = (DICT.hi.taglineText ?? "").split(" ");

function Words({ words }: { words: string[] }) {
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="w" style={{ transitionDelay: `${i * 65}ms` }}>
          {w}{" "}
        </span>
      ))}
    </>
  );
}

export function TaglineReveal() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [armed, setArmed] = useState(false);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(true);
      return;
    }
    setArmed(true);
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          setLit(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="tagsec" aria-label="About EduCafe Hub">
      <p ref={ref} className={"tagline" + (armed ? " armed" : "") + (lit ? " in" : "")}>
        <span className="en-only">
          <Words words={EN_WORDS} />
        </span>
        <span className="hi-only">
          <Words words={HI_WORDS} />
        </span>
      </p>
    </section>
  );
}
