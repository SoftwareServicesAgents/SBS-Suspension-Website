"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { bedrijf, contact, navigatie } from "@/content/site";

export function Header() {
  const [open, setOpen] = useState(false);

  // Lock the page behind the mobile menu while it is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-18">
        <Link href="/" className="flex items-center gap-3" aria-label={`${bedrijf.naam} — home`}>
          <Image
            src="/logo-sbs.png"
            alt={bedrijf.naam}
            width={252}
            height={88}
            priority
            className="h-8 w-auto lg:h-9"
          />
        </Link>

        <nav aria-label="Hoofdmenu" className="hidden items-center gap-7 lg:flex">
          {navigatie.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-display text-sm font-medium tracking-[0.12em] text-muted-strong uppercase transition-colors hover:text-paper"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${contact.telefoonLink}`}
            className="hidden rounded-xs bg-accent px-4 py-2.5 font-display text-sm font-semibold tracking-wide text-accent-ink uppercase transition-colors hover:bg-paper sm:inline-flex"
          >
            {contact.telefoon}
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobiel-menu"
            className="-mr-2 flex h-11 w-11 items-center justify-center text-paper lg:hidden"
          >
            <span className="sr-only">{open ? "Menu sluiten" : "Menu openen"}</span>
            <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
              <span
                className={`h-px w-full bg-current transition-transform duration-200 ${open ? "translate-y-[6px] rotate-45" : ""}`}
              />
              <span className={`h-px w-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
              <span
                className={`h-px w-full bg-current transition-transform duration-200 ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobiel-menu"
        hidden={!open}
        className="border-t border-line bg-ink lg:hidden"
      >
        <nav aria-label="Mobiel menu" className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
          {navigatie.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-line-soft py-4 font-display text-lg tracking-wide text-paper uppercase last:border-b-0"
            >
              {item.label}
            </a>
          ))}
          <a
            href={`tel:${contact.telefoonLink}`}
            className="tabular mt-3 mb-4 flex items-center justify-center rounded-xs bg-accent px-4 py-3.5 font-display text-base font-semibold tracking-wide text-accent-ink uppercase"
          >
            {contact.telefoon}
          </a>
        </nav>
      </div>
    </header>
  );
}
