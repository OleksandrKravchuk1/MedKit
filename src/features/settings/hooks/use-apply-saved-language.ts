import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";

import { SETTING_KEYS } from "@/constants/settings";
import { db } from "@/db/client";
import { settings } from "@/db/schema";
import { applyLanguage } from "@/i18n";

import { parseLanguage } from "../utils/settings-parsers";

/**
 * Applies the language saved in settings once the database is ready.
 * Returns true when done, so the app can keep the splash screen until then
 * and never show the first frame in the device language.
 */
export function useApplySavedLanguage(databaseReady: boolean): boolean {
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!databaseReady) return;
    Promise.resolve()
      .then(() => {
        const row = db
          .select({ value: settings.value })
          .from(settings)
          .where(eq(settings.key, SETTING_KEYS.language))
          .get();
        return applyLanguage(parseLanguage(row?.value));
      })
      // On failure the app stays in the device language.
      .catch(() => undefined)
      .finally(() => setApplied(true));
  }, [databaseReady]);

  return applied;
}
