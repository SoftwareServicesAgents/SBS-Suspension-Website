# SBS Suspension — demo-redesign

Demo van een nieuwe website voor [sbs-suspension.nl](https://www.sbs-suspension.nl).
Draait lokaal, werkt volledig zonder internet en zonder accounts.

Kern van de demo is de **Vering-check**: een bezoeker kiest zijn motor, ziet
meteen welke voorvork en schokdemper erop zitten, beantwoordt vijf korte
vragen en laat zijn gegevens achter voor persoonlijk advies. Davy krijgt een
gekwalificeerde lead die hij kan inplannen.

---

## 1. Draaien op je eigen laptop

```bash
npm install
npm run build
npm start
```

Open daarna **http://localhost:3000**.

Stoppen: `Ctrl-C` in hetzelfde terminalvenster.

> Gebruik `npm run build` + `npm start`, niet `npm run dev`. De dev-server is
> trager en laadt bij elke wijziging opnieuw; dat wil je niet tijdens een pitch.

### Pagina's

| Pagina | Adres | Opmerking |
|---|---|---|
| Homepage met de Vering-check | `/` | alles staat hier |
| Privacyverklaring | `/privacy` | concepttekst, zie placeholders |
| Lead-dashboard | `/leads` | **demo**, staat met opzet niet in het menu |

---

## 2. Checklist vóór de pitch

1. **Bouw terwijl je nog online bent** — `npm run build` haalt de lettertypen
   eenmalig op en zet ze in het project. Daarna is internet niet meer nodig.
2. Zet je **wifi uit** en doe `npm start`. Loop de hele Vering-check door.
   Alles hoort te werken: foto's, lettertypen, de speckaart, het versturen en
   `/leads`.
3. Laat `/leads` leeg bij de start. Klik tijdens de demo op
   **"Voorbeelddata laden (nep)"** of vul live een aanvraag in — die verschijnt
   er meteen bij.
4. Demo de telefoonweergave in de devtools van je browser op **375 px breed**.
   Op die maat is het ontwerp ontworpen; riders komen via forums en Facebook
   binnen op hun telefoon.
5. Zorg dat er niets op poort 3000 draait: `lsof -ti:3000 | xargs kill -9`.

### Doorlopen flows (allemaal getest op 375 px en 1440 px)

| Flow | Wat het laat zien |
|---|---|
| KTM 450 SX-F 2027 | nagekeken motor, **luchtvork** — luchtdruk-opmerking |
| Honda CRF450R 2027 | nagekeken motor **zonder** veersysteem — veld blijft weg |
| Husqvarna FC 350 2025 | niet-nagekeken motor — regel "onder voorbehoud" |
| "Vul hem zelf in" | motor niet in de lijst — flow loopt gewoon door |

---

## 3. Volledig offline

Na `npm run build` doet de site **geen enkel verzoek naar een extern adres**.
Gecontroleerd met een script dat al het netwerkverkeer meeleest: `none — fully local`.

- Logo en alle 16 foto's zijn van de huidige site gehaald en staan in `/public`.
  Geen enkele hotlink.
- Lettertypen (Barlow Condensed + Inter) komen via `next/font`: die worden
  tijdens het bouwen gedownload en in het project gezet. 19 `.woff2`-bestanden
  in `.next/static/media`. Geen verzoek naar Google Fonts.
- Geen analytics, geen externe scripts, geen embeds, geen iframes.
- **Geen kaart op de contactpagina.** Een Google Maps-kaart laadt van buitenaf
  en zou offline een leeg vlak geven. In plaats daarvan staat er het adres met
  een knop **"Open in Google Maps"**.
- Links naar Facebook, Instagram, LinkedIn, Google Maps en WhatsApp zijn gewone
  links. Die laden niets; ze doen alleen iets als je erop klikt.

---

## 4. Tekst aanpassen

> Dit stukje is voor Davy. Je hebt geen programmeerkennis nodig.

Alle tekst van de website staat in **één bestand**: `content/site.ts`.
Open dat in een teksteditor (Kladblok, TextEdit, VS Code — maakt niet uit).

Boven elk blok staat in gewoon Nederlands wat het is, bijvoorbeeld:

```
// De gekleurde balk bovenaan de site (seizoensactie).
// Wil je hem weghalen? Zet enabled op false.
export const banner = {
  enabled: true,
  title: "Winterrevisie 2026/27",
  text: "Plan nu je plek. In de winter is het druk in de werkplaats.",
  ctaLabel: "Plan nu je plek",
};
```

**De regels:**

1. Pas alleen de tekst **tussen de "aanhalingstekens"** aan.
2. Laat alles eromheen staan: de haakjes, de komma's en het Engelse woordje
   ervoor (`title`, `text`, …).
3. Een apostrof in je tekst? Schrijf die als `\'` of herschrijf de zin even.
4. `true` betekent aan, `false` betekent uit. Daar horen géén aanhalingstekens bij.

**Opslaan en de wijziging zien:**

```bash
npm run build
npm start
```

Ververs daarna de pagina in je browser.

**Wat je zoal kunt aanpassen in `content/site.ts`:**

| Blok | Wat erin staat |
|---|---|
| `bedrijf` | bedrijfsnaam en de zin onder het logo |
| `contact` | adres, telefoon, e-mail, WhatsApp-nummer, Google Maps-link |
| `openingstijden` | de tijden per dag en de opmerking eronder |
| `navigatie` | het menu bovenaan |
| `banner` | de seizoensbalk (aan/uit, titel, tekst, knoptekst) |
| `hero` | de grote kop, de intro en de knoppen bovenaan |
| `veringCheck` | **alle** tekst van de Vering-check, inclusief de vragen |
| `diensten` | de vier diensten en de drie soorten vering |
| `werkwijze` | de vier stappen |
| `overDavy` | het verhaal over Davy |
| `werkplaats` | werkplaats en servicebus |
| `contactSectie` | het contactblok onderaan |
| `footer` | social media, KvK, btw, copyright |
| `meta` | de titel en omschrijving die Google laat zien |
| `privacy` | de hele privacyverklaring |
| `leadsPagina` | de teksten op het demo-dashboard |

De **motorgegevens** staan apart, in `data/bikes.ts`. Zie `VERIFY.md`.

---

## 5. Leads: hoe het nu werkt

### Demo-modus (standaard, zonder instellingen)

Bij het versturen wordt de aanvraag opgeslagen **in de browser zelf**
(localStorage) en verschijnt de melding *"Demo-modus: lead opgeslagen"*.
Daarna staat hij op `/leads`. Dit werkt volledig offline.

`/leads` heeft:
- een kolom per antwoord, plus een score-badge
- standaardsortering: **hot eerst, dan nieuwste**
- **Exporteer CSV** (puntkomma's en een BOM, dus Excel in het Nederlands opent hem goed)
- **Voorbeelddata laden (nep)** — duidelijk als nep gelabeld, namen zijn
  "Voorbeeld Rijder 1" met `@example.nl`-adressen
- **Alles wissen**

> De aanvragen staan alleen in de browser waarin ze zijn ingevuld. Doe je de
> demo in Chrome en open je `/leads` in Safari, dan is die leeg. Gebruik
> dezelfde browser, en geen incognitovenster.

### Echte e-mail aanzetten (Resend)

Zet twee omgevingsvariabelen en de site mailt in plaats van alleen op te slaan.

1. Maak een account op [resend.com](https://resend.com) en genereer een API-key.
2. Maak in de projectmap een bestand `.env.local`:

   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   LEAD_TO_EMAIL=info@sbs-suspension.nl
   LEAD_FROM_EMAIL=SBS Suspension <noreply@sbs-suspension.nl>
   ```

3. `npm run build` en `npm start` opnieuw.

Dan gaan er twee mails uit:

- **naar Davy** — alle leadgegevens plus de score in het onderwerp, bijvoorbeeld
  `[HOT] Vering-check · Test Rijder · KTM 450 SX-F 2027`. Antwoorden gaat
  rechtstreeks naar de rijder (`reply_to`).
- **naar de rijder** — een bevestiging in de huisstijl met de samenvatting van
  zijn vering en wat hij van Davy krijgt.

Aandachtspunten:

- `LEAD_FROM_EMAIL` is optioneel. Zonder die regel gebruikt Resend hun
  testafzender; die is prima om te proberen, maar voor echt gebruik moet je bij
  Resend je eigen domein verifiëren.
- Gaat er iets mis met Resend, dan **breekt de flow nooit**: de bezoeker krijgt
  gewoon zijn bevestigingsscherm en de aanvraag staat nog in de browser. De
  fout komt in het serverlog te staan.
- Zonder deze variabelen doet `/api/lead` **geen enkel extern verzoek**. Dat is
  precies waarom de offline demo werkt.

> **Nog niet geverifieerd:** of Resend de mail daadwerkelijk aflevert, is niet
> getest — daar is jouw eigen API-key voor nodig. Wat wél is getest, met een
> lokale nabootsing van de Resend-API: beide mails worden opgebouwd, correct
> geadresseerd en verstuurd, met de juiste afzender, `reply_to`, onderwerp en
> inhoud. Alleen de laatste stap (Resend → postvak) staat nog open.

### Beveiliging tegen spam

`/api/lead` controleert alles met `zod` en heeft een **honeypot**: een
verborgen veld `website` dat alleen een bot invult. Is het ingevuld, dan geeft
de route gewoon `200` terug en stuurt niets. Een bot leert daardoor niet welk
veld hem verraadde.

---

## 6. Lead scoring

Alleen intern — de bezoeker ziet zijn score **nooit**. Punten tellen op:

| Signaal | Punten |
|---|---|
| Telefoonnummer ingevuld | +2 |
| Meer dan 100 uur / 30.000 km sinds onderhoud | +2 |
| 50 – 100 uur / 15.000 – 30.000 km sinds onderhoud | +1 |
| Doel is *revisie / onderhoud* of *probleem oplossen* | +2 |
| Wanneer is *zo snel mogelijk* | +2 |
| Wanneer is *deze winter* | +1 |
| Niveau is *nationaal* | +2 |
| Niveau is *clubwedstrijd* | +1 |

| Totaal | Score |
|---|---|
| 6 of meer | **hot** |
| 3 – 5 | **warm** |
| 0 – 2 | **cold** |

Maximaal 10 punten. De gedachte: iemand die belbaar is, al lang niet bij een
monteur is geweest, concreet werk wil, haast heeft en wedstrijden rijdt, is de
rijder die Davy als eerste moet bellen.

Aanpassen? Dat staat in `lib/lead.ts`, bovenaan onder "Lead scoring".

---

## 7. Placeholders die nog ingevuld moeten worden

Met opzet zichtbaar gelaten, zodat niemand iets verzint. Zoek op de tekst
tussen `[ ]`.

| Placeholder | Waar | Wat erin moet |
|---|---|---|
| `[BINNEN X WERKDAGEN]` | `content/site.ts` → `veringCheck.stapKlaar.reactietijd` | Hoe snel neemt Davy contact op? Bijv. `binnen 2 werkdagen`. Staat op het bevestigingsscherm **en** in de mail naar de rijder. |
| `[PRIJS OP AANVRAAG]` | `content/site.ts` → `diensten.prijsNoot` | Wel of geen prijsindicatie op de site. Nu staat er dat prijzen van merk en type afhangen. |
| `[KVK-NUMMER]` | `content/site.ts` → `footer.kvk` en `privacy` | KvK-nummer |
| `[BTW-NUMMER]` | `content/site.ts` → `footer.btw` | Btw-nummer |
| `[CONCEPT]` + `[DATUM INVULLEN]` | `content/site.ts` → `privacy` | De privacyverklaring is een **opzet**, juridisch nog niet nagekeken |
| `[BEWAARTERMIJN INVULLEN]` | `content/site.ts` → `privacy` | Hoe lang blijven aanvragen bewaard? |
| `[AANVULLEN]` (verwerkers) | `content/site.ts` → `privacy` | Wie verwerkt de gegevens: mailprovider, hostingpartij |
| `[CONTROLEREN]` WhatsApp | `content/site.ts` → `contact.whatsappAan` | Staat WhatsApp aan op 06 53 463 821? Zo niet: zet op `false`, dan verdwijnen alle WhatsApp-knoppen |

Verder nog te controleren:

- **De LinkedIn-link** in de footer gaat naar het profiel dat op de huidige site
  staat (`arnold-smits-...`), terwijl de site zelf over Davy spreekt. Even nalopen.
- **Openingstijden** zijn overgenomen van de huidige site. Nog actueel?
- **`meta.siteUrl`** staat op `https://www.sbs-suspension.nl` en wordt pas
  gebruikt als de site echt live staat.

---

## 8. Gemaakte ontwerpkeuzes

**Kleur.** De accentkleur is uit het logo gehaald: het diepe indigo `#201060`.
Op bijna-zwart is dat te donker om te lezen, dus dezelfde kleur is opgetild naar
`#8470FF` voor gebruik op donkere vlakken (contrast 5,38:1 — ruim boven de
AA-norm van 4,5:1). De diepe variant wordt gebruikt als vulling met lichte tekst,
zoals in de seizoensbalk en de voettekst van de e-mails. Eén accent, geen neon,
geen gloed, geen verlopen.

**Donker als basis.** Bijna-zwart `#0B0B0C` met gebroken wit `#F4F4F2`. De echte
werkplaatsfoto's zijn donker en contrastrijk; op een donkere ondergrond vallen de
gecoate poten en het aluminium op. Een witte site zou die foto's plat maken.

**Typografie.** Barlow Condensed voor koppen — smal, technisch, en bij
hoofdletters leest het als een sticker op een vork. Inter voor lopende tekst.
Alle getallen staan in tabelcijfers, zodat specs en openingstijden netjes onder
elkaar uitlijnen.

**Motieven.** Dunne lijnen in plaats van kaders, spec-sheet-labels
(`VOORVORK / 48 MM / LUCHTVORK`), een nauwelijks zichtbaar raster achter de hero
en de Vering-check, hoekradius 0–4 px. De speckaart is bewust opgezet als een
technisch gegevensblad en niet als een marketingblok.

**Animatie.** Terughoudend. Scroll-onthullingen gebeuren één keer. De hero-kop
komt per woord omhoog; het laatste woord staat er binnen ~400 ms. Het
signatuurdetail zit op de hoofdknop: die **veert in bij indrukken en veert bij
loslaten één keer door voordat hij uitdempt** — precies wat een voorvork doet na
een klap. Het lijntje onder het label loopt mee. Bij
`prefers-reduced-motion: reduce` vervalt alles; geen enkele tekst wacht ooit op
een animatie.

**"Je" in plaats van "u".** De huidige site spreekt met "u". Deze versie gebruikt
consequent "je". De Vering-check is een gesprek met een rijder die van een forum
of uit een Facebook-groep komt, en door elkaar heen "u" en "je" gebruiken leest
slecht. Wil Davy liever "u", dan is dat één zoek-en-vervang in `content/site.ts`.

**Vijf vragen op één scherm.** De Vering-check heeft zes stappen. Stap 4 bundelt
de vijf kwalificerende vragen op één scherm in plaats van vijf aparte schermen,
gescheiden door dunne lijnen. Tien schermen achter elkaar voelt op een telefoon
als een formulier; vijf snelle tikjes onder elkaar niet. De voortgangsbalk toont
daarom zes stappen.

**Het resultaat is niet afgeschermd.** De speckaart verschijnt meteen na het
kiezen van de motor, vóór het contactformulier. Dat is de haak: de bezoeker
krijgt eerst iets van waarde en geeft daarna pas zijn gegevens.

**De telefoon is optioneel maar wordt aangemoedigd.** Verplicht stellen kost
leads; er staat bij waarom het handig is ("dan kan Davy je sneller even bellen").
In de score telt een ingevuld nummer voor 2 punten.

**Nooit doodlopen.** Staat de motor er niet tussen, dan is er altijd "Vul hem
zelf in". Die leads zijn net zo goed — Davy zoekt de gegevens er zelf bij.

**Geen verzonnen vertrouwenssignalen.** Geen reviews, geen rapportcijfers, geen
klantaantallen, geen keurmerken, geen prijzen. Wat er aan cijfers staat (1994,
2005, 25 jaar) komt rechtstreeks van de huidige site.

**Toestemming staat uit.** Het vinkje bij het contactformulier is standaard
**leeg** en linkt naar `/privacy`. Daarboven staat precies wat de bezoeker
terugkrijgt.

**`/leads` staat niet in het menu** en is afgeschermd voor zoekmachines
(`robots: noindex, nofollow`), met een duidelijk **DEMO**-label in beeld.

---

## 9. Techniek

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · zod.
Geen database, geen CMS, geen accounts.

```
app/                    pagina's en de API-route
  layout.tsx            lettertypen, meta-tags, LocalBusiness JSON-LD
  page.tsx              homepage
  privacy/              privacyverklaring
  leads/                demo-dashboard
  api/lead/route.ts     leadverwerking + e-mail
components/             alle bouwstenen; lezen uitsluitend uit content/site.ts
content/site.ts         ← ALLE TEKST
data/bikes.ts           ← ALLE MOTORGEGEVENS
lib/
  bikes.ts              zoeken in de motorlijst
  lead.ts               validatie, labels, lead scoring
  lead-store.ts         opslag in de browser
public/                 logo, foto's, og-afbeelding
```

**Toegankelijkheid en SEO.** Elk invoerveld heeft een gekoppeld label. De
merk-, model- en bouwjaarkeuzes zijn echte ARIA-comboboxen: je kunt typen om te
zoeken (`450` vindt alle 450's) en met pijltjes, Home/End, Enter en Escape
bedienen. Overal een zichtbare focusrand. De voortgangsbalk is een
`progressbar` met de juiste waarden, de melding onderin is een `status` met
`aria-live`. Alle foto's gaan door `next/image` met een beschrijvende `alt`.
Meta- en OG-tags staan er, de OG-afbeelding staat lokaal in `/public/og.jpg`, en
er is LocalBusiness-JSON-LD met het echte adres en telefoonnummer. De
openingstijden in de JSON-LD bevatten alleen de vaste middagen — "op afspraak"
is geen openingstijd en wordt niet als zodanig gepubliceerd.

**Gecontroleerd:** `npm run build` en `npm run lint` draaien schoon. Alle vier
de flows zijn op 375 px en 1440 px doorlopen met een aangestuurde browser: geen
fouten in de console, geen externe verzoeken.

**Nog niet gemeten:** Lighthouse. De opzet mikt op ≥ 90 op mobiel — alles
statisch voorgerenderd, lettertypen lokaal, geen externe scripts, afbeeldingen
via `next/image` — maar er is geen score gedraaid. Doe dat in Chrome via
devtools → Lighthouse → Mobile, zolang `npm start` draait.

---

## 10. Fase 2

**Live zetten.** Dit project draait zonder aanpassingen op Vercel: repo
koppelen, deployen, klaar. De e-mailvariabelen zet je dan in de
projectinstellingen van Vercel in plaats van in `.env.local`. Daarna
`meta.siteUrl` controleren en het domein koppelen.

**Leads bewaren in plaats van in de browser.** Nu staat alles in localStorage.
Zodra het echt gebruikt wordt, wil je een database (Vercel Postgres of Supabase)
of op zijn minst de mail naar Davy als vaste opslag. `/leads` wordt dan een
echte, met wachtwoord afgeschermde pagina in plaats van een demo.

**Tekst aanpassen zonder bestanden.** Een headless CMS bovenop `content/site.ts`:
**TinaCMS** (bewerkt het bestand rechtstreeks, met een voorbeeldweergave ernaast)
of **Decap CMS** (eenvoudiger, werkt via GitHub). Davy logt dan in op
`/admin` en past tekst aan in een formulier. Bewust niet vanavond gebouwd:
het kost tijd en de winst zit nu in de Vering-check.

**Meer nagekeken motoren.** 5 van de 62 regels zijn tegen bronnen van de
fabrikant gecontroleerd. De rest draagt de regel "onder voorbehoud". Davy kan
die in een avond doorlopen — zet `verified: true` en vul `sources`, en de regel
verdwijnt vanzelf. Dat is meteen het sterkste punt van de tool: specs die
kloppen omdat de specialist ze zelf heeft nagekeken.

**MTB in de Vering-check.** MTB staat nu alleen bij de diensten. Een vierde
categorie met Fox-, Marzocchi- en RockShox-vorken en -dempers is dezelfde
flow, met andere velden (travel, wieldiameter, stand- of dropper-post).

**Verder denkbaar:** foto's van de eigen werkplaats in plaats van de
bestaande set, een pagina per discipline voor SEO (nu alles op één pagina), een
instelkaart die de rijder kan meenemen na een revisie, en de servicebus-agenda
met de wedstrijden waar Davy staat.
