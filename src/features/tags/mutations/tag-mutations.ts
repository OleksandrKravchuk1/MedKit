import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { tags } from "@/db/schema";

import type { TagInput } from "../types/tag-types";

/** Thrown when another tag already has this name (case-insensitive). */
export class TagNameTakenError extends Error {
  constructor() {
    super("Tag name is already taken");
    this.name = "TagNameTakenError";
  }
}

/** Returns the new tag id. Throws TagNameTakenError on a duplicate name. */
export function createTag(input: TagInput): number {
  const values = normalize(input);
  assertNameFree(values.name);
  return db.insert(tags).values(values).returning({ id: tags.id }).get().id;
}

/** Throws TagNameTakenError when another tag has this name. */
export function updateTag(id: number, input: TagInput): void {
  const values = normalize(input);
  assertNameFree(values.name, id);
  db.update(tags).set(values).where(eq(tags.id, id)).run();
}

/** Links to medicines are removed by ON DELETE CASCADE. */
export function deleteTag(id: number): void {
  db.delete(tags).where(eq(tags.id, id)).run();
}

// --- helpers ---------------------------------------------------------------

function normalize({ name, color }: TagInput): TagInput {
  return {
    name: name.trim(),
    color: color.toUpperCase(),
  };
}

/**
 * Compared in JS, not with SQL lower(): SQLite lowercases ASCII only, so
 * "Біль" and "біль" would count as different names.
 */
function assertNameFree(name: string, exceptId?: number): void {
  const key = name.toLocaleLowerCase();
  const taken = db
    .select({ id: tags.id, name: tags.name })
    .from(tags)
    .all()
    .some((tag) => tag.id !== exceptId && tag.name.toLocaleLowerCase() === key);
  if (taken) throw new TagNameTakenError();
}
