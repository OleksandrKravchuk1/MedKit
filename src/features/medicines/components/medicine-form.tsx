import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Switch, Text, View } from "react-native";

import { DateField } from "@/components/form/date-field";
import { FieldError, FieldLabel } from "@/components/form/field";
import { FormScrollView } from "@/components/form/form-scroll-view";
import { Stepper } from "@/components/form/stepper";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { MEDICINE_FORMS } from "@/constants/medicine";
import { TagChips } from "@/features/tags/components/tag-chips";
import { useTags } from "@/features/tags/queries";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { toLastDayOfMonth } from "@/lib/dates";

import {
  createMedicineFormSchema,
  QUANTITY_MAX,
  QUANTITY_MIN,
  type MedicineFormValues,
} from "../schema";

type MedicineFormProps = {
  /** "edit" hides the package section: packages are managed on the details screen. */
  mode: "create" | "edit";
  defaultValues: MedicineFormValues;
  /**
   * Adding a package to an existing medicine ("Add package" on details):
   * medicine fields are read-only, only the package section is filled in.
   */
  addingPackage?: boolean;
  submitLabel: string;
  onSubmit: (values: MedicineFormValues) => void;
};

export function MedicineForm({
  mode,
  defaultValues,
  addingPackage = false,
  submitLabel,
  onSubmit,
}: MedicineFormProps) {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const { data: tags } = useTags();

  const isCreate = mode === "create";
  const locked = addingPackage;

  const schema = useMemo(
    () => createMedicineFormSchema({ requirePackage: isCreate }),
    [isCreate],
  );
  const { control, handleSubmit, getValues, setValue, formState } =
    useForm<MedicineFormValues>({
      resolver: zodResolver(schema),
      defaultValues,
    });
  const { errors, isSubmitting } = formState;

  return (
    <FormScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-5 p-4 pb-10"
      showsVerticalScrollIndicator={false}
    >
      {locked ? (
        <View className="rounded-xl bg-primary-soft p-3">
          <Text className="text-sm text-foreground">
            {t("medicineForm.addingPackageNotice", {
              name: defaultValues.name,
            })}
          </Text>
        </View>
      ) : null}

      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextField
            label={t("medicineForm.name")}
            placeholder={t("medicineForm.namePlaceholder")}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            editable={!locked}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="form"
        render={({ field }) => (
          <View>
            <FieldLabel>{t("medicineForm.form")}</FieldLabel>
            <View className="flex-row flex-wrap gap-2">
              {MEDICINE_FORMS.map((form) => (
                <Chip
                  key={form}
                  label={t(`medicineForms.${form}`)}
                  selected={field.value === form}
                  onPress={() => field.onChange(form)}
                  disabled={locked}
                />
              ))}
            </View>
            <FieldError message={errors.form?.message} />
          </View>
        )}
      />

      <Controller
        control={control}
        name="dosage"
        render={({ field }) => (
          <TextField
            label={t("medicineForm.dosage")}
            placeholder={t("medicineForm.dosagePlaceholder")}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            editable={!locked}
            error={errors.dosage?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="tagIds"
        render={({ field }) => (
          <View>
            <FieldLabel>{t("medicineForm.tags")}</FieldLabel>
            <TagChips
              tags={tags}
              selectedIds={field.value}
              onChange={field.onChange}
              disabled={locked}
            />
          </View>
        )}
      />

      {isCreate ? (
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
      ) : null}

      <Controller
        control={control}
        name="notes"
        render={({ field }) => (
          <TextField
            label={t("medicineForm.notes")}
            placeholder={t("medicineForm.notesPlaceholder")}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            editable={!locked}
            multiline
            textAlignVertical="top"
            style={{ minHeight: 88 }}
            error={errors.notes?.message}
          />
        )}
      />

      <Button
        title={submitLabel}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
      />
    </FormScrollView>
  );
}
