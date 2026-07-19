import { NextRequest, NextResponse } from "next/server";
import { bookingSubmissionSchema } from "@/lib/validations/booking";
import { escapeRecordForSheets } from "@/lib/server/sheet-sanitize";
import { callN8nWebhook, N8nNotConfiguredError } from "@/lib/server/n8n-client";
import { rateLimit, requestIp } from "@/lib/server/rate-limit";
import { getCachedSubmission, cacheSubmission } from "@/lib/server/idempotency";
import { generateBookingId } from "@/lib/server/booking-id";
import { findServiceOption, findBudgetOption, findLeadSourceOption } from "@/lib/booking-config";

export async function handleBookingSubmission(
  req: NextRequest,
  webhookPath: "/strategy-call" | "/emergency"
): Promise<NextResponse> {
  const ip = requestIp(req.headers);
  const { allowed } = rateLimit(`submit:${ip}`, { limit: 8, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json(
      { success: false, code: "RATE_LIMITED", message: "Too many requests. Try again shortly." },
      { status: 429 }
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, code: "INVALID_REQUEST", message: "Malformed request body." },
      { status: 400 }
    );
  }

  const parsed = bookingSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "Please review the highlighted fields before continuing.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Honeypot: real users never fill this in. Pretend success so bots don't
  // learn to avoid the field, but do nothing further.
  if (data.website) {
    return NextResponse.json({
      success: true,
      bookingId: generateBookingId(webhookPath === "/strategy-call" ? "standard" : "emergency"),
      status: "Pending",
    });
  }

  const cached = getCachedSubmission(data.submissionId);
  if (cached) {
    return NextResponse.json(cached.body, { status: cached.status });
  }

  const kind = webhookPath === "/strategy-call" ? "standard" : "emergency";
  const bookingId = generateBookingId(kind);

  const serviceLabel = findServiceOption(data.serviceInterest)?.label ?? data.serviceInterest;
  const budgetOption = findBudgetOption(data.budgetRange);
  const leadSourceLabel = findLeadSourceOption(data.leadSource)?.label ?? data.leadSource;

  const enrichedPayload = escapeRecordForSheets({
    bookingId,
    submissionId: data.submissionId,
    appointmentType: kind,
    fullName: data.fullName,
    email: data.email.toLowerCase(),
    phone: data.phone,
    businessName: data.businessName,
    businessWebsite: data.businessWebsite ?? "",
    serviceInterest: serviceLabel,
    serviceInterestId: data.serviceInterest,
    budgetRange: budgetOption?.label ?? data.budgetRange,
    budgetMinimum: budgetOption?.minimum ?? null,
    budgetMaximum: budgetOption?.maximum ?? null,
    projectDetails: data.projectDetails,
    meetingDate: data.meetingDate ?? "",
    meetingTime: data.meetingTime ?? "",
    emergencyDetails: data.emergencyDetails ?? "",
    leadSource: leadSourceLabel,
    leadSourceOther: data.leadSourceOther ?? "",
    preferredContactMethod: data.preferredContactMethod ?? "",
    additionalParticipants: data.additionalParticipants ?? [],
    agreementAccepted: data.agreementAccepted,
    agreementVersion: data.agreementVersion,
    agreementTimestamp: data.agreementTimestamp,
    utmSource: data.utmSource ?? "",
    utmMedium: data.utmMedium ?? "",
    utmCampaign: data.utmCampaign ?? "",
    utmContent: data.utmContent ?? "",
    utmTerm: data.utmTerm ?? "",
    referrer: data.referrer ?? "",
    landingPage: data.landingPage ?? "",
    pageUrl: data.pageUrl ?? "",
    ipAddress: ip,
    userAgent: req.headers.get("user-agent") ?? "",
    submittedAt: new Date().toISOString(),
  });

  try {
    const result = await callN8nWebhook<{
      success: boolean;
      code?: string;
      message?: string;
      bookingId?: string;
      status?: string;
      calendarEventLink?: string;
      googleMeetLink?: string;
      conflictDetected?: boolean;
    }>(webhookPath, enrichedPayload);

    if (result.ok && result.data?.success) {
      const body = {
        success: true,
        bookingId: result.data.bookingId ?? bookingId,
        status: result.data.status ?? "Pending",
        calendarEventLink: result.data.calendarEventLink,
        googleMeetLink: result.data.googleMeetLink,
        conflictDetected: result.data.conflictDetected ?? false,
      };
      cacheSubmission(data.submissionId, 200, body);
      return NextResponse.json(body);
    }

    // n8n explicitly reports the slot was taken between availability check
    // and submission.
    if (result.data?.code === "SLOT_NO_LONGER_AVAILABLE") {
      const body = {
        success: false,
        code: "SLOT_NO_LONGER_AVAILABLE",
        message: "That time was just booked. Please choose another available time.",
      };
      return NextResponse.json(body, { status: 409 });
    }

    return NextResponse.json(
      {
        success: false,
        code: "SUBMISSION_FAILED",
        message:
          "We could not confirm this appointment right now. Your information has not been lost. Please try again or contact hello@velordigital.com.",
      },
      { status: 502 }
    );
  } catch (err) {
    if (err instanceof N8nNotConfiguredError) {
      return NextResponse.json(
        {
          success: false,
          code: "BOOKING_BACKEND_NOT_CONFIGURED",
          message: "Booking is not yet connected. Please contact hello@velordigital.com directly.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        code: "SUBMISSION_FAILED",
        message:
          "We could not confirm this appointment right now. Your information has not been lost. Please try again or contact hello@velordigital.com.",
      },
      { status: 502 }
    );
  }
}
