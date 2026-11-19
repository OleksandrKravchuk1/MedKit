import { router } from "expo-router";

import { MedicineFilterSheet } from "@/features/medicines/components/filter/medicine-filter-sheet";

export default function FiltersScreen() {
  return <MedicineFilterSheet onClose={() => router.back()} />;
}
