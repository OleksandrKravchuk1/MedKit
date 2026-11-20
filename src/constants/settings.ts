export const REMIND_DAYS_MIN = 1;
export const REMIND_DAYS_MAX = 60;
export const REMIND_DAYS_DEFAULT = 7;

export const NOTIFY_TIME_DEFAULT = "10:00";
export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Keys of the key-value `settings` table. */
export const SETTING_KEYS = {
  remindDaysBefore: "remindDaysBefore",
  notifyTime: "notifyTime",
  seeded: "seeded",
  language: "language",
  onboardingDone: "onboardingDone",
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

export const LANGUAGE_SETTINGS = ["system", "uk", "en"] as const;
export type LanguageSetting = (typeof LANGUAGE_SETTINGS)[number];
export const LANGUAGE_DEFAULT: LanguageSetting = "system" as const;

/** Values written on first launch. */
export const DEFAULT_SETTINGS: Partial<Record<SettingKey, string>> = {
  [SETTING_KEYS.remindDaysBefore]: String(REMIND_DAYS_DEFAULT),
  [SETTING_KEYS.notifyTime]: NOTIFY_TIME_DEFAULT,
  [SETTING_KEYS.language]: LANGUAGE_DEFAULT,
};
