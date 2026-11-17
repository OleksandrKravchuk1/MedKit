import { NativeTabs } from "expo-router/native-tabs";
import { useTranslation } from "react-i18next";

import { useThemeColors } from "@/hooks/use-theme-colors";

// Each tab nests its own Stack (header, large title); theme comes from the root layout.
export default function TabsLayout() {
  const { t } = useTranslation();
  const { colors } = useThemeColors();

  return (
    // backgroundColor matches the root window colour (see root layout), so on
    // Android the tab bar blends into the navigation bar area. Ignored on iOS 26+.
    <NativeTabs minimizeBehavior="onScrollDown" backgroundColor={colors.card}>
      <NativeTabs.Trigger name="(medicines)">
        <NativeTabs.Trigger.Label>
          {t("navigation.medicines")}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "pills", selected: "pills.fill" }}
          md="medication"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>
          {t("navigation.settings")}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          md="settings"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
