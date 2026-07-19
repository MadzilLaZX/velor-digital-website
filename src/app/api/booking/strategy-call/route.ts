import { NextRequest } from "next/server";
import { handleBookingSubmission } from "@/lib/server/booking-submit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return handleBookingSubmission(req, "/strategy-call");
}
