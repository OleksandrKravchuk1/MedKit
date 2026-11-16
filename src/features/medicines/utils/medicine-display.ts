import type { Medicine, Package } from "@/db/schema";
import i18n from "@/i18n";

/*
 * Text fragments for medicines and packages, in the current app language.
 */

/** 'Таблетки · 500 мг' — form label plus optional dosage. */
export function formatMedicineSubtitle(
  medicine: Pick<Medicine, "form" | "dosage">,
): string {
  return [i18n.t(`medicineForms.${medicine.form}`), medicine.dosage]
    .filter(Boolean)
    .join(" · ");
}

/** '2 уп. · серія AB123' — shown only for quantity > 1 and a known batch. */
export function formatPackageDetails(
  pkg: Pick<Package, "quantity" | "batch">,
): string {
  return [
    pkg.quantity > 1 ? i18n.t("common.packs", { n: pkg.quantity }) : null,
    pkg.batch ? i18n.t("package.batch", { batch: pkg.batch }) : null,
  ]
    .filter(Boolean)
    .join(" · ");
}
