import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionReveal } from "@/components/ui/section-reveal";
import { TestimonialsPreview } from "@/components/sections/testimonials-preview";
import { CtaBand } from "@/components/sections/cta-band";
import { jsonLdScriptProps, breadcrumbSchema, reviewSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "What Velor Digital clients say about working with us on websites, booking systems, automations, and marketing.",
  alternates: { canonical: "/testimonials" },
  openGraph: { url: `${siteConfig.url}/testimonials` },
};

export default function TestimonialsPage() {
  return (
    <>
      <script {...jsonLdScriptProps(reviewSchema())} />
      <script
        {...jsonLdScriptProps(
          breadcrumbSchema([
            { name: "Home", url: siteConfig.url },
            { name: "Testimonials", url: `${siteConfig.url}/testimonials` },
          ])
        )}
      />
      <section className="relative px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
        <div className="mx-auto max-w-4xl text-center">
          <SectionReveal className="flex flex-col items-center gap-5">
            <Eyebrow>Testimonials</Eyebrow>
            <h1 className="text-balance font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">
              <span className="silver-text">What it&rsquo;s like to</span>{" "}
              <span className="accent-text">work with Velor.</span>
            </h1>
          </SectionReveal>
        </div>
      </section>

      <TestimonialsPreview showAll />
      <CtaBand />
    </>
  );
}
