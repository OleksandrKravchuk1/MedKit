import { router, Stack } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native";

import { LoadingView } from "@/components/feedback/loading-view";
import { StateView } from "@/components/feedback/state-view";
import { MedicineCard } from "@/features/medicines/components/list/medicine-card";
import { useMedicineList } from "@/features/medicines/hooks/use-medicine-list";
import { filterMedicines } from "@/features/medicines/utils/medicine-list";

export default function SearchScreen() {
  const { t } = useTranslation();
  const { data: medicines, error, isLoading } = useMedicineList();
  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const results = trimmed ? filterMedicines(medicines, trimmed, []) : [];

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
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: t("search.placeholder"),
            onChangeText: (e) => setQuery(e.nativeEvent.text),
            onCancelButtonPress: () => setQuery(""),
            hideWhenScrolling: false,
          },
        }}
      />
      <FlatList
        className="flex-1 bg-background"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="pb-6 pt-4"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        data={results}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          trimmed ? (
            <StateView
              title={t("search.noResultsTitle")}
              description={t("search.noResultsDescription")}
            />
          ) : (
            <StateView
              title={t("search.hintTitle")}
              description={t("search.hintDescription")}
            />
          )
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
    </>
  );
}
