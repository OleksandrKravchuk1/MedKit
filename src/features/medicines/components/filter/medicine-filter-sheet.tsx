import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SheetCloseButton } from "@/components/ui/sheet-close-button";
import { TagSelectRow } from "@/features/tags/components/tag-select-row";

import { useMedicineFilter } from "../../hooks/list/use-medicine-filter";

const EDGE_GAP = 20;

export type MedicineFilterSheetProps = {
  onClose: () => void;
};

export function MedicineFilterSheet({ onClose }: MedicineFilterSheetProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { tags, tagsLoaded, tagIds, toggleTag } = useMedicineFilter();

  const bottomGap = insets.bottom + EDGE_GAP;

  if (!tagsLoaded) return null;

  return (
    <View
      className="bg-background"
      style={{ paddingHorizontal: EDGE_GAP, paddingBottom: bottomGap }}
    >
      <View className="flex-row items-center justify-between pb-5 pt-7">
        <Text
          accessibilityRole="header"
          className="mr-4 flex-1 text-3xl font-bold text-foreground"
          numberOfLines={1}
        >
          {t("medicineFilter.title")}
        </Text>
        <SheetCloseButton onPress={onClose} />
      </View>

      {tags.length === 0 ? (
        <Text className="py-8 text-center text-lg text-muted">
          {t("medicineFilter.noTags")}
        </Text>
      ) : (
        <View className="overflow-hidden rounded-3xl bg-card">
          {tags.map((tag, index) => (
            <TagSelectRow
              key={tag.id}
              tag={tag}
              selected={tagIds.includes(tag.id)}
              onPress={() => toggleTag(tag.id)}
              separator={index > 0}
            />
          ))}
        </View>
      )}
    </View>
  );
}
