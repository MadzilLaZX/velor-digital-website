/**
 * Prevent spreadsheet-formula injection: any submitted string beginning with
 * =, +, -, or @ can be interpreted as a formula by Google Sheets. Prefix it
 * with a straight quote so it's stored as literal text. Apply this to every
 * user-supplied string before it's forwarded to a sheet-writing workflow.
 */
const FORMULA_PREFIXES = ["=", "+", "-", "@"];

export function escapeForSheets(value: string): string {
  if (value.length > 0 && FORMULA_PREFIXES.includes(value[0])) {
    return `'${value}`;
  }
  return value;
}

export function escapeRecordForSheets<T extends Record<string, unknown>>(record: T): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === "string") {
      out[key] = escapeForSheets(value);
    } else if (Array.isArray(value)) {
      out[key] = value.map((v) => (typeof v === "string" ? escapeForSheets(v) : v));
    } else {
      out[key] = value;
    }
  }
  return out as T;
}
