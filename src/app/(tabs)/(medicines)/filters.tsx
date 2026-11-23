import { router } from "expo-router";

import { MedicineFilterSheet } from "@/features/medicines/ui/views/medicine-filter-sheet";

export default function FiltersScreen() {
  return <MedicineFilterSheet onClose={() => router.back()} />;
}
