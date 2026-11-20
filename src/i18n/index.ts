import { getLocales } from "expo-localization";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import type { LanguageSetting } from "@/constants/settings";

import en from "./locales/en.json";
import uk from "./locales/uk.json";

// uk.json is the source of truth for keys; this fails to compile if en.json misses any.
const enTranslation: typeof uk = en;

export const resources = {
  uk: { translation: uk },
  en: { translation: enTranslation },
} as const;

export const SUPPORTED_LANGUAGES = ["uk", "en"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const FALLBACK_LANGUAGE: AppLanguage = "en";

function isSupported(code: string | null | undefined): code is AppLanguage {
  return SUPPORTED_LANGUAGES.includes(code as AppLanguage);
}

/** First supported language from the device preferences, else English. */
export function detectDeviceLanguage(): AppLanguage {
  const preferred = getLocales().find((l) => isSupported(l.languageCode));
  return (
    (preferred?.languageCode as AppLanguage | undefined) ?? FALLBACK_LANGUAGE
  );
}

const i18n = createInstance();

// initAsync: false — resources are bundled, so translations are ready before the first render.
void i18n.use(initReactI18next).init({
  resources,
  lng: detectDeviceLanguage(),
  fallbackLng: FALLBACK_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: { escapeValue: false },
  initAsync: false,
});

/**
 * Switches the UI to the language chosen in settings ("system" follows the
 * device). Screens re-render through react-i18next.
 */
export function applyLanguage(setting: LanguageSetting): Promise<unknown> {
  return i18n.changeLanguage(
    setting === "system" ? detectDeviceLanguage() : setting,
  );
}

export function getCurrentLanguage(): AppLanguage {
  return isSupported(i18n.language) ? i18n.language : FALLBACK_LANGUAGE;
}

export default i18n;
