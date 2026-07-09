import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { MarketGap } from "@/components/sections/market-gap";
import { ServicesGrid } from "@/components/sections/services-grid";
import { DigitalDepartment } from "@/components/sections/digital-department";
import { VelorOSSection } from "@/components/sections/velor-os-section";
import { ComingSoon } from "@/components/sections/coming-soon";
import { WorkPreview } from "@/components/sections/work-preview";
import { TestimonialsPreview } from "@/components/sections/testimonials-preview";
import { BookingSection } from "@/components/sections/booking-section";
import { jsonLdScriptProps, servicesSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <script {...jsonLdScriptProps(servicesSchema())} />
      <Hero />
      <MarketGap />
      <ServicesGrid />
      <DigitalDepartment />
      <VelorOSSection />
      <ComingSoon />
      <WorkPreview />
      <TestimonialsPreview />
      <BookingSection />
    </>
  );
}
