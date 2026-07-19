import { SectionHeading } from "@/components/ui/section-heading";
import { BookingForm } from "@/components/sections/booking-form";

export function BookingSection() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:py-32" id="book">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Book a strategy call"
          title="Tell us about your business."
          description="A focused strategy call to understand your business, identify the biggest digital bottlenecks, and map out the right next step."
          align="center"
          className="mx-auto mb-12"
        />
        <BookingForm />
      </div>
    </section>
  );
}
