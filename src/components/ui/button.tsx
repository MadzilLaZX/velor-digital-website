"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type MouseEvent, useRef } from "react";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  icon?: boolean;
  magnetic?: boolean;
};

type ButtonAsLink = BaseProps & {
  href: string;
  onClick?: never;
  type?: never;
};

type ButtonAsButton = BaseProps & {
  href?: never;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
};

const base =
  "focus-ring group relative inline-flex items-center gap-3 rounded-full font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]";

const variants = {
  primary:
    "bg-gradient-to-b from-[#e9fbf7] to-[#b9ece1] text-[#04120f] shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_18px_40px_-16px_var(--accent-glow)] hover:shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_22px_50px_-14px_var(--accent-glow)]",
  secondary:
    "border border-hairline-strong bg-white/[0.03] text-foreground hover:bg-white/[0.06] hover:border-white/20",
  ghost: "text-muted hover:text-foreground",
};

const sizes = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-[15px]",
};

function useMagnetic(enabled: boolean) {
  const ref = useRef<HTMLElement | null>(null);

  const onMouseMove = (e: MouseEvent) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
  };

  const onMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0px, 0px)";
  };

  return { ref, onMouseMove, onMouseLeave };
}

const IconNub = () => (
  <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105">
    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
  </span>
);

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const {
    children,
    className,
    variant = "primary",
    size = "md",
    icon = true,
    magnetic = false,
  } = props;
  const { ref, onMouseMove, onMouseLeave } = useMagnetic(magnetic);
  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    icon && variant !== "ghost" && "pr-2",
    className
  );

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        onMouseMove={onMouseMove as (e: MouseEvent<HTMLAnchorElement>) => void}
        onMouseLeave={onMouseLeave}
        className={classes}
      >
        <span>{children}</span>
        {icon && variant !== "ghost" && <IconNub />}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      ref={ref as React.Ref<HTMLButtonElement>}
      onMouseMove={onMouseMove as (e: MouseEvent<HTMLButtonElement>) => void}
      onMouseLeave={onMouseLeave}
      className={classes}
    >
      <span>{children}</span>
      {icon && variant !== "ghost" && <IconNub />}
    </button>
  );
}
