import { Form, Host, Section, Text } from "@expo/ui/swift-ui";
import {
  foregroundStyle,
  scrollContentBackground,
} from "@expo/ui/swift-ui/modifiers";
import { useTranslation } from "react-i18next";
import { Text as RNText, View } from "react-native";

import { SheetCloseButton } from "@/components/ui/sheet-close-button";
import { TagSelectRow } from "@/features/tags/components/tag-select-row";

import { useMedicineFilter } from "../../hooks/use-medicine-filter";
import type { MedicineFilterSheetProps } from "./medicine-filter-sheet";

const secondaryText = foregroundStyle({
  type: "hierarchical",
  style: "secondary",
});

export function MedicineFilterSheet({ onClose }: MedicineFilterSheetProps) {
  const { t } = useTranslation();
  const { tags, tagsLoaded, tagIds, toggleTag } = useMedicineFilter();

  if (!tagsLoaded) return null;

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-5 pb-1 pt-7">
        <RNText
          accessibilityRole="header"
          className="mr-4 flex-1 text-3xl font-bold text-foreground"
          numberOfLines={1}
        >
          {t("medicineFilter.title")}
        </RNText>
        <SheetCloseButton onPress={onClose} />
      </View>

      <Host style={{ flex: 1 }}>
        <Form modifiers={[scrollContentBackground("hidden")]}>
          {tags.length === 0 ? (
            <Section>
              <Text modifiers={[secondaryText]}>
                {t("medicineFilter.noTags")}
              </Text>
            </Section>
          ) : (
            <Section>
              {tags.map((tag) => (
                <TagSelectRow
                  key={tag.id}
                  tag={tag}
                  selected={tagIds.includes(tag.id)}
                  onPress={() => toggleTag(tag.id)}
                />
              ))}
            </Section>
          )}
        </Form>
      </Host>
    </View>
  );
}
