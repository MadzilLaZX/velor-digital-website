import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function BentoCard({
  children,
  className,
  span = "sm",
}: {
  children: ReactNode;
  className?: string;
  span?: "lg" | "md" | "sm";
}) {
  const spans = {
    lg: "md:col-span-8 md:row-span-2",
    md: "md:col-span-4 md:row-span-2",
    sm: "md:col-span-4 md:row-span-1",
  };
  return (
    <div
      className={cn(
        "col-span-1 rounded-[1.75rem] border border-hairline bg-white/[0.02] p-6 transition-colors duration-500 hover:border-white/[0.14] hover:bg-white/[0.035] sm:p-8",
        spans[span],
        className
      )}
    >
      {children}
    </div>
  );
}
