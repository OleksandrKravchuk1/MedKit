import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useEffect, useEffectEvent, useState } from "react";

import { db } from "./client";
import type { NewTag } from "./schema";
import { seedDatabase } from "./seed";

import migrations from "../../drizzle/migrations";

type State = { ready: boolean; error: Error | null };

/**
 * Runs pending migrations, then the first-launch seed.
 * `getDefaultTags` is called only when seeding actually happens.
 */
export function useDatabaseReady(getDefaultTags: () => NewTag[]): State {
  const { success, error: migrationError } = useMigrations(db, migrations);
  const [seedState, setSeedState] = useState<State>({
    ready: false,
    error: null,
  });

  const seed = useEffectEvent(() => seedDatabase(db, getDefaultTags()));

  useEffect(() => {
    if (!success) return;
    // Async boundary: state is set from a callback, not synchronously in the effect.
    Promise.resolve()
      .then(() => seed())
      .then(
        () => setSeedState({ ready: true, error: null }),
        (e: unknown) =>
          setSeedState({
            ready: false,
            error: e instanceof Error ? e : new Error(String(e)),
          }),
      );
  }, [success]);

  return {
    ready: seedState.ready,
    error: migrationError ?? seedState.error,
  };
}
