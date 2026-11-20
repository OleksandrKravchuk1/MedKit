import {
  LANGUAGE_DEFAULT,
  LANGUAGE_SETTINGS,
  LanguageSetting,
  NOTIFY_TIME_DEFAULT,
  REMIND_DAYS_DEFAULT,
  REMIND_DAYS_MAX,
  REMIND_DAYS_MIN,
  TIME_PATTERN,
} from "@/constants/settings";

/**
 * Value of the `remindDaysBefore` setting: an integer within 1–60,
 * otherwise the default (7). The settings table stores values as strings.
 */
export function parseRemindDays(value?: string): number {
  const days = Number(value);

  const isValid =
    Number.isInteger(days) &&
    days >= REMIND_DAYS_MIN &&
    days <= REMIND_DAYS_MAX;

  return isValid ? days : REMIND_DAYS_DEFAULT;
}

/**
 * Value of the `notifyTime` setting: a valid "HH:mm" time,
 * otherwise the default ("10:00").
 */
export function parseNotifyTime(value?: string): string {
  return value && TIME_PATTERN.test(value) ? value : NOTIFY_TIME_DEFAULT;
}

/** Narrows any string to LanguageSetting. */
function isLanguageSetting(value: string): value is LanguageSetting {
  return (LANGUAGE_SETTINGS as readonly string[]).includes(value);
}

/**
 * Value of the `language` setting: one of LANGUAGE_SETTINGS,
 * otherwise the default ("system").
 */
export function parseLanguage(value?: string): LanguageSetting {
  return value && isLanguageSetting(value) ? value : LANGUAGE_DEFAULT;
}
