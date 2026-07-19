import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionReveal } from "@/components/ui/section-reveal";
import { BookingForm } from "@/components/sections/booking-form";
import { jsonLdScriptProps, breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";
import { CalendarClock, Clock, Video } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a Strategy Call",
  description:
    "Book a strategy call with Velor Digital. Approximately 45–60 minutes to map out the right website, automation, or digital department engagement for your business.",
  alternates: { canonical: "/book" },
  openGraph: { url: `${siteConfig.url}/book` },
};

const details = [
  { icon: Clock, label: "Approximately 45–60 minutes" },
  { icon: Video, label: "Online video meeting, link sent after booking" },
  { icon: CalendarClock, label: "Flexible scheduling, Ottawa & ET time zone" },
];

export default function BookPage() {
  return (
    <>
      <script
        {...jsonLdScriptProps(
          breadcrumbSchema([
            { name: "Home", url: siteConfig.url },
            { name: "Book a Strategy Call", url: `${siteConfig.url}/book` },
          ])
        )}
      />
      <section className="relative px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
        <div className="mx-auto max-w-3xl text-center">
          <SectionReveal className="flex flex-col items-center gap-5">
            <Eyebrow>Book a Strategy Call</Eyebrow>
            <h1 className="text-balance font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">
              <span className="silver-text">Let&rsquo;s map out</span>{" "}
              <span className="accent-text">your system.</span>
            </h1>
            <p className="max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
              Tell us about your business below. We&rsquo;ll follow up to confirm a time and
              come prepared with a plan.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted-2">
              {details.map((d) => (
                <span key={d.label} className="inline-flex items-center gap-2">
                  <d.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {d.label}
                </span>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="relative px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <BookingForm />
        </div>
      </section>
    </>
  );
}
