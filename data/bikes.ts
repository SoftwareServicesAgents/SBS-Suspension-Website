// =====================================================================
//  Bike suspension database for the Vering-check.
//
//  Two tiers:
//   - `verifiedBikes`  : checked against manufacturer sources. Every one
//                        carries `sources`. Shown without a disclaimer.
//   - `unverifiedBikes`: seeded from general model knowledge. Shown with
//                        "Specificaties onder voorbehoud".
//
//  Accuracy rules applied to the unverified tier:
//   - only fitments with high confidence are listed;
//   - optional fields are omitted rather than guessed;
//   - where a specific part code was uncertain, the broader correct
//     description is used instead;
//   - year ranges never overlap a verified entry for the same model.
//
//  See VERIFY.md for the full checklist.
// =====================================================================

export type Bike = {
  category: "mx" | "enduro" | "supermoto" | "road";
  make: string;
  model: string;
  yearFrom: number;
  yearTo: number;
  fork: {
    brand: string;
    type: string;
    diameterMm?: number;
    springType?: "lucht" | "veer";
    adjustment?: string;
  };
  shock: { brand: string; type: string; adjustment?: string };
  notes?: string;
  verified: boolean;
  sources?: string[];
};

// ---------------------------------------------------------------------
// VERIFIED — checked against manufacturer sources. Do not edit values
// here without re-checking the source links.
// ---------------------------------------------------------------------
export const verifiedBikes: Bike[] = [
  {
    category: "mx", make: "KTM", model: "450 SX-F", yearFrom: 2026, yearTo: 2027,
    fork:  { brand: "WP", type: "XACT-USD AER", diameterMm: 48, springType: "lucht",
             adjustment: "Compressie (high- & low-speed), rebound" },
    shock: { brand: "WP", type: "XACT monoshock met linkage", adjustment: "Compressie, rebound" },
    notes: "Luchtvork: de luchtdruk moet passen bij je rijgewicht. Let op: de Factory Edition heeft andere vering.",
    verified: true,
    sources: [
      "https://www.ktm.com/en-cz/models/motocross/4-stroke/2027-ktm-450-sx-f/technical-specifications.html",
      "https://www.ktm.com/en-be/models/motocross/4-stroke/2026-ktm-450-sx-f/technical-specifications.html",
    ],
  },
  {
    category: "mx", make: "Yamaha", model: "YZ450F", yearFrom: 2026, yearTo: 2027,
    fork:  { brand: "KYB", type: "Speed Sensitive System (SSS)", diameterMm: 48, springType: "veer",
             adjustment: "Volledig instelbaar" },
    shock: { brand: "KYB", type: "Monoshock met linkage",
             adjustment: "Volledig instelbaar, met handbediende low-speed compressie" },
    notes: "Sinds 2026: nieuwe KYB-schokdemper met handbediende low-speed compressieafsteller.",
    verified: true,
    sources: [
      "https://www.yamaha-motor.ca/en/off-road/motorcycle/motocross/2027-yz450f/2027-YZ450FV",
      "https://yamahamotorsports.com/models/26-yz450f/specs",
    ],
  },
  {
    category: "mx", make: "Honda", model: "CRF450R", yearFrom: 2025, yearTo: 2026,
    fork:  { brand: "Showa", type: "USD", diameterMm: 49, springType: "veer", adjustment: "Volledig instelbaar" },
    shock: { brand: "Showa", type: "Pro-Link monoshock", adjustment: "Volledig instelbaar" },
    notes: "Let op: de Works Edition (CRF450RWE) heeft een vork met titanium-oxide coating.",
    verified: true,
    sources: [
      "https://powersports.honda.com/motorcycle/motocross/crf450r/2026/crf450r",
      "https://hondanews.com/en-US/powersports/releases/release-0d29cf91ab5515b985a1c28691022ee6-2026-honda-crf450r-specifications",
      "https://www.dirtrider.com/dirt-bikes/honda-crf450r-technical-information",
    ],
  },
  {
    category: "mx", make: "Honda", model: "CRF450R", yearFrom: 2027, yearTo: 2027,
    fork:  { brand: "Showa", type: "USD met DBS-zuiger (Dynamic Blow System)", diameterMm: 49 },
    shock: { brand: "Showa", type: "Monoshock Ø 50 mm met Pro-Link" },
    notes: "Nieuw voor 2027: volledig herziene vork met DBS-zuiger voor meer demping bij lage snelheid, Kashima-coating op stang en cilinder, en een nieuwe Pro-Link-verhouding. Let op: de CRF450R HRC-WE heeft eigen veringsinstellingen.",
    verified: true,
    sources: ["https://hondanews.eu/nl/nl/motorcycles/media/pressreleases/578555/27ym-honda-crf450r"],
  },
  {
    category: "road", make: "Yamaha", model: "MT-07", yearFrom: 2025, yearTo: 2026,
    fork:  { brand: "KYB", type: "USD", diameterMm: 41 },
    shock: { brand: "KYB", type: "Monoshock met linkage", adjustment: "Voorspanning, rebound" },
    notes: "Sinds 2025 een nieuwe upside-down vork; oudere MT-07's hebben een ander vorktype.",
    verified: true,
    sources: ["https://www.yamahamotorsports.com/models/25-mt-07/specs"],
  },
];

// ---------------------------------------------------------------------
// UNVERIFIED — seeded for demo breadth. Always rendered with the
// "onder voorbehoud" disclaimer. Never carries sources.
// ---------------------------------------------------------------------

// Shared descriptions, so the same platform is always described identically.
const WP_AER48 = {
  brand: "WP",
  type: "XACT-USD AER",
  diameterMm: 48,
  springType: "lucht" as const,
  adjustment: "Compressie, rebound",
};
const WP_XACT_SHOCK = {
  brand: "WP",
  type: "XACT monoshock met linkage",
  adjustment: "Compressie, rebound",
};
const AIR_NOTE = "Luchtvork: de luchtdruk moet passen bij je rijgewicht.";

const WP_XPLOR48 = {
  brand: "WP",
  type: "XPLOR USD",
  diameterMm: 48,
  springType: "veer" as const,
  adjustment: "Compressie, rebound",
};
const WP_PDS_SHOCK = {
  brand: "WP",
  type: "XPLOR PDS monoshock, zonder linkage",
  adjustment: "Compressie (high- & low-speed), rebound",
};
const WP_XACT_CC48 = {
  brand: "WP",
  type: "XACT-USD gesloten cartridge",
  diameterMm: 48,
  springType: "veer" as const,
  adjustment: "Compressie, rebound",
};
const PDS_NOTE =
  "Deze generatie heeft een PDS-achterbrug zonder linkage. Vanaf modeljaar 2024 heeft de EXC-lijn wel een linkage.";

const KYB_SSS = {
  brand: "KYB",
  type: "Speed Sensitive System (SSS)",
  springType: "veer" as const,
  adjustment: "Volledig instelbaar",
};
const KYB_MX_SHOCK = {
  brand: "KYB",
  type: "Monoshock met linkage",
  adjustment: "Volledig instelbaar",
};

const SHOWA_MX49 = {
  brand: "Showa",
  type: "USD",
  diameterMm: 49,
  springType: "veer" as const,
  adjustment: "Volledig instelbaar",
};

export const unverifiedBikes: Bike[] = [
  // ---------------- MX — KTM ----------------
  { category: "mx", make: "KTM", model: "125 SX", yearFrom: 2023, yearTo: 2027,
    fork: WP_AER48, shock: WP_XACT_SHOCK, notes: AIR_NOTE, verified: false },
  { category: "mx", make: "KTM", model: "250 SX", yearFrom: 2023, yearTo: 2027,
    fork: WP_AER48, shock: WP_XACT_SHOCK, notes: AIR_NOTE, verified: false },
  { category: "mx", make: "KTM", model: "250 SX-F", yearFrom: 2023, yearTo: 2027,
    fork: WP_AER48, shock: WP_XACT_SHOCK, notes: AIR_NOTE, verified: false },
  { category: "mx", make: "KTM", model: "350 SX-F", yearFrom: 2023, yearTo: 2027,
    fork: WP_AER48, shock: WP_XACT_SHOCK, notes: AIR_NOTE, verified: false },
  { category: "mx", make: "KTM", model: "450 SX-F", yearFrom: 2023, yearTo: 2025,
    fork: WP_AER48, shock: WP_XACT_SHOCK, notes: AIR_NOTE, verified: false },

  // ---------------- MX — Husqvarna ----------------
  { category: "mx", make: "Husqvarna", model: "TC 125", yearFrom: 2023, yearTo: 2027,
    fork: WP_AER48, shock: WP_XACT_SHOCK, notes: AIR_NOTE, verified: false },
  { category: "mx", make: "Husqvarna", model: "TC 250", yearFrom: 2023, yearTo: 2027,
    fork: WP_AER48, shock: WP_XACT_SHOCK, notes: AIR_NOTE, verified: false },
  { category: "mx", make: "Husqvarna", model: "FC 250", yearFrom: 2023, yearTo: 2027,
    fork: WP_AER48, shock: WP_XACT_SHOCK, notes: AIR_NOTE, verified: false },
  { category: "mx", make: "Husqvarna", model: "FC 350", yearFrom: 2023, yearTo: 2027,
    fork: WP_AER48, shock: WP_XACT_SHOCK, notes: AIR_NOTE, verified: false },
  { category: "mx", make: "Husqvarna", model: "FC 450", yearFrom: 2023, yearTo: 2027,
    fork: WP_AER48, shock: WP_XACT_SHOCK, notes: AIR_NOTE, verified: false },

  // ---------------- MX — GasGas ----------------
  { category: "mx", make: "GasGas", model: "MC 125", yearFrom: 2023, yearTo: 2027,
    fork: WP_AER48, shock: WP_XACT_SHOCK, notes: AIR_NOTE, verified: false },
  { category: "mx", make: "GasGas", model: "MC 250F", yearFrom: 2023, yearTo: 2027,
    fork: WP_AER48, shock: WP_XACT_SHOCK, notes: AIR_NOTE, verified: false },
  { category: "mx", make: "GasGas", model: "MC 450F", yearFrom: 2023, yearTo: 2027,
    fork: WP_AER48, shock: WP_XACT_SHOCK, notes: AIR_NOTE, verified: false },

  // ---------------- MX — Yamaha ----------------
  { category: "mx", make: "Yamaha", model: "YZ125", yearFrom: 2022, yearTo: 2027,
    fork: KYB_SSS, shock: KYB_MX_SHOCK, verified: false },
  { category: "mx", make: "Yamaha", model: "YZ250", yearFrom: 2022, yearTo: 2027,
    fork: KYB_SSS, shock: KYB_MX_SHOCK, verified: false },
  { category: "mx", make: "Yamaha", model: "YZ250F", yearFrom: 2024, yearTo: 2027,
    fork: { ...KYB_SSS, diameterMm: 48 }, shock: KYB_MX_SHOCK, verified: false },
  { category: "mx", make: "Yamaha", model: "YZ450F", yearFrom: 2023, yearTo: 2025,
    fork: { ...KYB_SSS, diameterMm: 48 }, shock: KYB_MX_SHOCK, verified: false },

  // ---------------- MX — Honda ----------------
  { category: "mx", make: "Honda", model: "CRF250R", yearFrom: 2022, yearTo: 2027,
    fork: SHOWA_MX49, shock: { brand: "Showa", type: "Pro-Link monoshock", adjustment: "Volledig instelbaar" },
    verified: false },
  { category: "mx", make: "Honda", model: "CRF450R", yearFrom: 2021, yearTo: 2024,
    fork: SHOWA_MX49, shock: { brand: "Showa", type: "Pro-Link monoshock", adjustment: "Volledig instelbaar" },
    notes: "Let op: de Works Edition (CRF450RWE) heeft eigen veringsinstellingen.", verified: false },

  // ---------------- MX — Kawasaki ----------------
  { category: "mx", make: "Kawasaki", model: "KX250", yearFrom: 2021, yearTo: 2027,
    fork: { brand: "Showa", type: "USD", springType: "veer", adjustment: "Volledig instelbaar" },
    shock: { brand: "Showa", type: "Uni-Trak monoshock", adjustment: "Volledig instelbaar" }, verified: false },
  { category: "mx", make: "Kawasaki", model: "KX450", yearFrom: 2021, yearTo: 2027,
    fork: { brand: "Showa", type: "USD", diameterMm: 49, springType: "veer", adjustment: "Volledig instelbaar" },
    shock: { brand: "Showa", type: "Uni-Trak monoshock", adjustment: "Volledig instelbaar" }, verified: false },

  // ---------------- MX — Suzuki ----------------
  { category: "mx", make: "Suzuki", model: "RM-Z250", yearFrom: 2019, yearTo: 2024,
    fork: SHOWA_MX49, shock: { brand: "Showa", type: "Monoshock met linkage", adjustment: "Volledig instelbaar" },
    verified: false },
  { category: "mx", make: "Suzuki", model: "RM-Z450", yearFrom: 2018, yearTo: 2024,
    fork: SHOWA_MX49,
    shock: { brand: "Showa", type: "Balance Free Rear Cushion lite (BFRC-lite) monoshock", adjustment: "Volledig instelbaar" },
    verified: false },

  // ---------------- Enduro — KTM ----------------
  { category: "enduro", make: "KTM", model: "250 EXC", yearFrom: 2020, yearTo: 2023,
    fork: WP_XPLOR48, shock: WP_PDS_SHOCK, notes: PDS_NOTE, verified: false },
  { category: "enduro", make: "KTM", model: "300 EXC", yearFrom: 2020, yearTo: 2023,
    fork: WP_XPLOR48, shock: WP_PDS_SHOCK, notes: PDS_NOTE, verified: false },
  { category: "enduro", make: "KTM", model: "350 EXC-F", yearFrom: 2020, yearTo: 2023,
    fork: WP_XPLOR48, shock: WP_PDS_SHOCK, notes: PDS_NOTE, verified: false },
  { category: "enduro", make: "KTM", model: "300 EXC", yearFrom: 2024, yearTo: 2027,
    fork: WP_XACT_CC48, shock: WP_XACT_SHOCK, verified: false },
  { category: "enduro", make: "KTM", model: "350 EXC-F", yearFrom: 2024, yearTo: 2027,
    fork: WP_XACT_CC48, shock: WP_XACT_SHOCK, verified: false },
  { category: "enduro", make: "KTM", model: "500 EXC-F", yearFrom: 2024, yearTo: 2027,
    fork: WP_XACT_CC48, shock: WP_XACT_SHOCK, verified: false },

  // ---------------- Enduro — Husqvarna ----------------
  { category: "enduro", make: "Husqvarna", model: "TE 300", yearFrom: 2020, yearTo: 2023,
    fork: WP_XPLOR48, shock: WP_PDS_SHOCK, notes: PDS_NOTE, verified: false },
  { category: "enduro", make: "Husqvarna", model: "FE 350", yearFrom: 2020, yearTo: 2023,
    fork: WP_XPLOR48, shock: WP_PDS_SHOCK, notes: PDS_NOTE, verified: false },
  { category: "enduro", make: "Husqvarna", model: "TE 300", yearFrom: 2024, yearTo: 2027,
    fork: WP_XACT_CC48, shock: WP_XACT_SHOCK, verified: false },
  { category: "enduro", make: "Husqvarna", model: "FE 350", yearFrom: 2024, yearTo: 2027,
    fork: WP_XACT_CC48, shock: WP_XACT_SHOCK, verified: false },
  { category: "enduro", make: "Husqvarna", model: "FE 501", yearFrom: 2024, yearTo: 2027,
    fork: WP_XACT_CC48, shock: WP_XACT_SHOCK, verified: false },

  // ---------------- Enduro — Beta ----------------
  { category: "enduro", make: "Beta", model: "RR 300 2T", yearFrom: 2020, yearTo: 2024,
    fork: { brand: "KYB", type: "USD gesloten cartridge", diameterMm: 48, springType: "veer",
            adjustment: "Compressie, rebound" },
    shock: { brand: "Sachs", type: "Monoshock met linkage", adjustment: "Voorspanning, compressie, rebound" },
    verified: false },
  { category: "enduro", make: "Beta", model: "RR 350 4T", yearFrom: 2020, yearTo: 2024,
    fork: { brand: "KYB", type: "USD gesloten cartridge", diameterMm: 48, springType: "veer",
            adjustment: "Compressie, rebound" },
    shock: { brand: "Sachs", type: "Monoshock met linkage", adjustment: "Voorspanning, compressie, rebound" },
    verified: false },

  // ---------------- Enduro — Sherco ----------------
  { category: "enduro", make: "Sherco", model: "SE 300 Factory", yearFrom: 2020, yearTo: 2024,
    fork: { brand: "KYB", type: "USD gesloten cartridge", diameterMm: 48, springType: "veer",
            adjustment: "Compressie, rebound" },
    shock: { brand: "KYB", type: "Monoshock met linkage", adjustment: "Voorspanning, compressie, rebound" },
    notes: "Factory-uitvoering. Op andere uitvoeringen kan een ander merk vering zitten.", verified: false },
  { category: "enduro", make: "Sherco", model: "SEF 450 Factory", yearFrom: 2020, yearTo: 2024,
    fork: { brand: "KYB", type: "USD gesloten cartridge", diameterMm: 48, springType: "veer",
            adjustment: "Compressie, rebound" },
    shock: { brand: "KYB", type: "Monoshock met linkage", adjustment: "Voorspanning, compressie, rebound" },
    notes: "Factory-uitvoering. Op andere uitvoeringen kan een ander merk vering zitten.", verified: false },

  // ---------------- Supermoto ----------------
  { category: "supermoto", make: "KTM", model: "450 SMR", yearFrom: 2021, yearTo: 2024,
    fork: WP_AER48, shock: WP_XACT_SHOCK, notes: AIR_NOTE, verified: false },
  { category: "supermoto", make: "Husqvarna", model: "FS 450", yearFrom: 2020, yearTo: 2024,
    fork: WP_AER48, shock: WP_XACT_SHOCK, notes: AIR_NOTE, verified: false },
  { category: "supermoto", make: "KTM", model: "690 SMC R", yearFrom: 2019, yearTo: 2027,
    fork: { brand: "WP", type: "APEX USD", diameterMm: 48, springType: "veer", adjustment: "Compressie, rebound" },
    shock: { brand: "WP", type: "APEX monoshock", adjustment: "Voorspanning, compressie, rebound" },
    verified: false },
  { category: "supermoto", make: "Husqvarna", model: "701 Supermoto", yearFrom: 2019, yearTo: 2027,
    fork: { brand: "WP", type: "APEX USD", diameterMm: 48, springType: "veer", adjustment: "Compressie, rebound" },
    shock: { brand: "WP", type: "APEX monoshock", adjustment: "Voorspanning, compressie, rebound" },
    verified: false },

  // ---------------- Wegmotoren — Yamaha ----------------
  { category: "road", make: "Yamaha", model: "MT-07", yearFrom: 2014, yearTo: 2024,
    fork: { brand: "KYB", type: "Telescopische vork", diameterMm: 41 },
    shock: { brand: "KYB", type: "Monoshock met linkage", adjustment: "Voorspanning, rebound" },
    notes: "Deze generatie heeft een gewone telescoopvork. Vanaf modeljaar 2025 zit er een upside-down vork op.",
    verified: false },
  { category: "road", make: "Yamaha", model: "MT-09", yearFrom: 2021, yearTo: 2027,
    fork: { brand: "KYB", type: "USD", diameterMm: 41, springType: "veer", adjustment: "Voorspanning, compressie, rebound" },
    shock: { brand: "KYB", type: "Monoshock met linkage", adjustment: "Voorspanning, rebound" },
    verified: false },
  { category: "road", make: "Yamaha", model: "Tracer 9", yearFrom: 2021, yearTo: 2027,
    fork: { brand: "KYB", type: "USD", diameterMm: 41, springType: "veer" },
    shock: { brand: "KYB", type: "Monoshock met linkage" },
    notes: "GT+-uitvoeringen hebben elektronisch geregelde vering; die stel je anders af.", verified: false },
  { category: "road", make: "Yamaha", model: "MT-03", yearFrom: 2020, yearTo: 2027,
    fork: { brand: "KYB", type: "USD", diameterMm: 37, springType: "veer" },
    shock: { brand: "KYB", type: "Monoshock met linkage", adjustment: "Voorspanning" },
    verified: false },
  { category: "road", make: "Yamaha", model: "Ténéré 700", yearFrom: 2019, yearTo: 2027,
    fork: { brand: "KYB", type: "USD", diameterMm: 43, springType: "veer", adjustment: "Voorspanning, compressie, rebound" },
    shock: { brand: "KYB", type: "Monoshock met linkage", adjustment: "Voorspanning, rebound" },
    verified: false },
  { category: "road", make: "Yamaha", model: "YZF-R1", yearFrom: 2015, yearTo: 2027,
    fork: { brand: "KYB", type: "USD", diameterMm: 43, springType: "veer", adjustment: "Volledig instelbaar" },
    shock: { brand: "KYB", type: "Monoshock met linkage", adjustment: "Volledig instelbaar" },
    notes: "De R1M heeft semi-actieve Öhlins-vering en valt hier buiten.", verified: false },

  // ---------------- Wegmotoren — Honda ----------------
  { category: "road", make: "Honda", model: "CB650R", yearFrom: 2019, yearTo: 2027,
    fork: { brand: "Showa", type: "SFF-BP USD (Separate Function Big Piston)", diameterMm: 41, springType: "veer" },
    shock: { brand: "Showa", type: "Monoshock met linkage", adjustment: "Voorspanning" },
    verified: false },
  { category: "road", make: "Honda", model: "CB500F", yearFrom: 2019, yearTo: 2027,
    fork: { brand: "Showa", type: "SFF-BP USD (Separate Function Big Piston)", diameterMm: 41, springType: "veer" },
    shock: { brand: "Showa", type: "Monoshock met linkage", adjustment: "Voorspanning" },
    verified: false },
  { category: "road", make: "Honda", model: "CRF1100L Africa Twin", yearFrom: 2020, yearTo: 2027,
    fork: { brand: "Showa", type: "USD", diameterMm: 45, springType: "veer", adjustment: "Voorspanning, compressie, rebound" },
    shock: { brand: "Showa", type: "Pro-Link monoshock", adjustment: "Voorspanning, compressie, rebound" },
    notes: "Uitvoeringen met elektronisch geregelde vering (Showa EERA) stel je via het scherm af.", verified: false },

  // ---------------- Wegmotoren — Suzuki ----------------
  { category: "road", make: "Suzuki", model: "GSX-R1000R", yearFrom: 2017, yearTo: 2024,
    fork: { brand: "Showa", type: "Balance Free Front Fork (BFF)", diameterMm: 43, springType: "veer",
            adjustment: "Volledig instelbaar" },
    shock: { brand: "Showa", type: "Balance Free Rear Cushion lite (BFRC-lite)", adjustment: "Volledig instelbaar" },
    notes: "Geldt voor de R-uitvoering. De standaard GSX-R1000 heeft een andere vork.", verified: false },

  // ---------------- Wegmotoren — KTM ----------------
  { category: "road", make: "KTM", model: "390 Duke", yearFrom: 2017, yearTo: 2023,
    fork: { brand: "WP", type: "APEX USD", diameterMm: 43, springType: "veer" },
    shock: { brand: "WP", type: "APEX monoshock", adjustment: "Voorspanning" },
    verified: false },
  { category: "road", make: "KTM", model: "890 Duke R", yearFrom: 2020, yearTo: 2024,
    fork: { brand: "WP", type: "APEX USD", diameterMm: 43, springType: "veer", adjustment: "Compressie, rebound" },
    shock: { brand: "WP", type: "APEX monoshock", adjustment: "Voorspanning, rebound" },
    verified: false },
  { category: "road", make: "KTM", model: "1290 Super Duke R", yearFrom: 2020, yearTo: 2027,
    fork: { brand: "WP", type: "APEX USD", diameterMm: 48, springType: "veer", adjustment: "Compressie, rebound" },
    shock: { brand: "WP", type: "APEX monoshock", adjustment: "Voorspanning, compressie, rebound" },
    notes: "EVO-uitvoeringen hebben semi-actieve vering en worden elektronisch geregeld.", verified: false },

  // ---------------- Wegmotoren — BMW ----------------
  { category: "road", make: "BMW", model: "R 1250 GS", yearFrom: 2019, yearTo: 2023,
    fork: { brand: "BMW", type: "Telelever met centrale veerpoot" },
    shock: { brand: "BMW", type: "Paralever met centrale veerpoot",
             adjustment: "Afhankelijk van de uitvoering handmatig of elektronisch (Dynamic ESA)" },
    notes: "Een Telelever werkt anders dan een gewone voorvork; revisie en afstelling verlopen ook anders.",
    verified: false },

  // ---------------- Wegmotoren — Triumph ----------------
  { category: "road", make: "Triumph", model: "Street Triple 765 RS", yearFrom: 2020, yearTo: 2022,
    fork: { brand: "Showa", type: "Big Piston Fork (BPF) USD", diameterMm: 41, springType: "veer",
            adjustment: "Volledig instelbaar" },
    shock: { brand: "Öhlins", type: "STX40 monoshock met linkage", adjustment: "Volledig instelbaar" },
    notes: "Geldt voor de RS-uitvoering. R- en S-uitvoeringen hebben andere vering.", verified: false },
];

// Everything the Vering-check searches through.
export const bikes: Bike[] = [...verifiedBikes, ...unverifiedBikes];
