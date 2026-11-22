import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import { LoadingView } from "@/components/feedback/loading-view";
import { StateView } from "@/components/feedback/state-view";
import { MedicineForm } from "@/features/medicines/ui/views/medicine-form";
import { EMPTY_MEDICINE_FORM } from "@/features/medicines/constants/medicine-form-constants";
import { createMedicineWithPackage } from "@/features/medicines/mutations/medicine-mutations";
import { addPackage } from "@/features/medicines/mutations/package-mutations";
import {
  toFormValues,
  toMedicineInput,
  toPackageInput,
} from "@/features/medicines/utils/medicine-form-mappers";
import { useMedicine } from "@/features/medicines/hooks/details/use-medicine";
import { runSafely } from "@/lib/alerts";

/**
 * /medicine/new                 — create a medicine with its first package.
 * /medicine/new?medicineId=<id> — add a package to an existing medicine.
 */
export default function NewMedicineScreen() {
  const { medicineId } = useLocalSearchParams<{ medicineId?: string }>();
  return medicineId ? (
    <AddPackageForm medicineId={Number(medicineId)} />
  ) : (
    <CreateMedicineForm />
  );
}

function CreateMedicineForm() {
  const { t } = useTranslation();

  return (
    <MedicineForm
      mode="create"
      defaultValues={EMPTY_MEDICINE_FORM}
      submitLabel={t("medicineForm.submitCreate")}
      onSubmit={(values) =>
        runSafely(
          () =>
            createMedicineWithPackage(
              toMedicineInput(values),
              toPackageInput(values),
            ),
          t("medicineForm.saveFailed"),
        )
      }
      onClose={() => router.back()}
    />
  );
}

function AddPackageForm({ medicineId }: { medicineId: number }) {
  const { t } = useTranslation();
  const { data, error, isLoading } = useMedicine(medicineId);

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
  if (!data) return <StateView title={t("medicineDetails.notFoundTitle")} />;

  const { medicine, tags } = data;

  return (
    <MedicineForm
      mode="create"
      addingPackage
      defaultValues={toFormValues(medicine, tags)}
      submitLabel={t("medicineForm.submitAddPackage")}
      onSubmit={(values) =>
        runSafely(
          () => addPackage(medicine.id, toPackageInput(values)),
          t("medicineForm.saveFailed"),
        )
      }
      onClose={() => router.back()}
    />
  );
}
