import { bookingConfig, lastSlotStartMinutes } from "@/lib/booking-config";
import { zonedTimeToUtc, formatTimeLabel, todayIsoInZone } from "@/lib/server/timezone";

export type CandidateSlot = {
  start: string; // ISO instant
  end: string; // ISO instant
  label: string;
};

/**
 * Pure candidate-slot generation from configured hours/duration/buffer —
 * does NOT consult Google Calendar. The availability route filters this
 * list against Calendar (via n8n) before returning it to the browser, and
 * the booking route rechecks again immediately before creating the event.
 * Never treat this list alone as "available."
 */
export function generateCandidateSlots(
  date: string,
  appointmentType: "standard" | "emergency",
  timezone: string
): CandidateSlot[] {
  const cfg = appointmentType === "standard" ? bookingConfig.standard : bookingConfig.emergency;
  const duration = cfg.durationMinutes;
  const startMinutes = cfg.startHour * 60;
  const lastStart = lastSlotStartMinutes(cfg.startHour, cfg.endHour, duration);

  const slots: CandidateSlot[] = [];
  for (
    let m = startMinutes;
    m <= lastStart;
    m += bookingConfig.slotIntervalMinutes
  ) {
    const hh = Math.floor(m / 60);
    const mm = m % 60;
    const start = zonedTimeToUtc(date, hh, mm, timezone);
    const end = new Date(start.getTime() + duration * 60_000);
    slots.push({
      start: start.toISOString(),
      end: end.toISOString(),
      label: formatTimeLabel(start, timezone),
    });
  }

  const now = new Date();
  const minNotice = new Date(now.getTime() + bookingConfig.minimumNoticeHours * 3_600_000);
  return slots.filter((s) => new Date(s.start) >= minNotice);
}

export function isDateWithinBookingWindow(date: string, timezone: string): boolean {
  const today = todayIsoInZone(timezone);
  if (date < today) return false;

  const max = new Date();
  max.setDate(max.getDate() + bookingConfig.maximumDaysAhead);
  const maxDateStr = new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(max);
  return date <= maxDateStr;
}
