import Link from "next/link";
import { Check } from "lucide-react";
import { serviceTiers } from "@/lib/data/services";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ServicesGrid({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:py-32" id="services">
      <div className="mx-auto max-w-6xl">
        {showHeading && (
          <SectionHeading
            eyebrow="Services"
            title="Four ways to work with Velor."
            description="Every engagement starts with a strategy call. From there, we scope the tier that matches where your business actually is."
            className="mb-14"
          />
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {serviceTiers.map((tier, i) => (
            <SectionReveal key={tier.slug} delay={i * 0.08} className="h-full">
              <div
                id={tier.slug}
                className={cn(
                  "group relative flex h-full scroll-mt-32 flex-col rounded-[1.75rem] border p-6 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:p-7",
                  tier.featured
                    ? "border-accent/30 bg-gradient-to-b from-accent/[0.08] to-transparent shadow-[0_0_60px_-20px_var(--accent-glow)]"
                    : "border-hairline bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.035]"
                )}
              >
                <span className="font-mono text-[11px] tracking-wide text-muted-2">
                  {tier.eyebrow}
                </span>
                <h3 className="mt-3 font-display text-2xl font-medium text-foreground">
                  {tier.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{tier.positioning}</p>

                <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                  {tier.features.slice(0, 6).map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-[13px] text-muted">
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-soft"
                        strokeWidth={2}
                      />
                      {feature}
                    </li>
                  ))}
                  {tier.features.length > 6 && (
                    <li className="pl-6 text-[13px] text-muted-2">
                      +{tier.features.length - 6} more
                    </li>
                  )}
                </ul>

                <p className="mt-6 text-[12px] italic text-muted-2">{tier.bestFor}</p>

                <div className="mt-6">
                  <Button
                    href={`/book?service=${encodeURIComponent(tier.name)}`}
                    variant={tier.featured ? "primary" : "secondary"}
                    size="md"
                    className="w-full justify-center"
                  >
                    {tier.featured ? "Hire the Department" : `Start with ${tier.name}`}
                  </Button>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-2">
          Pricing is scoped per project on a{" "}
          <Link href="/book" className="underline decoration-hairline-strong underline-offset-4 hover:text-muted">
            strategy call
          </Link>{" "}
          — every business&rsquo;s starting point is different.
        </p>
      </div>
    </section>
  );
}
