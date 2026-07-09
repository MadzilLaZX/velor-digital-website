import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionReveal } from "@/components/ui/section-reveal";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import {
  Users,
  CalendarCheck2,
  Receipt,
  FolderLock,
  Wallet,
  ShieldCheck,
  BarChart3,
  Workflow,
} from "lucide-react";

const features = [
  { icon: Users, label: "Client CRM" },
  { icon: CalendarCheck2, label: "Booking manager" },
  { icon: Receipt, label: "Invoice tracking" },
  { icon: FolderLock, label: "File vault" },
  { icon: Wallet, label: "Payment overview" },
  { icon: ShieldCheck, label: "Team roles" },
  { icon: BarChart3, label: "Reports" },
  { icon: Workflow, label: "Automation-ready workflows" },
];

export function VelorOSSection({ compact = false }: { compact?: boolean }) {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:py-32" id="velor-os">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <SectionReveal className="flex flex-col gap-6">
            <Eyebrow>Private Beta</Eyebrow>
            <h2 className="text-balance font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl">
              Meet <span className="accent-text">Velor OS.</span>
            </h2>
            <p className="max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
              Velor OS is a private beta platform built to help service companies manage
              clients, bookings, invoices, files, payments, reports, team activity, and
              workflows from one clean dashboard.
            </p>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.06] px-4 py-2 text-[13px] text-accent-soft">
              Now accepting a small group of founding businesses.
            </div>
            {!compact && (
              <div>
                <Button href="/velor-os#apply" size="lg">
                  Apply for Beta Access
                </Button>
              </div>
            )}
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <GlassPanel className="p-2" glow>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-hairline sm:grid-cols-4">
                {features.map((feature) => (
                  <div
                    key={feature.label}
                    className="flex flex-col items-start gap-3 bg-surface p-5"
                  >
                    <feature.icon className="h-4 w-4 text-accent-soft" strokeWidth={1.5} />
                    <span className="text-[12px] leading-tight text-muted">{feature.label}</span>
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
