import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { formatDate } from "@/i18n/format";
import { cn } from "@/lib/cn";
import { parseIsoDate, toIsoDate } from "@/lib/dates";

import { DatePicker } from "./date-picker";
import { FieldError, FieldLabel } from "./field";

type DateFieldProps = {
  label: string;
  /** 'YYYY-MM-DD' or null when not chosen yet. */
  value: string | null;
  onChange: (iso: string) => void;
  /** i18n key of the validation message. */
  error?: string;
};

/** Form field that opens the platform date picker. */
export function DateField({ label, value, onChange, error }: DateFieldProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <View>
      <FieldLabel>{label}</FieldLabel>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen((o) => !o)}
        className={cn(
          "rounded-xl border bg-card px-3 py-3",
          error ? "border-danger" : "border-input",
        )}
      >
        <Text
          className={cn("text-base", value ? "text-foreground" : "text-muted")}
        >
          {value ? formatDate(value) : t("datePicker.placeholder")}
        </Text>
      </Pressable>
      {open ? (
        <DatePicker
          value={value ? parseIsoDate(value) : new Date()}
          onChange={(date) => onChange(toIsoDate(date))}
          onClose={() => setOpen(false)}
        />
      ) : null}
      <FieldError message={error} />
    </View>
  );
}
