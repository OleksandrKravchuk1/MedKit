import type { z } from "zod";

import type { MedicineForm } from "@/constants/medicine";
import type { Medicine, Package, Tag } from "@/db/schema";
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
};

/** Everything the details screen shows. */
export type MedicineDetails = {
  medicine: Medicine;
  activePackages: Package[];
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

/** Values of the medicine form (inferred from its zod schema). */
export type MedicineFormValues = z.infer<typeof medicineFormSchema>;
