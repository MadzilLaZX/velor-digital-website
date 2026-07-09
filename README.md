# Velor Digital — Flagship Website

The official marketing site for Velor Digital: premium websites, automation, marketing systems, and Velor OS for service businesses in Ottawa, Gatineau, and Ontario.

## Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Tailwind CSS v4** (CSS-based theme in `src/app/globals.css`)
- **Framer Motion** for scroll reveals and micro-interactions
- **React Hook Form + Zod** for the strategy-call / beta-application form
- Fonts: **Geist** (body/UI), **Geist Mono** (dashboard metrics), **Bricolage Grotesque** (display headings)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If 3000 is taken: `npm run dev -- -p 3001`.

```bash
npm run build   # production build (also type-checks)
npm run start   # serve the production build
npm run lint    # ESLint
```

## Project structure

```
src/
  app/                  routes (App Router), SEO files (sitemap.ts, robots.ts,
                         manifest.ts, icon.tsx, opengraph-image.tsx)
    work/[slug]/         dynamic case-study pages
  components/
    layout/              Nav, Footer
    sections/            page-level sections (Hero, ServicesGrid, BookingForm, ...)
    ui/                  primitives (Button, GlassPanel, SectionReveal, Badge, ...)
  lib/
    data/                content: services, work, testimonials, coming-soon, faq
    validations/         Zod schemas
    schema.ts            JSON-LD builders (Organization, LocalBusiness, Service, FAQ, Review)
    site-config.ts        site-wide constants (nav, contact info, keywords)
public/
  brand/                 Velor logo assets
  llms.txt, agents.json  AI-crawler readability files
```

## SEO

- Per-page metadata, canonical URLs, and Open Graph/Twitter cards via the App Router `metadata` API
- Dynamic OG image + favicon generated with `next/og` (`opengraph-image.tsx`, `icon.tsx`, `apple-icon.tsx`)
- `sitemap.xml` and `robots.txt` generated from `src/app/sitemap.ts` / `robots.ts`
- JSON-LD: Organization, LocalBusiness (ProfessionalService), Service list, FAQPage, Review/AggregateRating, BreadcrumbList — see `src/lib/schema.ts`
- `public/llms.txt` and `public/agents.json` describe the business and site to LLM crawlers/agents
- Structured, visible FAQ content on `/services` and `/contact` (not schema-only, to match Google's FAQ rich-result guidance)

## What still needs to be connected

The booking form (`src/components/sections/booking-form.tsx`) is fully validated and frontend-complete, but submission currently just simulates a delay. Wire it up to:

1. **Lead intake** — POST to an n8n webhook or a Next.js Route Handler (`/api/booking`) that:
   - Upserts the lead into Supabase (or your CRM of record)
   - Sends a confirmation email to the client and a notification to `hello@velordigital.com` (Resend/Postmark)
   - Optionally sends an SMS confirmation (Twilio)
2. **Supabase** — connect a project for lead storage / Velor OS beta applicants.
3. **Analytics** — add `NEXT_PUBLIC_GA_MEASUREMENT_ID` (or PostHog/Plausible) and wire a `<Script>` in `src/app/layout.tsx`.
4. **Domain + hosting** — deploy to Vercel and point `velordigital.com` at it; update `siteConfig.url` in `src/lib/site-config.ts` if the domain differs.
5. **Real testimonials & case study photography** — replace the placeholder testimonial slots and case-study color blocks in `src/lib/data/` as real assets come in.

See `.env.example` for the environment variables these integrations will need.

## Design system notes

Dark-mode-only ("Ethereal Glass" direction): deep OLED black background, graphite surfaces, hairline borders, soft cyan/teal accent glow, silver gradient headline text. Cards use a "double-bezel" pattern (outer hairline shell + inner surface) instead of flat divs. All scroll animations use `whileInView` (IntersectionObserver-based) with `transform`/`opacity` only, so they're Core-Web-Vitals-safe and respect `prefers-reduced-motion`.
