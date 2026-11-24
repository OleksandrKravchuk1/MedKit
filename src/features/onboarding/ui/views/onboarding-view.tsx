import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";

import { ONBOARDING_FEATURES } from "../../constants/onboarding-constants";
import { OnboardingFeatureRow } from "../components/onboarding-feature-row";

export type OnboardingViewProps = {
  onContinue: () => void;
  isBusy: boolean;
};

export function OnboardingView({ onContinue, isBusy }: OnboardingViewProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-8 py-12">
        <Text className="mb-10 text-center text-3xl font-bold text-foreground">
          {t("onboarding.title")}
        </Text>
        <View className="gap-6">
          {ONBOARDING_FEATURES.map((feature) => (
            <OnboardingFeatureRow key={feature.key} feature={feature} />
          ))}
        </View>
      </ScrollView>

      <View className="gap-4 px-8 pb-6">
        <Text className="text-center text-sm text-muted">
          {t("onboarding.notificationsNote")}
        </Text>
        <Button
          title={t("onboarding.continue")}
          onPress={onContinue}
          loading={isBusy}
          size="lg"
        />
      </View>
    </View>
  );
}
