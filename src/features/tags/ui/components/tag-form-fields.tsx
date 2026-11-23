import { SymbolView } from "expo-symbols";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { FieldError, FieldLabel } from "@/components/form/field";
import { FormScrollView } from "@/components/form/form-scroll-view";
import { TextField } from "@/components/form/text-field";
import { TAG_COLOR_PALETTE, TAG_NAME_MAX_LENGTH } from "@/constants/tags";
import { cn } from "@/lib/cn";

import type { TagFormValues } from "../../types/tag-types";

/**
 * Tag form fields, React Native layout (Android): name and a colour palette.
 * iOS uses tag-form-fields.ios.tsx (SwiftUI Form with ColorPicker).
 */
export function TagFormFields() {
  const { t } = useTranslation();
  const { control, formState } = useFormContext<TagFormValues>();
  const { errors } = formState;

  return (
    <FormScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-5 p-4 pb-10"
    >
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextField
            label={t("tagEditor.name")}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            maxLength={TAG_NAME_MAX_LENGTH}
            autoFocus
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="color"
        render={({ field }) => (
          <View>
            <FieldLabel>{t("tagEditor.color")}</FieldLabel>
            <View className="flex-row flex-wrap gap-3">
              {TAG_COLOR_PALETTE.map((color) => {
                const selected = field.value.toUpperCase() === color;
                return (
                  <Pressable
                    key={color}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={color}
                    onPress={() => field.onChange(color)}
                    className={cn(
                      "h-11 w-11 items-center justify-center rounded-full",
                      selected && "border-2 border-foreground",
                    )}
                  >
                    <View
                      className="h-9 w-9 items-center justify-center rounded-full"
                      style={{ backgroundColor: color }}
                    >
                      {selected ? (
                        <SymbolView
                          name={{
                            ios: "checkmark",
                            android: "check",
                            web: "check",
                          }}
                          tintColor="#FFFFFF"
                          size={18}
                        />
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
            <FieldError message={errors.color?.message} />
          </View>
        )}
      />
    </FormScrollView>
  );
}
