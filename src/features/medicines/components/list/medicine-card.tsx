import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { formatDate, formatDaysLeft } from "@/i18n/format";
import { cn } from "@/lib/cn";
import { daysUntil } from "@/lib/dates";

import {
  STATUS_DOT_CLASS,
  STATUS_TEXT_CLASS,
} from "../../constants/expiry-status-classes";
import { formatMedicineSubtitle } from "../../utils/medicine-display";
import type { MedicineListItem } from "../../types/medicine-types";

type MedicineCardProps = {
  item: MedicineListItem;
  onPress: () => void;
};

export function MedicineCard({ item, onPress }: MedicineCardProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="mx-4 mb-3 flex-row overflow-hidden rounded-2xl border border-border bg-card active:bg-subtle"
    >
      <View className={cn("w-1.5", STATUS_DOT_CLASS[item.status])} />
      <View className="flex-1 p-4">
        <View className="flex-row items-start justify-between">
          <Text
            className="mr-2 flex-1 text-base font-semibold text-foreground"
            numberOfLines={2}
          >
            {item.name}
          </Text>
          {item.packCount > 0 ? (
            <Text className="text-sm text-muted">
              {t("common.packs", { n: item.packCount })}
            </Text>
          ) : null}
        </View>
        <Text className="mt-0.5 text-sm text-muted">
          {formatMedicineSubtitle(item)}
        </Text>
        {item.nearestExpiry ? (
          <Text
            className={cn(
              "mt-2 text-sm font-medium",
              STATUS_TEXT_CLASS[item.status],
            )}
          >
            {t("expiry.until", { date: formatDate(item.nearestExpiry) })} ·{" "}
            {formatDaysLeft(daysUntil(item.nearestExpiry))}
          </Text>
        ) : (
          <Text className="mt-2 text-sm text-muted">
            {t("medicineList.noActivePackages")}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
