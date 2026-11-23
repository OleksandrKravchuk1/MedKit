import { foregroundStyle } from "@expo/ui/swift-ui/modifiers";

/*
 * Hierarchical text styles for SwiftUI views (@expo/ui): system label colours
 * that adapt to light/dark mode. Import only from .ios files.
 */

export const primaryText = foregroundStyle({
  type: "hierarchical",
  style: "primary",
});

export const secondaryText = foregroundStyle({
  type: "hierarchical",
  style: "secondary",
});

export const tertiaryText = foregroundStyle({
  type: "hierarchical",
  style: "tertiary",
});
