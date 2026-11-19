import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

import { useThemeColors } from "@/hooks/use-theme-colors";

type MedicineFilterButtonProps = {
  activeCount: number;
  onPress: () => void;
};

/**
 * Header button that opens the tag filter sheet, used on Android.
 * On iOS the screen uses a native header item (unstable_headerRightItems),
 * which gets the system Liquid Glass background on iOS 26.
 */
export function MedicineFilterButton({
  activeCount,
  onPress,
}: MedicineFilterButtonProps) {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const active = activeCount > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        active
          ? t("medicineFilter.openActive", { n: activeCount })
          : t("medicineFilter.open")
      }
      onPress={onPress}
      hitSlop={8}
      className="items-center justify-center active:opacity-60"
    >
      <SymbolView
        name={{
          ios: active
            ? "line.3.horizontal.decrease.circle.fill"
            : "line.3.horizontal.decrease.circle",
          android: active ? "filter_alt" : "filter_list",
          web: active ? "filter_alt" : "filter_list",
        }}
        tintColor={colors.primary}
        size={24}
      />
    </Pressable>
  );
}
