import { ScrollView, View } from "react-native";

import { Chip } from "@/components/ui/chip";
import type { Tag } from "@/db/schema";

type TagChipsProps = {
  tags: Tag[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  /** Single scrollable row (list filter) instead of wrapping (form). */
  horizontal?: boolean;
  disabled?: boolean;
};

/** Multi-select tag chips. */
export function TagChips({
  tags,
  selectedIds,
  onChange,
  horizontal = false,
  disabled = false,
}: TagChipsProps) {
  const toggle = (id: number) =>
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    );

  const chips = tags.map((tag) => (
    <Chip
      key={tag.id}
      label={tag.name}
      color={tag.color}
      selected={selectedIds.includes(tag.id)}
      onPress={() => toggle(tag.id)}
      disabled={disabled}
    />
  ));

  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-4"
        keyboardShouldPersistTaps="handled"
      >
        {chips}
      </ScrollView>
    );
  }

  return <View className="flex-row flex-wrap gap-2">{chips}</View>;
}
