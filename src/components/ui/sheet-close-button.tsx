import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, View } from "react-native";

import { useThemeColors } from "@/hooks/use-theme-colors";

const SIZE = 44;
const ICON_SIZE = 17;

const circle = {
  width: SIZE,
  height: SIZE,
  borderRadius: SIZE / 2,
  alignItems: "center",
  justifyContent: "center",
} as const;

type SheetCloseButtonProps = {
  onPress: () => void;
};

export function SheetCloseButton({ onPress }: SheetCloseButtonProps) {
  const { t } = useTranslation();
  const { colors } = useThemeColors();

  const icon = (
    <SymbolView
      name={{ ios: "xmark", android: "close", web: "close" }}
      weight="semibold"
      tintColor={colors.muted}
      size={ICON_SIZE}
    />
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t("common.close")}
      onPress={onPress}
      hitSlop={8}
      className="active:opacity-70"
    >
      {Platform.OS === "ios" && isLiquidGlassAvailable() ? (
        <GlassView isInteractive glassEffectStyle="regular" style={circle}>
          {icon}
        </GlassView>
      ) : (
        <View className="bg-subtle" style={circle}>
          {icon}
        </View>
      )}
    </Pressable>
  );
}
