import { TextInput, View } from "react-native";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

import { FieldError, FieldLabel } from "./field";

type StepperProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  /** i18n key of the validation message. */
  error?: string;
};

/** Integer input with −/+ buttons. Typing an empty value yields 0 so validation can flag it. */
export function Stepper({
  label,
  value,
  onChange,
  onBlur,
  min = 1,
  max = 999,
  error,
}: StepperProps) {
  return (
    <View>
      <FieldLabel>{label}</FieldLabel>
      <View className="flex-row items-center gap-3">
        <Button
          title="−"
          variant="secondary"
          accessibilityLabel={`${label} −1`}
          onPress={() => onChange(Math.max(min, (value || min) - 1))}
          className="w-12"
        />
        <TextInput
          accessibilityLabel={label}
          value={value ? String(value) : ""}
          onChangeText={(text) => {
            const n = parseInt(text.replace(/\D/g, ""), 10);
            onChange(Number.isNaN(n) ? 0 : n);
          }}
          onBlur={onBlur}
          keyboardType="number-pad"
          maxLength={String(max).length}
          className={cn(
            "w-16 rounded-xl border bg-card py-3 text-center text-[14px] text-foreground",
            error ? "border-danger" : "border-input",
          )}
        />
        <Button
          title="+"
          variant="secondary"
          accessibilityLabel={`${label} +1`}
          onPress={() => onChange(Math.min(max, (value || 0) + 1))}
          className="w-12"
        />
      </View>
      <FieldError message={error} />
    </View>
  );
}
