import { asc, desc, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMemo } from "react";

import { db } from "@/db/client";
import { medicines, medicineTags, packages } from "@/db/schema";
import { useTags } from "@/features/tags/hooks/use-tags";
import { daysUntil, getExpiryStatus } from "@/lib/dates";

import type { MedicineDetails } from "../../types/medicine-types";
import { useToday } from "@/hooks/use-today";

/**
 * Live details of one medicine: the medicine, its packages (active/archived)
 * and tags. One live query per table, see useMedicineList.
 */
export function useMedicine(id: number) {
  const today = useToday();
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
      activePackages: pkgs.data
        .filter((p) => p.status === "active")
        .map((p) => ({
          ...p,
          expiryStatus: getExpiryStatus(p.expiryDate, today),
          daysLeft: daysUntil(p.expiryDate, today),
        })),
      archivedPackages: pkgs.data.filter((p) => p.status !== "active"),
      tags: allTags.data.filter((t) => tagIds.has(t.id)),
    };
  }, [med.data, pkgs.data, links.data, allTags.data, today]);

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
