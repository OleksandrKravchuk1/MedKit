import { eq } from "drizzle-orm";

import type { PackageStatus } from "@/constants/medicine";
import { db, type Transaction } from "@/db/client";
import { packages } from "@/db/schema";

import type { PackageInput } from "../types/medicine-types";

/*
 * Package writes. The expo-sqlite driver is synchronous: transactions take a
 * sync callback and queries run with .run() / .get(). Errors are thrown.
 */

export function addPackage(medicineId: number, pkg: PackageInput): void {
  db.transaction((tx) => insertPackage(tx, medicineId, pkg));
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

/** Inserts a package inside an existing transaction (also used when creating a medicine). */
export function insertPackage(
  tx: Transaction,
  medicineId: number,
  pkg: PackageInput,
): void {
  tx.insert(packages)
    .values({
      medicineId,
      expiryDate: pkg.expiryDate,
      quantity: pkg.quantity,
      batch: pkg.batch ?? null,
    })
    .run();
}
