"use client";

import Image from "next/image";
import { HeadlineReveal, TravelRule } from "@/components/motion";
import { Button, ButtonLink, CompressCta } from "@/components/ui";
import { banner, contact, hero } from "@/content/site";

function scrollToTool() {
  const el = document.getElementById("vering-check");
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

/** Slim seasonal bar above the hero, switched from content/site.ts. */
export function SeasonalBanner() {
  if (!banner.enabled) return null;

  return (
    <div className="border-b border-accent/30 bg-accent-deep">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-sm sm:px-6">
        <span className="font-display font-semibold tracking-[0.12em] text-accent uppercase">
          {banner.title}
        </span>
        <span className="text-paper/85">{banner.text}</span>
        <button
          type="button"
          onClick={scrollToTool}
          className="ml-auto shrink-0 font-display font-semibold tracking-wide text-paper uppercase underline underline-offset-4 transition-colors hover:text-accent"
        >
          {banner.ctaLabel} →
        </button>
      </div>
    </div>
  );
}

export function Hero() {
  const waUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappBericht)}`;

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="grid-motif pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pt-12 pb-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:pt-20 lg:pb-24">
        <div>
          <p className="spec-label text-accent">{hero.label}</p>
          <TravelRule className="mt-3 mb-6" />

          <HeadlineReveal
            text={hero.titel}
            className="text-[2.6rem] leading-[0.98] sm:text-6xl lg:text-7xl"
          />

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-strong sm:text-lg">
            {hero.intro}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <CompressCta onClick={scrollToTool}>{hero.ctaPrimair}</CompressCta>
            <ButtonLink href={`tel:${contact.telefoonLink}`} variant="secondary">
              {hero.ctaSecundair}
            </ButtonLink>
            {contact.whatsappAan && (
              <Button
                variant="quiet"
                onClick={() => window.open(waUrl, "_blank", "noopener,noreferrer")}
              >
                {hero.ctaWhatsapp}
              </Button>
            )}
          </div>

          {/* Figures align along one baseline even when the labels above
              them wrap to different line counts. */}
          <dl className="rule mt-10 grid grid-cols-3 items-stretch gap-4 pt-6">
            {hero.feiten.map((f) => (
              <div key={f.label} className="flex flex-col">
                <dt className="spec-label">{f.label}</dt>
                <dd className="tabular mt-auto pt-1 font-display text-2xl font-semibold text-paper sm:text-3xl">
                  {f.waarde}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line">
            <Image
              src={hero.foto}
              alt={hero.fotoAlt}
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
          </div>
          {/* Spec-sheet caption, in the technical register of the design. */}
          <p className="spec-label mt-3 text-right">
            {hero.fotoBijschrift.map((part, i) => (
              <span key={part}>
                {i > 0 && <span className="px-1.5 text-accent">/</span>}
                {part}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
