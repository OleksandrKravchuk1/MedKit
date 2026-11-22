import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";

import { StateView } from "@/components/feedback/state-view";

import type { MedicineListItem } from "../../types/medicine-types";
import { MedicineFilterEmptyState } from "../components/filter/medicine-filter-empty-state";
import { AddMedicineFab } from "../components/list/add-medicine-fab";
import { MedicineCard } from "../components/list/medicine-card";

export type MedicineListViewProps = {
  /** Medicines to show, already filtered and sorted. */
  items: MedicineListItem[];
  /** No medicines at all (not just none matching the filter). */
  isEmpty: boolean;
  /** The tag filter is on: an empty list offers to reset it. */
  isFiltered: boolean;
  onAdd: () => void;
  onOpenMedicine: (id: number) => void;
};

/**
 * Medicines list: cards, the empty state and the add button (FAB on
 * Android; on iOS "+" is in the navigation bar).
 */
export function MedicineListView({
  items,
  isEmpty,
  isFiltered,
  onAdd,
  onOpenMedicine,
}: MedicineListViewProps) {
  const { t } = useTranslation();

  if (isEmpty) {
    return (
      <View className="flex-1 bg-background">
        <StateView
          title={t("medicineList.emptyTitle")}
          description={t("medicineList.emptyDescription")}
        />
        <AddMedicineFab onPress={onAdd} />
      </View>
    );
  }

  return (
    <View collapsable={false} className="flex-1 bg-background">
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="pt-4 pb-6 android:pb-24"
        ListEmptyComponent={
          isFiltered ? <MedicineFilterEmptyState /> : undefined
        }
        renderItem={({ item }) => (
          <MedicineCard item={item} onPress={() => onOpenMedicine(item.id)} />
        )}
      />
      <AddMedicineFab onPress={onAdd} />
    </View>
  );
}
