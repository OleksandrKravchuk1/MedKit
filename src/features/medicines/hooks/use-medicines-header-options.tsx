import type {
  NativeStackHeaderItem,
  NativeStackNavigationOptions,
} from "expo-router/native-stack";
import { useTranslation } from "react-i18next";

import { MedicineFilterButton } from "../components/filter/medicine-filter-button";
import { useMedicineFilter } from "./use-medicine-filter";

type HeaderOptions = Pick<
  NativeStackNavigationOptions,
  "headerRight" | "unstable_headerRightItems"
>;

type MedicinesHeaderActions = {
  onAdd: () => void;
  onOpenFilters: () => void;
};

/**
 * Header buttons of the medicines list.
 * iOS: native bar button items, "+" (rightmost) and the tag filter (Liquid Glass on
 * iOS 26, badge with the number of selected tags).
 * Android: only the filter button; adding is the FAB on the screen.
 * The filter button is hidden when there are no tags.
 */
export function useMedicinesHeaderOptions({
  onAdd,
  onOpenFilters,
}: MedicinesHeaderActions): HeaderOptions {
  const { t } = useTranslation();
  const { tags, activeTagIds, isActive } = useMedicineFilter();
  const hasTags = tags.length > 0;
  const count = activeTagIds.length;

  const addItem: NativeStackHeaderItem = {
    type: "button",
    label: t("medicineList.addMedicine"),
    icon: { type: "sfSymbol", name: "plus" },
    onPress: onAdd,
  };

  const filterItem: NativeStackHeaderItem = {
    type: "button",
    label: t("medicineFilter.open"),
    accessibilityLabel: isActive
      ? t("medicineFilter.openActive", { n: count })
      : t("medicineFilter.open"),
    icon: { type: "sfSymbol", name: "line.3.horizontal.decrease" },
    variant: isActive ? "prominent" : "plain",
    badge: isActive ? { value: count } : undefined,
    onPress: onOpenFilters,
  };

  return {
    headerRight: () =>
      hasTags ? (
        <MedicineFilterButton activeCount={count} onPress={onOpenFilters} />
      ) : null,
    unstable_headerRightItems: () =>
      hasTags ? [addItem, filterItem] : [addItem],
  };
}
