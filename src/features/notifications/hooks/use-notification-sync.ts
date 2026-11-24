import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { MAX_SCHEDULED_NOTIFICATIONS } from "@/constants/notifications";
import { db } from "@/db/client";
import { medicines, packages } from "@/db/schema";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { useToday } from "@/hooks/use-today";
import i18n from "@/i18n";
import { formatDate, formatDaysLeft } from "@/i18n/format";
import { daysUntil, toIsoDate } from "@/lib/dates";
import { replaceScheduledReminders, type Reminder } from "@/lib/notifications";

import type { NotificationPlanItem } from "../types/notification-types";
import { buildNotificationPlan } from "../utils/notification-plan";
import { useNotificationPermission } from "./use-notification-permission";

function toReminder(item: NotificationPlanItem): Reminder {
  const daysLeft = daysUntil(item.expiryDate, toIsoDate(item.date));
  return {
    id: `package-${item.packageId}`,
    date: item.date,
    medicineId: item.medicineId,
    title: item.medicineName,
    body: i18n.t("notifications.body", {
      date: formatDate(item.expiryDate),
      left: formatDaysLeft(daysLeft),
    }),
  };
}

/**
 * Keeps scheduled reminders in step with the data: on any change of
 * medicines, active packages, reminder settings or language, and once a day
 * (the nearest-60 window moves), all reminders are replaced.
 */
export function useNotificationSync(enabled: boolean): void {
  const { i18n: i18nInstance } = useTranslation();
  const { allowed } = useNotificationPermission();
  const today = useToday();
  const settings = useSettings();
  const meds = useLiveQuery(
    db.select({ id: medicines.id, name: medicines.name }).from(medicines),
  );
  const activePackages = useLiveQuery(
    db
      .select({
        id: packages.id,
        medicineId: packages.medicineId,
        expiryDate: packages.expiryDate,
        createdAt: packages.createdAt,
      })
      .from(packages)
      .where(eq(packages.status, "active")),
  );
  // Syncs run one after another, so an older one cannot finish last.
  const queue = useRef(Promise.resolve());

  const loaded =
    !settings.isLoading &&
    meds.updatedAt !== undefined &&
    activePackages.updatedAt !== undefined;
  const { remindDaysBefore, notifyTime } = settings.data;
  const language = i18nInstance.language;

  useEffect(() => {
    if (!enabled || !loaded || !allowed) return;

    const reminders = buildNotificationPlan({
      packages: activePackages.data,
      medicineNames: new Map(meds.data.map((med) => [med.id, med.name])),
      remindDaysBefore,
      notifyTime,
      now: new Date(),
      limit: MAX_SCHEDULED_NOTIFICATIONS,
    }).map(toReminder);

    queue.current = queue.current
      .then(() => replaceScheduledReminders(reminders))
      .catch((error: unknown) => {
        console.warn("Scheduling reminders failed", error);
      });
  }, [
    enabled,
    loaded,
    allowed,
    meds.data,
    activePackages.data,
    remindDaysBefore,
    notifyTime,
    language,
    today,
  ]);
}
