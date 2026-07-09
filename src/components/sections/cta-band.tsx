import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/ui/section-reveal";

export function CtaBand({
  title = "Ready to see what Velor can build for you?",
  description = "Book a strategy call and we'll map out the right system for your business — no obligation.",
  primary = { label: "Book a Strategy Call", href: "/book" },
  secondary = { label: "View our work", href: "/work" },
}: {
  title?: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="relative px-4 pb-24 sm:px-6 lg:pb-32">
      <div className="mx-auto max-w-5xl">
        <SectionReveal className="relative overflow-hidden rounded-[2rem] border border-hairline bg-gradient-to-b from-white/[0.04] to-transparent px-8 py-16 text-center sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-56 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[100px]"
          />
          <h2 className="relative text-balance font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-balance text-sm leading-relaxed text-muted sm:text-base">
            {description}
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={primary.href} size="lg" magnetic>
              {primary.label}
            </Button>
            <Button href={secondary.href} size="lg" variant="secondary">
              {secondary.label}
            </Button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
