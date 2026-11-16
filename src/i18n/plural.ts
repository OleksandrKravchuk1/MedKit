import type { AppLanguage } from "./index";

export type PluralCategory = "one" | "few" | "many" | "other";

/**
 * CLDR plural category for integers. Implemented by hand instead of relying on
 * Intl.PluralRules, whose availability varies across JS engines (Hermes).
 */
export function pluralCategory(
  language: AppLanguage,
  n: number,
): PluralCategory {
  const abs = Math.abs(n);
  if (language === "uk") {
    const mod10 = abs % 10;
    const mod100 = abs % 100;
    if (mod10 === 1 && mod100 !== 11) return "one";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "few";
    return "many";
  }
  return abs === 1 ? "one" : "other";
}
