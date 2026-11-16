import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { FieldError, FieldLabel } from "@/components/form/field";
import { FormScrollView } from "@/components/form/form-scroll-view";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { MEDICINE_FORMS } from "@/constants/medicine";
import { TagChips } from "@/features/tags/components/tag-chips";
import { useTags } from "@/features/tags/hooks/use-tags";

import { createMedicineFormSchema } from "../schemas/medicine-form-schema";
import type { MedicineFormValues } from "../types/medicine-types";
import { PackageFields } from "./package-fields";

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
  const { data: tags } = useTags();

  const isCreate = mode === "create";
  const locked = addingPackage;

  const schema = useMemo(
    () => createMedicineFormSchema({ requirePackage: isCreate }),
    [isCreate],
  );
  const form = useForm<MedicineFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { control, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  return (
    <FormProvider {...form}>
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

        {isCreate ? <PackageFields /> : null}

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
    </FormProvider>
  );
}
