import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { useThemeColors } from "@/hooks/use-theme-colors";

import type { OnboardingFeature } from "../../constants/onboarding-constants";

export type OnboardingFeatureRowProps = {
  feature: OnboardingFeature;
};

/** Icon with a short title and description */
export function OnboardingFeatureRow({ feature }: OnboardingFeatureRowProps) {
  const { t } = useTranslation();
  const { colors } = useThemeColors();

  return (
    <View className="flex-row items-start gap-4">
      <SymbolView name={feature.icon} tintColor={colors.primary} size={32} />
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">
          {t(`onboarding.features.${feature.key}.title`)}
        </Text>
        <Text className="text-muted">
          {t(`onboarding.features.${feature.key}.text`)}
        </Text>
      </View>
    </View>
  );
}
