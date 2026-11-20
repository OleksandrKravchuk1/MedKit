import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMemo } from "react";

import { SETTING_KEYS } from "@/constants/settings";
import { db } from "@/db/client";
import { settings } from "@/db/schema";

import type { AppSettings } from "../types/settings-types";
import {
  parseLanguage,
  parseNotifyTime,
  parseRemindDays,
} from "../utils/settings-parsers";

/**
 * App settings (live). Missing or invalid values fall back to defaults,
 * so `data` is always complete.
 */
export function useSettings() {
  const {
    data: rows,
    error,
    updatedAt,
  } = useLiveQuery(db.select().from(settings));

  const data = useMemo<AppSettings>(() => {
    const values = new Map(rows.map((row) => [row.key, row.value]));
    return {
      remindDaysBefore: parseRemindDays(
        values.get(SETTING_KEYS.remindDaysBefore),
      ),
      notifyTime: parseNotifyTime(values.get(SETTING_KEYS.notifyTime)),
      language: parseLanguage(values.get(SETTING_KEYS.language)),
    };
  }, [rows]);

  return { data, error, isLoading: !updatedAt };
}
