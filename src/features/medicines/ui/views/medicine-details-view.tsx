import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

import { Button } from "@/components/ui/button";

import type { MedicineDetails } from "../../types/medicine-types";
import { ActivePackageRow } from "../components/details/active-package-row";
import { ArchivedPackageRow } from "../components/details/archived-package-row";
import { MedicineSummary } from "../components/details/medicine-summary";

export type MedicineDetailsViewProps = {
  details: MedicineDetails;
  onEdit: () => void;
  onDelete: () => void;
  onAddPackage: () => void;
  onPackageUsed: (packageId: number) => void;
  onPackageDiscarded: (packageId: number) => void;
  onPackageRestored: (packageId: number) => void;
  onChangeExpiry: (packageId: number, iso: string) => void;
};

/**
 * Medicine details, React Native layout (Android). Shows ready data and
 * reports actions through callbacks; loading, navigation and writes are in
 * the route.
 */
export function MedicineDetailsView({
  details,
  onEdit,
  onDelete,
  onAddPackage,
  onPackageUsed,
  onPackageDiscarded,
  onPackageRestored,
  onChangeExpiry,
}: MedicineDetailsViewProps) {
  const { t } = useTranslation();
  const { medicine, activePackages, archivedPackages, tags } = details;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 p-4 pb-10"
    >
      <MedicineSummary medicine={medicine} tags={tags} />

      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold text-foreground">
            {t("medicineDetails.packages")}
          </Text>
          <Button
            title={t("medicineDetails.addPackage")}
            variant="ghost"
            size="sm"
            onPress={onAddPackage}
          />
        </View>
        {activePackages.length === 0 ? (
          <Text className="text-muted">
            {t("medicineDetails.noActivePackages")}
          </Text>
        ) : (
          activePackages.map((pkg) => (
            <ActivePackageRow
              key={pkg.id}
              pkg={pkg}
              onUsed={() => onPackageUsed(pkg.id)}
              onDiscarded={() => onPackageDiscarded(pkg.id)}
              onChangeExpiry={(iso) => onChangeExpiry(pkg.id, iso)}
            />
          ))
        )}
      </View>

      {archivedPackages.length > 0 ? (
        <View className="gap-2">
          <Text className="text-sm font-medium text-muted">
            {t("medicineDetails.archive")}
          </Text>
          {archivedPackages.map((pkg) => (
            <ArchivedPackageRow
              key={pkg.id}
              pkg={pkg}
              onRestore={() => onPackageRestored(pkg.id)}
            />
          ))}
        </View>
      ) : null}

      <View className="mt-2 gap-2">
        <Button
          title={t("medicineDetails.edit")}
          variant="outline"
          onPress={onEdit}
        />
        <Button
          title={t("medicineDetails.delete")}
          variant="danger"
          onPress={onDelete}
        />
      </View>
    </ScrollView>
  );
}
