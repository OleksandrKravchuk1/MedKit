import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";

import { LoadingView } from "@/components/feedback/loading-view";
import { StateView } from "@/components/feedback/state-view";
import { MedicineFilterEmptyState } from "@/features/medicines/components/filter/medicine-filter-empty-state";
import { AddMedicineFab } from "@/features/medicines/components/list/add-medicine-fab";
import { MedicineCard } from "@/features/medicines/components/list/medicine-card";
import { useMedicineFilter } from "@/features/medicines/hooks/list/use-medicine-filter";
import { useMedicineList } from "@/features/medicines/hooks/list/use-medicine-list";
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
      <View className="flex-1 bg-background">
        <StateView
          title={t("medicineList.emptyTitle")}
          description={t("medicineList.emptyDescription")}
        />
        <AddMedicineFab onPress={openNew} />
      </View>
    );
  }

  return (
    <View collapsable={false} className="flex-1 bg-background">
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={visible}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="pt-4 pb-6 android:pb-24"
        ListEmptyComponent={isActive ? <MedicineFilterEmptyState /> : undefined}
        renderItem={({ item }) => (
          <MedicineCard item={item} onPress={() => openMedicine(item.id)} />
        )}
      />
      <AddMedicineFab onPress={openNew} />
    </View>
  );
}
