import { useTranslation } from "react-i18next";

import { StateView } from "@/components/feedback/state-view";
import { Button } from "@/components/ui/button";

import { useMedicineFilter } from "../hooks/use-medicine-filter";

/** Shown in the medicines list when the tag filter matches nothing. */
export function MedicineFilterEmptyState() {
  const { t } = useTranslation();
  const { reset } = useMedicineFilter();

  return (
    <StateView
      title={t("medicineList.noResultsTitle")}
      description={t("medicineList.noResultsDescription")}
      action={
        <Button
          title={t("medicineList.resetFilters")}
          variant="ghost"
          onPress={reset}
        />
      }
    />
  );
}
