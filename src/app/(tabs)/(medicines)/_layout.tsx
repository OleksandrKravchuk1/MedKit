import { router, Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { MedicineFilterProvider } from "@/features/medicines/hooks/use-medicine-filter";
import { useMedicineFilterHeaderOptions } from "@/features/medicines/hooks/use-medicine-filter-header-options";
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
  const filterHeaderOptions = useMedicineFilterHeaderOptions(() =>
    router.push("/filters"),
  );

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t("navigation.medicines"),
          headerLargeTitleEnabled: true,
          ...filterHeaderOptions,
        }}
      />
      <Stack.Screen
        name="filters"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: "fitToContents",
          sheetGrabberVisible: true,
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </Stack>
  );
}
