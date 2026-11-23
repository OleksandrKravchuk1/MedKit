import { useEffect, useState } from "react";

import i18n from "@/i18n";
import {
  requestNotificationPermission,
  setupNotifications,
} from "@/lib/notifications";

/**
 * Creates the Android channel and the foreground handler once `enabled`
 * (database and language ready), then asks for permission.
 * Returns true when reminders can be scheduled.
 *
 * TODO(stage 3d): ask for permission in onboarding, with an explanation.
 */
export function useNotificationSetup(enabled: boolean): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    setupNotifications(i18n.t("notifications.channelName"))
      .then(requestNotificationPermission)
      .catch((error: unknown) => {
        console.warn("Notification setup failed", error);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return ready;
}
