import { comingSoonProducts } from "@/lib/data/coming-soon";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Badge } from "@/components/ui/badge";

export function ComingSoon() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="What's next"
          title="Coming soon from Velor OS."
          description="New product-grade tools we're building for service businesses — scheduling, AI receptionists, and client-facing portals."
          className="mb-14"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {comingSoonProducts.map((product, i) => {
            const spanClass =
              product.span === "lg"
                ? "md:col-span-7"
                : product.span === "md"
                ? "md:col-span-5"
                : "md:col-span-4";
            return (
              <SectionReveal key={product.name} delay={i * 0.06} className={spanClass}>
                <div className="hover-glow group relative flex h-full min-h-[200px] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-hairline bg-white/[0.02] p-6 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/[0.14] hover:bg-white/[0.035] sm:p-7">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/[0.08] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl font-medium text-foreground sm:text-2xl">
                      {product.name}
                    </h3>
                    <Badge tone="coming-soon" className="shrink-0">
                      Coming Soon
                    </Badge>
                  </div>
                  <p className="relative mt-4 text-[13px] leading-relaxed text-muted">
                    {product.description}
                  </p>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
