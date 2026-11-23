import { useEffect } from "react";

import { subscribeToReminderTaps } from "@/lib/notifications";

/**
 * Calls `onOpenMedicine` when a reminder is tapped, including the tap that
 * launched the app. Enable only once the navigator is mounted.
 */
export function useReminderTap(
  enabled: boolean,
  onOpenMedicine: (medicineId: number) => void,
): void {
  useEffect(() => {
    if (!enabled) return;
    return subscribeToReminderTaps(onOpenMedicine);
  }, [enabled, onOpenMedicine]);
}
