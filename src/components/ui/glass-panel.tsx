import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

/**
 * Double-bezel panel: an outer shell with a hairline ring, and an inner core
 * with a concentric radius so surfaces read as machined hardware, not flat divs.
 */
export function GlassPanel({
  children,
  className,
  innerClassName,
  as: Component = "div",
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  as?: ElementType;
  glow?: boolean;
}) {
  return (
    <Component
      className={cn(
        "group/panel relative rounded-[1.75rem] border border-hairline bg-white/[0.02] p-1.5",
        glow && "shadow-[0_0_60px_-15px_var(--accent-glow)]",
        className
      )}
    >
      <div
        className={cn(
          "relative h-full w-full rounded-[calc(1.75rem-0.375rem)] border border-white/[0.06] bg-surface/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
          innerClassName
        )}
      >
        {children}
      </div>
    </Component>
  );
}
