export type ServiceTier = {
  slug: string;
  name: string;
  eyebrow: string;
  positioning: string;
  bestFor: string;
  features: string[];
  featured?: boolean;
};

export const serviceTiers: ServiceTier[] = [
  {
    slug: "foundation",
    name: "Foundation",
    eyebrow: "Tier 01",
    positioning: "For businesses that need a premium online identity.",
    bestFor: "Best for businesses launching or rebuilding their web presence.",
    features: [
      "Premium website design",
      "Responsive development",
      "SEO-ready structure",
      "Google indexing setup",
      "Contact & lead forms",
      "Analytics integration",
      "Brand polish",
    ],
  },
  {
    slug: "operations",
    name: "Operations",
    eyebrow: "Tier 02",
    positioning: "For businesses that want their workflow to run smoother.",
    bestFor: "Best for businesses drowning in manual booking and admin work.",
    features: [
      "Booking systems",
      "CRM setup",
      "Email & SMS confirmations",
      "Google Sheets or Supabase workflows",
      "Admin dashboards",
      "n8n automations",
      "Internal process systems",
    ],
  },
  {
    slug: "marketing-manager",
    name: "Marketing Manager",
    eyebrow: "Tier 03",
    positioning:
      "For businesses that want an outsourced marketing manager without hiring in-house.",
    bestFor: "Best for businesses ready to grow but not ready to hire a full team.",
    features: [
      "Website support",
      "Landing pages",
      "Meta & Google ad support",
      "Campaign setup",
      "Conversion tracking",
      "Monthly reporting",
      "Strategy calls",
      "Content direction",
      "Performance optimization",
    ],
  },
  {
    slug: "digital-department",
    name: "Digital Department",
    eyebrow: "Tier 04 — Flagship",
    positioning: "Instead of hiring an internal digital department, hire ours.",
    bestFor: "Best for businesses that want one team accountable for everything digital.",
    features: [
      "Website",
      "Automations",
      "Marketing",
      "CRM",
      "Booking platform",
      "AI features",
      "Velor OS access",
      "Dashboards",
      "Ongoing development",
      "Priority support",
      "Custom integrations",
    ],
    featured: true,
  },
];
