import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/data/work";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function WorkPreview({ showAll = false }: { showAll?: boolean }) {
  const items = showAll ? caseStudies : caseStudies.slice(0, 4);
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:py-32" id="work">
      <div className="mx-auto max-w-6xl">
        {!showAll && (
          <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Work"
              title="Real businesses, real systems."
              description="A look at what Velor has built for service businesses across the region."
            />
            <Button href="/work" variant="secondary" size="md" className="shrink-0">
              View all work
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {items.map((study, i) => (
            <SectionReveal key={study.slug} delay={i * 0.08}>
              <Link
                href={`/work/${study.slug}`}
                className="group focus-ring relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-hairline bg-white/[0.02] p-6 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/[0.14] hover:bg-white/[0.035] sm:p-7"
              >
                <div
                  aria-hidden
                  className="mb-6 flex h-48 items-center justify-center overflow-hidden rounded-2xl border border-hairline"
                  style={{
                    background: `linear-gradient(135deg, ${study.color}22, transparent 70%), radial-gradient(circle at 30% 20%, ${study.color}33, transparent 60%)`,
                  }}
                >
                  {study.logo ? (
                    <Image
                      src={study.logo}
                      alt={study.client}
                      width={320}
                      height={320}
                      className="max-h-40 w-auto max-w-[94%] object-contain sm:max-h-44"
                    />
                  ) : (
                    <span
                      className="font-display text-3xl font-medium tracking-tight opacity-80"
                      style={{ color: study.color }}
                    >
                      {study.client
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </span>
                  )}
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  {study.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
                <h3 className="font-display text-xl font-medium text-foreground">
                  {study.client}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{study.tagline}</p>

                <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-soft">
                  View case study
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.75}
                  />
                </span>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
