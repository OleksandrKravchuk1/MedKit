import { useEffect, useState } from "react";
import { AppState, Linking } from "react-native";

import {
  getNotificationPermission,
  type NotificationPermission,
} from "@/lib/notifications";

import { useRequestNotificationPermission } from "./use-request-notification-permission";

/**
 * Notification permission, rechecked whenever the app returns to the
 * foreground (the user may change it in system settings). `allowed` is null
 * until the first check. `enable` asks again when the system still allows it,
 * otherwise opens the app's system settings.
 */
export function useNotificationPermission() {
  const requestPermission = useRequestNotificationPermission();
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null,
  );

  const refresh = () =>
    getNotificationPermission()
      .then(setPermission)
      .catch((error: unknown) => {
        console.warn("Reading notification permission failed", error);
      });

  useEffect(() => {
    void refresh();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void refresh();
    });
    return () => subscription.remove();
  }, []);

  const enable = async () => {
    if (permission?.canAskAgain) {
      await requestPermission();
      await refresh();
    } else {
      await Linking.openSettings();
    }
  };

  return { allowed: permission?.allowed ?? null, enable };
}
