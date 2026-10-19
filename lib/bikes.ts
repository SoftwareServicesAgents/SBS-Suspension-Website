import { bikes, type Bike } from "@/data/bikes";

/** The three choices a visitor sees in step 1 of the Vering-check. */
export type UiCategory = "mx" | "supermoto" | "road";

/**
 * "MX / Enduro" is one choice for the rider but two categories in the data,
 * because enduro bikes genuinely have different suspension (PDS vs linkage).
 */
const CATEGORY_MAP: Record<UiCategory, Bike["category"][]> = {
  mx: ["mx", "enduro"],
  supermoto: ["supermoto"],
  road: ["road"],
};

/** Natural sort, so "250 SX" comes before "450 SX-F" and "YZ125" before "YZ450F". */
const byName = (a: string, b: string) => a.localeCompare(b, "nl", { numeric: true, sensitivity: "base" });

function pool(category: UiCategory): Bike[] {
  const allowed = CATEGORY_MAP[category];
  return bikes.filter((b) => allowed.includes(b.category));
}

export function getMakes(category: UiCategory): string[] {
  return [...new Set(pool(category).map((b) => b.make))].sort(byName);
}

export function getModels(category: UiCategory, make: string): string[] {
  return [...new Set(pool(category).filter((b) => b.make === make).map((b) => b.model))].sort(byName);
}

/** Union of every year range for this model, newest first. */
export function getYears(category: UiCategory, make: string, model: string): number[] {
  const years = new Set<number>();
  for (const b of pool(category)) {
    if (b.make !== make || b.model !== model) continue;
    for (let y = b.yearFrom; y <= b.yearTo; y++) years.add(y);
  }
  return [...years].sort((a, b) => b - a);
}

/**
 * Find the entry covering this year. Verified entries win, so a model that
 * exists in both tiers never shows the disclaimer for a year we checked.
 */
export function findBike(
  category: UiCategory,
  make: string,
  model: string,
  year: number,
): Bike | undefined {
  const matches = pool(category).filter(
    (b) => b.make === make && b.model === model && year >= b.yearFrom && year <= b.yearTo,
  );
  return matches.find((b) => b.verified) ?? matches[0];
}

/** Human-readable one-liner used in the lead summary, the dashboard and e-mails. */
export function describeFork(bike: Bike): string {
  const parts = [bike.fork.brand, bike.fork.type];
  if (bike.fork.diameterMm) parts.push(`${bike.fork.diameterMm} mm`);
  return parts.filter(Boolean).join(" ");
}

export function describeShock(bike: Bike): string {
  return [bike.shock.brand, bike.shock.type].filter(Boolean).join(" ");
}
