"use client";

import { timeSlotOptions } from "@/lib/validations/booking";
import { cn } from "@/lib/utils";

export function TimeSlotPicker({
  value,
  onChange,
  className,
}: {
  value: string | null | undefined;
  onChange: (slot: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-3 gap-2 sm:grid-cols-4", className)}>
      {timeSlotOptions.map((slot) => {
        const selected = value === slot;
        return (
          <button
            key={slot}
            type="button"
            onClick={() => onChange(slot)}
            aria-pressed={selected}
            className={cn(
              "hover-glow focus-ring rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-colors duration-200",
              selected
                ? "border-accent/40 bg-accent/15 text-accent-soft shadow-[0_0_20px_-6px_var(--accent-glow)]"
                : "border-hairline bg-white/[0.02] text-muted hover:border-white/[0.14] hover:text-foreground"
            )}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}
