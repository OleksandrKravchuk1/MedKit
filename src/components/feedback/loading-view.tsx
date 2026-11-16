import { ActivityIndicator, View } from "react-native";

import { useThemeColors } from "@/hooks/use-theme-colors";

export function LoadingView() {
  const { colors } = useThemeColors();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color={colors.muted} />
    </View>
  );
}
