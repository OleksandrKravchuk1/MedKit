import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { useTranslation } from "react-i18next";
import { Platform, View } from "react-native";

import { Button } from "@/components/ui/button";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { getNativeLocale } from "@/i18n/format";

type DatePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
};

/**
 * Platform date picker, rendered while open:
 * - Android: Material dialog, opens on mount; closes after a choice or cancel
 *   (cancel doesn't call onChange).
 * - iOS: inline calendar (the @expo/ui picker is always inline); Done commits
 *   the shown date and closes.
 */
export function DatePicker({ value, onChange, onClose }: DatePickerProps) {
  const { t } = useTranslation();
  const { scheme, colors } = useThemeColors();

  if (Platform.OS === "android") {
    return (
      <DateTimePicker
        value={value}
        mode="date"
        presentation="dialog"
        themeVariant={scheme}
        accentColor={colors.primary}
        positiveButton={{ label: t("common.done") }}
        negativeButton={{ label: t("common.cancel") }}
        onValueChange={(_, selected) => {
          onClose();
          onChange(selected);
        }}
        onDismiss={onClose}
      />
    );
  }

  return (
    <View className="mt-2 rounded-xl border border-border bg-card p-2">
      <DateTimePicker
        value={value}
        mode="date"
        display="inline"
        locale={getNativeLocale()}
        themeVariant={scheme}
        accentColor={colors.primary}
        onValueChange={(_, selected) => onChange(selected)}
      />
      <Button
        title={t("common.done")}
        variant="ghost"
        size="sm"
        // Commit the shown date too: the user may accept the preselected one without scrolling.
        onPress={() => {
          onChange(value);
          onClose();
        }}
      />
    </View>
  );
}
