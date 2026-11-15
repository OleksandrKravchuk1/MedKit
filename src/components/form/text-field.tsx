import { TextInput, View, type TextInputProps } from "react-native";

import { useThemeColors } from "@/hooks/use-theme-colors";
import { cn } from "@/lib/cn";

import { FieldError, FieldLabel } from "./field";

type TextFieldProps = TextInputProps & {
  label: string;
  /** i18n key of the validation message. */
  error?: string;
};

export function TextField({
  label,
  error,
  editable = true,
  ...inputProps
}: TextFieldProps) {
  const { colors } = useThemeColors();

  return (
    <View>
      <FieldLabel>{label}</FieldLabel>
      <TextInput
        placeholderTextColor={colors.placeholder}
        editable={editable}
        // text-[14px] instead of text-sm/base: those also set lineHeight,
        // which makes iOS text inputs shift vertically while typing.
        className={cn(
          "rounded-xl border px-3 py-3 text-[14px] text-foreground",
          error ? "border-danger" : "border-input",
          editable ? "bg-card" : "bg-subtle text-muted",
        )}
        {...inputProps}
      />
      <FieldError message={error} />
    </View>
  );
}
