import {
  ColorPicker,
  Form,
  Host,
  Section,
  Text,
  TextField,
  useNativeState,
} from "@expo/ui/swift-ui";
import {
  foregroundStyle,
  scrollDismissesKeyboard,
  textInputAutocapitalization,
} from "@expo/ui/swift-ui/modifiers";
import type { ParseKeys } from "i18next";
import { useController, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useThemeColors } from "@/hooks/use-theme-colors";

import type { TagFormValues } from "../types/tag-types";

/**
 * Tag form fields as a native SwiftUI Form: name and the system ColorPicker
 * (no opacity, stored as "#RRGGBB"). Errors are shown in section footers.
 */
export function TagFormFields() {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const { control, formState, getValues } = useFormContext<TagFormValues>();
  const { errors } = formState;

  const name = useController({ control, name: "name" });
  const color = useController({ control, name: "color" });
  const nameText = useNativeState(getValues("name"));

  const footerError = (message?: string) =>
    message && (
      <Text modifiers={[foregroundStyle(colors.danger)]}>
        {t(message as ParseKeys, { defaultValue: message })}
      </Text>
    );

  return (
    <Host style={{ flex: 1 }}>
      <Form modifiers={[scrollDismissesKeyboard("interactively")]}>
        <Section footer={footerError(errors.name?.message)}>
          <TextField
            text={nameText}
            placeholder={t("tagEditor.name")}
            onTextChange={name.field.onChange}
            modifiers={[textInputAutocapitalization("sentences")]}
          />
        </Section>
        <Section footer={footerError(errors.color?.message)}>
          <ColorPicker
            label={t("tagEditor.color")}
            selection={color.field.value}
            supportsOpacity={false}
            onSelectionChange={color.field.onChange}
          />
        </Section>
      </Form>
    </Host>
  );
}
