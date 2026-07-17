import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Workflow,
  Megaphone,
  Users,
  CalendarCheck2,
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

const roles = [
  { icon: Globe, label: "Website designer" },
  { icon: Workflow, label: "Automation builder" },
  { icon: Users, label: "CRM operator" },
  { icon: Megaphone, label: "Marketing manager" },
  { icon: CalendarCheck2, label: "Booking platform lead" },
  { icon: Sparkles, label: "AI systems lead" },
  { icon: LayoutDashboard, label: "Dashboard engineer" },
  { icon: ShieldCheck, label: "Digital strategist" },
];

export function DigitalDepartment() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(63,217,199,0.08),transparent_70%)]"
      />
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-accent/20 bg-gradient-to-b from-white/[0.04] to-transparent p-8 sm:p-12 lg:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-[100px]"
          />
          <div className="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <SectionReveal className="flex flex-col gap-6">
              <Eyebrow>The main differentiator</Eyebrow>
              <h2 className="text-balance font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl">
                Instead of hiring an internal
                <span className="accent-text"> digital department</span>, hire ours.
              </h2>
              <p className="max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
                Your website designer, automation builder, CRM operator, marketing manager,
                and digital strategist — under one team. No hiring, no onboarding, no gaps
                in coverage.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/book?service=Digital%20Department" size="lg">
                  Hire the Department
                </Button>
                <Button href="/services#digital-department" variant="secondary" size="lg">
                  See what&rsquo;s included
                </Button>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.15} className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <div
                  key={role.label}
                  className="hover-glow flex flex-col gap-3 rounded-2xl border border-hairline bg-black/30 p-4 backdrop-blur-sm transition-colors duration-500 hover:border-accent/30"
                >
                  <role.icon className="h-4 w-4 text-accent-soft" strokeWidth={1.5} />
                  <span className="text-[13px] leading-tight text-foreground">{role.label}</span>
                </div>
              ))}
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
