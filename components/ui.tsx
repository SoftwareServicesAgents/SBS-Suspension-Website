"use client";

import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

// Horizontal padding lives in the variants: the quiet variant reads as a
// text action, so it must sit flush with the block above it rather than
// appearing indented when it wraps onto its own line.
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xs py-3.5 font-display text-base font-semibold tracking-wide uppercase transition-colors select-none";

const VARIANTS = {
  primary: "px-5 bg-accent text-accent-ink hover:bg-paper",
  secondary: "px-5 border border-line text-paper hover:border-accent hover:text-accent",
  quiet: "px-1 text-muted-strong underline decoration-line underline-offset-4 hover:text-paper hover:decoration-accent",
} as const;

type Variant = keyof typeof VARIANTS;

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: { children: ReactNode; variant?: Variant } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  className = "",
  external,
  ...props
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  className?: string;
  external?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;
  if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}

/**
 * Signature motion: the primary call to action behaves like a suspension
 * unit. Pressing it compresses the button towards its base; releasing it
 * rebounds past the resting point and settles — a damped spring, same as
 * a fork returning from a hit. A travel line under the label tracks it.
 *
 * Under prefers-reduced-motion the whole thing degrades to a plain button.
 */
export function CompressCta({
  children,
  onClick,
  href,
  className = "",
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const reduce = useReducedMotion();
  const body = useAnimationControls();
  const travel = useAnimationControls();

  const compress = () => {
    if (reduce || disabled) return;
    body.start({ scaleY: 0.87, transition: { duration: 0.09, ease: "easeOut" } });
    travel.start({ scaleX: 0.25, transition: { duration: 0.09, ease: "easeOut" } });
  };

  const rebound = () => {
    if (reduce || disabled) return;
    // Low damping so it overshoots once before settling.
    body.start({ scaleY: 1, transition: { type: "spring", stiffness: 620, damping: 9, mass: 0.5 } });
    travel.start({ scaleX: 1, transition: { type: "spring", stiffness: 420, damping: 14, mass: 0.6 } });
  };

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <motion.span
        aria-hidden="true"
        animate={travel}
        initial={{ scaleX: 1 }}
        style={{ originX: 0 }}
        className="pointer-events-none absolute right-5 bottom-1.5 left-5 z-10 h-px bg-current opacity-35"
      />
    </>
  );

  const classes = `${BASE} relative origin-bottom overflow-hidden px-5 bg-accent text-accent-ink hover:bg-paper disabled:cursor-not-allowed disabled:bg-line disabled:text-muted ${className}`;

  const handlers = {
    onPointerDown: compress,
    onPointerUp: rebound,
    onPointerLeave: rebound,
    onPointerCancel: rebound,
  };

  if (href) {
    return (
      <motion.a href={href} animate={body} className={classes} onClick={onClick} {...handlers}>
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      animate={body}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...handlers}
    >
      {inner}
    </motion.button>
  );
}

/** Section heading block: spec label, rule, title. Used across the page. */
export function SectionHeading({
  label,
  title,
  intro,
  id,
}: {
  label: string;
  title: string;
  intro?: string;
  id?: string;
}) {
  return (
    <header className="max-w-3xl">
      <p className="spec-label text-accent">{label}</p>
      <div className="mt-3 mb-5 h-px w-full bg-line" />
      <h2 id={id} className="text-4xl sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {intro && <p className="mt-5 text-base leading-relaxed text-muted-strong sm:text-lg">{intro}</p>}
    </header>
  );
}
