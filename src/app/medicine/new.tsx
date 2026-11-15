import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import { LoadingView } from "@/components/feedback/loading-view";
import { StateView } from "@/components/feedback/state-view";
import { MedicineForm } from "@/features/medicines/components/medicine-form";
import {
  addPackage,
  createMedicineWithPackage,
} from "@/features/medicines/mutations";
import { useMedicine } from "@/features/medicines/queries";
import {
  EMPTY_MEDICINE_FORM,
  type MedicineFormValues,
} from "@/features/medicines/schema";
import { runSafely } from "@/lib/alerts";

/** Package fields from the form; the schema guarantees expiryDate in create mode. */
const toPackageInput = (values: MedicineFormValues) => ({
  expiryDate: values.expiryDate!,
  quantity: values.quantity,
});

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
      onSubmit={(values) => {
        const saved = runSafely(
          () => createMedicineWithPackage(values, toPackageInput(values)),
          t("medicineForm.saveFailed"),
        );
        if (saved) router.back();
      }}
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
      defaultValues={{
        ...EMPTY_MEDICINE_FORM,
        name: medicine.name,
        form: medicine.form,
        dosage: medicine.dosage ?? "",
        notes: medicine.notes ?? "",
        tagIds: tags.map((tag) => tag.id),
      }}
      submitLabel={t("medicineForm.submitAddPackage")}
      onSubmit={(values) => {
        const saved = runSafely(
          () => addPackage(medicine.id, toPackageInput(values)),
          t("medicineForm.saveFailed"),
        );
        if (saved) router.back();
      }}
    />
  );
}
