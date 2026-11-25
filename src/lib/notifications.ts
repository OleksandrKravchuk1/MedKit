import * as Notifications from "expo-notifications";
import { AndroidImportance, IosAuthorizationStatus } from "expo-notifications";
import { Platform } from "react-native";

import { EXPIRY_CHANNEL_ID } from "@/constants/notifications";

/*
 * Local notifications only (no push). Thin wrappers over expo-notifications;
 * what to schedule is decided in features/notifications.
 */

export type Reminder = {
  id: string;
  date: Date;
  title: string;
  body: string;
  medicineId: number;
};

export type NotificationPermission = {
  allowed: boolean;
  /** False once the system will not show the prompt again. */
  canAskAgain: boolean;
};

/**
 * Shows reminders that arrive while the app is open. Call once at module
 * scope of the root layout, as the expo-notifications docs do.
 */
export function showNotificationsInForeground(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Creates (or renames) the Android channel for reminders; no-op elsewhere.
 * Android 13+ shows the permission prompt only after a channel exists.
 */
export async function createExpiryChannel(name: string): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(EXPIRY_CHANNEL_ID, {
    name,
    importance: AndroidImportance.DEFAULT,
  });
}

function toPermission(
  permissions: Notifications.NotificationPermissionsStatus,
): NotificationPermission {
  return {
    allowed: isAllowed(permissions),
    canAskAgain: permissions.canAskAgain,
  };
}

function isAllowed(permissions: Notifications.NotificationPermissionsStatus) {
  // iOS has granular states (provisional, ephemeral) beyond plain "granted".
  const iosStatus = permissions.ios?.status;
  if (iosStatus !== undefined) {
    return (
      iosStatus === IosAuthorizationStatus.AUTHORIZED ||
      iosStatus === IosAuthorizationStatus.PROVISIONAL ||
      iosStatus === IosAuthorizationStatus.EPHEMERAL
    );
  }
  return permissions.granted;
}

/** Current notification permission, without asking. */
export async function getNotificationPermission(): Promise<NotificationPermission> {
  return toPermission(await Notifications.getPermissionsAsync());
}

/** Asks for notification permission unless it is already decided. */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  const current = await Notifications.getPermissionsAsync();
  if (isAllowed(current) || !current.canAskAgain) return toPermission(current);
  return toPermission(await Notifications.requestPermissionsAsync());
}

/** Cancels every scheduled notification and schedules `reminders` instead. */
export async function replaceScheduledReminders(
  reminders: Reminder[],
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Promise.all(
    reminders.map((reminder) =>
      Notifications.scheduleNotificationAsync({
        identifier: reminder.id,
        content: {
          title: reminder.title,
          body: reminder.body,
          data: { medicineId: reminder.medicineId },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: reminder.date,
          channelId: EXPIRY_CHANNEL_ID,
        },
      }),
    ),
  );
}

/**
 * Calls `onOpen` with the medicine id when a reminder is tapped, including
 * the tap that launched the app. Returns an unsubscribe function.
 */
export function subscribeToReminderTaps(
  onOpen: (medicineId: number) => void,
): () => void {
  const handle = (response: Notifications.NotificationResponse) => {
    // Clear first, so the same tap is not handled again on the next mount.
    Notifications.clearLastNotificationResponse();
    const medicineId = response.notification.request.content.data?.medicineId;
    if (typeof medicineId === "number") onOpen(medicineId);
  };

  const launchResponse = Notifications.getLastNotificationResponse();
  if (launchResponse) handle(launchResponse);

  const subscription =
    Notifications.addNotificationResponseReceivedListener(handle);
  return () => subscription.remove();
}
