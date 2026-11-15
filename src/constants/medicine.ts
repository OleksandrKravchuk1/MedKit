// Domain values shared by the DB schema, validation and UI.
// User-facing labels live in i18n: medicineForms.*, packageStatuses.*

export const MEDICINE_FORMS = [
  "tablets",
  "capsules",
  "syrup",
  "drops",
  "ointment",
  "spray",
  "other",
] as const;
export type MedicineForm = (typeof MEDICINE_FORMS)[number];

export const PACKAGE_STATUSES = ["active", "used", "discarded"] as const;
export type PackageStatus = (typeof PACKAGE_STATUSES)[number];
