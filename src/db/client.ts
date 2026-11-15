import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

import * as schema from "./schema";

// enableChangeListener is required for useLiveQuery.
export const sqlite = openDatabaseSync("medkit.db", {
  enableChangeListener: true,
});

// SQLite enforces foreign keys (and ON DELETE CASCADE) only when enabled per connection.
sqlite.execSync("PRAGMA foreign_keys = ON;");

export const db = drizzle(sqlite, { schema });

export type Db = typeof db;
