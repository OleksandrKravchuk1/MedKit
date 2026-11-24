import { SETTING_KEYS } from "@/constants/settings";
import { db } from "@/db/client";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export function useOnboardingDone(databaseReady: boolean) {
  const { data, updatedAt } = useLiveQuery(
    db
      .select({ value: settings.value })
      .from(settings)
      .where(eq(settings.key, SETTING_KEYS.onboardingDone)),
    [databaseReady],
  );

  return {
    done: data[0]?.value === "true",
    isLoading: !databaseReady || !updatedAt,
  };
}
