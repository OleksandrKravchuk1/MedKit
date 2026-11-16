/** Keys of the key-value `settings` table. */
export const SETTING_KEYS = {
  remindDaysBefore: "remindDaysBefore",
  notifyTime: "notifyTime",
  /** Set once the first-launch seed has run. */
  seeded: "seeded",
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

/** Values written on first launch. */
export const DEFAULT_SETTINGS: Partial<Record<SettingKey, string>> = {
  [SETTING_KEYS.remindDaysBefore]: "7",
  [SETTING_KEYS.notifyTime]: "10:00",
};
