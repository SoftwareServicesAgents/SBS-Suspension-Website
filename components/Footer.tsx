import Image from "next/image";
import Link from "next/link";
import { bedrijf, contact, footer, openingstijden } from "@/content/site";

export function Footer() {
  const jaar = new Date().getFullYear();

  return (
    <footer className="rule bg-ink-sunken">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/logo-sbs.png"
              alt={bedrijf.naam}
              width={252}
              height={88}
              className="h-9 w-auto"
            />
            <p className="mt-4 text-sm leading-relaxed text-muted">{bedrijf.tagline}</p>
          </div>

          <div>
            <p className="spec-label">Adres</p>
            <address className="mt-3 text-sm leading-relaxed text-muted-strong not-italic">
              {contact.straat}
              <br />
              {contact.postcode} {contact.plaats} ({contact.provincie})
            </address>
            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-accent underline underline-offset-4 hover:text-paper"
            >
              {contact.mapsLabel}
            </a>
          </div>

          <div>
            <p className="spec-label">Contact</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={`tel:${contact.telefoonLink}`}
                  className="tabular text-muted-strong transition-colors hover:text-accent"
                >
                  {contact.telefoon}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-muted-strong transition-colors hover:text-accent"
                >
                  {contact.email}
                </a>
              </li>
            </ul>

            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {footer.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted transition-colors hover:text-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="spec-label">{openingstijden.titel}</p>
            <dl className="mt-3 space-y-1 text-sm">
              {openingstijden.dagen.map((d) => (
                <div key={d.dag} className="flex justify-between gap-3">
                  <dt className="text-muted">{d.dag}</dt>
                  <dd className="tabular max-w-[60%] text-right text-muted-strong">{d.tijd}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="rule mt-12 flex flex-col gap-3 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright.replace("{jaar}", String(jaar))}</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            <li className="tabular">{footer.kvk}</li>
            <li className="tabular">{footer.btw}</li>
            {footer.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
