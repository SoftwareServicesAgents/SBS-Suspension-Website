import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { bedrijf, contact, meta, openingstijden } from "@/content/site";
import "./globals.css";

// next/font downloads and self-hosts these at build time, so the running
// site never requests anything from Google Fonts.
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(meta.siteUrl),
  title: { default: meta.titel, template: `%s · ${meta.titelKort}` },
  description: meta.omschrijving,
  applicationName: bedrijf.naam,
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: bedrijf.naam,
    title: meta.titel,
    description: meta.omschrijving,
    url: meta.siteUrl,
    images: [{ url: meta.ogImage, width: 1200, height: 630, alt: bedrijf.naam }],
  },
  twitter: {
    card: "summary_large_image",
    title: meta.titel,
    description: meta.omschrijving,
    images: [meta.ogImage],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  width: "device-width",
  initialScale: 1,
};

/** Maps the Dutch opening hours to schema.org day codes. */
const DAY_CODES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${meta.siteUrl}/#localbusiness`,
  name: bedrijf.naam,
  legalName: bedrijf.volledigeNaam,
  description: meta.omschrijving,
  url: meta.siteUrl,
  image: `${meta.siteUrl}${meta.ogImage}`,
  logo: `${meta.siteUrl}/logo-sbs.png`,
  telephone: contact.telefoon,
  email: contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: contact.straat,
    postalCode: contact.postcode,
    addressLocality: contact.plaats,
    addressRegion: "Noord-Brabant",
    addressCountry: "NL",
  },
  areaServed: "NL",
  founder: { "@type": "Person", name: bedrijf.eigenaar },
  foundingDate: "2005",
  openingHoursSpecification: openingstijden.dagen
    .map((d, i) => {
      // Only publish the plain afternoon window; "op afspraak" is not a
      // fixed opening time and should not be advertised as one.
      const match = d.tijd.match(/^(\d{2})\.(\d{2}) – (\d{2})\.(\d{2})/);
      if (!match) return null;
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DAY_CODES[i],
        opens: `${match[1]}:${match[2]}`,
        closes: `${match[3]}:${match[4]}`,
      };
    })
    .filter(Boolean),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl-NL" className={`${barlowCondensed.variable} ${inter.variable}`}>
      <body className="bg-ink text-paper antialiased">
        <script
          type="application/ld+json"
          // Static, build-time object — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
