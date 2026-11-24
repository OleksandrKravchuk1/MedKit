import { Button, Host, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import {
  buttonStyle,
  controlSize,
  disabled,
  font,
  frame,
  multilineTextAlignment,
  padding,
} from "@expo/ui/swift-ui/modifiers";
import { useTranslation } from "react-i18next";

import { secondaryText } from "@/constants/swift-ui-styles";

import { ONBOARDING_FEATURES } from "../../constants/onboarding-constants";
import { OnboardingFeatureRow } from "../components/onboarding-feature-row";
import type { OnboardingViewProps } from "./onboarding-view";

export function OnboardingView({ onContinue, isBusy }: OnboardingViewProps) {
  const { t } = useTranslation();

  return (
    <Host style={{ flex: 1 }}>
      <VStack
        spacing={32}
        modifiers={[padding({ horizontal: 32, vertical: 16 })]}
      >
        <Spacer />
        <Text
          modifiers={[
            font({ textStyle: "largeTitle", weight: "bold" }),
            multilineTextAlignment("center"),
          ]}
        >
          {t("onboarding.title")}
        </Text>
        <VStack alignment="leading" spacing={24}>
          {ONBOARDING_FEATURES.map((feature) => (
            <OnboardingFeatureRow key={feature.key} feature={feature} />
          ))}
        </VStack>
        <Spacer />
        <VStack spacing={16}>
          <Text
            modifiers={[
              font({ textStyle: "footnote" }),
              secondaryText,
              multilineTextAlignment("center"),
            ]}
          >
            {t("onboarding.notificationsNote")}
          </Text>
          <Button
            onPress={onContinue}
            modifiers={[
              buttonStyle("borderedProminent"),
              controlSize("large"),
              disabled(isBusy),
            ]}
          >
            <Text modifiers={[frame({ maxWidth: Infinity })]}>
              {t("onboarding.continue")}
            </Text>
          </Button>
        </VStack>
      </VStack>
    </Host>
  );
}
