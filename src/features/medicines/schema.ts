import type { ParseKeys } from "i18next";
import { z } from "zod";

import { MEDICINE_FORMS } from "@/constants/medicine";
import { isIsoDate } from "@/lib/dates";

/**
 * Validation messages are i18n keys (checked at compile time), translated by
 * FieldError at render time so they follow the current app language.
 */
const msg = (key: ParseKeys) => key;

const optionalText = (max: number) =>
  z.string().trim().max(max, msg("validation.tooLong"));

export const NAME_MAX_LENGTH = 100;
export const QUANTITY_MIN = 1;
export const QUANTITY_MAX = 999;

export const medicineFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, msg("validation.nameRequired"))
    .max(NAME_MAX_LENGTH, msg("validation.tooLong")),
  form: z.enum(MEDICINE_FORMS),
  dosage: optionalText(50),
  notes: optionalText(500),
  tagIds: z.array(z.number().int()),
  // Package fields: required when creating, ignored when editing a medicine.
  expiryDate: z
    .string()
    .refine(isIsoDate, msg("validation.invalidDate"))
    .nullable(),
  monthOnly: z.boolean(),
  quantity: z
    .number({ error: msg("validation.quantityRequired") })
    .int(msg("validation.quantityInteger"))
    .min(QUANTITY_MIN, msg("validation.quantityMin"))
    .max(QUANTITY_MAX, msg("validation.quantityMax")),
});

export type MedicineFormValues = z.infer<typeof medicineFormSchema>;

export function createMedicineFormSchema(options: { requirePackage: boolean }) {
  return medicineFormSchema.superRefine((values, ctx) => {
    if (options.requirePackage && !values.expiryDate) {
      ctx.addIssue({
        code: "custom",
        path: ["expiryDate"],
        message: msg("validation.expiryRequired"),
      });
    }
  });
}

export const EMPTY_MEDICINE_FORM: MedicineFormValues = {
  name: "",
  form: "tablets",
  dosage: "",
  notes: "",
  tagIds: [],
  expiryDate: null,
  monthOnly: false,
  quantity: 1,
};
