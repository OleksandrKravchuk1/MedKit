import { z } from "zod";

import { HEX_COLOR_PATTERN, TAG_NAME_MAX_LENGTH } from "@/constants/tags";
import { msg } from "@/i18n/msg";

export const tagFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, msg("validation.nameRequired"))
    .max(TAG_NAME_MAX_LENGTH, msg("validation.tooLong")),
  color: z.string().regex(HEX_COLOR_PATTERN, msg("validation.invalidColor")),
});
