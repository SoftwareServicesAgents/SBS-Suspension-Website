import { z } from "zod";

// ---------------------------------------------------------------------
// Lead shape — shared by the form, the API route and the /leads demo
// dashboard, so all three always agree on the field names.
// ---------------------------------------------------------------------

export const leadSchema = z.object({
  naam: z.string().trim().min(2, "Vul je naam in.").max(80),
  email: z.email("Vul een geldig e-mailadres in.").max(120),
  // Optional, but encouraged. Loose on format: NL riders type it many ways.
  telefoon: z
    .string()
    .trim()
    .max(30)
    .refine((v) => v === "" || /^[\d+\s().-]{8,}$/.test(v), "Dit telefoonnummer lijkt niet te kloppen.")
    .optional()
    .default(""),
  consent: z.literal(true, "Zet even een vinkje, dan mag Davy je benaderen."),

  motor: z.object({
    categorie: z.enum(["mx", "supermoto", "road"]),
    merk: z.string().trim().min(1).max(60),
    model: z.string().trim().min(1).max(80),
    bouwjaar: z.string().trim().min(1).max(20),
    handmatig: z.boolean(),
    vork: z.string().max(160).optional().default(""),
    demper: z.string().max(160).optional().default(""),
    geverifieerd: z.boolean().optional().default(false),
  }),

  gewichtKg: z.number().int().min(30).max(200),
  niveau: z.enum(["recreatief", "clubwedstrijd", "nationaal"]),
  uren: z.enum(["lt20", "20-50", "50-100", "gt100", "onbekend"]),
  doel: z.enum(["revisie", "afstellen", "prestaties", "probleem", "coating"]),
  wanneer: z.enum(["asap", "winter", "seizoen", "onbekend"]),

  // Honeypot: real people never see this field, bots fill everything.
  // Deliberately permissive so a filled value passes validation and is
  // dropped silently by the API route instead of bouncing with a 400 —
  // a bot that gets a validation error learns which field gave it away.
  website: z.string().max(200).optional().default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type LeadScore = "hot" | "warm" | "cold";

export type Lead = LeadInput & {
  id: string;
  createdAt: string;
  score: LeadScore;
  scorePunten: number;
};

// ---------------------------------------------------------------------
// Lead scoring — internal only, never shown to the visitor.
// Points are additive; the thresholds are at the bottom.
// Documented in README.md under "Lead scoring".
// ---------------------------------------------------------------------

const URGENCY_POINTS: Record<LeadInput["wanneer"], number> = {
  asap: 2,
  winter: 1,
  seizoen: 0,
  onbekend: 0,
};

const SERVICE_GAP_POINTS: Record<LeadInput["uren"], number> = {
  gt100: 2,
  "50-100": 1,
  "20-50": 0,
  lt20: 0,
  onbekend: 0,
};

const LEVEL_POINTS: Record<LeadInput["niveau"], number> = {
  nationaal: 2,
  clubwedstrijd: 1,
  recreatief: 0,
};

/** Jobs that mean actual work on the bench, rather than browsing. */
const INTENT_JOBS: LeadInput["doel"][] = ["revisie", "probleem"];

export function scoreLead(lead: LeadInput): { score: LeadScore; punten: number } {
  let punten = 0;

  if (lead.telefoon && lead.telefoon.trim().length >= 8) punten += 2;
  punten += SERVICE_GAP_POINTS[lead.uren];
  if (INTENT_JOBS.includes(lead.doel)) punten += 2;
  punten += URGENCY_POINTS[lead.wanneer];
  punten += LEVEL_POINTS[lead.niveau];

  const score: LeadScore = punten >= 6 ? "hot" : punten >= 3 ? "warm" : "cold";
  return { score, punten };
}

// ---------------------------------------------------------------------
// Readable Dutch labels for the stored option ids. Used in the summary,
// the dashboard, the CSV export and the e-mails.
// ---------------------------------------------------------------------

export const LABELS = {
  categorie: { mx: "MX / Enduro", supermoto: "Supermoto", road: "Wegmotor" },
  niveau: { recreatief: "Recreatief", clubwedstrijd: "Clubwedstrijd", nationaal: "Nationaal" },
  uren: {
    lt20: "< 20 uur / 5.000 km",
    "20-50": "20 – 50 uur / 5.000 – 15.000 km",
    "50-100": "50 – 100 uur / 15.000 – 30.000 km",
    gt100: "> 100 uur / 30.000 km",
    onbekend: "Geen idee",
  },
  doel: {
    revisie: "Revisie / onderhoud",
    afstellen: "Afstellen op gewicht",
    prestaties: "Betere prestaties",
    probleem: "Probleem oplossen",
    coating: "Coating",
  },
  wanneer: {
    asap: "Zo snel mogelijk",
    winter: "Deze winter",
    seizoen: "Voor het nieuwe seizoen",
    onbekend: "Weet ik nog niet",
  },
} as const;

export function describeBike(lead: Pick<Lead, "motor">): string {
  const { merk, model, bouwjaar } = lead.motor;
  return [merk, model, bouwjaar].filter(Boolean).join(" ");
}
