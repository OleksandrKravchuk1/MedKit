import { router, Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

import { LoadingView } from "@/components/feedback/loading-view";
import { StateView } from "@/components/feedback/state-view";
import { Button } from "@/components/ui/button";
import { MedicineSummary } from "@/features/medicines/components/medicine-summary";
import { ActivePackageRow } from "@/features/medicines/components/active-package-row";
import { ArchivedPackageRow } from "@/features/medicines/components/archived-package-row";
import { deleteMedicine } from "@/features/medicines/mutations/medicine-mutations";
import {
  setPackageStatus,
  updatePackageExpiry,
} from "@/features/medicines/mutations/package-mutations";
import { useMedicine } from "@/features/medicines/hooks/use-medicine";
import { confirmDestructive, runSafely } from "@/lib/alerts";

export default function MedicineDetailsScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  const id = Number(params.id);
  const { data, error, isLoading } = useMedicine(id);

  if (error) {
    return (
      <StateView
        tone="error"
        title={t("medicineDetails.loadFailed")}
        description={error.message}
      />
    );
  }
  if (isLoading) return <LoadingView />;
  if (!data) {
    return (
      <StateView
        title={t("medicineDetails.notFoundTitle")}
        description={t("medicineDetails.notFoundDescription")}
        action={
          <Button
            title={t("medicineDetails.backToList")}
            variant="ghost"
            onPress={() => router.back()}
          />
        }
      />
    );
  }

  const { medicine, activePackages, archivedPackages, tags } = data;

  const handleDelete = () =>
    confirmDestructive({
      title: t("medicineDetails.deleteConfirmTitle"),
      message: t("medicineDetails.deleteConfirmMessage", {
        name: medicine.name,
      }),
      confirmLabel: t("medicineDetails.deleteConfirm"),
      // Leave first so the screen doesn't flash "not found" during the back animation.
      onConfirm: () => {
        router.back();
        runSafely(() => deleteMedicine(medicine.id));
      },
    });

  return (
    <>
      <Stack.Screen options={{ title: medicine.name }} />
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
              onPress={() =>
                router.push({
                  pathname: "/medicine/new",
                  params: { medicineId: String(medicine.id) },
                })
              }
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
                onUsed={() => runSafely(() => setPackageStatus(pkg.id, "used"))}
                onDiscarded={() =>
                  runSafely(() => setPackageStatus(pkg.id, "discarded"))
                }
                onChangeExpiry={(iso) =>
                  runSafely(() => updatePackageExpiry(pkg.id, iso))
                }
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
                onRestore={() =>
                  runSafely(() => setPackageStatus(pkg.id, "active"))
                }
              />
            ))}
          </View>
        ) : null}

        <View className="mt-2 gap-2">
          <Button
            title={t("medicineDetails.edit")}
            variant="outline"
            onPress={() =>
              router.push({
                pathname: "/medicine/[id]/edit",
                params: { id: String(medicine.id) },
              })
            }
          />
          <Button
            title={t("medicineDetails.delete")}
            variant="danger"
            onPress={handleDelete}
          />
        </View>
      </ScrollView>
    </>
  );
}
