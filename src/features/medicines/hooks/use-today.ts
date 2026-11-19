import { addDays, startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import { AppState } from "react-native";

import { toIsoDate } from "@/lib/dates";

/**
 * Today's local date as 'YYYY-MM-DD'. Updates when the app returns to the
 * foreground and at midnight while it is open.
 */
export function useToday(): string {
  const [today, setToday] = useState(() => toIsoDate(new Date()));

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") setToday(toIsoDate(new Date()));
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const now = new Date();
    const untilMidnight = startOfDay(addDays(now, 1)).getTime() - now.getTime();
    const timer = setTimeout(
      () => setToday(toIsoDate(new Date())),
      untilMidnight + 1000,
    );
    return () => clearTimeout(timer);
  }, [today]);

  return today;
}
