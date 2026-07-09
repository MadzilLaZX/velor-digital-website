export type ComingSoonProduct = {
  name: string;
  description: string;
  span: "lg" | "md" | "sm";
};

export const comingSoonProducts: ComingSoonProduct[] = [
  {
    name: "Bay Scheduler",
    description:
      "A smart scheduling system for auto shops, detailers, rental fleets, and service teams. Manage bays, technicians, bookings, job status, and customer flow from one clean dashboard.",
    span: "lg",
  },
  {
    name: "AI Receptionist",
    description:
      "An always-on AI receptionist that answers calls, books appointments, and routes urgent requests to your team.",
    span: "md",
  },
  {
    name: "Voice Booking Assistant",
    description:
      "A voice-driven assistant that lets customers book, reschedule, and confirm appointments hands-free.",
    span: "sm",
  },
  {
    name: "AI Follow-up Agent",
    description:
      "Automatically follows up with leads and past clients by email and SMS until they book or opt out.",
    span: "sm",
  },
  {
    name: "Client Portal",
    description:
      "A branded portal where your clients track project status, invoices, files, and communication in one place.",
    span: "md",
  },
  {
    name: "Fleet / Service Team Dashboard",
    description:
      "Live visibility into technician locations, job status, and daily throughput for service and fleet teams.",
    span: "lg",
  },
];
