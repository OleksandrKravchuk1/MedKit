import { z } from "zod";

import { MEDICINE_FORMS } from "@/constants/medicine";
import { msg } from "@/i18n/msg";
import { isIsoDate } from "@/lib/dates";

import {
  DOSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  NOTES_MAX_LENGTH,
  QUANTITY_MAX,
  QUANTITY_MIN,
} from "../constants/medicine-form-constants";

const optionalText = (max: number) =>
  z.string().trim().max(max, msg("validation.tooLong"));

export const medicineFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, msg("validation.nameRequired"))
    .max(NAME_MAX_LENGTH, msg("validation.tooLong")),
  form: z.enum(MEDICINE_FORMS),
  dosage: optionalText(DOSAGE_MAX_LENGTH),
  notes: optionalText(NOTES_MAX_LENGTH),
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

/** The package section is validated only when creating (requirePackage). */
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
