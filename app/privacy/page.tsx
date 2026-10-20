import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { privacy, weergave } from "@/content/site";

export const metadata: Metadata = {
  title: privacy.titel,
  description: "Privacyverklaring van SBS Suspension in Berlicum.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        {weergave.sectieLabels && (
          <>
            <p className="spec-label text-accent">AVG</p>
            <div className="mt-3 mb-5 h-px w-full bg-line" />
          </>
        )}
        <h1 className="text-4xl sm:text-5xl">{privacy.titel}</h1>
        <p className="tabular mt-3 text-sm text-muted">{privacy.laatstBijgewerkt}</p>

        <p className="mt-6 rounded-sm border border-warm/40 bg-warm/10 px-4 py-3 text-sm text-warm">
          {privacy.waarschuwing}
        </p>

        <p className="mt-6 text-base leading-relaxed text-muted-strong">{privacy.intro}</p>

        <div className="mt-10 space-y-8">
          {privacy.secties.map((sectie) => (
            <section key={sectie.titel} className="rule pt-6">
              <h2 className="font-display text-2xl font-semibold tracking-wide text-paper">
                {sectie.titel}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-strong">{sectie.tekst}</p>
            </section>
          ))}
        </div>

        <Link
          href="/"
          className="mt-12 inline-block font-display tracking-wide text-accent uppercase underline underline-offset-4 hover:text-paper"
        >
          ← {privacy.terug}
        </Link>
      </main>
      <Footer />
    </>
  );
}
