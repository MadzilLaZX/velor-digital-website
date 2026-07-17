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
    <div className={cn("grid grid-cols-4 gap-1.5 sm:grid-cols-6", className)}>
      {timeSlotOptions.map((slot) => {
        const selected = value === slot;
        return (
          <button
            key={slot}
            type="button"
            onClick={() => onChange(slot)}
            aria-pressed={selected}
            className={cn(
              "focus-ring rounded-lg border px-2 py-2 text-[12px] font-medium transition-all duration-200",
              selected
                ? "border-accent/40 bg-accent/15 text-accent-soft shadow-[0_0_16px_-4px_var(--accent-glow)]"
                : "border-hairline bg-white/[0.02] text-muted hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-foreground hover:shadow-[0_0_14px_-4px_var(--accent-glow)]"
            )}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}
