import { Button, HStack, Image, Spacer, Text } from "@expo/ui/swift-ui";
import { disabled as disabledModifier } from "@expo/ui/swift-ui/modifiers";

import { primaryText } from "@/constants/swift-ui-styles";
import { useThemeColors } from "@/hooks/use-theme-colors";

import type { TagSelectRowProps } from "./tag-select-row";

/**
 * SwiftUI row of a tag list: colour dot, name and a checkmark when selected.
 * Renders SwiftUI views, so it must be placed inside a Host (Form/Section).
 */
export function TagSelectRow({
  tag,
  selected,
  onPress,
  disabled = false,
}: TagSelectRowProps) {
  const { colors } = useThemeColors();

  return (
    <Button onPress={onPress} modifiers={[disabledModifier(disabled)]}>
      <HStack spacing={12}>
        <Image systemName="circle.fill" color={tag.color} size={12} />
        <Text modifiers={[primaryText]}>{tag.name}</Text>
        <Spacer />
        {selected && (
          <Image systemName="checkmark" color={colors.primary} size={15} />
        )}
      </HStack>
    </Button>
  );
}
