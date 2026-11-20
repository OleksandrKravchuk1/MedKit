import { router, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import { MedicineFilterProvider } from "@/features/medicines/hooks/list/use-medicine-filter";
import { useMedicinesHeaderOptions } from "@/features/medicines/hooks/list/use-medicines-header-options";
import { useThemeColors } from "@/hooks/use-theme-colors";

export default function MedicinesTabLayout() {
  return (
    <MedicineFilterProvider>
      <MedicinesStack />
    </MedicineFilterProvider>
  );
}

function MedicinesStack() {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const headerOptions = useMedicinesHeaderOptions({
    onAdd: () => router.push("/medicine/new"),
    onOpenFilters: () => router.push("/filters"),
  });

  const isIos = Platform.OS === "ios";

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t("navigation.medicines"),
          headerLargeTitleEnabled: true,
          ...headerOptions,
        }}
      />
      <Stack.Screen
        name="filters"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: isIos ? [0.6, 1] : "fitToContents",
          sheetGrabberVisible: true,
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </Stack>
  );
}
