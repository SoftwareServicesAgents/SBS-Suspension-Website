"use client";

import type { Lead } from "./lead";

// Demo persistence. No database, no accounts, works with the Wi-Fi off.
//
// Exposed as a proper external store (subscribe / getSnapshot) so React
// can read it with useSyncExternalStore instead of a mount effect. The
// snapshot is cached, which keeps the reference stable between renders,
// and a `storage` listener picks up leads submitted in another tab.
const KEY = "sbs.leads.v1";

const EMPTY: Lead[] = [];

let cache: Lead[] | null = null;
const listeners = new Set<() => void>();

function load(): Lead[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Lead[]) : EMPTY;
  } catch {
    // Corrupt or blocked storage must never break the page.
    return EMPTY;
  }
}

function write(leads: Lead[]): void {
  cache = leads;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(leads));
  } catch {
    /* private mode / quota — the UI still reflects the new state */
  }
  for (const listener of listeners) listener();
}

export function getLeadsSnapshot(): Lead[] {
  if (cache === null) cache = load();
  return cache;
}

export function getLeadsServerSnapshot(): Lead[] {
  return EMPTY;
}

export function subscribeToLeads(onChange: () => void): () => void {
  listeners.add(onChange);

  const onStorage = (e: StorageEvent) => {
    if (e.key !== null && e.key !== KEY) return;
    cache = null;
    onChange();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function saveLead(lead: Lead): void {
  if (typeof window === "undefined") return;
  write([lead, ...getLeadsSnapshot()]);
}

export function replaceLeads(leads: Lead[]): void {
  if (typeof window === "undefined") return;
  write(leads);
}

export function clearLeads(): void {
  if (typeof window === "undefined") return;
  cache = EMPTY;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  for (const listener of listeners) listener();
}

/** Hot first, then newest. Matches the dashboard's default sort. */
const RANK: Record<Lead["score"], number> = { hot: 0, warm: 1, cold: 2 };

export function sortLeads(leads: Lead[]): Lead[] {
  return [...leads].sort(
    (a, b) => RANK[a.score] - RANK[b.score] || b.createdAt.localeCompare(a.createdAt),
  );
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `lead-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}
