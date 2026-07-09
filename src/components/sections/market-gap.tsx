import { SectionHeading } from "@/components/ui/section-heading";
import { SectionReveal } from "@/components/ui/section-reveal";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Search, Workflow, CalendarClock, LineChart } from "lucide-react";

const steps = [
  {
    icon: Search,
    label: "Bring leads in",
    detail: "SEO-ready pages and campaigns that get found.",
  },
  {
    icon: Workflow,
    label: "Organize them",
    detail: "A CRM that tracks every lead automatically.",
  },
  {
    icon: CalendarClock,
    label: "Follow up & book",
    detail: "Automated confirmations and scheduling.",
  },
  {
    icon: LineChart,
    label: "Track & grow",
    detail: "Dashboards that show what's actually working.",
  },
];

export function MarketGap() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow="The market gap"
            title={
              <>
                Most businesses don&rsquo;t need
                <span className="text-muted"> just a website.</span>
              </>
            }
            description="They need a system that brings leads in, organizes them, follows up, books them, tracks them, and helps the business grow. A website alone is a brochure. Velor builds the engine behind it."
          />

          <SectionReveal delay={0.1}>
            <GlassPanel className="p-2">
              <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-hairline sm:grid-cols-2">
                {steps.map((step, i) => (
                  <div key={step.label} className="flex flex-col gap-3 bg-surface p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-white/[0.03] font-mono text-xs text-accent-soft">
                        0{i + 1}
                      </span>
                      <step.icon className="h-4 w-4 text-muted" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-medium text-foreground">{step.label}</p>
                    <p className="text-[13px] leading-relaxed text-muted">{step.detail}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
