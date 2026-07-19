"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type AvailableSlot = { start: string; end: string; label: string };

export function TimeSlotPicker({
  slots,
  value,
  onChange,
  loading = false,
  disabledMessage,
  className,
}: {
  slots: AvailableSlot[];
  value: string | null | undefined;
  onChange: (slot: string) => void;
  loading?: boolean;
  disabledMessage?: string;
  className?: string;
}) {
  if (loading) {
    return (
      <div className={cn("flex h-32 items-center justify-center gap-2 text-muted-2", className)}>
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
        <span className="text-[13px]">Checking availability…</span>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className={cn("rounded-xl border border-hairline bg-white/[0.02] p-4 text-[13px] text-muted-2", className)}>
        {disabledMessage ?? "No times available for this date. Try another day."}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {slots.map((slot) => {
        const selected = value === slot.label;
        return (
          <button
            key={slot.start}
            type="button"
            onClick={() => onChange(slot.label)}
            aria-pressed={selected}
            className={cn(
              "focus-ring rounded-xl border px-3 py-3 text-[13px] font-medium transition-all duration-200",
              selected
                ? "border-accent/40 bg-accent/15 text-accent-soft shadow-[0_0_16px_-4px_var(--accent-glow)]"
                : "border-hairline bg-white/[0.02] text-muted hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-foreground hover:shadow-[0_0_14px_-4px_var(--accent-glow)]"
            )}
          >
            {slot.label}
          </button>
        );
      })}
    </div>
  );
}
