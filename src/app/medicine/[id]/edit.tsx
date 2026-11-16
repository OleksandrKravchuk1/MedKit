import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import { LoadingView } from "@/components/feedback/loading-view";
import { StateView } from "@/components/feedback/state-view";
import { MedicineForm } from "@/features/medicines/components/medicine-form";
import { updateMedicine } from "@/features/medicines/mutations/medicine-mutations";
import {
  toFormValues,
  toMedicineInput,
} from "@/features/medicines/utils/medicine-form-mappers";
import { useMedicine } from "@/features/medicines/hooks/use-medicine";
import { runSafely } from "@/lib/alerts";

export default function EditMedicineScreen() {
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
  if (!data) return <StateView title={t("medicineDetails.notFoundTitle")} />;

  const { medicine, tags } = data;

  return (
    <MedicineForm
      // Remount if the route switches to another medicine: defaultValues are read once.
      key={medicine.id}
      mode="edit"
      defaultValues={toFormValues(medicine, tags)}
      submitLabel={t("medicineForm.submitEdit")}
      onSubmit={(values) => {
        const saved = runSafely(
          () => updateMedicine(medicine.id, toMedicineInput(values)),
          t("medicineForm.saveFailed"),
        );
        if (saved) router.back();
      }}
    />
  );
}
