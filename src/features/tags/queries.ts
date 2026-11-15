import { asc } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "@/db/client";
import { tags } from "@/db/schema";

export function useTags() {
  return useLiveQuery(db.select().from(tags).orderBy(asc(tags.name)));
}
