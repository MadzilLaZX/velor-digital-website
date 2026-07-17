"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DateCalendar({
  value,
  onChange,
  className,
}: {
  value: string | null | undefined;
  onChange: (isoDate: string) => void;
  className?: string;
}) {
  const today = startOfDay(new Date());
  const minSelectable = new Date(today);
  minSelectable.setDate(minSelectable.getDate() + 1);

  const [viewMonth, setViewMonth] = useState(
    () => new Date(minSelectable.getFullYear(), minSelectable.getMonth(), 1)
  );

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const canGoPrev =
    year * 12 + month > minSelectable.getFullYear() * 12 + minSelectable.getMonth();

  return (
    <div
      className={cn(
        "w-full rounded-[1.75rem] border border-hairline bg-white/[0.02] p-6 sm:max-w-[380px]",
        className
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => canGoPrev && setViewMonth(new Date(year, month - 1, 1))}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-hairline text-muted transition-all duration-300 hover:border-white/20 hover:text-foreground hover:shadow-[0_0_14px_-4px_var(--accent-glow)] disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <span className="font-display text-[17px] font-medium tracking-tight text-foreground">
          {viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <button
          type="button"
          onClick={() => setViewMonth(new Date(year, month + 1, 1))}
          aria-label="Next month"
          className="focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-hairline text-muted transition-all duration-300 hover:border-white/20 hover:text-foreground hover:shadow-[0_0_14px_-4px_var(--accent-glow)]"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="mb-4 grid grid-cols-7 gap-2 border-b border-hairline pb-4 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-muted-2">
        {WEEKDAY_LABELS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2.5">
        {cells.map((date, i) => {
          if (!date) return <span key={`blank-${i}`} />;
          const disabled = date < minSelectable;
          const isToday = date.getTime() === today.getTime();
          const iso = toISODate(date);
          const selected = value === iso;
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iso)}
              aria-pressed={selected}
              className={cn(
                "focus-ring relative flex aspect-square items-center justify-center rounded-full text-[15px] transition-all duration-200",
                disabled
                  ? "pointer-events-none cursor-not-allowed text-muted-2/35"
                  : "cursor-pointer text-foreground hover:bg-white/[0.08] hover:shadow-[0_0_16px_-4px_var(--accent-glow)]",
                isToday &&
                  disabled &&
                  "border border-accent/40 text-accent-soft shadow-[0_0_14px_-3px_var(--accent-glow)]",
                selected &&
                  "bg-accent text-[#04120f] shadow-[0_0_20px_-4px_var(--accent-glow)] hover:bg-accent hover:shadow-[0_0_20px_-4px_var(--accent-glow)]"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
