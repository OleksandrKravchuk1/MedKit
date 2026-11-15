import type { ExpiryStatus } from "@/lib/dates";

export type ExpiryStatusOrNone = ExpiryStatus | "none";

// Full literal class names so Tailwind can find them.
// Bars/dots read fine on both themes; text needs lighter shades on dark backgrounds.
export const STATUS_DOT_CLASS: Record<ExpiryStatusOrNone, string> = {
  ok: "bg-green-500",
  soon: "bg-amber-400",
  expired: "bg-red-500",
  none: "bg-gray-300 dark:bg-gray-600",
};

export const STATUS_TEXT_CLASS: Record<ExpiryStatusOrNone, string> = {
  ok: "text-green-700 dark:text-green-400",
  soon: "text-amber-700 dark:text-amber-400",
  expired: "text-red-600 dark:text-red-400",
  none: "text-muted",
};
