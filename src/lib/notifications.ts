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

/**
 * Shows notifications while the app is in the foreground and creates the
 * Android channel. On Android 13+ the permission prompt appears only after a
 * channel exists, so call this before requesting permission.
 */
export async function setupNotifications(channelName: string): Promise<void> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(EXPIRY_CHANNEL_ID, {
      name: channelName,
      importance: AndroidImportance.DEFAULT,
    });
  }
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

/**
 * Asks for notification permission unless it is already decided.
 * Resolves to whether notifications are allowed.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (isAllowed(current) || !current.canAskAgain) {
    return isAllowed(current);
  }

  return isAllowed(await Notifications.requestPermissionsAsync());
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
