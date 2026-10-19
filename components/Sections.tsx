import Image from "next/image";
import { Reveal } from "@/components/motion";
import { ButtonLink, SectionHeading } from "@/components/ui";
import {
  contact,
  contactSectie,
  diensten,
  openingstijden,
  overDavy,
  werkplaats,
  werkwijze,
} from "@/content/site";

const SECTION = "mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24";

// ---------------------------------------------------------------------
// Diensten
// ---------------------------------------------------------------------
export function Diensten() {
  return (
    <section id="diensten" className="rule scroll-mt-20">
      <div className={SECTION}>
        <Reveal>
          <SectionHeading label={diensten.label} title={diensten.titel} intro={diensten.intro} />
        </Reveal>

        <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2">
          {diensten.items.map((item, i) => (
            <Reveal as="li" key={item.titel} delay={i * 0.05} className="bg-ink">
              <article className="flex h-full flex-col">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={item.foto}
                    alt={item.fotoAlt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-7">
                  <h3 className="font-display text-2xl font-semibold tracking-wide text-paper sm:text-3xl">
                    {item.titel}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-strong">{item.tekst}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <p className="spec-label mt-12 text-accent">{diensten.disciplinesLabel}</p>
          <div className="mt-4 h-px w-full bg-line" />
        </Reveal>

        <ul className="mt-8 grid gap-6 sm:grid-cols-3">
          {diensten.disciplines.map((d, i) => (
            <Reveal as="li" key={d.titel} delay={i * 0.05}>
              <article className="h-full rounded-sm border border-line bg-ink-raised">
                <div className="relative aspect-[4/3] overflow-hidden border-b border-line">
                  <Image
                    src={d.foto}
                    alt={d.fotoAlt}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold tracking-wide text-paper">
                    {d.titel}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{d.tekst}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <p className="mt-10 text-xs text-muted">{diensten.prijsNoot}</p>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Werkwijze
// ---------------------------------------------------------------------
export function Werkwijze() {
  return (
    <section id="werkwijze" className="rule scroll-mt-20 bg-ink-sunken">
      <div className={SECTION}>
        <Reveal>
          <SectionHeading label={werkwijze.label} title={werkwijze.titel} />
        </Reveal>

        <ol className="mt-12 grid gap-px bg-line lg:grid-cols-4">
          {werkwijze.stappen.map((stap, i) => (
            <Reveal as="li" key={stap.titel} delay={i * 0.05} className="bg-ink-sunken p-6 lg:p-7">
              <p className="tabular font-display text-5xl font-semibold text-accent/35">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-wide text-paper">
                {stap.titel}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-strong">{stap.tekst}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Over Davy
// ---------------------------------------------------------------------
export function OverDavy() {
  return (
    <section id="over-davy" className="rule scroll-mt-20">
      <div className={SECTION}>
        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-start lg:gap-14">
          <Reveal>
            <SectionHeading label={overDavy.label} title={overDavy.titel} />
            <div className="mt-6 space-y-4">
              {overDavy.alineas.map((alinea) => (
                <p key={alinea.slice(0, 32)} className="text-base leading-relaxed text-muted-strong">
                  {alinea}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line">
              <Image
                src={overDavy.foto}
                alt={overDavy.fotoAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <dl className="mt-6 grid gap-px bg-line">
              {overDavy.feiten.map((f) => (
                <div
                  key={f.label}
                  className="flex items-baseline justify-between gap-4 bg-ink px-4 py-3"
                >
                  <dt className="spec-label">{f.label}</dt>
                  <dd className="tabular font-display text-xl font-semibold text-paper">
                    {f.waarde}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Werkplaats & servicebus
// ---------------------------------------------------------------------
export function Werkplaats() {
  return (
    <section id="werkplaats" className="rule scroll-mt-20 bg-ink-sunken">
      <div className={SECTION}>
        <Reveal>
          <SectionHeading label={werkplaats.label} title={werkplaats.titel} />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-10">
          {werkplaats.blokken.map((blok, i) => (
            <Reveal key={blok.titel} delay={i * 0.06}>
              <article>
                <div className="relative aspect-[3/2] overflow-hidden rounded-sm border border-line">
                  <Image
                    src={blok.foto}
                    alt={blok.fotoAlt}
                    fill
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-wide text-paper sm:text-3xl">
                  {blok.titel}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-strong">{blok.tekst}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------
export function Contact() {
  return (
    <section id="contact" className="rule scroll-mt-20">
      <div className={SECTION}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHeading
              label={contactSectie.label}
              title={contactSectie.titel}
              intro={contactSectie.intro}
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`tel:${contact.telefoonLink}`}>{contactSectie.belKnop}</ButtonLink>
              <ButtonLink href={`mailto:${contact.email}`} variant="secondary">
                {contactSectie.mailKnop}
              </ButtonLink>
            </div>

            <dl className="rule mt-10 grid gap-5 pt-8 sm:grid-cols-2">
              <div>
                <dt className="spec-label">{contactSectie.adresTitel}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-strong">
                  <address className="not-italic">
                    {contact.straat}
                    <br />
                    {contact.postcode} {contact.plaats} ({contact.provincie})
                  </address>
                  <a
                    href={contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-accent underline underline-offset-4 hover:text-paper"
                  >
                    {contact.mapsLabel}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="spec-label">{contactSectie.postadresTitel}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-strong">
                  {contact.straat}
                  <br />
                  {contact.postcode} {contact.plaats}
                </dd>
              </div>

              <div>
                <dt className="spec-label">{contactSectie.telefoonLabel}</dt>
                <dd className="mt-2 text-sm">
                  <a
                    href={`tel:${contact.telefoonLink}`}
                    className="tabular text-muted-strong hover:text-accent"
                  >
                    {contact.telefoon}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="spec-label">{contactSectie.emailLabel}</dt>
                <dd className="mt-2 text-sm">
                  <a href={`mailto:${contact.email}`} className="text-muted-strong hover:text-accent">
                    {contact.email}
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-sm border border-line bg-ink-raised">
              <p className="spec-label border-b border-line px-5 py-3.5">{openingstijden.titel}</p>
              <dl className="px-5 py-1">
                {openingstijden.dagen.map((d) => (
                  <div
                    key={d.dag}
                    className="flex items-baseline justify-between gap-4 border-t border-line-soft py-3 first:border-t-0"
                  >
                    <dt className="font-display text-base tracking-wide text-paper">{d.dag}</dt>
                    <dd className="tabular max-w-[62%] text-right text-sm text-muted-strong">
                      {d.tijd}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{openingstijden.noot}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
