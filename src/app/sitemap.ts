import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { caseStudies } from "@/lib/data/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.url}/work`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/velor-os`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/testimonials`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/book`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const workRoutes: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${siteConfig.url}/work/${study.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...workRoutes];
}
