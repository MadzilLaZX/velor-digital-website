export const siteConfig = {
  name: "Velor Digital",
  shortName: "Velor",
  url: "https://velordigital.com",
  ogImage: "/opengraph-image",
  description:
    "Velor Digital builds premium websites, automation systems, booking workflows, marketing engines, and business dashboards for service companies across Ottawa, Gatineau, and Ontario.",
  tagline: "We build businesses that run smoother.",
  positioning:
    "If this is what we build for ourselves, imagine what we build for your business.",
  email: "hello@velordigital.com",
  phone: "+1 (613) 555-0142",
  location: {
    city: "Ottawa",
    region: "ON",
    country: "CA",
    areaServed: ["Ottawa", "Gatineau", "Kanata", "Nepean", "Orleans", "Ontario"],
  },
  social: {
    instagram: "https://instagram.com/velordigital",
    linkedin: "https://linkedin.com/company/velordigital",
  },
  nav: [
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "Velor OS", href: "/velor-os" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ],
  ctaPrimary: { label: "Book a Strategy Call", href: "/book" },
  ctaSecondary: { label: "Explore Velor OS", href: "/velor-os" },
  keywords: [
    "Ottawa web design",
    "Ottawa website development",
    "Ottawa automation agency",
    "Ontario business automation",
    "Gatineau web design",
    "CRM setup Ottawa",
    "booking system for service businesses",
    "marketing manager Ottawa",
    "digital agency Ottawa",
    "AI automation Ontario",
    "Velor OS beta",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
