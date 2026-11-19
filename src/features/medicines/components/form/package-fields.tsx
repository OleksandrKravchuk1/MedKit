import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Switch, Text, View } from "react-native";

import { DateField } from "@/components/form/date-field";
import { Stepper } from "@/components/form/stepper";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { toLastDayOfMonth } from "@/lib/dates";

import {
  QUANTITY_MAX,
  QUANTITY_MIN,
} from "../../constants/medicine-form-constants";
import type { MedicineFormValues } from "../../types/medicine-types";

/** "Package" section of the medicine form: expiry date and quantity. */
export function PackageFields() {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const { control, getValues, setValue, formState } =
    useFormContext<MedicineFormValues>();
  const { errors } = formState;

  return (
    <View className="gap-5 rounded-2xl border border-border bg-card p-4">
      <Text className="text-base font-semibold text-foreground">
        {t("medicineForm.package")}
      </Text>

      <Controller
        control={control}
        name="monthOnly"
        render={({ field }) => (
          <View className="flex-row items-center justify-between">
            <Text className="mr-3 flex-1 text-sm text-foreground">
              {t("medicineForm.monthOnly")}
            </Text>
            <Switch
              value={field.value}
              trackColor={{ true: colors.primary, false: colors.input }}
              onValueChange={(on) => {
                field.onChange(on);
                // Switching on snaps an already chosen date to the end of its month.
                const date = getValues("expiryDate");
                if (on && date) {
                  setValue("expiryDate", toLastDayOfMonth(date), {
                    shouldValidate: true,
                  });
                }
              }}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="expiryDate"
        render={({ field }) => (
          <DateField
            label={t("medicineForm.expiryDate")}
            value={field.value}
            onChange={(iso) =>
              field.onChange(
                getValues("monthOnly") ? toLastDayOfMonth(iso) : iso,
              )
            }
            error={errors.expiryDate?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="quantity"
        render={({ field }) => (
          <Stepper
            label={t("medicineForm.quantity")}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            min={QUANTITY_MIN}
            max={QUANTITY_MAX}
            error={errors.quantity?.message}
          />
        )}
      />
    </View>
  );
}
