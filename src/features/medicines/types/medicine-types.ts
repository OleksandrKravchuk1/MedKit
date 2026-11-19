import type { z } from "zod";

import type { MedicineForm } from "@/constants/medicine";
import type { Medicine, MedicineTag, Package, Tag } from "@/db/schema";
import type { ExpiryStatus } from "@/lib/dates";

import type { medicineFormSchema } from "../schemas/medicine-form-schema";

/** Expiry status of a list item; "none" when it has no active packages. */
export type ListExpiryStatus = ExpiryStatus | "none";

/** Row of the medicines list: a medicine with aggregated package data. */
export type MedicineListItem = Medicine & {
  /** Earliest expiry among active packages. */
  nearestExpiry: string | null;
  /** Sum of quantities of active packages. */
  packCount: number;
  tagIds: number[];
  status: ListExpiryStatus;
  /** Days until nearestExpiry; null when there are no active packages. */
  daysLeft: number | null;
};

/** Active package with its expiry state for today. */
export type ActivePackage = Package & {
  expiryStatus: ExpiryStatus;
  daysLeft: number;
};

/** Everything the details screen shows. */
export type MedicineDetails = {
  medicine: Medicine;
  activePackages: ActivePackage[];
  archivedPackages: Package[];
  tags: Tag[];
};

/** Medicine fields accepted by mutations. */
export type MedicineInput = {
  name: string;
  form: MedicineForm;
  dosage: string;
  notes: string;
  tagIds: number[];
};

/** Package fields accepted by mutations. */
export type PackageInput = {
  expiryDate: string;
  quantity: number;
  batch?: string | null;
};

/** Active package fields the list needs (one row of the list's live query). */
export type ListPackageRow = Pick<
  Package,
  "medicineId" | "expiryDate" | "quantity"
>;

/** Input of buildMedicineList: live query rows and today's date. */
export type BuildMedicineListInput = {
  medicines: Medicine[];
  activePackages: ListPackageRow[];
  links: MedicineTag[];
  /** 'YYYY-MM-DD' */
  today: string;
  locale?: string;
};

/** Values of the medicine form (inferred from its zod schema). */
export type MedicineFormValues = z.infer<typeof medicineFormSchema>;
