import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { FieldError, FieldLabel } from "@/components/form/field";
import { FormScrollView } from "@/components/form/form-scroll-view";
import { TextField } from "@/components/form/text-field";
import { Chip } from "@/components/ui/chip";
import { MEDICINE_FORMS } from "@/constants/medicine";
import { TagChips } from "@/features/tags/ui/components/tag-chips";
import { useTags } from "@/features/tags/hooks/use-tags";

import type { MedicineFormValues } from "../../../types/medicine-types";
import { PackageFields } from "./package-fields";

export type MedicineFormFieldsProps = {
  showPackage: boolean;
  locked: boolean;
};

/**
 * Medicine form fields, Material-style React Native layout (Android).
 * iOS uses medicine-form-fields.ios.tsx (native SwiftUI Form).
 * State lives in the parent's react-hook-form (useFormContext).
 */
export function MedicineFormFields({
  showPackage,
  locked,
}: MedicineFormFieldsProps) {
  const { t } = useTranslation();
  const { data: tags } = useTags();
  const { control, formState, getValues } =
    useFormContext<MedicineFormValues>();
  const { errors } = formState;

  return (
    <FormScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-5 p-4 pb-10"
      showsVerticalScrollIndicator={false}
    >
      {locked ? (
        <View className="rounded-xl bg-primary-soft p-3">
          <Text className="text-sm text-foreground">
            {t("medicineForm.addingPackageNotice", { name: getValues("name") })}
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

      {showPackage ? <PackageFields /> : null}

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
    </FormScrollView>
  );
}
