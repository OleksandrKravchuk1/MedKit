import type { Medicine, MedicineTag, Package } from "@/db/schema";
import { getExpiryStatus } from "@/lib/dates";

import type { MedicineListItem } from "../types/medicine-types";

/*
 * Pure list logic (no React, no DB): combines rows from the live queries into
 * list items, and filters them.
 */

type ActivePackageRow = Pick<Package, "medicineId" | "expiryDate" | "quantity">;

/** Builds list items sorted by nearest expiry; medicines without active packages go last. */
export function buildMedicineList(
  medicines: Medicine[],
  activePackages: ActivePackageRow[],
  links: MedicineTag[],
  options: { today?: Date; locale?: string } = {},
): MedicineListItem[] {
  const today = options.today ?? new Date();
  const nearest = new Map<number, string>();
  const counts = new Map<number, number>();
  const tagsByMedicine = new Map<number, number[]>();

  for (const p of activePackages) {
    const current = nearest.get(p.medicineId);
    if (!current || p.expiryDate < current) {
      nearest.set(p.medicineId, p.expiryDate);
    }
    counts.set(p.medicineId, (counts.get(p.medicineId) ?? 0) + p.quantity);
  }

  for (const l of links) {
    const ids = tagsByMedicine.get(l.medicineId) ?? [];
    ids.push(l.tagId);
    tagsByMedicine.set(l.medicineId, ids);
  }

  const items = medicines.map((m): MedicineListItem => {
    const nearestExpiry = nearest.get(m.id) ?? null;
    return {
      ...m,
      nearestExpiry,
      packCount: counts.get(m.id) ?? 0,
      tagIds: tagsByMedicine.get(m.id) ?? [],
      status: nearestExpiry ? getExpiryStatus(nearestExpiry, today) : "none",
    };
  });

  return items.sort((a, b) => {
    if (a.nearestExpiry !== b.nearestExpiry) {
      if (!a.nearestExpiry) return 1;
      if (!b.nearestExpiry) return -1;
      return a.nearestExpiry < b.nearestExpiry ? -1 : 1;
    }
    return a.name.localeCompare(b.name, options.locale);
  });
}

/** Case-insensitive name search; with tags selected, keeps medicines having any of them. */
export function filterMedicines(
  items: MedicineListItem[],
  search: string,
  tagIds: number[],
): MedicineListItem[] {
  const query = search.trim().toLocaleLowerCase();
  return items.filter((m) => {
    if (query && !m.name.toLocaleLowerCase().includes(query)) return false;
    if (tagIds.length > 0 && !m.tagIds.some((id) => tagIds.includes(id))) {
      return false;
    }
    return true;
  });
}
