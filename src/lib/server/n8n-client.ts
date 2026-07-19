import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * All calendar/sheet/telegram/email credentials live in n8n, never in this
 * app. This module only signs and forwards requests so n8n can trust they
 * came from the real website and not a spoofed POST.
 */

export class N8nNotConfiguredError extends Error {
  constructor() {
    super("N8N_BOOKING_WEBHOOK_URL is not configured");
    this.name = "N8nNotConfiguredError";
  }
}

function sign(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("hex");
}

export async function callN8nWebhook<TResponse = unknown>(
  path: string,
  payload: unknown
): Promise<{ ok: boolean; status: number; data: TResponse | null }> {
  const baseUrl = process.env.N8N_BOOKING_WEBHOOK_URL;
  const secret = process.env.N8N_WEBHOOK_SHARED_SECRET;

  if (!baseUrl) {
    throw new N8nNotConfiguredError();
  }

  const body = JSON.stringify(payload);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (secret) {
    headers["X-Velor-Signature"] = sign(body, secret);
  }

  const url = `${baseUrl.replace(/\/$/, "")}${path}`;
  const res = await fetch(url, { method: "POST", headers, body });

  let data: TResponse | null = null;
  try {
    data = (await res.json()) as TResponse;
  } catch {
    data = null;
  }

  return { ok: res.ok, status: res.status, data };
}

/** Verify an inbound signature when this app also receives callbacks from n8n. */
export function verifyN8nSignature(body: string, signatureHeader: string | null): boolean {
  const secret = process.env.N8N_WEBHOOK_SHARED_SECRET;
  if (!secret || !signatureHeader) return false;
  const expected = sign(body, secret);
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
