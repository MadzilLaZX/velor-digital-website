import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
  dot = true,
}: {
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-hairline bg-white/[0.03] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-muted",
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent-glow)]" />}
      {children}
    </span>
  );
}
