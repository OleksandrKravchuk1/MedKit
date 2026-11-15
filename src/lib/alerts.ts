import { Alert } from "react-native";

import i18n from "@/i18n";

export function showError(error: unknown, title?: string) {
  const message =
    error instanceof Error ? error.message : i18n.t("common.unknownError");
  Alert.alert(title ?? i18n.t("common.error"), message);
}

/** Runs a synchronous action and reports a failure in an alert instead of throwing. */
export function runSafely(action: () => void, errorTitle?: string): boolean {
  try {
    action();
    return true;
  } catch (e) {
    showError(e, errorTitle);
    return false;
  }
}

export function confirmDestructive(options: {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  Alert.alert(options.title, options.message, [
    { text: i18n.t("common.cancel"), style: "cancel" },
    {
      text: options.confirmLabel,
      style: "destructive",
      onPress: options.onConfirm,
    },
  ]);
}
