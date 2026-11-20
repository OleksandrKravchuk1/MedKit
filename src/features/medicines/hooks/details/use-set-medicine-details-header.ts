import { useNavigation } from "expo-router";
import type { NativeStackNavigationOptions } from "expo-router/native-stack";
import { useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

type MedicineDetailsHeaderOptions = {
  title: string | undefined;
  onEdit: () => void;
};

/**
 * Header of the medicine details screen: the medicine name as the title and,
 * on iOS, an "Edit" bar button (Android keeps the Edit button in the content).
 */
export function useSetMedicineDetailsHeader({
  title,
  onEdit,
}: MedicineDetailsHeaderOptions) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const handlers = useRef({ onEdit });

  useLayoutEffect(() => {
    handlers.current = { onEdit };
  });

  useLayoutEffect(() => {
    if (title === undefined) return;
    const options: NativeStackNavigationOptions = {
      title,
      unstable_headerRightItems: () => [
        {
          type: "button",
          label: t("medicineDetails.edit"),
          onPress: () => handlers.current.onEdit(),
        },
      ],
    };
    navigation.setOptions(options);
  }, [navigation, title, t]);
}
