import type { LanguageSetting } from "@/constants/settings";

/** Parsed values of the key-value `settings` table. */
export type AppSettings = {
  remindDaysBefore: number;
  notifyTime: string;
  language: LanguageSetting;
};
