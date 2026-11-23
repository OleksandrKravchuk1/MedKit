import { getReminderDate } from "@/lib/dates";

import type {
  NotificationPlanItem,
  ReminderPackage,
} from "../types/notification-types";

type BuildNotificationPlanInput = {
  /** Active packages only. */
  packages: ReminderPackage[];
  medicineNames: Map<number, string>;
  remindDaysBefore: number;
  notifyTime: string;
  now: Date;
  limit: number;
};

/**
 * Reminders still ahead of `now`, soonest first, at most `limit` of them
 * (iOS keeps only a limited number of pending notifications).
 */
export function buildNotificationPlan({
  packages,
  medicineNames,
  remindDaysBefore,
  notifyTime,
  now,
  limit,
}: BuildNotificationPlanInput): NotificationPlanItem[] {
  const plan: NotificationPlanItem[] = [];

  for (const pkg of packages) {
    const medicineName = medicineNames.get(pkg.medicineId);
    if (medicineName === undefined) continue;

    const date = getReminderDate(
      pkg.expiryDate,
      pkg.createdAt,
      remindDaysBefore,
      notifyTime,
    );
    if (!date || date <= now) continue;

    plan.push({
      packageId: pkg.id,
      medicineId: pkg.medicineId,
      medicineName,
      expiryDate: pkg.expiryDate,
      date,
    });
  }

  return plan
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, limit);
}
