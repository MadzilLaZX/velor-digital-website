import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "accent" | "coming-soon";
}) {
  const tones = {
    default: "border-hairline bg-white/[0.03] text-muted",
    accent: "border-accent/30 bg-accent/10 text-accent-soft",
    "coming-soon": "border-hairline bg-graphite text-muted-2",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
