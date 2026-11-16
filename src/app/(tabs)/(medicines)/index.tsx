import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, TextInput, View } from "react-native";

import { LoadingView } from "@/components/feedback/loading-view";
import { StateView } from "@/components/feedback/state-view";
import { Button } from "@/components/ui/button";
import { Fab } from "@/components/ui/fab";
import { MedicineCard } from "@/features/medicines/components/medicine-card";
import { useMedicineList } from "@/features/medicines/hooks/use-medicine-list";
import { filterMedicines } from "@/features/medicines/utils/medicine-list";
import { TagChips } from "@/features/tags/components/tag-chips";
import { useTags } from "@/features/tags/hooks/use-tags";
import { useThemeColors } from "@/hooks/use-theme-colors";

export default function MedicinesScreen() {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const { data: medicines, error, isLoading } = useMedicineList();
  const { data: tags } = useTags();
  const [search, setSearch] = useState("");
  const [tagIds, setTagIds] = useState<number[]>([]);

  const visible = filterMedicines(medicines, search, tagIds);
  const isFiltered = search.trim() !== "" || tagIds.length > 0;
  const openNew = () => router.push("/medicine/new");
  const resetFilters = () => {
    setSearch("");
    setTagIds([]);
  };

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
    // collapsable={false}: the wrapper must stay a native view so iOS treats the
    // FlatList as the screen's scroll view (content insets + large title collapse).
    <View collapsable={false} className="flex-1 bg-background">
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={visible}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerClassName="pb-24"
        ListHeaderComponent={
          <View className="gap-3 pb-3 pt-4">
            <View className="px-4">
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={t("medicineList.searchPlaceholder")}
                placeholderTextColor={colors.placeholder}
                autoCorrect={false}
                clearButtonMode="while-editing"
                accessibilityLabel={t("medicineList.searchPlaceholder")}
                className="rounded-xl border border-input bg-card px-3 py-2.5 text-[14px] text-foreground"
              />
            </View>
            {tags.length > 0 ? (
              <TagChips
                tags={tags}
                selectedIds={tagIds}
                onChange={setTagIds}
                horizontal
              />
            ) : null}
          </View>
        }
        ListEmptyComponent={
          isFiltered ? (
            <StateView
              title={t("medicineList.noResultsTitle")}
              description={t("medicineList.noResultsDescription")}
              action={
                <Button
                  title={t("medicineList.resetFilters")}
                  variant="ghost"
                  onPress={resetFilters}
                />
              }
            />
          ) : undefined
        }
        renderItem={({ item }) => (
          <MedicineCard
            item={item}
            onPress={() =>
              router.push({
                pathname: "/medicine/[id]",
                params: { id: String(item.id) },
              })
            }
          />
        )}
      />
      <Fab
        onPress={openNew}
        accessibilityLabel={t("medicineList.addMedicine")}
      />
    </View>
  );
}
