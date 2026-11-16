import type { Medicine, Tag } from "@/db/schema";

import { EMPTY_MEDICINE_FORM } from "../constants/medicine-form-constants";
import type {
  MedicineFormValues,
  MedicineInput,
  PackageInput,
} from "../types/medicine-types";

/*
 * Mapping between DB rows, medicine form values and mutation inputs.
 */

/** Form values for an existing medicine (edit, or adding a package to it). */
export function toFormValues(
  medicine: Medicine,
  tags: Pick<Tag, "id">[],
): MedicineFormValues {
  return {
    ...EMPTY_MEDICINE_FORM,
    name: medicine.name,
    form: medicine.form,
    dosage: medicine.dosage ?? "",
    notes: medicine.notes ?? "",
    tagIds: tags.map((tag) => tag.id),
  };
}

export function toMedicineInput(values: MedicineFormValues): MedicineInput {
  return {
    name: values.name,
    form: values.form,
    dosage: values.dosage,
    notes: values.notes,
    tagIds: values.tagIds,
  };
}

/** Only for values validated with requirePackage, which guarantees expiryDate. */
export function toPackageInput(values: MedicineFormValues): PackageInput {
  if (!values.expiryDate) {
    throw new Error("toPackageInput: expiryDate is required");
  }
  return { expiryDate: values.expiryDate, quantity: values.quantity };
}
