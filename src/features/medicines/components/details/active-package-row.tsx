import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { DatePicker } from "@/components/form/date-picker";
import { Button } from "@/components/ui/button";
import { formatDate, formatDaysLeft } from "@/i18n/format";
import { cn } from "@/lib/cn";
import { parseIsoDate, toIsoDate } from "@/lib/dates";

import {
  STATUS_DOT_CLASS,
  STATUS_TEXT_CLASS,
} from "../../constants/expiry-status-classes";
import type { ActivePackage } from "../../types/medicine-types";
import { formatPackageDetails } from "../../utils/medicine-display";

export type ActivePackageRowProps = {
  pkg: ActivePackage;
  onUsed: () => void;
  onDiscarded: () => void;
  onChangeExpiry: (iso: string) => void;
};

/** Active package: tappable expiry date, status, and "used"/"discarded" actions. */
export function ActivePackageRow({
  pkg,
  onUsed,
  onDiscarded,
  onChangeExpiry,
}: ActivePackageRowProps) {
  const { t } = useTranslation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const status = pkg.expiryStatus;
  const details = formatPackageDetails(pkg);

  return (
    <View className="rounded-xl border border-border bg-card p-3">
      <Pressable
        accessibilityRole="button"
        onPress={() => setPickerOpen((open) => !open)}
        className="py-1"
      >
        <Text className="text-base font-semibold text-primary">
          <Text className="font-normal text-muted">
            {t("expiry.untilPrefix")}{" "}
          </Text>
          {formatDate(pkg.expiryDate)}
        </Text>
      </Pressable>
      {pickerOpen ? (
        <DatePicker
          value={parseIsoDate(pkg.expiryDate)}
          onChange={(date) => {
            const iso = toIsoDate(date);
            if (iso !== pkg.expiryDate) onChangeExpiry(iso);
          }}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}

      <View className="flex-row items-center">
        <View
          className={cn(
            "mr-2 h-2.5 w-2.5 rounded-full",
            STATUS_DOT_CLASS[status],
          )}
        />
        <Text className={cn("text-sm", STATUS_TEXT_CLASS[status])}>
          {formatDaysLeft(pkg.daysLeft)}
          {details ? <Text className="text-muted"> · {details}</Text> : null}
        </Text>
      </View>

      <View className="mt-3 flex-row gap-2">
        <Button
          title={t("package.markUsed")}
          variant="secondary"
          size="sm"
          onPress={onUsed}
          className="flex-1"
        />
        <Button
          title={t("package.markDiscarded")}
          variant="secondary"
          size="sm"
          onPress={onDiscarded}
          className="flex-1"
        />
      </View>
    </View>
  );
}
