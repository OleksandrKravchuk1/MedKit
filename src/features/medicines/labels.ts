import type { Medicine } from "@/db/schema";
import i18n from "@/i18n";

/** 'Таблетки · 500 мг' — form label plus optional dosage. */
export function formatMedicineSubtitle(
  medicine: Pick<Medicine, "form" | "dosage">,
): string {
  return [i18n.t(`medicineForms.${medicine.form}`), medicine.dosage]
    .filter(Boolean)
    .join(" · ");
}
