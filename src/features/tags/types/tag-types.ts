import type { z } from "zod";

import type { Tag } from "@/db/schema";

import type { tagFormSchema } from "../schemas/tag-form-schema";

/** Values of the tag form (inferred from its zod schema). */
export type TagFormValues = z.infer<typeof tagFormSchema>;

/** Tag fields accepted by mutations. */
export type TagInput = Pick<Tag, "name" | "color">;
