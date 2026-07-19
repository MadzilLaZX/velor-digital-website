import { z } from "zod";
import {
  serviceOptions,
  budgetOptions,
  leadSourceOptions,
  preferredContactMethodOptions,
  BOOKING_AGREEMENT_VERSION,
} from "@/lib/booking-config";

const serviceIds = serviceOptions.map((s) => s.id) as [string, ...string[]];
const budgetIds = budgetOptions.map((b) => b.id) as [string, ...string[]];
const leadSourceIds = leadSourceOptions.map((l) => l.id) as [string, ...string[]];
const contactMethodIds = preferredContactMethodOptions.map((c) => c.id) as [
  string,
  ...string[],
];

/** Matches the label format the time-slot picker renders, e.g. "9:00 AM". */
const timeLabelPattern = /^(1[0-2]|[1-9]):[0-5]\d (AM|PM)$/;

export const additionalParticipantSchema = z.string().trim().email();

export const bookingFormSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name").max(100),
    email: z.string().trim().email("Enter a valid email address"),
    phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
    businessName: z.string().trim().min(2, "Enter your business name").max(150),
    businessWebsite: z
      .string()
      .trim()
      .max(300)
      .optional()
      .refine((v) => !v || /^https?:\/\/.+/i.test(v) || /^[\w-]+\.[a-z]{2,}/i.test(v), {
        message: "Enter a valid website or social link",
      }),

    serviceInterest: z.enum(serviceIds, { message: "Select the service you're interested in" }),
    budgetRange: z.enum(budgetIds, { message: "Select a budget range" }),
    projectDetails: z
      .string()
      .trim()
      .min(20, "Tell us a bit more about the project (at least 20 characters)")
      .max(3000),

    appointmentType: z.enum(["standard", "emergency"]),
    meetingDate: z.string().trim().optional(),
    meetingTime: z.string().trim().regex(timeLabelPattern).optional(),
    emergencyDetails: z.string().trim().max(3000).optional(),

    leadSource: z.enum(leadSourceIds, { message: "Let us know where you heard about us" }),
    leadSourceOther: z.string().trim().max(200).optional(),

    preferredContactMethod: z.enum(contactMethodIds).optional(),
    additionalParticipants: z.array(additionalParticipantSchema).max(10).optional(),

    agreementAccepted: z.literal(true, {
      message: "You must accept the agreement to continue",
    }),

    submissionId: z.string().trim().uuid(),
    // Honeypot: intentionally unconstrained here. A filled-in value must pass
    // validation so the handler can silently no-op instead of returning a 422
    // that would tell a bot exactly which field gave it away.
    website: z.string().optional(),

    utmSource: z.string().trim().max(200).optional(),
    utmMedium: z.string().trim().max(200).optional(),
    utmCampaign: z.string().trim().max(200).optional(),
    utmContent: z.string().trim().max(200).optional(),
    utmTerm: z.string().trim().max(200).optional(),
    referrer: z.string().trim().max(500).optional(),
    landingPage: z.string().trim().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.appointmentType === "standard") {
      if (!data.meetingDate) {
        ctx.addIssue({ code: "custom", path: ["meetingDate"], message: "Pick a preferred date" });
      }
      if (!data.meetingTime) {
        ctx.addIssue({
          code: "custom",
          path: ["meetingTime"],
          message: "Pick a preferred time slot",
        });
      }
    } else {
      if (!data.meetingDate) {
        ctx.addIssue({
          code: "custom",
          path: ["meetingDate"],
          message: "Tell us your preferred date",
        });
      }
      if (!data.meetingTime) {
        ctx.addIssue({
          code: "custom",
          path: ["meetingTime"],
          message: "Tell us your preferred time",
        });
      }
      if (!data.emergencyDetails || data.emergencyDetails.trim().length < 10) {
        ctx.addIssue({
          code: "custom",
          path: ["emergencyDetails"],
          message: "Briefly describe the emergency or urgent issue",
        });
      }
    }

    if (data.leadSource === "other" && !data.leadSourceOther?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["leadSourceOther"],
        message: "Tell us where you heard about us",
      });
    }
  });

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const bookingAgreementVersion = BOOKING_AGREEMENT_VERSION;

/** Server-side envelope: adds fields the browser can't be trusted to set itself. */
export const bookingSubmissionSchema = bookingFormSchema.and(
  z.object({
    agreementVersion: z.literal(BOOKING_AGREEMENT_VERSION),
    agreementTimestamp: z.string().trim().datetime(),
    pageUrl: z.string().trim().max(500).optional(),
  })
);

export type BookingSubmission = z.infer<typeof bookingSubmissionSchema>;

export const availabilityQuerySchema = z.object({
  appointmentType: z.enum(["standard", "emergency"]),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  timezone: z.string().trim().min(1).default("America/Toronto"),
});
