import { useColorScheme } from "react-native";

import { palette, type ColorSchemeName } from "@/constants/theme";

/** Current color scheme and its palette, for props that don't accept className. */
export function useThemeColors() {
  const scheme: ColorSchemeName =
    useColorScheme() === "dark" ? "dark" : "light";
  return { scheme, colors: palette[scheme] };
}
