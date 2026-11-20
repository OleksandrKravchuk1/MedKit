import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "@/db/client";
import { tags } from "@/db/schema";

/** One tag by id (live); `data` is undefined when it does not exist. */
export function useTag(id: number) {
  const { data, error, updatedAt } = useLiveQuery(
    db.select().from(tags).where(eq(tags.id, id)),
    [id],
  );
  return { data: data[0], error, isLoading: !updatedAt };
}
