/**
 * Minimal IANA-timezone helpers built on Intl so we don't need a date-fns-tz
 * dependency for a handful of conversions. Good enough for scheduling UX;
 * not meant for exhaustive historical-DST correctness.
 *
 * Deliberately avoids `new Date(dateString)` for zone conversion — that
 * constructor parses using the *runtime's local system timezone*, which
 * silently produces wrong offsets whenever the server isn't running in UTC
 * (e.g. a dev machine set to a non-UTC zone). Everything here works off
 * `Intl.DateTimeFormat.formatToParts`, which is independent of the system
 * timezone.
 */

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Offset (in minutes, UTC+offset = local) of `timeZone` at the given instant. */
function timeZoneOffsetMinutes(instant: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(instant).reduce<Record<string, string>>((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return (asUtc - instant.getTime()) / 60_000;
}

/** Converts a wall-clock date+time in `timeZone` to the equivalent UTC instant. */
export function zonedTimeToUtc(
  isoDate: string,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  // Guess: pretend the wall-clock numbers are UTC, then correct by the
  // zone's actual offset at that instant (DST-safe to within a few hours
  // of a transition, which is more than sufficient for booking slots).
  const guess = new Date(`${isoDate}T${pad(hour)}:${pad(minute)}:00Z`);
  const offsetMinutes = timeZoneOffsetMinutes(guess, timeZone);
  return new Date(guess.getTime() - offsetMinutes * 60_000);
}

export function formatTimeLabel(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function todayIsoInZone(timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date()); // en-CA -> YYYY-MM-DD
}
