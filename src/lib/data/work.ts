export type CaseStudy = {
  slug: string;
  client: string;
  tagline: string;
  problem: string;
  solution: string;
  result: string;
  tags: string[];
  services: string[];
  color: string;
  logo?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "clean-cabin-detailing",
    client: "Clean Cabin Detailing",
    tagline: "A booking engine that turned a detailing shop into a lead machine.",
    problem:
      "Clean Cabin was losing bookings to DMs and missed calls, with no way to track leads or follow up automatically.",
    solution:
      "Velor built a premium website with an integrated booking workflow, automated confirmations, and a lightweight CRM to track every lead from first click to paid job.",
    result: "15 new clients in the first month through the new site and booking workflow.",
    tags: ["Website", "Booking System", "Automation"],
    services: ["Foundation", "Operations"],
    color: "#3FD9C7",
    logo: "/logos/clean-cabin.jpg",
  },
  {
    slug: "hasara-parfums",
    client: "Hasara Parfums",
    tagline: "A fragrance brand rebuilt with an editorial, product-first web presence.",
    problem:
      "Hasara's catalog looked like every other template storefront and didn't reflect the quality of the product.",
    solution:
      "Velor designed a premium, editorial-grade site with custom product presentation, refined typography, and conversion-focused product pages.",
    result: "A storefront that finally matches the quality of the fragrance line.",
    tags: ["Website", "Brand", "E-commerce"],
    services: ["Foundation", "Marketing Manager"],
    color: "#C7B7FF",
    logo: "/logos/hasara-parfums.png",
  },
  {
    slug: "premium-otto-care",
    client: "Premium Otto Care",
    tagline: "A dashboard-driven operation for a growing auto care business.",
    problem:
      "Job status, technician schedules, and customer communication all lived in someone's head, not a system.",
    solution:
      "Velor implemented an admin dashboard, technician scheduling, and automated customer status updates connected through n8n.",
    result: "A fully systemized shop floor with real-time visibility for the owner.",
    tags: ["Dashboard", "Automation", "CRM"],
    services: ["Operations", "Digital Department"],
    color: "#7DEDDA",
    logo: "/logos/poc.jpeg",
  },
];
