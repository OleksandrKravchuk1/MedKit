import {
  differenceInCalendarDays,
  endOfMonth,
  format,
  isValid,
  parseISO,
} from "date-fns";

/*
 * Pure calendar-date helpers. User-facing formatting lives in src/i18n/format.ts.
 */

/** Packages expiring within this many days are shown as "soon". */
export const SOON_THRESHOLD_DAYS = 30;

export type ExpiryStatus = "ok" | "soon" | "expired";

/** Local calendar date -> 'YYYY-MM-DD'. */
export function toIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** 'YYYY-MM-DD' -> Date at local midnight. */
export function parseIsoDate(iso: string): Date {
  return parseISO(iso);
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && isValid(parseISO(value));
}

/** Used when only month and year of expiry are known. */
export function toLastDayOfMonth(iso: string): string {
  return toIsoDate(endOfMonth(parseIsoDate(iso)));
}

/** Calendar days from today until expiry; negative when already expired. */
export function daysUntil(iso: string, today: string): number {
  return differenceInCalendarDays(parseIsoDate(iso), parseIsoDate(today));
}

/** A medicine is usable through its expiry date and expired from the next day. */
export function getExpiryStatus(iso: string, today: string): ExpiryStatus {
  const days = daysUntil(iso, today);
  if (days < 0) return "expired";
  if (days <= SOON_THRESHOLD_DAYS) return "soon";
  return "ok";
}
