import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useFormHeaderButtons } from "@/hooks/use-form-header-buttons";
import { msg } from "@/i18n/msg";
import { showError } from "@/lib/alerts";

import { TagNameTakenError } from "../mutations/tag-mutations";
import { tagFormSchema } from "../schemas/tag-form-schema";
import type { TagFormValues } from "../types/tag-types";
import { TagFormFields } from "./tag-form-fields";

type TagFormProps = {
  defaultValues: TagFormValues;
  /** Saves the tag; may throw TagNameTakenError. */
  onSubmit: (values: TagFormValues) => void;
};

/**
 * Tag form: validation, Cancel / Save in the navigation bar, closes after a
 * successful save. A duplicate name is shown on the name field.
 */
export function TagForm({ defaultValues, onSubmit }: TagFormProps) {
  const { t } = useTranslation();
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues,
  });

  const saved = useRef(false);
  const save = () =>
    void form.handleSubmit((values) => {
      if (saved.current) return;
      try {
        onSubmit(values);
        saved.current = true;
        router.back();
      } catch (e) {
        if (e instanceof TagNameTakenError) {
          form.setError("name", { message: msg("validation.tagNameTaken") });
        } else {
          showError(e, t("tagEditor.saveFailed"));
        }
      }
    })();

  useFormHeaderButtons({
    saveLabel: t("common.save"),
    onSave: save,
    onCancel: () => router.back(),
  });

  return (
    <FormProvider {...form}>
      <TagFormFields />
    </FormProvider>
  );
}
