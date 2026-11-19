import { isLiquidGlassAvailable } from "expo-glass-effect";
import { useNavigation } from "expo-router";
import type { NativeStackNavigationOptions } from "expo-router/native-stack";
import { useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

type FormHeaderButtonsOptions = {
  saveLabel: string;
  onSave: () => void;
  /** Shown on iOS only: modals there have no back button. */
  onCancel: () => void;
};

/**
 * Puts the form actions into the navigation bar of the current screen.
 * iOS: native bar button items (Liquid Glass on iOS 26); Android: a text button.
 */
export function useFormHeaderButtons({
  saveLabel,
  onSave,
  onCancel,
}: FormHeaderButtonsOptions) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handlers = useRef({ onSave, onCancel });
  useLayoutEffect(() => {
    handlers.current = { onSave, onCancel };
  });

  useLayoutEffect(() => {
    const save = () => handlers.current.onSave();
    const cancel = () => handlers.current.onCancel();

    const options: NativeStackNavigationOptions = {
      headerRight: () => (
        <Button title={saveLabel} variant="ghost" size="sm" onPress={save} />
      ),
      unstable_headerRightItems: () => [
        {
          type: "button",
          label: saveLabel,
          variant: isLiquidGlassAvailable() ? "prominent" : "done",
          onPress: save,
        },
      ],
      unstable_headerLeftItems: () => [
        {
          type: "button",
          label: t("common.cancel"),
          icon: { type: "sfSymbol", name: "xmark" },
          onPress: cancel,
        },
      ],
    };
    navigation.setOptions(options);
  }, [navigation, saveLabel, t]);
}
