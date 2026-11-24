import { HStack, Image, Text, VStack } from "@expo/ui/swift-ui";
import { font } from "@expo/ui/swift-ui/modifiers";
import { useTranslation } from "react-i18next";

import { secondaryText } from "@/constants/swift-ui-styles";
import { useThemeColors } from "@/hooks/use-theme-colors";

import type { OnboardingFeatureRowProps } from "./onboarding-feature-row";

export function OnboardingFeatureRow({ feature }: OnboardingFeatureRowProps) {
  const { t } = useTranslation();
  const { colors } = useThemeColors();

  return (
    <HStack spacing={16}>
      <Image systemName={feature.icon.ios} color={colors.primary} size={32} />
      <VStack alignment="leading" spacing={2}>
        <Text modifiers={[font({ textStyle: "headline" })]}>
          {t(`onboarding.features.${feature.key}.title`)}
        </Text>
        <Text modifiers={[font({ textStyle: "subheadline" }), secondaryText]}>
          {t(`onboarding.features.${feature.key}.text`)}
        </Text>
      </VStack>
    </HStack>
  );
}
