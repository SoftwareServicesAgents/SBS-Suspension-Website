"use client";

import { veringCheck } from "@/content/site";
import type { Bike } from "@/data/bikes";

const t = veringCheck.stapSpecs;

/** Dutch display name for the spring medium; nothing at all when unknown. */
function springLabel(springType?: Bike["fork"]["springType"]): string | null {
  if (springType === "lucht") return t.lucht;
  if (springType === "veer") return t.veer;
  return null;
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line-soft py-2.5 first:border-t-0">
      <dt className="spec-label shrink-0">{label}</dt>
      <dd className="tabular text-right text-sm text-paper">{value}</dd>
    </div>
  );
}

/** "VOORVORK / 48 MM / LUCHTVORK" — the spec-sheet strip above each column. */
function Strip({ parts }: { parts: (string | null)[] }) {
  const shown = parts.filter(Boolean) as string[];
  return (
    <p className="spec-label text-accent">
      {shown.map((part, i) => (
        <span key={part}>
          {i > 0 && <span className="px-1.5 text-muted">/</span>}
          {part}
        </span>
      ))}
    </p>
  );
}

export function SpecCard({ bike, title }: { bike: Bike; title: string }) {
  const spring = springLabel(bike.fork.springType);

  return (
    <div className="rounded-sm border border-line bg-ink-raised">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <p className="spec-label">{t.label}</p>
        <p className="tabular text-sm font-medium text-paper">{title}</p>
      </div>

      <div className="grid gap-px bg-line sm:grid-cols-2">
        <section className="bg-ink-raised p-4 sm:p-5">
          <Strip
            parts={[
              t.vorkLabel,
              bike.fork.diameterMm ? `${bike.fork.diameterMm} mm` : null,
              spring,
            ]}
          />
          <dl className="mt-3">
            <Row label={t.merkLabel} value={bike.fork.brand} />
            <Row label={t.typeLabel} value={bike.fork.type} />
            <Row label={t.diameterLabel} value={bike.fork.diameterMm ? `${bike.fork.diameterMm} mm` : null} />
            <Row label={t.veerLabel} value={spring} />
            <Row label={t.afstelLabel} value={bike.fork.adjustment} />
          </dl>
        </section>

        <section className="bg-ink-raised p-4 sm:p-5">
          <Strip parts={[t.demperLabel, bike.shock.brand]} />
          <dl className="mt-3">
            <Row label={t.merkLabel} value={bike.shock.brand} />
            <Row label={t.typeLabel} value={bike.shock.type} />
            <Row label={t.afstelLabel} value={bike.shock.adjustment} />
          </dl>
        </section>
      </div>

      {(bike.notes || !bike.verified) && (
        <div className="space-y-1.5 border-t border-line px-4 py-3 sm:px-5">
          {bike.notes && <p className="text-xs leading-relaxed text-muted-strong">{bike.notes}</p>}
          {!bike.verified && <p className="text-xs leading-relaxed text-muted">{t.onderVoorbehoud}</p>}
        </div>
      )}
    </div>
  );
}

/** Shown when the rider typed in a bike we have no data for. */
export function SpecCardManual({ title }: { title: string }) {
  return (
    <div className="rounded-sm border border-line bg-ink-raised">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <p className="spec-label">{t.label}</p>
        <p className="tabular text-sm font-medium text-paper">{title}</p>
      </div>
      <p className="px-4 py-5 text-sm leading-relaxed text-muted-strong sm:px-5">
        {t.handmatigGeenSpecs}
      </p>
    </div>
  );
}
