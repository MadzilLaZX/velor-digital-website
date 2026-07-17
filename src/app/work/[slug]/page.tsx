import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { caseStudies } from "@/lib/data/work";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";
import { SectionReveal } from "@/components/ui/section-reveal";
import { GlassPanel } from "@/components/ui/glass-panel";
import { TestimonialVideo } from "@/components/ui/testimonial-video";
import { CtaBand } from "@/components/sections/cta-band";
import { jsonLdScriptProps, breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) return {};
  return {
    title: study.client,
    description: study.tagline,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: { url: `${siteConfig.url}/work/${study.slug}` },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) notFound();

  const otherStudies = caseStudies.filter((s) => s.slug !== study.slug).slice(0, 2);

  return (
    <>
      <script
        {...jsonLdScriptProps(
          breadcrumbSchema([
            { name: "Home", url: siteConfig.url },
            { name: "Work", url: `${siteConfig.url}/work` },
            { name: study.client, url: `${siteConfig.url}/work/${study.slug}` },
          ])
        )}
      />

      <section className="relative px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/work"
            className="hover-glow-text focus-ring mb-8 inline-flex items-center gap-2 text-[13px] text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
            All work
          </Link>
          <SectionReveal className="flex flex-col gap-5">
            <Eyebrow>Case Study</Eyebrow>
            <h1 className="text-balance font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl">
              {study.client}
            </h1>
            <p className="text-balance text-lg leading-relaxed text-muted">{study.tagline}</p>
            <div className="flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="relative px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <SectionReveal>
            <div
              aria-hidden
              className="mb-14 flex h-64 items-center justify-center overflow-hidden rounded-[1.75rem] border border-hairline sm:h-80"
              style={{
                background: `linear-gradient(135deg, ${study.color}26, transparent 70%), radial-gradient(circle at 25% 20%, ${study.color}3d, transparent 60%)`,
              }}
            >
              {study.logo ? (
                <Image
                  src={study.logo}
                  alt={study.client}
                  width={480}
                  height={480}
                  className="max-h-56 w-auto max-w-[78%] object-contain sm:max-h-72"
                />
              ) : (
                <span
                  className="font-display text-6xl font-medium tracking-tight opacity-80 sm:text-8xl"
                  style={{ color: study.color }}
                >
                  {study.client
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </span>
              )}
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { label: "Problem", body: study.problem },
              { label: "Solution", body: study.solution },
              { label: "Result", body: study.result },
            ].map((block, i) => (
              <SectionReveal key={block.label} delay={i * 0.08}>
                <GlassPanel className="h-full p-2">
                  <div className="flex h-full flex-col gap-3 p-6">
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent-soft">
                      {block.label}
                    </span>
                    <p className="text-[14px] leading-relaxed text-muted">{block.body}</p>
                  </div>
                </GlassPanel>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal delay={0.2} className="mt-10 flex flex-wrap gap-2">
            <span className="text-[12px] uppercase tracking-[0.14em] text-muted-2">
              Services used:
            </span>
            {study.services.map((s) => (
              <Badge key={s} tone="accent">
                {s}
              </Badge>
            ))}
          </SectionReveal>

          {study.video && (
            <SectionReveal delay={0.28} className="mt-14">
              <span className="mb-4 block text-[12px] uppercase tracking-[0.14em] text-muted-2">
                Client testimonial
              </span>
              <TestimonialVideo src={study.video} poster={study.videoPoster} />
            </SectionReveal>
          )}
        </div>
      </section>

      {otherStudies.length > 0 && (
        <section className="relative px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <span className="mb-6 block text-[12px] uppercase tracking-[0.14em] text-muted-2">
              More work
            </span>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {otherStudies.map((s) => (
                <Link
                  key={s.slug}
                  href={`/work/${s.slug}`}
                  className="hover-glow focus-ring group rounded-2xl border border-hairline bg-white/[0.02] p-5 transition-colors duration-300 hover:border-white/[0.14]"
                >
                  <p className="font-display text-lg font-medium text-foreground">{s.client}</p>
                  <p className="mt-1 text-[13px] text-muted">{s.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title={`Want results like ${study.client}?`}
        description="Book a strategy call and we'll map out the right system for your business."
      />
    </>
  );
}
