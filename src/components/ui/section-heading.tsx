import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionReveal } from "@/components/ui/section-reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <SectionReveal
      className={cn(
        "flex max-w-2xl flex-col gap-5",
        align === "center" && "mx-auto items-center text-center",
        className
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-balance font-display text-4xl font-medium leading-[1.08] tracking-tight text-foreground sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="text-balance text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      )}
    </SectionReveal>
  );
}
