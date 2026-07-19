import { NextRequest, NextResponse } from "next/server";
import { availabilityQuerySchema } from "@/lib/validations/booking";
import { generateCandidateSlots, isDateWithinBookingWindow } from "@/lib/server/slots";
import { callN8nWebhook, N8nNotConfiguredError } from "@/lib/server/n8n-client";
import { rateLimit, requestIp } from "@/lib/server/rate-limit";

export const dynamic = "force-dynamic";

type CalendarFilteredResponse = {
  success: boolean;
  slots: { start: string; end: string; label: string }[];
};

export async function GET(req: NextRequest) {
  const ip = requestIp(req.headers);
  const { allowed } = rateLimit(`availability:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json(
      { success: false, code: "RATE_LIMITED", message: "Too many requests. Try again shortly." },
      { status: 429 }
    );
  }

  const parsed = availabilityQuerySchema.safeParse({
    appointmentType: req.nextUrl.searchParams.get("appointmentType"),
    date: req.nextUrl.searchParams.get("date"),
    timezone: req.nextUrl.searchParams.get("timezone") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, code: "INVALID_REQUEST", message: "Invalid availability request." },
      { status: 400 }
    );
  }

  const { appointmentType, date, timezone } = parsed.data;

  if (!isDateWithinBookingWindow(date, timezone)) {
    return NextResponse.json({ success: true, date, timezone, slots: [] });
  }

  const candidateSlots = generateCandidateSlots(date, appointmentType, timezone);

  if (candidateSlots.length === 0) {
    return NextResponse.json({ success: true, date, timezone, slots: [] });
  }

  // Google Calendar is the source of truth for what's actually free. That
  // check happens inside n8n, which holds the Calendar credentials — this
  // route never talks to Google directly.
  try {
    const result = await callN8nWebhook<CalendarFilteredResponse>("/availability", {
      appointmentType,
      date,
      timezone,
      candidateSlots,
    });

    if (result.ok && result.data?.success) {
      return NextResponse.json({
        success: true,
        date,
        timezone,
        slots: result.data.slots,
      });
    }

    return NextResponse.json(
      {
        success: false,
        code: "AVAILABILITY_CHECK_FAILED",
        message: "We could not check availability right now. Please try again shortly.",
      },
      { status: 502 }
    );
  } catch (err) {
    if (err instanceof N8nNotConfiguredError) {
      // Local/dev fallback only: no calendar to check against yet, so return
      // the raw candidate slots. This must never happen in production —
      // acceptance criteria requires a real Calendar check before slots are
      // offered.
      return NextResponse.json({
        success: true,
        date,
        timezone,
        slots: candidateSlots,
        calendarChecked: false,
      });
    }
    return NextResponse.json(
      {
        success: false,
        code: "AVAILABILITY_CHECK_FAILED",
        message: "We could not check availability right now. Please try again shortly.",
      },
      { status: 502 }
    );
  }
}
