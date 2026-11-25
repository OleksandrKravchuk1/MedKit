import { useState } from "react";

import { askNotificationPermission } from "@/features/notifications/hooks/use-notification-permission";
import { OnboardingView } from "@/features/onboarding/ui/views/onboarding-view";
import { completeOnboarding } from "@/features/settings/mutations/settings-mutations";
import { runSafely } from "@/lib/alerts";

export default function OnboardingScreen() {
  const [isBusy, setIsBusy] = useState(false);

  const handleContinue = async () => {
    setIsBusy(true);
    // The answer does not matter: the app works without notifications.
    await askNotificationPermission();
    // Flips the guard in the root layout, which then opens the tabs.
    if (!runSafely(completeOnboarding)) setIsBusy(false);
  };

  return (
    <OnboardingView onContinue={() => void handleContinue()} isBusy={isBusy} />
  );
}
