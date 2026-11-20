import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import type { Package } from "@/db/schema";
import { formatDate } from "@/i18n/format";

import { formatPackageDetails } from "../../utils/medicine-display";

export type ArchivedPackageRowProps = {
  pkg: Package;
  onRestore: () => void;
};

/** Used or discarded package, can be restored to active. */
export function ArchivedPackageRow({
  pkg,
  onRestore,
}: ArchivedPackageRowProps) {
  const { t } = useTranslation();
  const details = formatPackageDetails(pkg);

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
