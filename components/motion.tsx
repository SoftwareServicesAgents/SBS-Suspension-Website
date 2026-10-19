"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll reveal, once. Deliberately short: content is visible within
 * ~350ms of entering the viewport, and instantly under reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  if (reduce) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}

/** Hero headline: words rise in sequence. Fully readable inside ~400ms. */
export function HeadlineReveal({
  text,
  className,
  accentClassName = "text-accent",
}: {
  text: string;
  className?: string;
  accentClassName?: string;
}) {
  const reduce = useReducedMotion();

  // Words wrapped in |pipes| take the accent colour.
  const words = text.split(" ").map((word) => {
    const accent = word.startsWith("|") || word.endsWith("|");
    return { word: word.replace(/\|/g, ""), accent };
  });

  // Timings are deliberately tight: the last word has fully arrived by
  // ~400ms, so no content is held back behind the animation.
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.018 } },
  };
  const item: Variants = {
    // Travels further than the clip box is tall, so each word starts
    // completely hidden below its own mask.
    hidden: { opacity: 0, y: "1.3em" },
    show: { opacity: 1, y: 0, transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] } },
  };

  if (reduce) {
    return (
      <h1 className={className}>
        {words.map((w, i) => (
          <span key={i} className={w.accent ? accentClassName : undefined}>
            {w.word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </h1>
    );
  }

  return (
    <motion.h1 className={className} variants={container} initial="hidden" animate="show">
      {words.map((w, i) => (
        // The clipping wrapper gives the words a mechanical "rise" edge.
        // The padding/negative-margin pair extends the mask below the
        // baseline so descenders (g, j, y) are not sheared off.
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.26em] align-bottom -mb-[0.26em]"
        >
          <motion.span
            variants={item}
            className={`inline-block ${w.accent ? accentClassName : ""}`}
          >
            {w.word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}

/**
 * Fork-travel rule: a thin line with a marker that settles like a fork
 * returning from compression. Decoration only.
 */
export function TravelRule({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div className={`relative h-px w-full bg-line ${className}`} aria-hidden="true">
      <motion.span
        className="absolute -top-[3px] block h-[7px] w-[7px] bg-accent"
        initial={reduce ? { left: "100%" } : { left: "0%" }}
        animate={{ left: "100%" }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }
        }
      />
    </div>
  );
}
