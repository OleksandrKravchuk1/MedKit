import { useEffect, useState } from "react";

import i18n from "@/i18n";
import { setupNotifications } from "@/lib/notifications";

/**
 * Creates the Android channel and the foreground handler once `enabled`
 * (database and language ready), then asks for permission.
 * Returns true when reminders can be scheduled.
 */

/** Resolves once the Android channel and the foreground handler exist. */
let setupDone: Promise<void> | null = null;

export function ensureNotificationSetup(): Promise<void> {
  setupDone ??= setupNotifications(i18n.t("notifications.channelName")).catch(
    (error: unknown) => {
      console.warn("Notification setup failed", error);
    },
  );
  return setupDone;
}

export function useNotificationSetup(enabled: boolean): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    void ensureNotificationSetup().then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return ready;
}
