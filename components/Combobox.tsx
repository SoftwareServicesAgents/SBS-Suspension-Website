"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

type Props = {
  label: string;
  placeholder: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  disabledHint?: string;
  emptyText: string;
};

/**
 * Searchable single-select following the ARIA combobox (listbox popup)
 * pattern. Typing filters on a plain substring match, so "450" turns up
 * every 450 in the list regardless of where the digits sit in the name.
 */
export function Combobox({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled,
  disabledHint,
  emptyText,
}: Props) {
  const id = useId();
  const listboxId = `${id}-listbox`;
  const hintId = `${id}-hint`;

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [rawActiveIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // While the list is closed the input mirrors the selection; while it is
  // open it holds whatever the rider is typing.
  const inputValue = open ? query : (value ?? "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !open) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query, open]);

  // Clamp during render rather than in an effect: typing shortens the list,
  // and the highlight must never point past the last remaining option.
  const activeIndex = Math.min(rawActiveIndex, Math.max(0, filtered.length - 1));

  // Close when focus or a click leaves the component.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the highlighted option in view during keyboard navigation.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function openList(initialQuery = "") {
    if (disabled) return;
    setQuery(initialQuery);
    setOpen(true);
    const index = value ? Math.max(0, options.indexOf(value)) : 0;
    setActiveIndex(index);
  }

  function select(option: string) {
    onChange(option);
    setOpen(false);
    setQuery("");
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        openList();
        return;
      }
      if (filtered.length === 0) return;
      const delta = e.key === "ArrowDown" ? 1 : -1;
      // Based on the clamped index, so a shortened list still steps correctly.
      setActiveIndex((activeIndex + delta + filtered.length) % filtered.length);
      return;
    }

    if (e.key === "Home" && open) {
      e.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (e.key === "End" && open) {
      e.preventDefault();
      setActiveIndex(Math.max(0, filtered.length - 1));
      return;
    }

    if (e.key === "Enter") {
      if (open && filtered[activeIndex]) {
        e.preventDefault();
        select(filtered[activeIndex]);
      }
      return;
    }

    if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
        setQuery("");
      }
      return;
    }

    if (e.key === "Tab" && open) {
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div className="flex flex-col gap-2" ref={rootRef}>
      <label htmlFor={id} className="spec-label">
        {label}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={open && filtered[activeIndex] ? `${id}-opt-${activeIndex}` : undefined}
          aria-describedby={disabled && disabledHint ? hintId : undefined}
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          placeholder={disabled && disabledHint ? disabledHint : placeholder}
          value={inputValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => openList()}
          onClick={() => !open && openList()}
          onKeyDown={onKeyDown}
          className="w-full rounded-xs border border-line bg-ink-raised px-4 py-3.5 pr-10 text-base text-paper outline-none transition-colors placeholder:text-muted/70 hover:border-muted/60 focus:border-accent disabled:cursor-not-allowed disabled:border-line-soft disabled:text-muted/60"
        />

        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>

        {/* The listbox stays mounted but empty when closed, so the id in
            aria-controls always resolves. */}
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={label}
          hidden={!open}
          className="absolute top-[calc(100%+4px)] right-0 left-0 z-30 max-h-64 overflow-y-auto rounded-xs border border-line bg-ink-raised py-1 shadow-2xl shadow-black/60"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-sm text-muted">{emptyText}</li>
          ) : (
            filtered.map((option, i) => {
              const isActive = i === activeIndex;
              return (
                <li
                  key={option}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={option === value}
                  data-active={isActive}
                  // Pointer-down would blur the input before the click lands.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(option)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`cursor-pointer px-4 py-2.5 text-base ${
                    isActive ? "bg-accent text-accent-ink" : "text-paper"
                  } ${option === value && !isActive ? "text-accent" : ""}`}
                >
                  {option}
                </li>
              );
            })
          )}
        </ul>
      </div>

      {disabled && disabledHint && (
        <p id={hintId} className="text-xs text-muted">
          {disabledHint}
        </p>
      )}
    </div>
  );
}
