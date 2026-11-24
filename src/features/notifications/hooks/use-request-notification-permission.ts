import { requestNotificationPermission } from "@/lib/notifications";
import { ensureNotificationSetup } from "./use-notification-setup";

/**
 * Asks for notification permission after the channel exists (Android 13+
 * shows the prompt only then). Never rejects: a failure counts as "denied".
 */

export function useRequestNotificationPermission() {
  return async (): Promise<boolean> => {
    await ensureNotificationSetup();
    return requestNotificationPermission().catch(() => false);
  };
}
