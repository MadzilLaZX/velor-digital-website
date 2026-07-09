import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionReveal } from "@/components/ui/section-reveal";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { jsonLdScriptProps, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";
import { generalFaq } from "@/lib/data/faq";
import { Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/social-icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Velor Digital. Email hello@velordigital.com or book a strategy call to discuss your website, automation, or marketing project.",
  alternates: { canonical: "/contact" },
  openGraph: { url: `${siteConfig.url}/contact` },
};

const channels = [
  { icon: Mail, label: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: Phone, label: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}` },
  {
    icon: MapPin,
    label: `${siteConfig.location.city}, ${siteConfig.location.region}`,
    href: null,
  },
];

const socials = [
  { icon: InstagramIcon, label: "Instagram", href: siteConfig.social.instagram },
  { icon: LinkedinIcon, label: "LinkedIn", href: siteConfig.social.linkedin },
];

export default function ContactPage() {
  return (
    <>
      <script {...jsonLdScriptProps(faqSchema(generalFaq))} />
      <script
        {...jsonLdScriptProps(
          breadcrumbSchema([
            { name: "Home", url: siteConfig.url },
            { name: "Contact", url: `${siteConfig.url}/contact` },
          ])
        )}
      />

      <section className="relative px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:pb-24">
        <div className="mx-auto max-w-5xl">
          <SectionReveal className="mb-14 flex flex-col items-center gap-5 text-center">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="text-balance font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl">
              <span className="silver-text">Let&rsquo;s talk about</span>{" "}
              <span className="accent-text">your business.</span>
            </h1>
            <p className="max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
              The fastest way to start is a strategy call. For anything else, reach out
              directly.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
            <SectionReveal>
              <GlassPanel className="h-full p-2" glow>
                <div className="flex h-full flex-col gap-6 p-7 sm:p-9">
                  <h2 className="font-display text-2xl font-medium text-foreground">
                    Reach us directly
                  </h2>
                  <div className="flex flex-col gap-4">
                    {channels.map((channel) => {
                      const content = (
                        <span className="inline-flex items-center gap-3 text-sm text-muted">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-white/[0.03]">
                            <channel.icon className="h-4 w-4 text-accent-soft" strokeWidth={1.5} />
                          </span>
                          {channel.label}
                        </span>
                      );
                      return channel.href ? (
                        <a
                          key={channel.label}
                          href={channel.href}
                          className="focus-ring w-fit transition-colors hover:text-foreground"
                        >
                          {content}
                        </a>
                      ) : (
                        <span key={channel.label}>{content}</span>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 border-t border-hairline pt-6">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.label}
                        className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-muted transition-colors hover:border-white/20 hover:text-foreground"
                      >
                        <s.icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>

                  <div className="mt-auto pt-4">
                    <Button href="/book" size="lg" className="w-full justify-center">
                      Book a Strategy Call
                    </Button>
                  </div>
                </div>
              </GlassPanel>
            </SectionReveal>

            <SectionReveal delay={0.1}>
              <GlassPanel className="h-full p-2">
                <div className="flex h-full flex-col gap-5 p-7 sm:p-9">
                  <h2 className="font-display text-2xl font-medium text-foreground">
                    Frequently asked
                  </h2>
                  <div className="flex flex-col divide-y divide-hairline">
                    {generalFaq.slice(0, 4).map((item) => (
                      <div key={item.question} className="py-4 first:pt-0">
                        <p className="text-sm font-medium text-foreground">{item.question}</p>
                        <p className="mt-2 text-[13px] leading-relaxed text-muted">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/services"
                    className="focus-ring text-[13px] font-medium text-accent-soft underline underline-offset-4"
                  >
                    See the full breakdown on the Services page
                  </Link>
                </div>
              </GlassPanel>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
