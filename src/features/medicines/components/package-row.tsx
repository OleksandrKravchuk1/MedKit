import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { DatePicker } from "@/components/form/date-picker";
import { Button } from "@/components/ui/button";
import type { Package } from "@/db/schema";
import { formatDate, formatDaysLeft } from "@/i18n/format";
import { cn } from "@/lib/cn";
import {
  daysUntil,
  getExpiryStatus,
  parseIsoDate,
  toIsoDate,
} from "@/lib/dates";

import { STATUS_DOT_CLASS, STATUS_TEXT_CLASS } from "../expiry-status";

function usePackageDetails(pkg: Package): string {
  const { t } = useTranslation();
  return [
    pkg.quantity > 1 ? t("common.packs", { n: pkg.quantity }) : null,
    pkg.batch ? t("package.batch", { batch: pkg.batch }) : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

type ActivePackageRowProps = {
  pkg: Package;
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
  const status = getExpiryStatus(pkg.expiryDate);
  const details = usePackageDetails(pkg);

  return (
    <View className="rounded-xl border border-border bg-card p-3">
      <Pressable
        accessibilityRole="button"
        onPress={() => setPickerOpen((o) => !o)}
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
          {formatDaysLeft(daysUntil(pkg.expiryDate))}
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

type ArchivedPackageRowProps = {
  pkg: Package;
  onRestore: () => void;
};

/** Used or discarded package, can be restored to active. */
export function ArchivedPackageRow({
  pkg,
  onRestore,
}: ArchivedPackageRowProps) {
  const { t } = useTranslation();
  const details = usePackageDetails(pkg);

  return (
    <View className="flex-row items-center rounded-xl bg-subtle p-3">
      <View className="flex-1">
        <Text className="text-sm text-muted line-through">
          {t("expiry.until", { date: formatDate(pkg.expiryDate) })}
        </Text>
        <Text className="text-xs text-muted">
          {t(`packageStatuses.${pkg.status}`)}
          {details ? ` · ${details}` : ""}
        </Text>
      </View>
      <Button
        title={t("package.restore")}
        variant="ghost"
        size="sm"
        onPress={onRestore}
      />
    </View>
  );
}
