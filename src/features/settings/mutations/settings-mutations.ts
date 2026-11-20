import {
  SETTING_KEYS,
  type LanguageSetting,
  type SettingKey,
} from "@/constants/settings";
import { db } from "@/db/client";
import { settings } from "@/db/schema";
import { dateToTime } from "@/lib/dates";

/** Upserts one value of the key-value `settings` table. */
function setSetting(key: SettingKey, value: string): void {
  db.insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } })
    .run();
}

export function setRemindDaysBefore(days: number): void {
  setSetting(SETTING_KEYS.remindDaysBefore, String(days));
}

/** Stores the hours and minutes of `date` as "HH:mm". */
export function setNotifyTime(date: Date): void {
  setSetting(SETTING_KEYS.notifyTime, dateToTime(date));
}

export function setLanguage(language: LanguageSetting): void {
  setSetting(SETTING_KEYS.language, language);
}
