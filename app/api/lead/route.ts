import { NextResponse } from "next/server";
import { bedrijf, contact, veringCheck } from "@/content/site";
import { LABELS, leadSchema, scoreLead, type LeadInput } from "@/lib/lead";

export const runtime = "nodejs";
// Never statically evaluated: the response depends on the request body.
export const dynamic = "force-dynamic";

/**
 * Lead intake.
 *
 * Demo mode is the default and needs no configuration: the browser has
 * already stored the lead in localStorage, so this route simply confirms
 * `mode: "demo"` and makes no outbound request whatsoever.
 *
 * Email mode activates only when BOTH RESEND_API_KEY and LEAD_TO_EMAIL
 * are set. Any failure there still returns 200 with `mode: "demo"`, so a
 * misconfigured key can never break the flow for a rider.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const lead = parsed.data;

  // Honeypot: a filled "website" field means a bot. Answer 200 so the bot
  // learns nothing, but do not send anything.
  if (lead.website && lead.website.length > 0) {
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const { score, punten } = scoreLead(lead);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL ?? "SBS Suspension <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return NextResponse.json({ ok: true, mode: "demo", score });
  }

  // The owner notification is the one that must not be lost; the rider
  // already has an on-screen confirmation either way. So they are sent
  // independently and the owner mail decides the reported mode.
  const [owner, rider] = await Promise.allSettled([
    sendEmail(apiKey, {
      from,
      to: [to],
      reply_to: lead.email,
      subject: `[${score.toUpperCase()}] Vering-check · ${lead.naam} · ${bikeLine(lead)}`,
      html: ownerEmail(lead, score, punten),
    }),
    sendEmail(apiKey, {
      from,
      to: [lead.email],
      reply_to: contact.email,
      subject: `Je vering-advies van ${bedrijf.naam}`,
      html: riderEmail(lead),
    }),
  ]);

  if (owner.status === "rejected") {
    console.error("[lead] owner notification failed:", owner.reason);
  }
  if (rider.status === "rejected") {
    console.error("[lead] rider confirmation failed:", rider.reason);
  }

  return NextResponse.json({
    ok: true,
    mode: owner.status === "fulfilled" ? "email" : "demo",
    score,
    sent: { owner: owner.status === "fulfilled", rider: rider.status === "fulfilled" },
  });
}

type ResendPayload = {
  from: string;
  to: string[];
  reply_to?: string;
  subject: string;
  html: string;
};

// Overridable only so the send path can be exercised against a local mock
// without a real account. Leave it unset in production.
const RESEND_URL = process.env.RESEND_API_URL ?? "https://api.resend.com/emails";

async function sendEmail(apiKey: string, payload: ResendPayload) {
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`resend_${res.status} ${detail.slice(0, 300)}`);
  }
}

// ---------------------------------------------------------------------
// Email bodies
// ---------------------------------------------------------------------

const INK = "#0B0B0C";
const ACCENT = "#201060";
const PAPER = "#F4F4F2";

function bikeLine(lead: LeadInput): string {
  return [lead.motor.merk, lead.motor.model, lead.motor.bouwjaar].filter(Boolean).join(" ");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rows(pairs: [string, string][]): string {
  return pairs
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #e4e4e0;color:#5a5a62;font-size:12px;letter-spacing:.08em;text-transform:uppercase;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e4e4e0;color:${INK};font-size:14px;text-align:right;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");
}

function shell(title: string, intro: string, table: string, footerHtml: string): string {
  return `<!doctype html><html lang="nl"><body style="margin:0;background:${PAPER};font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e4e4e0;">
        <tr><td style="background:${INK};padding:20px 24px;">
          <div style="color:#8470FF;font-size:11px;letter-spacing:.2em;text-transform:uppercase;">${escapeHtml(bedrijf.naam)}</div>
          <div style="color:${PAPER};font-size:22px;font-weight:bold;margin-top:6px;">${escapeHtml(title)}</div>
        </td></tr>
        <tr><td style="padding:24px;">
          <p style="margin:0 0 18px;color:#3a3a42;font-size:15px;line-height:1.6;">${intro}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${table}</table>
          ${footerHtml}
        </td></tr>
        <tr><td style="background:${ACCENT};padding:16px 24px;color:${PAPER};font-size:12px;line-height:1.6;">
          ${escapeHtml(contact.straat)} · ${escapeHtml(contact.postcode)} ${escapeHtml(contact.plaats)}<br>
          ${escapeHtml(contact.telefoon)} · ${escapeHtml(contact.email)}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function ownerEmail(lead: LeadInput, score: string, punten: number): string {
  const table = rows([
    ["Score", `${score.toUpperCase()} (${punten} punten)`],
    ["Naam", lead.naam],
    ["E-mail", lead.email],
    ["Telefoon", lead.telefoon || "— niet opgegeven —"],
    ["Categorie", LABELS.categorie[lead.motor.categorie]],
    ["Motor", bikeLine(lead)],
    ["Zelf ingevuld", lead.motor.handmatig ? "Ja" : "Nee"],
    ["Voorvork", lead.motor.vork],
    ["Schokdemper", lead.motor.demper],
    ["Specs geverifieerd", lead.motor.geverifieerd ? "Ja" : "Nee"],
    ["Rijgewicht", `${lead.gewichtKg} kg`],
    ["Niveau", LABELS.niveau[lead.niveau]],
    ["Sinds onderhoud", LABELS.uren[lead.uren]],
    ["Doel", LABELS.doel[lead.doel]],
    ["Wanneer", LABELS.wanneer[lead.wanneer]],
  ]);

  return shell(
    "Nieuwe aanvraag via de Vering-check",
    `Er is een nieuwe aanvraag binnengekomen. Antwoorden op deze mail gaat rechtstreeks naar ${escapeHtml(lead.naam)}.`,
    table,
    "",
  );
}

function riderEmail(lead: LeadInput): string {
  const table = rows([
    ["Motor", bikeLine(lead)],
    ["Voorvork", lead.motor.vork],
    ["Schokdemper", lead.motor.demper],
    ["Rijgewicht", `${lead.gewichtKg} kg`],
    ["Niveau", LABELS.niveau[lead.niveau]],
    ["Sinds onderhoud", LABELS.uren[lead.uren]],
    ["Doel", LABELS.doel[lead.doel]],
    ["Wanneer", LABELS.wanneer[lead.wanneer]],
  ]);

  const promise = veringCheck.stapContact.belofte
    .map((item) => `<li style="margin-bottom:6px;">${escapeHtml(item)}</li>`)
    .join("");

  const footerHtml = `
    <p style="margin:22px 0 8px;color:#3a3a42;font-size:15px;line-height:1.6;">Je krijgt van Davy:</p>
    <ul style="margin:0 0 20px 18px;padding:0;color:#3a3a42;font-size:14px;line-height:1.6;">${promise}</ul>
    <p style="margin:0;color:#3a3a42;font-size:15px;line-height:1.6;">
      ${escapeHtml(veringCheck.stapKlaar.reactieZin.replace("{reactietijd}", veringCheck.stapKlaar.reactietijd))}
      Liever even bellen? Dat kan op
      <a href="tel:${escapeHtml(contact.telefoonLink)}" style="color:${ACCENT};">${escapeHtml(contact.telefoon)}</a>.
    </p>`;

  return shell(
    `Bedankt, ${escapeHtml(lead.naam.split(" ")[0])}`,
    "We hebben je aanvraag voor een persoonlijk vering-advies ontvangen. Dit heb je doorgegeven:",
    table,
    footerHtml,
  );
}
