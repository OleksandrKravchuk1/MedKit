import { eq } from "drizzle-orm";

import { DEFAULT_SETTINGS, SETTING_KEYS } from "@/constants/settings";

import type { Db } from "./client";
import { settings, tags, type NewTag } from "./schema";

/**
 * Inserts default tags and settings on the very first launch.
 * Guarded by the `seeded` flag so tags deleted by the user are not re-created.
 * Tag names are passed in (already localized) to keep the DB layer free of i18n.
 */
export function seedDatabase(db: Db, defaultTags: NewTag[]): void {
  const seeded = db
    .select({ value: settings.value })
    .from(settings)
    .where(eq(settings.key, SETTING_KEYS.seeded))
    .get();
  if (seeded) return;

  db.transaction((tx) => {
    if (defaultTags.length > 0) {
      tx.insert(tags).values(defaultTags).onConflictDoNothing().run();
    }
    tx.insert(settings)
      .values(
        Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({
          key,
          value: value ?? "",
        })),
      )
      .onConflictDoNothing()
      .run();
    tx.insert(settings).values({ key: SETTING_KEYS.seeded, value: "1" }).run();
  });
}
