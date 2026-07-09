import { siteConfig } from "@/lib/site-config";
import { serviceTiers } from "@/lib/data/services";
import { testimonials } from "@/lib/data/testimonials";
import { generalFaq } from "@/lib/data/faq";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/velor-mark.png`,
    description: siteConfig.description,
    email: siteConfig.email,
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.country,
    },
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    image: `${siteConfig.url}/brand/velor-mark.png`,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.country,
    },
    areaServed: siteConfig.location.areaServed.map((name) => ({
      "@type": "City",
      name,
    })),
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
  };
}

export function servicesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: serviceTiers.map((tier, index) => ({
      "@type": "Service",
      position: index + 1,
      name: tier.name,
      description: tier.positioning,
      provider: { "@id": `${siteConfig.url}/#organization` },
      areaServed: "Ontario, Canada",
      serviceType: tier.name,
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[] = generalFaq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function reviewSchema() {
  const real = testimonials.filter((t) => !t.placeholder);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${siteConfig.name} Services`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: String(real.length),
    },
    review: real.map((t) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(t.rating),
        bestRating: "5",
      },
      author: { "@type": "Organization", name: t.company },
      reviewBody: t.quote,
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function jsonLdScriptProps(data: object) {
  return {
    type: "application/ld+json" as const,
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  };
}
