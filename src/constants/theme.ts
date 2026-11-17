import { DarkTheme, DefaultTheme, type Theme } from "expo-router";

/*
 * Hex values for places where className does not apply: navigation themes,
 * placeholderTextColor, ActivityIndicator, Switch, date picker.
 * Keep in sync with the CSS variables in src/global.css.
 */
export const palette = {
  light: {
    background: "#F2F2F7",
    card: "#FFFFFF",
    foreground: "#111827",
    muted: "#6B7280",
    placeholder: "#9CA3AF",
    border: "#E5E7EB",
    input: "#D1D5DB",
    primary: "#2563EB",
    danger: "#DC2626",
  },
  dark: {
    background: "#000000",
    card: "#1C1C1E",
    foreground: "#F3F4F6",
    muted: "#9CA3AF",
    placeholder: "#6B7280",
    border: "#38383A",
    input: "#48484A",
    primary: "#0A84FF",
    danger: "#F87171",
  },
} as const;

export type ColorSchemeName = keyof typeof palette;
export type Palette = (typeof palette)[ColorSchemeName];

/** React Navigation themes matching the app palette, so headers and tab bar blend with screens. */
export const navigationThemes: Record<ColorSchemeName, Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: palette.light.primary,
      background: palette.light.background,
      card: palette.light.card,
      text: palette.light.foreground,
      border: palette.light.border,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: palette.dark.primary,
      background: palette.dark.background,
      card: palette.dark.card,
      text: palette.dark.foreground,
      border: palette.dark.border,
    },
  },
};
