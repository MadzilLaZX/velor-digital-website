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
        "w-full rounded-2xl border border-hairline bg-white/[0.02] p-4 sm:max-w-[300px]",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => canGoPrev && setViewMonth(new Date(year, month - 1, 1))}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="hover-glow focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-hairline text-muted transition-colors duration-300 hover:border-white/20 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <span className="text-[13px] font-medium text-foreground">
          {viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <button
          type="button"
          onClick={() => setViewMonth(new Date(year, month + 1, 1))}
          aria-label="Next month"
          className="hover-glow focus-ring flex h-8 w-8 items-center justify-center rounded-full border border-hairline text-muted transition-colors duration-300 hover:border-white/20 hover:text-foreground"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] text-muted-2">
        {WEEKDAY_LABELS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <span key={`blank-${i}`} />;
          const disabled = date < minSelectable;
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
                "hover-glow focus-ring flex h-9 items-center justify-center rounded-lg text-[13px] transition-colors duration-200",
                disabled
                  ? "pointer-events-none cursor-not-allowed text-muted-2/40"
                  : "cursor-pointer text-foreground hover:bg-white/[0.06]",
                selected &&
                  "bg-accent text-[#04120f] shadow-[0_0_20px_-4px_var(--accent-glow)] hover:bg-accent"
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
