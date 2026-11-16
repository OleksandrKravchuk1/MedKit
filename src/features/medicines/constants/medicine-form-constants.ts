import type { MedicineFormValues } from "../types/medicine-types";

/*
 * Medicine form limits and default values. The limits are shared by the zod
 * schema and the UI (e.g. Stepper min/max).
 */

export const NAME_MAX_LENGTH = 100;
export const DOSAGE_MAX_LENGTH = 50;
export const NOTES_MAX_LENGTH = 500;
export const QUANTITY_MIN = 1;
export const QUANTITY_MAX = 999;

export const EMPTY_MEDICINE_FORM: MedicineFormValues = {
  name: "",
  form: "tablets",
  dosage: "",
  notes: "",
  tagIds: [],
  expiryDate: null,
  monthOnly: false,
  quantity: QUANTITY_MIN,
};
