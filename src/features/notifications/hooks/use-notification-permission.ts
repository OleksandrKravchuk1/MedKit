import { useEffect, useState } from "react";
import { AppState, Linking } from "react-native";

import i18n from "@/i18n";
import {
  createExpiryChannel,
  getNotificationPermission,
  requestNotificationPermission,
  type NotificationPermission,
} from "@/lib/notifications";

let channelReady: Promise<void> | null = null;

/**
 * Creates the Android reminder channel once per launch. Needed before the
 * permission prompt (Android 13+) and before scheduling. Never rejects.
 */
export function ensureExpiryChannel(): Promise<void> {
  channelReady ??= createExpiryChannel(
    i18n.t("notifications.channelName"),
  ).catch((error: unknown) => {
    console.warn("Creating the notification channel failed", error);
  });
  return channelReady;
}

/**
 * Asks for notification permission, creating the channel first.
 * Never rejects: a failure counts as denied.
 */
export async function askNotificationPermission(): Promise<NotificationPermission> {
  await ensureExpiryChannel();
  return requestNotificationPermission().catch(() => ({
    allowed: false,
    canAskAgain: false,
  }));
}

/**
 * Notification permission, rechecked whenever the app returns to the
 * foreground (the user may change it in system settings). `allowed` is null
 * until the first check. `enable` asks again when the system still allows it,
 * otherwise opens the app's system settings.
 */
export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null,
  );

  useEffect(() => {
    const refresh = () => {
      getNotificationPermission()
        .then(setPermission)
        .catch((error: unknown) => {
          console.warn("Reading notification permission failed", error);
        });
    };

    refresh();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    return () => subscription.remove();
  }, []);

  const enable = async () => {
    if (permission?.canAskAgain) {
      setPermission(await askNotificationPermission());
    } else {
      await Linking.openSettings();
    }
  };

  return { allowed: permission?.allowed ?? null, enable };
}
