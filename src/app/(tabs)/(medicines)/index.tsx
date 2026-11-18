import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";

import { LoadingView } from "@/components/feedback/loading-view";
import { StateView } from "@/components/feedback/state-view";
import { Button } from "@/components/ui/button";
import { Fab } from "@/components/ui/fab";
import { MedicineCard } from "@/features/medicines/components/medicine-card";
import { MedicineFilterEmptyState } from "@/features/medicines/components/medicine-filter-empty-state";
import { useMedicineFilter } from "@/features/medicines/hooks/use-medicine-filter";
import { useMedicineList } from "@/features/medicines/hooks/use-medicine-list";
import { filterMedicines } from "@/features/medicines/utils/medicine-list";

export default function MedicinesScreen() {
  const { t } = useTranslation();
  const { data: medicines, error, isLoading } = useMedicineList();
  const { activeTagIds, isActive } = useMedicineFilter();

  const visible = filterMedicines(medicines, "", activeTagIds);
  const openNew = () => router.push("/medicine/new");
  const openMedicine = (id: number) =>
    router.push({ pathname: "/medicine/[id]", params: { id: String(id) } });

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

  if (medicines.length === 0) {
    return (
      <StateView
        title={t("medicineList.emptyTitle")}
        description={t("medicineList.emptyDescription")}
        action={
          <Button title={t("medicineList.addMedicine")} onPress={openNew} />
        }
      />
    );
  }

  return (
    <View collapsable={false} className="flex-1 bg-background">
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={visible}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="pb-24 pt-4"
        ListEmptyComponent={isActive ? <MedicineFilterEmptyState /> : undefined}
        renderItem={({ item }) => (
          <MedicineCard item={item} onPress={() => openMedicine(item.id)} />
        )}
      />
      <Fab
        onPress={openNew}
        accessibilityLabel={t("medicineList.addMedicine")}
      />
    </View>
  );
}
