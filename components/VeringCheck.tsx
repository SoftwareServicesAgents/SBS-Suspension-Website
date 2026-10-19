"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Combobox } from "@/components/Combobox";
import { SpecCard, SpecCardManual } from "@/components/SpecCard";
import { Button, CompressCta } from "@/components/ui";
import { contact, veringCheck } from "@/content/site";
import type { Bike } from "@/data/bikes";
import { describeFork, describeShock, findBike, getMakes, getModels, getYears, type UiCategory } from "@/lib/bikes";
import { LABELS, leadSchema, scoreLead, type Lead, type LeadInput } from "@/lib/lead";
import { newId, saveLead } from "@/lib/lead-store";

const t = veringCheck;
const TOTAL_STEPS = 6;

type Step = 0 | 1 | 2 | 3 | 4 | 5;
type Niveau = LeadInput["niveau"];
type Uren = LeadInput["uren"];
type Doel = LeadInput["doel"];
type Wanneer = LeadInput["wanneer"];

// ---------------------------------------------------------------------
// Small shared controls
// ---------------------------------------------------------------------

function OptionGroup<T extends string>({
  legend,
  hint,
  options,
  value,
  onChange,
  columns = 1,
}: {
  legend: string;
  hint?: string;
  options: readonly { id: string; label: string; omschrijving?: string }[];
  value: T | null;
  onChange: (value: T) => void;
  columns?: 1 | 2;
}) {
  return (
    <fieldset>
      <legend className="font-display text-xl font-semibold tracking-wide text-paper sm:text-2xl">
        {legend}
      </legend>
      {hint && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
      <div className={`mt-4 grid gap-2 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.id as T)}
              className={`group flex w-full items-center gap-3 rounded-xs border px-4 py-3.5 text-left transition-colors ${
                selected
                  ? "border-accent bg-accent/10"
                  : "border-line bg-ink-raised hover:border-muted/60"
              }`}
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 h-3 w-3 shrink-0 border transition-colors ${
                  selected ? "border-accent bg-accent" : "border-muted/70 bg-transparent"
                }`}
              />
              <span className="min-w-0">
                <span className="block text-base font-medium text-paper">{option.label}</span>
                {option.omschrijving && (
                  <span className="mt-0.5 block text-sm text-muted">{option.omschrijving}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function WeightSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const { gewichtMin: min, gewichtMax: max } = t.stapVragen;
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor="rijgewicht"
          className="font-display text-xl font-semibold tracking-wide text-paper sm:text-2xl"
        >
          {t.stapVragen.gewichtLabel}
        </label>
        <output htmlFor="rijgewicht" className="tabular font-display text-3xl font-semibold text-accent">
          {value}
          <span className="ml-1 text-base text-muted">{t.stapVragen.gewichtEenheid}</span>
        </output>
      </div>
      <p className="mt-1.5 text-sm text-muted">{t.stapVragen.gewichtHulp}</p>

      <input
        id="rijgewicht"
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-xs bg-line outline-offset-4 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-xs [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-accent [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-xs [&::-webkit-slider-thumb]:bg-accent"
        style={{
          background: `linear-gradient(to right, var(--color-accent) ${pct}%, var(--color-line) ${pct}%)`,
        }}
      />
      <div className="tabular mt-2 flex justify-between text-xs text-muted">
        <span>
          {min} {t.stapVragen.gewichtEenheid}
        </span>
        <span>
          {max} {t.stapVragen.gewichtEenheid}
        </span>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  children: ReactNodeLike;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="spec-label">
        {label}
        {optional && <span className="ml-2 normal-case opacity-70">({t.stapContact.optioneel})</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-hot">
          {error}
        </p>
      )}
    </div>
  );
}

type ReactNodeLike = React.ReactNode;

const INPUT_CLASS =
  "w-full rounded-xs border border-line bg-ink-raised px-4 py-3.5 text-base text-paper outline-none transition-colors placeholder:text-muted/70 hover:border-muted/60 focus:border-accent";

// ---------------------------------------------------------------------
// The tool
// ---------------------------------------------------------------------

export function VeringCheck() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const [step, setStep] = useState<Step>(0);

  // Step 1 — bike identification
  const [categorie, setCategorie] = useState<UiCategory | null>(null);
  const [merk, setMerk] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [bouwjaar, setBouwjaar] = useState<string | null>(null);
  const [manual, setManual] = useState(false);
  const [manualMerk, setManualMerk] = useState("");
  const [manualModel, setManualModel] = useState("");
  const [manualBouwjaar, setManualBouwjaar] = useState("");

  // Step 4 — qualifying
  const [gewicht, setGewicht] = useState(t.stapVragen.gewichtStandaard);
  const [niveau, setNiveau] = useState<Niveau | null>(null);
  const [uren, setUren] = useState<Uren | null>(null);
  const [doel, setDoel] = useState<Doel | null>(null);
  const [wanneer, setWanneer] = useState<Wanneer | null>(null);

  // Step 5 — contact
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [savedLead, setSavedLead] = useState<Lead | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const makes = useMemo(() => (categorie ? getMakes(categorie) : []), [categorie]);
  const models = useMemo(
    () => (categorie && merk ? getModels(categorie, merk) : []),
    [categorie, merk],
  );
  const years = useMemo(
    () => (categorie && merk && model ? getYears(categorie, merk, model).map(String) : []),
    [categorie, merk, model],
  );

  const bike: Bike | undefined = useMemo(() => {
    if (manual || !categorie || !merk || !model || !bouwjaar) return undefined;
    return findBike(categorie, merk, model, Number(bouwjaar));
  }, [manual, categorie, merk, model, bouwjaar]);

  const bikeTitle = manual
    ? [manualMerk, manualModel, manualBouwjaar].filter(Boolean).join(" ")
    : [merk, model, bouwjaar].filter(Boolean).join(" ");

  const bikeComplete = manual
    ? manualMerk.trim().length > 0 && manualModel.trim().length > 0
    : Boolean(merk && model && bouwjaar);

  const questionsComplete = Boolean(niveau && uren && doel && wanneer);

  // Keep the active step in view when it changes on a phone.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.5) {
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, [step, reduce]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(id);
  }, [toast]);

  const reset = useCallback(() => {
    setStep(0);
    setCategorie(null);
    setMerk(null);
    setModel(null);
    setBouwjaar(null);
    setManual(false);
    setManualMerk("");
    setManualModel("");
    setManualBouwjaar("");
    setGewicht(t.stapVragen.gewichtStandaard);
    setNiveau(null);
    setUren(null);
    setDoel(null);
    setWanneer(null);
    setNaam("");
    setEmail("");
    setTelefoon("");
    setConsent(false);
    setErrors({});
    setSavedLead(null);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const payload = {
      naam,
      email,
      telefoon,
      consent,
      motor: {
        categorie: categorie ?? "mx",
        merk: manual ? manualMerk : (merk ?? ""),
        model: manual ? manualModel : (model ?? ""),
        bouwjaar: manual ? manualBouwjaar : (bouwjaar ?? ""),
        handmatig: manual,
        vork: bike ? describeFork(bike) : "",
        demper: bike ? describeShock(bike) : "",
        geverifieerd: bike?.verified ?? false,
      },
      gewichtKg: gewicht,
      niveau: niveau!,
      uren: uren!,
      doel: doel!,
      wanneer: wanneer!,
      website: honeypot,
    };

    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const { score, punten } = scoreLead(parsed.data);
    const lead: Lead = {
      ...parsed.data,
      id: newId(),
      createdAt: new Date().toISOString(),
      score,
      scorePunten: punten,
    };

    // Demo mode is the default: the lead is kept in this browser so the
    // flow and the /leads dashboard work with no accounts and no network.
    saveLead(lead);

    // The API route only does something when Resend is configured. It must
    // never be able to block or break the demo, so it is time-boxed and
    // every failure falls back to demo mode.
    let mode: "demo" | "email" = "demo";
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const json = (await res.json()) as { mode?: "demo" | "email" };
        if (json.mode === "email") mode = "email";
      }
    } catch {
      /* offline or route unavailable — demo mode stands */
    }

    setSavedLead(lead);
    setSubmitting(false);
    setToast(mode === "email" ? t.toastVerstuurd : t.toastDemo);
    setStep(5);
  }

  const motionProps = reduce
    ? {}
    : {
        initial: { opacity: 0, x: 12 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -12 },
        transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div ref={rootRef} className="scroll-mt-24">
      {/* Progress -------------------------------------------------- */}
      <div className="mb-6">
        <div className="mb-2 flex items-baseline justify-between">
          <p className="spec-label">
            {t.voortgang.voor} {step + 1} {t.voortgang.tussen} {TOTAL_STEPS}
          </p>
          {step > 0 && step < 5 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1) as Step)}
              className="font-display text-sm tracking-wide text-muted uppercase transition-colors hover:text-paper"
            >
              ← {t.terug}
            </button>
          )}
        </div>
        <div
          className="h-0.5 w-full bg-line"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-valuenow={step + 1}
          aria-label={`${t.voortgang.voor} ${step + 1} ${t.voortgang.tussen} ${TOTAL_STEPS}`}
        >
          <motion.div
            className="h-full bg-accent"
            initial={false}
            animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {/* ---------------- Step 1: category ---------------- */}
        {step === 0 && (
          <motion.div key="cat" {...motionProps}>
            <OptionGroup
              legend={t.stapCategorie.titel}
              hint={t.stapCategorie.hulp}
              options={t.stapCategorie.opties}
              value={categorie}
              onChange={(v: UiCategory) => {
                setCategorie(v);
                setMerk(null);
                setModel(null);
                setBouwjaar(null);
                setStep(1);
              }}
            />
          </motion.div>
        )}

        {/* ---------------- Step 2: make / model / year ---------------- */}
        {step === 1 && (
          <motion.div key="bike" {...motionProps}>
            <h3 className="font-display text-xl font-semibold tracking-wide text-paper sm:text-2xl">
              {manual ? t.stapMotor.handmatigTitel : t.stapMotor.titel}
            </h3>
            <p className="mt-1.5 text-sm text-muted">
              {manual ? t.stapMotor.handmatigHulp : t.stapMotor.hulp}
            </p>

            {manual ? (
              <div className="mt-5 grid gap-4">
                <Field id="m-merk" label={t.stapMotor.handmatigMerk}>
                  <input
                    id="m-merk"
                    className={INPUT_CLASS}
                    value={manualMerk}
                    onChange={(e) => setManualMerk(e.target.value)}
                    autoComplete="off"
                  />
                </Field>
                <Field id="m-model" label={t.stapMotor.handmatigModel}>
                  <input
                    id="m-model"
                    className={INPUT_CLASS}
                    value={manualModel}
                    onChange={(e) => setManualModel(e.target.value)}
                    autoComplete="off"
                  />
                </Field>
                <Field id="m-jaar" label={t.stapMotor.handmatigBouwjaar}>
                  <input
                    id="m-jaar"
                    className={`${INPUT_CLASS} tabular`}
                    inputMode="numeric"
                    value={manualBouwjaar}
                    onChange={(e) => setManualBouwjaar(e.target.value)}
                    autoComplete="off"
                  />
                </Field>
                <button
                  type="button"
                  onClick={() => setManual(false)}
                  className="justify-self-start text-sm text-accent underline underline-offset-4 hover:text-paper"
                >
                  {t.stapMotor.handmatigTerug}
                </button>
              </div>
            ) : (
              <div className="mt-5 grid gap-4">
                <Combobox
                  label={t.stapMotor.merkLabel}
                  placeholder={t.stapMotor.merkPlaceholder}
                  options={makes}
                  value={merk}
                  emptyText={t.stapMotor.geenResultaat}
                  onChange={(v) => {
                    setMerk(v);
                    setModel(null);
                    setBouwjaar(null);
                  }}
                />
                <Combobox
                  label={t.stapMotor.modelLabel}
                  placeholder={t.stapMotor.modelPlaceholder}
                  options={models}
                  value={model}
                  disabled={!merk}
                  disabledHint={t.stapMotor.kiesEerstMerk}
                  emptyText={t.stapMotor.geenResultaat}
                  onChange={(v) => {
                    setModel(v);
                    setBouwjaar(null);
                  }}
                />
                <Combobox
                  label={t.stapMotor.bouwjaarLabel}
                  placeholder={t.stapMotor.bouwjaarPlaceholder}
                  options={years}
                  value={bouwjaar}
                  disabled={!model}
                  disabledHint={t.stapMotor.kiesEerstModel}
                  emptyText={t.stapMotor.geenResultaat}
                  onChange={setBouwjaar}
                />

                <div className="rule mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 text-sm">
                  <span className="text-muted">{t.stapMotor.nietGevondenVraag}</span>
                  <button
                    type="button"
                    onClick={() => setManual(true)}
                    className="text-accent underline underline-offset-4 hover:text-paper"
                  >
                    {t.stapMotor.nietGevondenKnop}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-7">
              <CompressCta onClick={() => setStep(2)} disabled={!bikeComplete}>
                {t.volgende}
              </CompressCta>
            </div>
          </motion.div>
        )}

        {/* ---------------- Step 3: instant result ---------------- */}
        {step === 2 && (
          <motion.div key="specs" {...motionProps}>
            <h3 className="font-display text-xl font-semibold tracking-wide text-paper sm:text-2xl">
              {t.stapSpecs.titel}
            </h3>

            <div className="mt-5">
              {bike ? (
                <SpecCard bike={bike} title={bikeTitle} />
              ) : (
                <SpecCardManual title={bikeTitle} />
              )}
            </div>

            <p className="mt-3 text-xs text-muted">{t.stapSpecs.prijsRegel}</p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <CompressCta onClick={() => setStep(3)}>{t.stapSpecs.doorgaan}</CompressCta>
              <span className="text-sm text-muted">{t.stapSpecs.doorgaanHulp}</span>
            </div>
          </motion.div>
        )}

        {/* ---------------- Step 4: qualifying ---------------- */}
        {step === 3 && (
          <motion.div key="vragen" {...motionProps} className="space-y-8">
            <WeightSlider value={gewicht} onChange={setGewicht} />

            <div className="rule pt-8">
              <OptionGroup
                legend={t.stapVragen.niveauLabel}
                options={t.stapVragen.niveauOpties}
                value={niveau}
                onChange={setNiveau}
                columns={2}
              />
            </div>

            <div className="rule pt-8">
              <OptionGroup
                legend={t.stapVragen.urenLabel}
                hint={t.stapVragen.urenHulp}
                options={t.stapVragen.urenOpties}
                value={uren}
                onChange={setUren}
              />
            </div>

            <div className="rule pt-8">
              <OptionGroup
                legend={t.stapVragen.doelLabel}
                options={t.stapVragen.doelOpties}
                value={doel}
                onChange={setDoel}
                columns={2}
              />
            </div>

            <div className="rule pt-8">
              <OptionGroup
                legend={t.stapVragen.wanneerLabel}
                options={t.stapVragen.wanneerOpties}
                value={wanneer}
                onChange={setWanneer}
                columns={2}
              />
            </div>

            <div className="rule pt-8">
              <CompressCta onClick={() => setStep(4)} disabled={!questionsComplete}>
                {t.volgende}
              </CompressCta>
            </div>
          </motion.div>
        )}

        {/* ---------------- Step 5: gated contact form ---------------- */}
        {step === 4 && (
          <motion.div key="contact" {...motionProps}>
            <h3 className="font-display text-2xl font-semibold tracking-wide text-paper sm:text-3xl">
              {t.stapContact.titel}
            </h3>
            <p className="mt-3 text-sm text-muted-strong">{t.stapContact.uitleg}</p>
            <ul className="mt-3 space-y-1.5">
              {t.stapContact.belofte.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted-strong">
                  <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <form className="mt-7 grid gap-5" onSubmit={submit} noValidate>
              {/* Honeypot: visually hidden and skipped by assistive tech. */}
              <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <Field id="naam" label={t.stapContact.naamLabel} error={errors.naam}>
                <input
                  id="naam"
                  className={INPUT_CLASS}
                  value={naam}
                  onChange={(e) => setNaam(e.target.value)}
                  placeholder={t.stapContact.naamPlaceholder}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.naam)}
                  aria-describedby={errors.naam ? "naam-error" : undefined}
                />
              </Field>

              <Field id="email" label={t.stapContact.emailLabel} error={errors.email}>
                <input
                  id="email"
                  type="email"
                  className={INPUT_CLASS}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.stapContact.emailPlaceholder}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </Field>

              <Field
                id="telefoon"
                label={t.stapContact.telefoonLabel}
                hint={t.stapContact.telefoonHulp}
                optional
                error={errors.telefoon}
              >
                <input
                  id="telefoon"
                  type="tel"
                  inputMode="tel"
                  className={`${INPUT_CLASS} tabular`}
                  value={telefoon}
                  onChange={(e) => setTelefoon(e.target.value)}
                  placeholder={t.stapContact.telefoonPlaceholder}
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.telefoon)}
                  aria-describedby={errors.telefoon ? "telefoon-error" : undefined}
                />
              </Field>

              <div className="rule pt-5">
                <div className="flex items-start gap-3">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-xs border border-muted/70 bg-ink-raised transition-colors checked:border-accent checked:bg-accent"
                  />
                  <label htmlFor="consent" className="text-sm leading-relaxed text-muted-strong">
                    {t.stapContact.consentTekst}{" "}
                    <Link
                      href={t.stapContact.consentLinkHref}
                      className="text-accent underline underline-offset-4 hover:text-paper"
                    >
                      {t.stapContact.consentLinkLabel}
                    </Link>
                    .
                  </label>
                </div>
                {errors.consent && (
                  <p id="consent-error" role="alert" className="mt-2 text-xs text-hot">
                    {errors.consent}
                  </p>
                )}
              </div>

              {errors.form && (
                <p role="alert" className="text-sm text-hot">
                  {errors.form}
                </p>
              )}

              <div className="mt-1">
                <CompressCta type="submit" disabled={submitting}>
                  {submitting ? t.stapContact.versturenBezig : t.stapContact.versturen}
                </CompressCta>
              </div>
            </form>
          </motion.div>
        )}

        {/* ---------------- Step 6: confirmation ---------------- */}
        {step === 5 && savedLead && (
          <motion.div key="klaar" {...motionProps}>
            <Confirmation lead={savedLead} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast ----------------------------------------------------- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            role="status"
            aria-live="polite"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-x-4 bottom-4 z-50 mx-auto w-fit max-w-[calc(100vw-2rem)] rounded-xs border border-accent/50 bg-ink-raised px-4 py-3 text-sm text-paper shadow-2xl shadow-black/70"
          >
            <span className="mr-2 inline-block h-2 w-2 bg-accent align-middle" aria-hidden="true" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------
// Confirmation screen
// ---------------------------------------------------------------------

function Confirmation({ lead, onReset }: { lead: Lead; onReset: () => void }) {
  const L = t.stapKlaar.labels;
  const waUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappBericht)}`;

  const rows: { label: string; value: string }[] = [
    { label: L.motor, value: [lead.motor.merk, lead.motor.model, lead.motor.bouwjaar].filter(Boolean).join(" ") },
    ...(lead.motor.vork ? [{ label: L.vork, value: lead.motor.vork }] : []),
    ...(lead.motor.demper ? [{ label: L.demper, value: lead.motor.demper }] : []),
    { label: L.gewicht, value: `${lead.gewichtKg} kg` },
    { label: L.niveau, value: LABELS.niveau[lead.niveau] },
    { label: L.uren, value: LABELS.uren[lead.uren] },
    { label: L.doel, value: LABELS.doel[lead.doel] },
    { label: L.wanneer, value: LABELS.wanneer[lead.wanneer] },
    { label: L.naam, value: lead.naam },
    { label: L.email, value: lead.email },
    ...(lead.telefoon ? [{ label: L.telefoon, value: lead.telefoon }] : []),
  ];

  return (
    <div>
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="mt-2.5 h-2.5 w-2.5 shrink-0 bg-accent" />
        <h3 className="font-display text-2xl font-semibold tracking-wide text-paper sm:text-3xl">
          {t.stapKlaar.titel}
        </h3>
      </div>

      <p className="mt-3 text-base text-muted-strong">
        {t.stapKlaar.reactieZin.replace("{reactietijd}", t.stapKlaar.reactietijd)}
      </p>

      <div className="mt-7 rounded-sm border border-line bg-ink-raised">
        <p className="spec-label border-b border-line px-4 py-3 sm:px-5">
          {t.stapKlaar.samenvattingTitel}
        </p>
        <dl className="px-4 py-1 sm:px-5">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-4 border-t border-line-soft py-2.5 first:border-t-0"
            >
              <dt className="spec-label shrink-0">{row.label}</dt>
              <dd className="tabular text-right text-sm break-words text-paper">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-7 text-sm text-muted-strong">{t.stapKlaar.haast}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <CompressCta href={`tel:${contact.telefoonLink}`}>{t.stapKlaar.belKnop}</CompressCta>
        {contact.whatsappAan && (
          <Button
            variant="secondary"
            onClick={() => window.open(waUrl, "_blank", "noopener,noreferrer")}
          >
            {t.stapKlaar.whatsappKnop}
          </Button>
        )}
        <Button variant="quiet" onClick={onReset}>
          {t.stapKlaar.opnieuwKnop}
        </Button>
      </div>
    </div>
  );
}
