"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GlassPanel } from "@/components/ui/glass-panel";
import {
  Activity,
  Bell,
  CalendarCheck2,
  CircleDollarSign,
  MessagesSquare,
  Users,
} from "lucide-react";

const nodePulse = {
  animate: { opacity: [0.4, 1, 0.4] },
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 sm:pt-16 lg:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_10%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-accent/[0.14] blur-[120px]"
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Eyebrow>Ottawa &middot; Gatineau &middot; Ontario</Eyebrow>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-balance font-display text-[2.6rem] font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          <span className="silver-text">We build businesses</span>
          <br />
          <span className="silver-text">that run </span>
          <span className="accent-text">smoother.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-balance max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        >
          Premium websites, automation systems, booking workflows, marketing engines, and
          business dashboards built for service companies across Ottawa, Gatineau, and
          Ontario.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button href="/book" size="lg" magnetic>
            Book a Strategy Call
          </Button>
          <Button href="/velor-os" size="lg" variant="secondary" magnetic>
            Explore Velor OS
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto mt-20 max-w-5xl"
      >
        <GlassPanel glow className="p-1.5 sm:p-2">
          <div className="relative overflow-hidden rounded-[calc(1.75rem-0.375rem)] p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-hairline pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </div>
              <span className="font-mono text-[11px] tracking-wide text-muted-2">
                velor-os / dashboard
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <StatCard
                icon={<Users className="h-4 w-4" strokeWidth={1.5} />}
                label="Active Clients"
                value="128"
                trend="+12%"
              />
              <StatCard
                icon={<CalendarCheck2 className="h-4 w-4" strokeWidth={1.5} />}
                label="Bookings"
                value="46"
                trend="+8%"
              />
              <StatCard
                icon={<CircleDollarSign className="h-4 w-4" strokeWidth={1.5} />}
                label="Revenue (MTD)"
                value="$38.2k"
                trend="+21%"
              />
              <StatCard
                icon={<Activity className="h-4 w-4" strokeWidth={1.5} />}
                label="Automations"
                value="14 live"
                trend="stable"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-12 sm:gap-4">
              <div className="rounded-2xl border border-hairline bg-white/[0.02] p-4 sm:col-span-7">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-2">
                    Automation Flow
                  </span>
                  <Bell className="h-3.5 w-3.5 text-muted-2" strokeWidth={1.5} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  {["Lead In", "Qualify", "Book", "Confirm", "Follow-up"].map((step, i) => (
                    <div key={step} className="flex flex-1 flex-col items-center gap-2">
                      <motion.span
                        {...nodePulse}
                        transition={{ ...nodePulse.transition, delay: i * 0.4 }}
                        className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent-glow)]"
                      />
                      <span className="text-center text-[10px] leading-tight text-muted-2">
                        {step}
                      </span>
                      {i < 4 && (
                        <span className="absolute mt-1 hidden h-px w-full translate-x-[60%] bg-hairline-strong sm:block" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 h-16 w-full rounded-lg bg-gradient-to-t from-accent/[0.12] to-transparent">
                  <svg viewBox="0 0 300 60" className="h-full w-full" preserveAspectRatio="none">
                    <polyline
                      points="0,45 40,38 80,42 120,20 160,28 200,12 240,18 300,4"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:col-span-5">
                <div className="rounded-2xl border border-hairline bg-white/[0.02] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <MessagesSquare className="h-3.5 w-3.5 text-accent-soft" strokeWidth={1.5} />
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-2">
                      Booking Card
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">Mobile Detail — Sedan</p>
                  <p className="mt-1 text-xs text-muted">Tomorrow, 10:30 AM &middot; Bay 2</p>
                  <div className="mt-3 inline-flex items-center rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-accent-soft">
                    Confirmed
                  </div>
                </div>
                <div className="rounded-2xl border border-hairline bg-white/[0.02] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-accent-soft" strokeWidth={1.5} />
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-2">
                      New Lead
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">J. Renaud &middot; Gatineau</p>
                  <p className="mt-1 text-xs text-muted">Interested in: Operations tier</p>
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>

        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-10 -bottom-16 h-32 bg-gradient-to-t from-background to-transparent"
        />
      </motion.div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-white/[0.02] p-3.5 sm:p-4">
      <div className="mb-3 flex items-center justify-between text-muted-2">
        {icon}
        <span className="font-mono text-[10px] text-accent-soft">{trend}</span>
      </div>
      <p className="font-mono text-lg font-medium text-foreground sm:text-xl">{value}</p>
      <p className="mt-0.5 text-[11px] text-muted-2">{label}</p>
    </div>
  );
}
