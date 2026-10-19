import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero, SeasonalBanner } from "@/components/Hero";
import { Reveal } from "@/components/motion";
import { Contact, Diensten, OverDavy, Werkplaats, Werkwijze } from "@/components/Sections";
import { SectionHeading } from "@/components/ui";
import { VeringCheck } from "@/components/VeringCheck";
import { veringCheck } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <SeasonalBanner />
      <Header />

      <main id="inhoud">
        <Hero />

        {/* The Vering-check is the centrepiece: first thing below the fold. */}
        <section id="vering-check" className="rule scroll-mt-20 bg-ink-sunken">
          <div className="relative overflow-hidden">
            <div
              className="grid-motif pointer-events-none absolute inset-0 opacity-40"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
              <Reveal>
                <SectionHeading
                  label={veringCheck.label}
                  title={veringCheck.titel}
                  intro={veringCheck.intro}
                />
              </Reveal>

              <div className="mt-10 lg:mt-14">
                <div className="rounded-sm border border-line bg-ink p-5 sm:p-8 lg:p-10">
                  <VeringCheck />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Diensten />
        <Werkwijze />
        <OverDavy />
        <Werkplaats />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
