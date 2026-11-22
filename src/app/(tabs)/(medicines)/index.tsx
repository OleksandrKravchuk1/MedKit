import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { LoadingView } from "@/components/feedback/loading-view";
import { StateView } from "@/components/feedback/state-view";
import { useMedicineFilter } from "@/features/medicines/hooks/list/use-medicine-filter";
import { useMedicineList } from "@/features/medicines/hooks/list/use-medicine-list";
import { MedicineListView } from "@/features/medicines/ui/views/medicine-list-view";
import { filterMedicines } from "@/features/medicines/utils/medicine-list";

export default function MedicinesScreen() {
  const { t } = useTranslation();
  const { data: medicines, error, isLoading } = useMedicineList();
  const { activeTagIds, isActive } = useMedicineFilter();

  if (error) {
    return (
      <StateView
        tone="error"
        title={t("medicineList.loadFailed")}
        description={error.message}
      />
    );
  }

  if (isLoading) return <LoadingView />;

  return (
    <MedicineListView
      items={filterMedicines(medicines, "", activeTagIds)}
      isEmpty={medicines.length === 0}
      isFiltered={isActive}
      onAdd={() => router.push("/medicine/new")}
      onOpenMedicine={(id) =>
        router.push({ pathname: "/medicine/[id]", params: { id: String(id) } })
      }
    />
  );
}
