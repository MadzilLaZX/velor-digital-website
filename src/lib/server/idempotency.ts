/**
 * Best-effort in-memory idempotency cache keyed by the client-generated
 * submissionId. Same caveat as rate-limit.ts: this is per-instance on
 * serverless, so it stops accidental double-clicks/duplicate retries within
 * a single warm instance, not a distributed guarantee. The real dedupe
 * authority is the n8n workflow, which must also check submissionId against
 * the Bookings sheet before creating a second row/event.
 */

type CachedResult = { status: number; body: unknown; cachedAt: number };

const cache = new Map<string, CachedResult>();
const TTL_MS = 30 * 60 * 1000;

export function getCachedSubmission(submissionId: string): CachedResult | undefined {
  const hit = cache.get(submissionId);
  if (!hit) return undefined;
  if (Date.now() - hit.cachedAt > TTL_MS) {
    cache.delete(submissionId);
    return undefined;
  }
  return hit;
}

export function cacheSubmission(submissionId: string, status: number, body: unknown) {
  cache.set(submissionId, { status, body, cachedAt: Date.now() });
}
