import { eq } from "drizzle-orm";

import { db, type Transaction } from "@/db/client";
import { medicines, medicineTags } from "@/db/schema";

import type { MedicineInput, PackageInput } from "../types/medicine-types";
import { insertPackage } from "./package-mutations";

/*
 * Medicine writes. The expo-sqlite driver is synchronous: transactions take a
 * sync callback and queries run with .run() / .get(). Errors are thrown.
 */

/** Creates a medicine with its first package. Returns the new medicine id. */
export function createMedicineWithPackage(
  medicine: MedicineInput,
  pkg: PackageInput,
): number {
  return db.transaction((tx) => {
    const row = tx
      .insert(medicines)
      .values(toMedicineRow(medicine))
      .returning({ id: medicines.id })
      .get();
    insertPackage(tx, row.id, pkg);
    replaceTags(tx, row.id, medicine.tagIds);
    return row.id;
  });
}

export function updateMedicine(id: number, medicine: MedicineInput): void {
  db.transaction((tx) => {
    tx.update(medicines)
      .set(toMedicineRow(medicine))
      .where(eq(medicines.id, id))
      .run();
    replaceTags(tx, id, medicine.tagIds);
  });
}

/** Packages and tag links are removed by ON DELETE CASCADE. */
export function deleteMedicine(id: number): void {
  db.delete(medicines).where(eq(medicines.id, id)).run();
}

// --- helpers ---------------------------------------------------------------

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function toMedicineRow(input: MedicineInput) {
  return {
    name: input.name.trim(),
    form: input.form,
    dosage: emptyToNull(input.dosage),
    notes: emptyToNull(input.notes),
  };
}

function replaceTags(tx: Transaction, medicineId: number, tagIds: number[]) {
  tx.delete(medicineTags).where(eq(medicineTags.medicineId, medicineId)).run();
  const unique = [...new Set(tagIds)];
  if (unique.length > 0) {
    tx.insert(medicineTags)
      .values(unique.map((tagId) => ({ medicineId, tagId })))
      .run();
  }
}
