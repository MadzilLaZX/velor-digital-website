import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionReveal } from "@/components/ui/section-reveal";
import { WorkPreview } from "@/components/sections/work-preview";
import { CtaBand } from "@/components/sections/cta-band";
import { jsonLdScriptProps, breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies from Velor Digital: premium websites, booking systems, automations, and dashboards built for service businesses in Ottawa and Ontario.",
  alternates: { canonical: "/work" },
  openGraph: { url: `${siteConfig.url}/work` },
};

export default function WorkPage() {
  return (
    <>
      <script
        {...jsonLdScriptProps(
          breadcrumbSchema([
            { name: "Home", url: siteConfig.url },
            { name: "Work", url: `${siteConfig.url}/work` },
          ])
        )}
      />
      <section className="relative px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
        <div className="mx-auto max-w-4xl text-center">
          <SectionReveal className="flex flex-col items-center gap-5">
            <Eyebrow>Work</Eyebrow>
            <h1 className="text-balance font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">
              <span className="silver-text">Real businesses,</span>{" "}
              <span className="accent-text">real systems.</span>
            </h1>
            <p className="max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
              If this is what we build for ourselves, imagine what we build for your
              business.
            </p>
          </SectionReveal>
        </div>
      </section>

      <WorkPreview showAll />
      <CtaBand />
    </>
  );
}
