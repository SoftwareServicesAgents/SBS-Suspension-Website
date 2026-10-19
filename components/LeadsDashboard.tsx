"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { Button } from "@/components/ui";
import { leadsPagina } from "@/content/site";
import { LABELS, scoreLead, type Lead, type LeadInput, type LeadScore } from "@/lib/lead";
import {
  clearLeads,
  getLeadsServerSnapshot,
  getLeadsSnapshot,
  replaceLeads,
  sortLeads,
  subscribeToLeads,
} from "@/lib/lead-store";

const t = leadsPagina;

const SCORE_STYLE: Record<LeadScore, string> = {
  hot: "border-hot/50 bg-hot/15 text-hot",
  warm: "border-warm/50 bg-warm/15 text-warm",
  cold: "border-cold/50 bg-cold/15 text-cold",
};

// ---------------------------------------------------------------------
// Sample data. Clearly fake: obvious names, example.nl addresses. Loaded
// only when the demo button is pressed.
// ---------------------------------------------------------------------
const SAMPLE_SEED: (Omit<LeadInput, "consent" | "website"> & { minutesAgo: number })[] = [
  {
    minutesAgo: 35,
    naam: "Voorbeeld Rijder 1",
    email: "rijder1@example.nl",
    telefoon: "06 12 34 56 78",
    motor: {
      categorie: "mx", merk: "KTM", model: "450 SX-F", bouwjaar: "2027", handmatig: false,
      vork: "WP XACT-USD AER 48 mm", demper: "WP XACT monoshock met linkage", geverifieerd: true,
    },
    gewichtKg: 88, niveau: "nationaal", uren: "gt100", doel: "revisie", wanneer: "asap",
  },
  {
    minutesAgo: 190,
    naam: "Voorbeeld Rijder 2",
    email: "rijder2@example.nl",
    telefoon: "",
    motor: {
      categorie: "road", merk: "Yamaha", model: "MT-07", bouwjaar: "2019", handmatig: false,
      vork: "KYB Telescopische vork 41 mm", demper: "KYB Monoshock met linkage", geverifieerd: false,
    },
    gewichtKg: 95, niveau: "recreatief", uren: "20-50", doel: "afstellen", wanneer: "seizoen",
  },
  {
    minutesAgo: 1510,
    naam: "Voorbeeld Rijder 3",
    email: "rijder3@example.nl",
    telefoon: "06 98 76 54 32",
    motor: {
      categorie: "mx", merk: "Husqvarna", model: "FC 350", bouwjaar: "2025", handmatig: false,
      vork: "WP XACT-USD AER 48 mm", demper: "WP XACT monoshock met linkage", geverifieerd: false,
    },
    gewichtKg: 74, niveau: "clubwedstrijd", uren: "50-100", doel: "probleem", wanneer: "winter",
  },
  {
    minutesAgo: 4300,
    naam: "Voorbeeld Rijder 4",
    email: "rijder4@example.nl",
    telefoon: "",
    motor: {
      categorie: "supermoto", merk: "Zelf ingevuld", model: "CCM 644 Supermoto", bouwjaar: "2004",
      handmatig: true, vork: "", demper: "", geverifieerd: false,
    },
    gewichtKg: 102, niveau: "recreatief", uren: "onbekend", doel: "coating", wanneer: "onbekend",
  },
];

function buildSample(): Lead[] {
  const now = Date.now();
  return SAMPLE_SEED.map((seed, i) => {
    const { minutesAgo, ...rest } = seed;
    const input: LeadInput = { ...rest, consent: true, website: "" };
    const { score, punten } = scoreLead(input);
    return {
      ...input,
      id: `sample-${i}`,
      createdAt: new Date(now - minutesAgo * 60_000).toISOString(),
      score,
      scorePunten: punten,
    };
  });
}

// ---------------------------------------------------------------------

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toCsv(leads: Lead[]): string {
  const header = [
    "tijd", "naam", "email", "telefoon", "categorie", "merk", "model", "bouwjaar",
    "zelf_ingevuld", "vork", "demper", "specs_geverifieerd", "gewicht_kg", "niveau",
    "sinds_onderhoud", "doel", "wanneer", "score", "score_punten",
  ];

  const cell = (value: string | number | boolean) => {
    const s = String(value);
    return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const lines = leads.map((l) =>
    [
      formatTime(l.createdAt), l.naam, l.email, l.telefoon ?? "",
      LABELS.categorie[l.motor.categorie], l.motor.merk, l.motor.model, l.motor.bouwjaar,
      l.motor.handmatig ? "ja" : "nee", l.motor.vork ?? "", l.motor.demper ?? "",
      l.motor.geverifieerd ? "ja" : "nee", l.gewichtKg, LABELS.niveau[l.niveau],
      LABELS.uren[l.uren], LABELS.doel[l.doel], LABELS.wanneer[l.wanneer],
      l.score, l.scorePunten,
    ]
      .map(cell)
      .join(";"),
  );

  // Semicolon-separated with a BOM, so Excel in a Dutch locale opens it right.
  return "﻿" + [header.join(";"), ...lines].join("\r\n");
}

export function LeadsDashboard() {
  const leads = useSyncExternalStore(subscribeToLeads, getLeadsSnapshot, getLeadsServerSnapshot);
  // False during SSR and the first paint, so the empty state is not
  // rendered before localStorage has been read.
  const loaded = useSyncExternalStore(
    subscribeToLeads,
    () => true,
    () => false,
  );

  const sorted = useMemo(() => sortLeads(leads), [leads]);

  function loadSample() {
    replaceLeads(sortLeads([...buildSample(), ...leads]));
  }

  function wipe() {
    clearLeads();
  }

  function exportCsv() {
    const blob = new Blob([toCsv(sorted)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sbs-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const columns = t.kolommen;

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-xs border border-accent bg-accent/15 px-2.5 py-1 font-display text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          {t.badge}
        </span>
        <Link
          href="/"
          className="font-display text-sm tracking-wide text-muted uppercase hover:text-paper"
        >
          ← {t.terug}
        </Link>
      </div>

      <h1 className="mt-5 text-4xl sm:text-5xl">{t.titel}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-strong">{t.intro}</p>

      <div className="mt-7 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={exportCsv} disabled={sorted.length === 0}>
          {t.exporteer}
        </Button>
        <Button variant="secondary" onClick={loadSample}>
          {t.laadVoorbeeld}
        </Button>
        <Button variant="quiet" onClick={wipe} disabled={sorted.length === 0}>
          {t.wisAlles}
        </Button>
      </div>

      {loaded && sorted.length === 0 ? (
        <p className="rule mt-10 pt-10 text-sm text-muted">{t.leeg}</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-sm border border-line">
          <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-ink-raised">
                {[
                  columns.tijd, columns.naam, columns.contactgegevens, columns.motor,
                  columns.vering, columns.gewicht, columns.niveau, columns.uren,
                  columns.doel, columns.wanneer, columns.score,
                ].map((label) => (
                  <th key={label} scope="col" className="spec-label px-3 py-3 whitespace-nowrap">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((lead) => (
                <tr key={lead.id} className="border-b border-line-soft last:border-b-0">
                  <td className="tabular px-3 py-3 whitespace-nowrap text-muted">
                    {formatTime(lead.createdAt)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-paper">{lead.naam}</td>
                  <td className="px-3 py-3 text-muted-strong">
                    <a href={`mailto:${lead.email}`} className="hover:text-accent">
                      {lead.email}
                    </a>
                    {lead.telefoon && (
                      <>
                        <br />
                        <a
                          href={`tel:${lead.telefoon.replace(/\s/g, "")}`}
                          className="tabular hover:text-accent"
                        >
                          {lead.telefoon}
                        </a>
                      </>
                    )}
                  </td>
                  <td className="px-3 py-3 text-paper">
                    {[lead.motor.merk, lead.motor.model, lead.motor.bouwjaar].filter(Boolean).join(" ")}
                    {lead.motor.handmatig && (
                      <span className="ml-2 text-xs text-muted">(zelf ingevuld)</span>
                    )}
                  </td>
                  <td className="max-w-[260px] px-3 py-3 text-xs leading-relaxed text-muted-strong">
                    {lead.motor.vork || "—"}
                    <br />
                    {lead.motor.demper || "—"}
                  </td>
                  <td className="tabular px-3 py-3 whitespace-nowrap text-paper">
                    {lead.gewichtKg} kg
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-strong">
                    {LABELS.niveau[lead.niveau]}
                  </td>
                  <td className="px-3 py-3 text-muted-strong">{LABELS.uren[lead.uren]}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-strong">
                    {LABELS.doel[lead.doel]}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-strong">
                    {LABELS.wanneer[lead.wanneer]}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={`inline-block rounded-xs border px-2 py-0.5 font-display text-xs font-semibold tracking-widest uppercase ${SCORE_STYLE[lead.score]}`}
                      title={`${lead.scorePunten} punten`}
                    >
                      {t.scoreLabels[lead.score]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
