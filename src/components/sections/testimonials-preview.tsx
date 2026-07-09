import { Star } from "lucide-react";
import { testimonials } from "@/lib/data/testimonials";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionReveal } from "@/components/ui/section-reveal";
import { cn } from "@/lib/utils";

export function TestimonialsPreview({ showAll = false }: { showAll?: boolean }) {
  const items = showAll ? testimonials : testimonials.slice(0, 3);
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {!showAll && (
          <SectionHeading
            eyebrow="Testimonials"
            title="What it's like to work with Velor."
            align="center"
            className="mx-auto mb-14"
          />
        )}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map((t, i) => (
            <SectionReveal key={t.author + i} delay={i * 0.08}>
              <div
                className={cn(
                  "flex h-full flex-col justify-between rounded-[1.75rem] border p-6 sm:p-7",
                  t.placeholder
                    ? "border-dashed border-hairline-strong bg-transparent"
                    : "border-hairline bg-white/[0.02]"
                )}
              >
                <div>
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={cn(
                          "h-3.5 w-3.5",
                          t.placeholder ? "text-muted-2" : "fill-accent-soft text-accent-soft"
                        )}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <p
                    className={cn(
                      "text-[15px] leading-relaxed",
                      t.placeholder ? "italic text-muted-2" : "text-foreground"
                    )}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 border-t border-hairline pt-4">
                  <p className="text-sm font-medium text-foreground">{t.company}</p>
                  <p className="text-xs text-muted-2">{t.role}</p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
