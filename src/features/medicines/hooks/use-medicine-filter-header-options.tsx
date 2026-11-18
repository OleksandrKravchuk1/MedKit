import type { NativeStackNavigationOptions } from "expo-router/native-stack";
import { useTranslation } from "react-i18next";

import { MedicineFilterButton } from "../components/medicine-filter-button";
import { useMedicineFilter } from "./use-medicine-filter";

type HeaderOptions = Pick<
  NativeStackNavigationOptions,
  "headerRight" | "unstable_headerRightItems"
>;

/**
 * Header options with the tag filter button for the medicines list.
 * iOS: a native bar button item (Liquid Glass on iOS 26, badge with the
 * number of selected tags). Android: MedicineFilterButton.
 * Hidden when there are no tags.
 */
export function useMedicineFilterHeaderOptions(
  onOpen: () => void,
): HeaderOptions {
  const { t } = useTranslation();
  const { tags, activeTagIds, isActive } = useMedicineFilter();

  if (tags.length === 0) {
    return {
      headerRight: () => null,
      unstable_headerRightItems: () => [],
    };
  }

  const count = activeTagIds.length;
  const label = isActive
    ? t("medicineFilter.openActive", { n: count })
    : t("medicineFilter.open");

  return {
    headerRight: () => (
      <MedicineFilterButton activeCount={count} onPress={onOpen} />
    ),
    unstable_headerRightItems: () => [
      {
        type: "button",
        label: t("medicineFilter.open"),
        accessibilityLabel: label,
        icon: { type: "sfSymbol", name: "line.3.horizontal.decrease" },
        variant: isActive ? "prominent" : "plain",
        badge: isActive ? { value: count } : undefined,
        onPress: onOpen,
      },
    ],
  };
}
