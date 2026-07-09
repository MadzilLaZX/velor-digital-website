import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionReveal } from "@/components/ui/section-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { VelorOSSection } from "@/components/sections/velor-os-section";
import { BookingForm } from "@/components/sections/booking-form";
import { GlassPanel } from "@/components/ui/glass-panel";
import { jsonLdScriptProps, breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";
import { ShieldCheck, Sparkles, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Velor OS Beta",
  description:
    "Velor OS is a private beta business operating platform for service companies — client CRM, booking manager, invoicing, files, payments, reports, and automation-ready workflows in one dashboard.",
  alternates: { canonical: "/velor-os" },
  openGraph: { url: `${siteConfig.url}/velor-os` },
};

const pillars = [
  {
    icon: ShieldCheck,
    title: "Built for service businesses",
    body: "Every module — CRM, booking, invoicing — is designed around how service companies actually operate.",
  },
  {
    icon: Zap,
    title: "Automation-ready from day one",
    body: "Connect Velor OS to n8n workflows to automate follow-ups, reminders, and reporting without extra tooling.",
  },
  {
    icon: Sparkles,
    title: "Founding-partner shaped",
    body: "Beta partners help shape the roadmap. Feedback goes directly into what we build next.",
  },
];

export default function VelorOsPage() {
  return (
    <>
      <script
        {...jsonLdScriptProps(
          breadcrumbSchema([
            { name: "Home", url: siteConfig.url },
            { name: "Velor OS Beta", url: `${siteConfig.url}/velor-os` },
          ])
        )}
      />

      <section className="relative px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
        <div className="mx-auto max-w-4xl text-center">
          <SectionReveal className="flex flex-col items-center gap-5">
            <Eyebrow>Private Beta &middot; Velor OS</Eyebrow>
            <h1 className="text-balance font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">
              <span className="silver-text">The operating system for</span>{" "}
              <span className="accent-text">service businesses.</span>
            </h1>
            <p className="max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
              Velor OS is a private beta platform built to help service companies manage
              clients, bookings, invoices, files, payments, reports, team activity, and
              workflows from one clean dashboard.
            </p>
          </SectionReveal>
        </div>
      </section>

      <VelorOSSection compact />

      <section className="relative px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Why the beta"
            title="Shaped by the businesses using it."
            className="mb-14"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {pillars.map((pillar, i) => (
              <SectionReveal key={pillar.title} delay={i * 0.08}>
                <GlassPanel className="h-full p-2">
                  <div className="flex h-full flex-col gap-4 p-6">
                    <pillar.icon className="h-5 w-5 text-accent-soft" strokeWidth={1.5} />
                    <h3 className="font-display text-lg font-medium text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-muted">{pillar.body}</p>
                  </div>
                </GlassPanel>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-6 lg:py-32" id="apply">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            eyebrow="Apply for Beta Access"
            title="Now accepting a small group of founding businesses."
            description="Apply below and mention Velor OS — we'll follow up with access details and onboarding."
            align="center"
            className="mx-auto mb-12"
          />
          <BookingForm defaultService="Velor OS Beta" />
        </div>
      </section>
    </>
  );
}
