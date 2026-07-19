/**
 * Single source of truth for booking options and scheduling rules.
 * Change service/budget/lead-source choices or scheduling windows here only —
 * every component and API route reads from this file instead of hardcoding values.
 */

export type ServiceOption = {
  id: string;
  label: string;
};

export const serviceOptions: ServiceOption[] = [
  { id: "foundation", label: "Foundation" },
  { id: "operations", label: "Operations" },
  { id: "marketing_manager", label: "Marketing Manager" },
  { id: "digital_department", label: "Digital Department" },
  { id: "velor_os_beta", label: "Velor OS Beta" },
  { id: "not_sure", label: "Not sure yet" },
];

export type BudgetOption = {
  id: string;
  label: string;
  minimum: number | null;
  maximum: number | null;
  currency: "CAD";
};

export const budgetOptions: BudgetOption[] = [
  { id: "under_2500", label: "Under $2,500", minimum: null, maximum: 2500, currency: "CAD" },
  { id: "2500_5000", label: "$2,500 – $5,000", minimum: 2500, maximum: 5000, currency: "CAD" },
  { id: "5000_10000", label: "$5,000 – $10,000", minimum: 5000, maximum: 10000, currency: "CAD" },
  { id: "10000_25000", label: "$10,000 – $25,000", minimum: 10000, maximum: 25000, currency: "CAD" },
  { id: "25000_plus", label: "$25,000+", minimum: 25000, maximum: null, currency: "CAD" },
  { id: "not_sure", label: "Not sure yet", minimum: null, maximum: null, currency: "CAD" },
];

export type LeadSourceOption = {
  id: string;
  label: string;
  requiresDetail?: boolean;
};

export const leadSourceOptions: LeadSourceOption[] = [
  { id: "google_search", label: "Google Search" },
  { id: "google_ad", label: "Google Advertisement" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "referral", label: "Referral from a friend or business" },
  { id: "existing_client", label: "Existing Velor client" },
  { id: "saw_velor_site", label: "Saw a Velor-built website" },
  { id: "email", label: "Email" },
  { id: "local_networking", label: "Local networking or event" },
  { id: "other", label: "Other", requiresDetail: true },
];

export const preferredContactMethodOptions = [
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "text", label: "Text message" },
  { id: "whatsapp", label: "WhatsApp" },
] as const;

export const BOOKING_AGREEMENT_VERSION = "VELOR_BOOKING_AGREEMENT_V1";

export const BOOKING_AGREEMENT_TEXT =
  "I confirm that the information provided is accurate and agree that Velor may contact me regarding this meeting request and related services.";

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function envBool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  return raw.toLowerCase() === "true";
}

export const bookingConfig = {
  timezone: process.env.BOOKING_TIMEZONE ?? "America/Toronto",

  standard: {
    durationMinutes: envInt("STANDARD_MEETING_DURATION_MINUTES", 60),
    bufferMinutes: envInt("STANDARD_MEETING_BUFFER_MINUTES", 15),
    startHour: envInt("STANDARD_BOOKING_START_HOUR", 9),
    endHour: envInt("STANDARD_BOOKING_END_HOUR", 21),
  },

  emergency: {
    enabled: envBool("EMERGENCY_REQUESTS_ENABLED", true),
    startHour: envInt("EMERGENCY_START_HOUR", 8),
    endHour: envInt("EMERGENCY_END_HOUR", 22),
    durationMinutes: envInt("EMERGENCY_DURATION_MINUTES", 60),
    autoConfirm: envBool("EMERGENCY_AUTO_CONFIRM", false),
  },

  slotIntervalMinutes: envInt("BOOKING_SLOT_INTERVAL_MINUTES", 60),
  minimumNoticeHours: envInt("MINIMUM_BOOKING_NOTICE_HOURS", 12),
  maximumDaysAhead: envInt("MAXIMUM_BOOKING_DAYS_AHEAD", 60),

  automationVersion: "1.0.0",
} as const;

/**
 * Last bookable start time for a given operating window: the end hour is the
 * business boundary, not an automatically valid meeting start — a meeting must
 * still end by end-hour.
 */
export function lastSlotStartMinutes(
  startHour: number,
  endHour: number,
  durationMinutes: number
): number {
  return endHour * 60 - durationMinutes;
}

export function findServiceOption(id: string) {
  return serviceOptions.find((s) => s.id === id);
}

export function findBudgetOption(id: string) {
  return budgetOptions.find((b) => b.id === id);
}

export function findLeadSourceOption(id: string) {
  return leadSourceOptions.find((l) => l.id === id);
}
