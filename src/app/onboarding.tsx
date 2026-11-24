import { useState } from "react";

import { useRequestNotificationPermission } from "@/features/notifications/hooks/use-request-notification-permission";
import { OnboardingView } from "@/features/onboarding/ui/views/onboarding-view";
import { completeOnboarding } from "@/features/settings/mutations/settings-mutations";
import { runSafely } from "@/lib/alerts";

export default function OnboardingScreen() {
  const requestPermission = useRequestNotificationPermission();
  const [isBusy, setIsBusy] = useState(false);

  const handleContinue = async () => {
    setIsBusy(true);
    await requestPermission();
    if (!runSafely(completeOnboarding)) setIsBusy(false);
  };

  return (
    <OnboardingView onContinue={() => void handleContinue()} isBusy={isBusy} />
  );
}
