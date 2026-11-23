import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import { LoadingView } from "@/components/feedback/loading-view";
import { StateView } from "@/components/feedback/state-view";
import { Button } from "@/components/ui/button";
import { MedicineDetailsView } from "@/features/medicines/ui/views/medicine-details-view";
import { useMedicine } from "@/features/medicines/hooks/details/use-medicine";
import { useSetMedicineDetailsHeader } from "@/features/medicines/hooks/details/use-set-medicine-details-header";
import { deleteMedicine } from "@/features/medicines/mutations/medicine-mutations";
import {
  setPackageStatus,
  updatePackageExpiry,
} from "@/features/medicines/mutations/package-mutations";
import { confirmDestructive, runSafely } from "@/lib/alerts";

export default function MedicineDetailsScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  const id = Number(params.id);
  const { data, error, isLoading } = useMedicine(id);

  const openEdit = () =>
    router.push({
      pathname: "/medicine/[id]/edit",
      params: { id: String(id) },
    });

  useSetMedicineDetailsHeader({ title: data?.medicine.name, onEdit: openEdit });

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

  const { medicine } = data;

  const handleDelete = () =>
    confirmDestructive({
      title: t("medicineDetails.deleteConfirmTitle"),
      message: t("medicineDetails.deleteConfirmMessage", {
        name: medicine.name,
      }),
      confirmLabel: t("medicineDetails.deleteConfirm"),
      onConfirm: () => {
        router.back();
        runSafely(() => deleteMedicine(medicine.id));
      },
    });

  return (
    <MedicineDetailsView
      details={data}
      onEdit={openEdit}
      onDelete={handleDelete}
      onAddPackage={() =>
        router.push({
          pathname: "/medicine/new",
          params: { medicineId: String(medicine.id) },
        })
      }
      onPackageUsed={(packageId) =>
        runSafely(() => setPackageStatus(packageId, "used"))
      }
      onPackageDiscarded={(packageId) =>
        runSafely(() => setPackageStatus(packageId, "discarded"))
      }
      onPackageRestored={(packageId) =>
        runSafely(() => setPackageStatus(packageId, "active"))
      }
      onChangeExpiry={(packageId, iso) =>
        runSafely(() => updatePackageExpiry(packageId, iso))
      }
    />
  );
}
