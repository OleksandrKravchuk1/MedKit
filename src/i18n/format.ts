import { format } from "date-fns";
import { enUS, uk } from "date-fns/locale";

import { parseIsoDate } from "@/lib/dates";

import i18n, { getCurrentLanguage, type AppLanguage } from "./index";
import { pluralCategory } from "./plural";

/*
 * Locale-aware formatting that follows the current i18n language.
 * Plain functions (not hooks) so they also work outside components.
 */

const DATE_LOCALES = { uk, en: enUS } as const;

/** Locale identifiers for native pickers (iOS `locale` prop). */
const NATIVE_LOCALES: Record<AppLanguage, string> = {
  uk: "uk_UA",
  en: "en_US",
};

export function getNativeLocale(): string {
  return NATIVE_LOCALES[getCurrentLanguage()];
}

/** '2027-03-31' -> '31 березня 2027' / '31 March 2027' */
export function formatDate(iso: string): string {
  return format(parseIsoDate(iso), "d MMMM yyyy", {
    locale: DATE_LOCALES[getCurrentLanguage()],
  });
}

/** 'залишилось 12 днів' / 'прострочено 3 дні тому' / 'останній день' */
export function formatDaysLeft(days: number): string {
  if (days === 0) return i18n.t("expiry.lastDay");
  const count = Math.abs(days);
  const category = pluralCategory(getCurrentLanguage(), count);
  return days > 0
    ? i18n.t(`expiry.daysLeft.${category}`, { n: count })
    : i18n.t(`expiry.expiredAgo.${category}`, { n: count });
}

/** 'За 7 днів' / '7 days before' (settings: how early to remind). */
export function formatRemindDaysBefore(days: number): string {
  const category = pluralCategory(getCurrentLanguage(), days);
  return i18n.t(`settings.remindDaysBefore.${category}`, { n: days });
}
