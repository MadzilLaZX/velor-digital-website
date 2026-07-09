import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-auto", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="velorMarkGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f5f6" />
          <stop offset="55%" stopColor="#c7c9cd" />
          <stop offset="100%" stopColor="#83868d" />
        </linearGradient>
      </defs>
      <path
        d="M0 2 L18 2 L24 30 L30 2 L48 2 L27.5 38 L20.5 38 Z"
        fill="url(#velorMarkGradient)"
      />
    </svg>
  );
}

export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn("h-4", markClassName)} />
      <span className="font-display text-[15px] font-medium tracking-[0.32em] text-foreground">
        VELOR
      </span>
    </span>
  );
}
