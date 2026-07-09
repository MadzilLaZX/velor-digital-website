import { z } from "zod";

export const serviceInterestOptions = [
  "Foundation",
  "Operations",
  "Marketing Manager",
  "Digital Department",
  "Velor OS Beta",
] as const;

export const budgetRangeOptions = [
  "Under $2,500",
  "$2,500 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
  "Not sure yet",
] as const;

export const bookingFormSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a valid phone number"),
  businessName: z.string().trim().min(2, "Enter your business name"),
  serviceInterest: z.enum(serviceInterestOptions, {
    message: "Select the service you're interested in",
  }),
  budgetRange: z.enum(budgetRangeOptions, {
    message: "Select a budget range",
  }),
  projectDetails: z.string().trim().min(10, "Tell us a bit more about the project"),
  preferredDateTime: z.string().trim().min(1, "Let us know a preferred date or time"),
  website: z.string().max(0).optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
