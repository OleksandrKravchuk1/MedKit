import { useTranslation } from "react-i18next";

import { Fab } from "@/components/ui/fab";

export type AddMedicineFabProps = {
  onPress: () => void;
};

/** Android: the floating "add medicine" button above the tab bar. */
export function AddMedicineFab({ onPress }: AddMedicineFabProps) {
  const { t } = useTranslation();

  return (
    <Fab onPress={onPress} accessibilityLabel={t("medicineList.addMedicine")} />
  );
}
