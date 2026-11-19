import { SymbolView } from "expo-symbols";
import { Pressable, Text, View } from "react-native";

import type { Tag } from "@/db/schema";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { cn } from "@/lib/cn";

export type TagSelectRowProps = {
  tag: Pick<Tag, "name" | "color">;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  /** Android: draws the separator above the row (all rows except the first). */
  separator?: boolean;
};

/** Row of a grouped list: colour dot, tag name and a checkmark when selected. */
export function TagSelectRow({
  tag,
  selected,
  onPress,
  disabled = false,
  separator = false,
}: TagSelectRowProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={tag.name}
      onPress={onPress}
      disabled={disabled}
      className={cn("active:bg-subtle", disabled && "opacity-50")}
    >
      <View
        className={cn(
          "ml-5 flex-row items-center py-5 pr-5",
          separator && "border-t border-border",
        )}
      >
        <View
          className="mr-4 h-3.5 w-3.5 rounded-full"
          style={{ backgroundColor: tag.color }}
        />
        <Text className="flex-1 text-lg text-foreground">{tag.name}</Text>
        {selected ? (
          <SymbolView
            name={{ ios: "checkmark", android: "check", web: "check" }}
            weight="semibold"
            tintColor={colors.primary}
            size={20}
          />
        ) : null}
      </View>
    </Pressable>
  );
}
