export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  placeholder?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Velor helped Clean Cabin bring in 15 clients in the first month through a smooth website, booking workflow, and marketing system.",
    author: "Owner",
    role: "Founder",
    company: "Clean Cabin Detailing",
    rating: 5,
  },
  {
    quote:
      "More client stories are coming soon as our founding partners wrap their first projects.",
    author: "Velor Digital",
    role: "Case study",
    company: "In progress",
    rating: 5,
    placeholder: true,
  },
  {
    quote:
      "Reserved for our next featured partner — testimonials are added as projects go live.",
    author: "Velor Digital",
    role: "Case study",
    company: "In progress",
    rating: 5,
    placeholder: true,
  },
];
