import { eq } from "drizzle-orm";

import type { MedicineForm, PackageStatus } from "@/constants/medicine";
import { db } from "@/db/client";
import { medicines, medicineTags, packages } from "@/db/schema";

// The expo-sqlite driver is synchronous: transactions take a sync callback
// and queries are executed with .run() / .get().

export type MedicineInput = {
  name: string;
  form: MedicineForm;
  dosage: string;
  notes: string;
  tagIds: number[];
};

export type PackageInput = {
  expiryDate: string;
  quantity: number;
  batch?: string | null;
};

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

const emptyToNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

function medicineValues(input: MedicineInput) {
  return {
    name: input.name.trim(),
    form: input.form,
    dosage: emptyToNull(input.dosage),
    notes: emptyToNull(input.notes),
  };
}

function replaceTags(tx: Tx, medicineId: number, tagIds: number[]) {
  tx.delete(medicineTags).where(eq(medicineTags.medicineId, medicineId)).run();
  const unique = [...new Set(tagIds)];
  if (unique.length > 0) {
    tx.insert(medicineTags)
      .values(unique.map((tagId) => ({ medicineId, tagId })))
      .run();
  }
}

function insertPackage(tx: Tx, medicineId: number, input: PackageInput) {
  tx.insert(packages)
    .values({
      medicineId,
      expiryDate: input.expiryDate,
      quantity: input.quantity,
      batch: input.batch ?? null,
    })
    .run();
}

/** Creates a medicine with its first package. Returns the new medicine id. */
export function createMedicineWithPackage(
  medicine: MedicineInput,
  pkg: PackageInput,
): number {
  return db.transaction((tx) => {
    const row = tx
      .insert(medicines)
      .values(medicineValues(medicine))
      .returning({ id: medicines.id })
      .get();
    insertPackage(tx, row.id, pkg);
    replaceTags(tx, row.id, medicine.tagIds);
    return row.id;
  });
}

export function addPackage(medicineId: number, pkg: PackageInput): void {
  db.transaction((tx) => insertPackage(tx, medicineId, pkg));
}

export function updateMedicine(id: number, medicine: MedicineInput): void {
  db.transaction((tx) => {
    tx.update(medicines)
      .set(medicineValues(medicine))
      .where(eq(medicines.id, id))
      .run();
    replaceTags(tx, id, medicine.tagIds);
  });
}

/** Packages and tag links are removed by ON DELETE CASCADE. */
export function deleteMedicine(id: number): void {
  db.delete(medicines).where(eq(medicines.id, id)).run();
}

export function setPackageStatus(
  packageId: number,
  status: PackageStatus,
): void {
  db.update(packages).set({ status }).where(eq(packages.id, packageId)).run();
}

export function updatePackageExpiry(
  packageId: number,
  expiryDate: string,
): void {
  db.update(packages)
    .set({ expiryDate })
    .where(eq(packages.id, packageId))
    .run();
}
