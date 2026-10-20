// =====================================================================
//  SBS SUSPENSION — ALLE TEKST VAN DE WEBSITE STAAT IN DIT ENE BESTAND
// =====================================================================
//
//  Wil je tekst op de site aanpassen? Dan hoef je ALLEEN in dit bestand
//  te zijn. Je past de tekst aan tussen de "aanhalingstekens" en laat
//  alles daaromheen (de haakjes, komma's en Engelse woordjes ervoor)
//  precies staan zoals het staat.
//
//  Voorbeeld — goed:   titel: "Mijn nieuwe tekst",
//  Voorbeeld — fout:   titel   Mijn nieuwe tekst
//
//  Let op: staat er een apostrof in je tekst (bijvoorbeeld: motor's),
//  schrijf die dan als \' of herschrijf de zin even zonder apostrof.
//
//  Regels die beginnen met // zijn uitleg voor jou. Die komen NIET op
//  de website te staan.
//
//  Teksten tussen [VIERKANTE HAAKJES] zijn nog in te vullen. Die zijn
//  met opzet zichtbaar gelaten, zodat niemand iets verzint. Zie ook de
//  lijst met in te vullen punten in README.md.
// =====================================================================

// ---------------------------------------------------------------------
// Weergave: kleine aan/uit-knoppen voor de rustige look.
//
// sectieLabels      = de kleine woordjes bóven een kop, zoals DIENSTEN
//                     of WERKWIJZE, met het streepje eronder.
// fotoBijschriften  = de kleine regeltjes onder een foto.
//
// Staan nu allebei uit. Wil je ze terugzien? Zet op true.
// De teksten zelf blijven gewoon hieronder staan.
// ---------------------------------------------------------------------
export const weergave = {
  sectieLabels: false,
  fotoBijschriften: false,
};

// ---------------------------------------------------------------------
// Bedrijfsnaam en korte omschrijving (gebruikt in de kop en de footer)
// ---------------------------------------------------------------------
export const bedrijf = {
  naam: "SBS Suspension",
  volledigeNaam: "Smits Bike Suspension",
  eigenaar: "Davy",
  // Korte zin onder het logo in de footer
  tagline: "Specialist in voorvorken en schokdempers",
  plaats: "Berlicum (N-Br)",
};

// ---------------------------------------------------------------------
// Contactgegevens. Deze worden op de hele site gebruikt: in de kop,
// in de footer, op de contactpagina en in de bel-/WhatsApp-knoppen.
// ---------------------------------------------------------------------
export const contact = {
  straat: "Marsstraat 14A",
  postcode: "5258 HE",
  plaats: "Berlicum",
  provincie: "N-Br",
  land: "Nederland",

  // Zo staat het telefoonnummer op de site
  telefoon: "+31 (0)6 53 463 821",
  // Zo wordt er gebeld als iemand erop klikt (geen spaties, geen haakjes)
  telefoonLink: "+31653463821",

  // WhatsApp-nummer zonder + en zonder spaties.
  // [CONTROLEREN] staat WhatsApp aan op dit nummer? Zo niet: zet
  // whatsappAan hieronder op false, dan verdwijnen alle WhatsApp-knoppen.
  whatsappAan: true,
  whatsapp: "31653463821",
  // Tekst die alvast in WhatsApp staat als iemand op de knop drukt
  whatsappBericht: "Hoi Davy, ik heb een vraag over mijn vering.",

  email: "info@sbs-suspension.nl",

  // Link naar Google Maps. Opent in een nieuw tabblad; er staat met
  // opzet GEEN kaart op de site (die laadt namelijk van buitenaf).
  mapsLabel: "Open in Google Maps",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Marsstraat+14A+5258+HE+Berlicum",
};

// ---------------------------------------------------------------------
// Openingstijden. Pas hier de tijden aan, of voeg een dag toe/weg.
// ---------------------------------------------------------------------
export const openingstijden = {
  titel: "Openingstijden",
  dagen: [
    { dag: "Maandag", tijd: "13.00 tot 17.00 uur" },
    { dag: "Dinsdag", tijd: "13.00 tot 17.00 uur en op afspraak vanaf 19.00 uur" },
    { dag: "Woensdag", tijd: "13.00 tot 17.00 uur" },
    { dag: "Donderdag", tijd: "13.00 tot 17.00 uur en op afspraak vanaf 19.00 uur" },
    { dag: "Vrijdag", tijd: "13.00 tot 17.00 uur" },
    { dag: "Zaterdag", tijd: "Ochtend, alleen op afspraak" },
    { dag: "Zondag", tijd: "Gesloten" },
  ],
  // Belangrijke opmerking onder de openingstijden
  noot:
    "Kom je langs? Bel dan eerst even voor een afspraak. Dan weet je zeker dat Davy er is, want hij staat regelmatig met de servicebus op een circuit, en reserveren we genoeg tijd voor je vragen.",
};

// ---------------------------------------------------------------------
// Het menu bovenaan de site. De link "#" met een naam ervoor springt
// naar een blok op de homepage.
// ---------------------------------------------------------------------
export const navigatie = [
  { label: "Vering-check", href: "#vering-check" },
  { label: "Diensten", href: "#diensten" },
  { label: "Werkwijze", href: "#werkwijze" },
  { label: "Over Davy", href: "#over-davy" },
  { label: "Werkplaats", href: "#werkplaats" },
  { label: "Contact", href: "#contact" },
];

// ---------------------------------------------------------------------
// De gekleurde balk bovenaan de site (seizoensactie).
// Wil je hem weghalen? Zet enabled op false.
// ---------------------------------------------------------------------
export const banner = {
  enabled: true,
  title: "Winterrevisie 2026/27",
  text: "Plan nu je plek. In de winter is het druk in de werkplaats.",
  ctaLabel: "Plan nu je plek",
};

// ---------------------------------------------------------------------
// Het grote blok bovenaan de homepage
// ---------------------------------------------------------------------
export const hero = {
  // Klein regeltje boven de titel
  label: "Berlicum (N-Br) · sinds 2005",
  // De grote kop. Het woord tussen de | | krijgt de accentkleur.
  titel: "Vering die past bij |jouw gewicht| en jouw rijstijl.",
  intro:
    "Onderhoud, afstellen, modificeren en coaten van voorvorken en schokdempers. Voor motorcross, enduro, supermotard, wegmotoren en MTB.",
  ctaPrimair: "Check jouw vering",
  ctaSecundair: "Bel Davy",
  ctaWhatsapp: "WhatsApp",
  // De drie korte feiten onder de knoppen
  feiten: [
    { waarde: "1994", label: "In de vering sinds" },
    { waarde: "2005", label: "Eigen werkplaats sinds" },
    { waarde: "25 jaar", label: "Zelf gecrosst" },
  ],
  foto: "/foto/werkbank-schokdemper.jpg",
  fotoAlt: "Schokdemper van een crossmotor in de bankschroef in de werkplaats van SBS Suspension",
  // Klein regeltje onder de foto, in losse woorden
  fotoBijschrift: ["Werkplaats", "Berlicum", "N-Br"],
};

// ---------------------------------------------------------------------
// De VERING-CHECK: het vraag-en-antwoord-hulpmiddel op de homepage.
// Dit is het belangrijkste onderdeel van de site.
// ---------------------------------------------------------------------
export const veringCheck = {
  label: "Vering-check",
  titel: "Welke vering zit er op jouw motor?",
  intro:
    "Kies je motor en zie meteen welke voorvork en schokdemper er standaard op zitten. Daarna stel je in een halve minuut je persoonlijk vering-advies samen.",

  // Tekst van de voortgangsbalk, bijvoorbeeld: Stap 2 van 6
  voortgang: { voor: "Stap", tussen: "van" },

  terug: "Terug",
  volgende: "Volgende",
  opnieuw: "Opnieuw beginnen",

  // --- Stap 1: wat voor motor? ---
  stapCategorie: {
    titel: "Wat rijd je?",
    hulp: "Kies de categorie die het beste past.",
    opties: [
      { id: "mx", label: "MX / Enduro", omschrijving: "Motorcross, enduro, zijspancross, quad" },
      { id: "supermoto", label: "Supermoto", omschrijving: "Supermotard en wegconversies" },
      { id: "road", label: "Wegmotor", omschrijving: "Naked, sport, tour, adventure en race" },
    ],
  },

  // --- Stap 2: merk, model en bouwjaar ---
  stapMotor: {
    titel: "Welke motor rijd je?",
    hulp: "Typ om te zoeken. Bijvoorbeeld 450 voor alle 450's.",
    merkLabel: "Merk",
    merkPlaceholder: "Kies of typ een merk",
    modelLabel: "Model",
    modelPlaceholder: "Kies of typ een model",
    bouwjaarLabel: "Bouwjaar",
    bouwjaarPlaceholder: "Kies een bouwjaar",
    geenResultaat: "Niets gevonden",
    kiesEerstMerk: "Kies eerst een merk",
    kiesEerstModel: "Kies eerst een model",

    // De uitweg als de motor er niet tussen staat
    nietGevondenVraag: "Staat je motor er niet tussen?",
    nietGevondenKnop: "Vul hem zelf in",
    handmatigTitel: "Vul je motor zelf in",
    handmatigHulp:
      "Geen probleem. Davy zoekt de juiste gegevens er zelf bij en neemt dat mee in je advies.",
    handmatigMerk: "Merk",
    handmatigModel: "Model",
    handmatigBouwjaar: "Bouwjaar",
    handmatigTerug: "Toch uit de lijst kiezen",
  },

  // --- Stap 3: het resultaat (de "haak") ---
  stapSpecs: {
    label: "Standaard vering",
    titel: "Dit zit er standaard op",
    vorkLabel: "Voorvork",
    demperLabel: "Schokdemper",
    merkLabel: "Merk",
    typeLabel: "Type",
    diameterLabel: "Diameter",
    veerLabel: "Veersysteem",
    afstelLabel: "Instelbaar",
    lucht: "Luchtvork",
    veer: "Veervork",

    // Regel onder de kaart bij motoren die Davy nog niet heeft nagekeken
    onderVoorbehoud:
      "Specificaties onder voorbehoud: Davy controleert dit in je persoonlijk advies.",
    // Regel bij een zelf ingevulde motor
    handmatigGeenSpecs:
      "Deze motor staat nog niet in onze lijst. Davy zoekt de juiste gegevens erbij en neemt dat mee in je persoonlijk advies.",
    prijsRegel: "Prijsindicatie in je persoonlijk advies.",

    doorgaan: "Stel mijn advies samen",
    doorgaanHulp: "Nog 5 korte vragen.",
  },

  // --- Stap 4: de korte vragen ---
  stapVragen: {
    titel: "Over jou en je motor",

    gewichtLabel: "Rijgewicht inclusief uitrusting",
    gewichtHulp: "Schatten mag. Dit bepaalt grotendeels je veer- of luchtdrukkeuze.",
    gewichtEenheid: "kg",
    gewichtMin: 45,
    gewichtMax: 140,
    gewichtStandaard: 82,

    niveauLabel: "Op welk niveau rijd je?",
    niveauOpties: [
      { id: "recreatief", label: "Recreatief" },
      { id: "clubwedstrijd", label: "Clubwedstrijd" },
      { id: "nationaal", label: "Nationaal" },
    ],

    urenLabel: "Uren of kilometers sinds het laatste onderhoud",
    urenHulp: "Weet je het niet precies? Kies wat er het dichtst bij komt.",
    urenOpties: [
      { id: "lt20", label: "Minder dan 20 uur / 5.000 km" },
      { id: "20-50", label: "20 tot 50 uur / 5.000 tot 15.000 km" },
      { id: "50-100", label: "50 tot 100 uur / 15.000 tot 30.000 km" },
      { id: "gt100", label: "Meer dan 100 uur / 30.000 km" },
      { id: "onbekend", label: "Geen idee" },
    ],

    doelLabel: "Wat wil je laten doen?",
    doelOpties: [
      { id: "revisie", label: "Revisie / onderhoud" },
      { id: "afstellen", label: "Afstellen op mijn gewicht" },
      { id: "prestaties", label: "Betere prestaties" },
      { id: "probleem", label: "Een probleem oplossen" },
      { id: "coating", label: "Coating" },
    ],

    wanneerLabel: "Wanneer wil je het laten doen?",
    wanneerOpties: [
      { id: "asap", label: "Zo snel mogelijk" },
      { id: "winter", label: "Deze winter" },
      { id: "seizoen", label: "Voor het nieuwe seizoen" },
      { id: "onbekend", label: "Weet ik nog niet" },
    ],
  },

  // --- Stap 5: contactgegevens achterlaten ---
  stapContact: {
    titel: "Ontvang jouw persoonlijk vering-advies",
    // Wat de bezoeker precies krijgt. Beloof hier niets wat niet klopt.
    uitleg: "Davy kijkt je gegevens persoonlijk na en stuurt je:",
    belofte: [
      "een advies voor je voorvork en schokdemper, afgestemd op je gewicht en niveau",
      "een prijsindicatie voor het werk dat je wilt laten doen",
      "wanneer er plek is in de werkplaats",
    ],
    naamLabel: "Naam",
    naamPlaceholder: "Voor- en achternaam",
    emailLabel: "E-mailadres",
    emailPlaceholder: "naam@voorbeeld.nl",
    telefoonLabel: "Telefoonnummer",
    telefoonHulp: "Niet verplicht, maar met een nummer kan Davy je sneller even bellen.",
    telefoonPlaceholder: "06 12 34 56 78",
    optioneel: "optioneel",

    consentTekst: "Ja, Davy mag mijn gegevens gebruiken om contact met mij op te nemen over dit advies.",
    consentLinkLabel: "Privacyverklaring",
    consentLinkHref: "/privacy",

    versturen: "Verstuur en ontvang mijn advies",
    versturenBezig: "Versturen…",

    // Foutmeldingen
    foutNaam: "Vul je naam in.",
    foutEmail: "Vul een geldig e-mailadres in.",
    foutTelefoon: "Dit telefoonnummer lijkt niet te kloppen.",
    foutConsent: "Zet even een vinkje, dan mag Davy je benaderen.",
    foutAlgemeen: "Er ging iets mis bij het versturen. Probeer het nog eens of bel Davy.",
  },

  // --- Stap 6: bevestiging ---
  stapKlaar: {
    titel: "Je aanvraag staat klaar",
    // [IN TE VULLEN] Hoe snel neemt Davy contact op? Vul het echte
    // aantal werkdagen in, bijvoorbeeld: "binnen 2 werkdagen".
    reactietijd: "[BINNEN X WERKDAGEN]",
    // In deze zin wordt {reactietijd} vervangen door de tekst hierboven
    reactieZin: "Davy neemt contact met je op {reactietijd}.",
    samenvattingTitel: "Dit heb je doorgegeven",
    haast: "Heb je haast of wil je het liever even doorspreken?",
    belKnop: "Bel Davy",
    whatsappKnop: "Stuur een WhatsApp",
    opnieuwKnop: "Nog een motor checken",

    // Labels in het overzicht van wat je hebt ingevuld
    labels: {
      motor: "Motor",
      vork: "Voorvork",
      demper: "Schokdemper",
      gewicht: "Rijgewicht",
      niveau: "Niveau",
      uren: "Sinds onderhoud",
      doel: "Doel",
      wanneer: "Wanneer",
      naam: "Naam",
      email: "E-mail",
      telefoon: "Telefoon",
    },
  },

  // Meldingen onderin beeld
  toastDemo: "Demo-modus: lead opgeslagen",
  toastVerstuurd: "Verstuurd. Davy heeft je aanvraag ontvangen",
};

// ---------------------------------------------------------------------
// Het blok "Diensten"
// ---------------------------------------------------------------------
export const diensten = {
  label: "Diensten",
  titel: "Wat we voor je vering doen",
  intro:
    "We hebben geen eigen merk vering. We werken met merken waar we zelf achter staan: WP, Öhlins, KYB, Showa, Reiger, Hyperpro en Hagon. Per rijder kiezen we wat past. Nieuwe veerelementen verkopen we niet.",

  items: [
    {
      titel: "Revisie & onderhoud",
      tekst:
        "Voorvork en schokdemper helemaal uit elkaar, schoon, nieuwe keerringen en olie, en nagekeken op slijtage en werking.",
      foto: "/foto/werkbank-schokdemper.jpg",
      fotoAlt: "Schokdemper in de bankschroef tijdens een revisie",
    },
    {
      titel: "Afstellen",
      tekst:
        "De afstelling is persoonlijk: je gewicht, je rijstijl, je motor en de omstandigheden bepalen samen de juiste instelling.",
      foto: "/foto/wegmotor-werkplaats.jpg",
      fotoAlt: "Wegmotor voor de werkplaats van SBS Suspension in Berlicum",
    },
    {
      titel: "Modificeren",
      tekst:
        "Meer afstelmogelijkheden of een vering die beter bij jou past? We passen de originele vork en demper aan naar jouw wensen.",
      foto: "/foto/coating-onderdelen.jpg",
      fotoAlt: "Gereviseerde en geanodiseerde onderdelen van een schokdemper",
    },
    {
      titel: "Coating",
      tekst:
        "Binnenpoten in titanium-nitride (zwart of goud): extreem hard, slijtvast en gladder, dus minder frictie. Buitenpoten, as-opnames en vorkdoppen anodiseren we in zwart, goud, titanium of bijna elke kleur op aanvraag.",
      foto: "/foto/coating-binnenpoten.jpg",
      fotoAlt: "Gecoate binnenpoten van een voorvork in goudkleur",
    },
  ],

  // De drie soorten vering waar we aan werken
  disciplinesLabel: "Waar we aan werken",
  disciplines: [
    {
      titel: "MX & Enduro",
      tekst:
        "Motorcross, enduro, supermotard, zijspancross en quad. We kennen de motoren en de circuitomstandigheden.",
      foto: "/foto/mx-crossmotor.jpg",
      fotoAlt: "Crossmotor met gecoate voorvork en SBS-sticker",
    },
    {
      titel: "Wegmotoren",
      tekst:
        "Naked, sport, tour, custom en race. Meer comfort, een betere wegligging, veiliger rijden en minder bandenslijtage.",
      foto: "/foto/dempers-wegmotor.jpg",
      fotoAlt: "Schokdempers voor wegmotoren in de werkplaats",
    },
    {
      titel: "MTB",
      tekst:
        "Onderhoud en revisie van MTB-vorken en dempers van Fox, Marzocchi en RockShox. Advies: elke 2 jaar of 120 uur.",
      foto: "/foto/mtb-vork.jpg",
      fotoAlt: "Gedemonteerde mountainbikevork met demperpatroon op de werkbank",
    },
  ],

  // Kleine regel onderaan het blok
  prijsNoot: "Prijzen hangen af van merk, type en wat er nodig is: [PRIJS OP AANVRAAG].",
};

// ---------------------------------------------------------------------
// Het blok "Werkwijze" — de vier stappen
// ---------------------------------------------------------------------
export const werkwijze = {
  label: "Werkwijze",
  titel: "Van aanleveren tot ophalen",
  stappen: [
    {
      titel: "Aanleveren",
      tekst:
        "Bel voor een afspraak en breng je motor of alleen je vork en demper langs in Berlicum. Staan we met de servicebus op jouw wedstrijd? Dan kan het daar ook.",
    },
    {
      titel: "Inspectie",
      tekst:
        "We halen alles uit elkaar en kijken na op slijtage en werking. Je hoort wat er nodig is en wat het gaat kosten voordat we beginnen.",
    },
    {
      titel: "Revisie of afstelling",
      tekst:
        "Reviseren, modificeren, coaten of afstellen op jouw gewicht en niveau. Wat we afspreken, gebeurt.",
    },
    {
      titel: "Ophalen",
      tekst:
        "Je krijgt je vering terug met de instellingen erbij en uitleg wat je zelf nog kunt bijstellen. Rijdt het niet zoals je wilt? Bel, dan kijken we opnieuw.",
    },
  ],
};

// ---------------------------------------------------------------------
// Het blok "Over Davy"
// ---------------------------------------------------------------------
export const overDavy = {
  label: "Over Davy",
  titel: "Dertig jaar vering, en zelf 25 jaar gecrosst",
  alineas: [
    "SBS Suspension is gestart in 2005. Davy werkt sinds 1994 in het aanpassen en reviseren van voorvorken en schokdempers en begon in 2005 voor zichzelf. Inmiddels is er een vaste klantenkring die jaarlijks terugkomt voor onderhoud, afstelling of vernieuwing.",
    "Doordat Davy zelf 25 jaar actief heeft gecrosst, komt die ervaring rechtstreeks terug in het advies aan crossers. Ook het aanpassen en reviseren van wegmotoren is altijd onderdeel van het werk geweest.",
    "In de loop der jaren zijn er dempers en schokbrekers van vrijwel elk merk door de werkplaats gegaan: WP, Öhlins, Kayaba, Showa en meer. Daardoor is het advies vaak gebonden aan merk of type, en verschilt het per rijder. Elke rijder heeft eigen wensen, en die nemen we mee.",
    "Elke motor is weer een uitdaging om de klant goed te adviseren en het 100% naar wens in orde te maken.",
  ],
  foto: "/foto/davy-werkplaats.jpg",
  fotoAlt: "Davy werkt aan een schokdemper in de werkplaats van SBS Suspension",
  // Korte feiten naast de foto
  feiten: [
    { label: "In de vering sinds", waarde: "1994" },
    { label: "Eigen onderneming sinds", waarde: "2005" },
    { label: "Zelf gecrosst", waarde: "25 jaar" },
  ],
};

// ---------------------------------------------------------------------
// Het blok "Werkplaats & servicebus"
// ---------------------------------------------------------------------
export const werkplaats = {
  label: "Werkplaats & servicebus",
  titel: "In de werkplaats én langs het circuit",
  blokken: [
    {
      titel: "Onze werkplaats",
      tekst:
        "In de werkplaats is je motor op de juiste plek voor alle werkzaamheden en onderhoud. We besteden grote zorg en aandacht aan je voorvorken en schokdempers. Het gaat tenslotte om kwaliteit. De werkplaats is elke middag open van 13.00 tot 17.00 uur; 's avonds en op zaterdag op afspraak.",
      foto: "/foto/wegmotor-bank.jpg",
      fotoAlt: "Wegmotor op de brug in de werkplaats van SBS Suspension",
    },
    {
      titel: "Onze servicebus",
      tekst:
        "SBS Suspension heeft een eigen servicebus. Daarmee staan we op wedstrijden en trainingsdagen om rijders ter plekke te helpen: vragen beantwoorden, de motor fijn afstellen en zo nodig reparaties verrichten. In overleg organiseren we ook een testdag, zodat we de motor op het circuit zo goed mogelijk kunnen laten afveren.",
      foto: "/foto/servicebus.jpg",
      fotoAlt: "De servicebus en stand van SBS Suspension bij een crosswedstrijd",
    },
  ],
};

// ---------------------------------------------------------------------
// Het blok "Contact" onderaan de homepage en op de contactpagina
// ---------------------------------------------------------------------
export const contactSectie = {
  label: "Contact",
  titel: "Even bellen werkt het snelst",
  intro:
    "Vragen over je vering, of wil je een afspraak maken? Bel of mail Davy. Kom je langs? Maak dan eerst telefonisch een afspraak.",
  adresTitel: "Bezoekadres",
  postadresTitel: "Postadres",
  telefoonLabel: "Telefoon",
  emailLabel: "E-mail",
  belKnop: "Bel Davy",
  mailKnop: "Mail Davy",
};

// ---------------------------------------------------------------------
// De footer onderaan elke pagina
// ---------------------------------------------------------------------
export const footer = {
  // Links naar social media. Haal een regel weg als die niet gebruikt wordt.
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/sbs.suspension" },
    { label: "Instagram", href: "https://www.instagram.com/sbs_suspension/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/arnold-smits-651b9596/" },
  ],
  links: [
    { label: "Privacyverklaring", href: "/privacy" },
  ],
  // {jaar} wordt automatisch vervangen door het huidige jaartal
  copyright: "© {jaar} SBS Suspension · Marsstraat 14A · 5258 HE Berlicum (N-Br)",
  // [IN TE VULLEN] KvK-nummer en btw-nummer
  kvk: "KvK [KVK-NUMMER]",
  btw: "Btw [BTW-NUMMER]",
};

// ---------------------------------------------------------------------
// Teksten die Google en social media laten zien
// ---------------------------------------------------------------------
export const meta = {
  titel: "SBS Suspension · Voorvorken en schokdempers reviseren, afstellen en coaten",
  titelKort: "SBS Suspension",
  omschrijving:
    "Specialist in voorvorken en schokdempers in Berlicum (N-Br). Revisie, onderhoud, afstellen, modificeren en coating voor motorcross, enduro, supermoto, wegmotoren en MTB.",
  // Dit adres gebruik je pas als de site echt live staat
  siteUrl: "https://www.sbs-suspension.nl",
  ogImage: "/og.jpg",
};

// ---------------------------------------------------------------------
// De privacyverklaring (pagina /privacy)
// LET OP: dit is een opzet, nog geen juridisch nagekeken tekst.
// ---------------------------------------------------------------------
export const privacy = {
  titel: "Privacyverklaring",
  laatstBijgewerkt: "Laatst bijgewerkt: [DATUM INVULLEN]",
  waarschuwing:
    "[CONCEPT] Deze privacyverklaring is een opzet en moet nog worden nagekeken en aangevuld voordat de site live gaat.",
  intro:
    "SBS Suspension (Marsstraat 14A, 5258 HE Berlicum) verwerkt persoonsgegevens van bezoekers van deze website. In deze verklaring lees je welke gegevens dat zijn, waarom we ze verwerken en welke rechten je hebt.",
  secties: [
    {
      titel: "Welke gegevens we verwerken",
      tekst:
        "Als je de Vering-check invult en je advies aanvraagt, verwerken we je naam, je e-mailadres, je telefoonnummer (als je dat invult) en de antwoorden die je in de Vering-check hebt gegeven: je motor, je rijgewicht, je niveau, de uren of kilometers sinds het laatste onderhoud, wat je wilt laten doen en wanneer.",
    },
    {
      titel: "Waarom we die gegevens verwerken",
      tekst:
        "We gebruiken je gegevens om je het gevraagde persoonlijke vering-advies en een prijsindicatie te sturen en om contact met je op te nemen over je aanvraag. We gebruiken ze niet voor iets anders en verkopen ze niet door.",
    },
    {
      titel: "Grondslag",
      tekst:
        "De verwerking gebeurt op basis van jouw toestemming. Die geef je met het vinkje in de Vering-check. Je kunt je toestemming op elk moment intrekken door een mail te sturen naar info@sbs-suspension.nl.",
    },
    {
      titel: "Hoe lang we je gegevens bewaren",
      tekst:
        "We bewaren je aanvraag [BEWAARTERMIJN INVULLEN, bijvoorbeeld: 24 maanden] na het laatste contact, zodat we je bij een vervolgvraag of een volgende revisie verder kunnen helpen. Daarna verwijderen we de gegevens.",
    },
    {
      titel: "Met wie we je gegevens delen",
      tekst:
        "[AANVULLEN] Hier noem je de partijen die je gegevens verwerken, bijvoorbeeld je e-mailprovider en de partij die de website host. Verwerk je gegevens buiten de EU? Vermeld dat hier ook.",
    },
    {
      titel: "Cookies",
      tekst:
        "Deze website plaatst geen tracking- of advertentiecookies en gebruikt geen analytics. Wat je in de Vering-check invult, blijft tijdens het invullen in je eigen browser en wordt pas verstuurd als je op de verzendknop drukt.",
    },
    {
      titel: "Jouw rechten",
      tekst:
        "Je mag je gegevens inzien, laten corrigeren of laten verwijderen, en je mag bezwaar maken tegen de verwerking. Stuur daarvoor een mail naar info@sbs-suspension.nl. Je hebt ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens.",
    },
    {
      titel: "Contact",
      tekst:
        "SBS Suspension · Marsstraat 14A · 5258 HE Berlicum (N-Br) · +31 (0)6 53 463 821 · info@sbs-suspension.nl · KvK [KVK-NUMMER].",
    },
  ],
  terug: "Terug naar de homepage",
};

// ---------------------------------------------------------------------
// Het demo-overzicht met binnengekomen aanvragen (pagina /leads).
// Deze pagina staat NIET in het menu.
// ---------------------------------------------------------------------
export const leadsPagina = {
  badge: "DEMO",
  titel: "Binnengekomen aanvragen",
  intro:
    "Dit is een demonstratie. De aanvragen hieronder staan alleen in deze browser opgeslagen en worden nergens heen gestuurd.",
  leeg: "Nog geen aanvragen. Vul de Vering-check in, of laad voorbeelddata.",
  laadVoorbeeld: "Voorbeelddata laden (nep)",
  wisAlles: "Alles wissen",
  exporteer: "Exporteer CSV",
  kolommen: {
    tijd: "Tijd",
    naam: "Naam",
    contactgegevens: "E-mail / telefoon",
    motor: "Motor",
    vering: "Vork / demper",
    gewicht: "Gewicht",
    niveau: "Niveau",
    uren: "Sinds onderhoud",
    doel: "Doel",
    wanneer: "Wanneer",
    score: "Score",
  },
  scoreLabels: { hot: "Hot", warm: "Warm", cold: "Koud" },
  terug: "Terug naar de site",
};
