"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Scroll-reveal wrapper (Kanak's design, on trial from 2026-11-16 at Sir's
// instruction): blocks fade up into view once, as the visitor scrolls to them.
// Visitors who prefer reduced motion get the content with no animation.
export function ScrollReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
