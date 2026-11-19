import {
  Button,
  DatePicker,
  Form,
  HStack,
  Host,
  Image,
  Picker,
  Section,
  Spacer,
  Stepper,
  Text,
  TextField,
  Toggle,
  useNativeState,
} from "@expo/ui/swift-ui";
import {
  datePickerStyle,
  disabled,
  foregroundStyle,
  pickerStyle,
  scrollDismissesKeyboard,
  tag,
  textInputAutocapitalization,
} from "@expo/ui/swift-ui/modifiers";
import type { ParseKeys } from "i18next";
import { useEffect } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { MEDICINE_FORMS, type MedicineForm } from "@/constants/medicine";
import { useTags } from "@/features/tags/hooks/use-tags";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { parseIsoDate, toIsoDate, toLastDayOfMonth } from "@/lib/dates";

import {
  QUANTITY_MAX,
  QUANTITY_MIN,
} from "../../constants/medicine-form-constants";
import type { MedicineFormValues } from "../../types/medicine-types";
import type { MedicineFormFieldsProps } from "./medicine-form-fields";

/**
 * Medicine form fields as a native SwiftUI Form (inset grouped list):
 * borderless text fields, a menu picker, a compact date picker, a stepper and
 * checkmark rows for tags. Validation messages are shown in section footers.
 * State lives in the parent's react-hook-form (useFormContext).
 */
export function MedicineFormFields({
  showPackage,
  locked,
}: MedicineFormFieldsProps) {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const { data: tags } = useTags();
  const { control, formState, getValues, setValue } =
    useFormContext<MedicineFormValues>();
  const { errors } = formState;

  const name = useController({ control, name: "name" });
  const dosage = useController({ control, name: "dosage" });
  const form = useController({ control, name: "form" });
  const tagIds = useController({ control, name: "tagIds" });
  const notes = useController({ control, name: "notes" });
  const monthOnly = useController({ control, name: "monthOnly" });
  const expiryDate = useController({ control, name: "expiryDate" });
  const quantity = useController({ control, name: "quantity" });

  const nameText = useNativeState(getValues("name"));
  const dosageText = useNativeState(getValues("dosage"));
  const notesText = useNativeState(getValues("notes"));

  // The compact date picker always shows a date; make the shown one the value.
  useEffect(() => {
    if (showPackage && !getValues("expiryDate")) {
      setValue("expiryDate", toIsoDate(new Date()));
    }
  }, [showPackage, getValues, setValue]);

  const footerError = (message?: string) =>
    message ? (
      <Text modifiers={[foregroundStyle(colors.danger)]}>
        {t(message as ParseKeys, { defaultValue: message })}
      </Text>
    ) : undefined;

  const primaryText = foregroundStyle({
    type: "hierarchical",
    style: "primary",
  });
  const secondaryText = foregroundStyle({
    type: "hierarchical",
    style: "secondary",
  });

  const setExpiry = (iso: string) =>
    expiryDate.field.onChange(
      monthOnly.field.value ? toLastDayOfMonth(iso) : iso,
    );

  const toggleTag = (id: number) =>
    tagIds.field.onChange(
      tagIds.field.value.includes(id)
        ? tagIds.field.value.filter((x) => x !== id)
        : [...tagIds.field.value, id],
    );

  return (
    <Host style={{ flex: 1 }}>
      <Form modifiers={[scrollDismissesKeyboard("interactively")]}>
        {locked ? (
          <Section>
            <Text modifiers={[secondaryText]}>
              {t("medicineForm.addingPackageNotice", {
                name: getValues("name"),
              })}
            </Text>
          </Section>
        ) : null}

        <Section
          title={t("medicineForm.sectionMedicine")}
          footer={footerError(errors.name?.message ?? errors.dosage?.message)}
        >
          <TextField
            text={nameText}
            placeholder={t("medicineForm.name")}
            onTextChange={name.field.onChange}
            modifiers={[
              textInputAutocapitalization("sentences"),
              disabled(locked),
            ]}
          />
          <TextField
            text={dosageText}
            placeholder={t("medicineForm.dosage")}
            onTextChange={dosage.field.onChange}
            modifiers={[textInputAutocapitalization("never"), disabled(locked)]}
          />
          <Picker<MedicineForm>
            label={t("medicineForm.form")}
            selection={form.field.value}
            onSelectionChange={form.field.onChange}
            modifiers={[pickerStyle("menu"), disabled(locked)]}
          >
            {MEDICINE_FORMS.map((value) => (
              <Text key={value} modifiers={[tag(value)]}>
                {t(`medicineForms.${value}`)}
              </Text>
            ))}
          </Picker>
        </Section>

        {showPackage ? (
          <Section
            title={t("medicineForm.package")}
            footer={footerError(
              errors.expiryDate?.message ?? errors.quantity?.message,
            )}
          >
            <DatePicker
              title={t("medicineForm.expiryDate")}
              selection={
                expiryDate.field.value
                  ? parseIsoDate(expiryDate.field.value)
                  : new Date()
              }
              displayedComponents={["date"]}
              onDateChange={(date) => setExpiry(toIsoDate(date))}
              modifiers={[datePickerStyle("compact")]}
            />
            <Toggle
              label={t("medicineForm.monthOnly")}
              isOn={monthOnly.field.value}
              onIsOnChange={(on) => {
                monthOnly.field.onChange(on);
                if (on && expiryDate.field.value) {
                  expiryDate.field.onChange(
                    toLastDayOfMonth(expiryDate.field.value),
                  );
                }
              }}
            />
            <Stepper
              label={`${t("medicineForm.quantity")}: ${quantity.field.value}`}
              value={quantity.field.value}
              min={QUANTITY_MIN}
              max={QUANTITY_MAX}
              step={1}
              onValueChange={quantity.field.onChange}
            />
          </Section>
        ) : null}

        {tags.length > 0 ? (
          <Section title={t("medicineForm.tags")}>
            {tags.map((item) => (
              <Button
                key={item.id}
                onPress={() => toggleTag(item.id)}
                modifiers={[disabled(locked)]}
              >
                <HStack spacing={12}>
                  <Image
                    systemName="circle.fill"
                    color={item.color}
                    size={12}
                  />
                  <Text modifiers={[primaryText]}>{item.name}</Text>
                  <Spacer />
                  {tagIds.field.value.includes(item.id) ? (
                    <Image
                      systemName="checkmark"
                      color={colors.primary}
                      size={15}
                    />
                  ) : null}
                </HStack>
              </Button>
            ))}
          </Section>
        ) : null}

        <Section footer={footerError(errors.notes?.message)}>
          <TextField
            text={notesText}
            placeholder={t("medicineForm.notes")}
            axis="vertical"
            onTextChange={notes.field.onChange}
            modifiers={[disabled(locked)]}
          />
        </Section>
      </Form>
    </Host>
  );
}
