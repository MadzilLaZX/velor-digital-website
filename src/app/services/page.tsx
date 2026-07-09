import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ServicesGrid } from "@/components/sections/services-grid";
import { DigitalDepartment } from "@/components/sections/digital-department";
import { Faq } from "@/components/sections/faq";
import { CtaBand } from "@/components/sections/cta-band";
import { SectionReveal } from "@/components/ui/section-reveal";
import { jsonLdScriptProps, servicesSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Four ways to work with Velor Digital: Foundation, Operations, Marketing Manager, and Digital Department. Premium websites, automation, CRM, and marketing systems for Ottawa & Ontario service businesses.",
  alternates: { canonical: "/services" },
  openGraph: { url: `${siteConfig.url}/services` },
};

export default function ServicesPage() {
  return (
    <>
      <script {...jsonLdScriptProps(servicesSchema())} />
      <script {...jsonLdScriptProps(faqSchema())} />
      <script
        {...jsonLdScriptProps(
          breadcrumbSchema([
            { name: "Home", url: siteConfig.url },
            { name: "Services", url: `${siteConfig.url}/services` },
          ])
        )}
      />
      <section className="relative px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
        <div className="mx-auto max-w-4xl text-center">
          <SectionReveal className="flex flex-col items-center gap-5">
            <Eyebrow>Services</Eyebrow>
            <h1 className="text-balance font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">
              <span className="silver-text">Four ways to work</span>{" "}
              <span className="accent-text">with Velor.</span>
            </h1>
            <p className="max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
              Every engagement starts with a strategy call. From premium web presence to a
              fully outsourced digital department, we scope the tier that matches where your
              business actually is today.
            </p>
          </SectionReveal>
        </div>
      </section>

      <ServicesGrid showHeading={false} />
      <DigitalDepartment />
      <Faq />
      <CtaBand />
    </>
  );
}
