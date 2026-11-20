import { PlatformColor, type ColorValue } from "react-native";

import type { ListExpiryStatus } from "../types/medicine-types";

/**
 * iOS system colours for expiry statuses (SwiftUI views). They adapt to
 * light/dark mode and accessibility contrast; use only in .ios files.
 */
export const STATUS_SYSTEM_COLOR: Record<ListExpiryStatus, ColorValue> = {
  ok: PlatformColor("systemGreen"),
  soon: PlatformColor("systemOrange"),
  expired: PlatformColor("systemRed"),
  none: PlatformColor("systemGray"),
};
