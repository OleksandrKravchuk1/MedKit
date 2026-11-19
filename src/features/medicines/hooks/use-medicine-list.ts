import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMemo } from "react";

import { db } from "@/db/client";
import { medicines, medicineTags, packages } from "@/db/schema";
import { getCurrentLanguage } from "@/i18n";

import { buildMedicineList } from "../utils/medicine-list";
import { useToday } from "./use-today";

/**
 * Live medicines list with aggregated package data.
 * useLiveQuery re-runs only when the table in FROM changes (joined tables are
 * not tracked), so each table gets its own live query, combined in JS.
 */
export function useMedicineList() {
  const today = useToday();
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
      buildMedicineList({
        medicines: meds.data,
        activePackages: activePackages.data,
        links: links.data,
        today,
        locale: getCurrentLanguage(),
      }),
    [meds.data, activePackages.data, links.data, today],
  );

  return {
    data,
    error: meds.error ?? activePackages.error ?? links.error,
    isLoading: !meds.updatedAt || !activePackages.updatedAt || !links.updatedAt,
  };
}
