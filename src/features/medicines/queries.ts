import { asc, desc, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMemo } from "react";

import { db } from "@/db/client";
import {
  medicines,
  medicineTags,
  packages,
  type Medicine,
  type Package,
  type Tag,
} from "@/db/schema";
import { useTags } from "@/features/tags/queries";
import { getCurrentLanguage } from "@/i18n";

import { buildMedicineList } from "./list-builder";

/*
 * useLiveQuery re-runs only when the table in FROM changes (joined tables are
 * not tracked), so each table gets its own live query and results are combined
 * in JS. A home medicine kit is small enough for this to be cheap.
 */

export function useMedicineList() {
  const meds = useLiveQuery(db.select().from(medicines));
  const activePackages = useLiveQuery(
    db
      .select({
        medicineId: packages.medicineId,
        expiryDate: packages.expiryDate,
        quantity: packages.quantity,
      })
      .from(packages)
      .where(eq(packages.status, "active")),
  );
  const links = useLiveQuery(db.select().from(medicineTags));

  const data = useMemo(
    () =>
      buildMedicineList(meds.data, activePackages.data, links.data, {
        locale: getCurrentLanguage(),
      }),
    [meds.data, activePackages.data, links.data],
  );

  return {
    data,
    error: meds.error ?? activePackages.error ?? links.error,
    isLoading: !meds.updatedAt || !activePackages.updatedAt || !links.updatedAt,
  };
}

export type MedicineDetails = {
  medicine: Medicine;
  activePackages: Package[];
  archivedPackages: Package[];
  tags: Tag[];
};

export function useMedicine(id: number) {
  const med = useLiveQuery(
    db.select().from(medicines).where(eq(medicines.id, id)),
    [id],
  );
  const pkgs = useLiveQuery(
    db
      .select()
      .from(packages)
      .where(eq(packages.medicineId, id))
      .orderBy(asc(packages.expiryDate), desc(packages.id)),
    [id],
  );
  const links = useLiveQuery(
    db
      .select({ tagId: medicineTags.tagId })
      .from(medicineTags)
      .where(eq(medicineTags.medicineId, id)),
    [id],
  );
  const allTags = useTags();

  const data = useMemo<MedicineDetails | null>(() => {
    const medicine = med.data[0];
    if (!medicine) return null;
    const tagIds = new Set(links.data.map((l) => l.tagId));
    return {
      medicine,
      activePackages: pkgs.data.filter((p) => p.status === "active"),
      archivedPackages: pkgs.data.filter((p) => p.status !== "active"),
      tags: allTags.data.filter((t) => tagIds.has(t.id)),
    };
  }, [med.data, pkgs.data, links.data, allTags.data]);

  return {
    data,
    error: med.error ?? pkgs.error ?? links.error ?? allTags.error,
    isLoading:
      !med.updatedAt ||
      !pkgs.updatedAt ||
      !links.updatedAt ||
      !allTags.updatedAt,
  };
}
