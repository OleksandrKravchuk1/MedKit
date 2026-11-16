import type { ParseKeys } from "i18next";

/**
 * Marks a string as an i18n key, e.g. for zod validation messages.
 * The key is checked at compile time and translated at render time (FieldError),
 * so the message follows the current app language.
 */
export const msg = (key: ParseKeys) => key;
