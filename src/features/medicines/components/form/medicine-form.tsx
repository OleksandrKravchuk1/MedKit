import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useFormHeaderButtons } from "@/hooks/use-form-header-buttons";

import { createMedicineFormSchema } from "../../schemas/medicine-form-schema";
import type { MedicineFormValues } from "../../types/medicine-types";
import { MedicineFormFields } from "./medicine-form-fields";

type MedicineFormProps = {
  mode: "create" | "edit";
  defaultValues: MedicineFormValues;
  addingPackage?: boolean;
  submitLabel: string;
  /** Saves the values; returns true on success (the form then closes). */
  onSubmit: (values: MedicineFormValues) => boolean;
  /** Leaves the form: after a successful save or on Cancel. */
  onClose: () => void;
};

/**
 * Medicine form: validation (react-hook-form + zod) and the Cancel / Save
 * actions in the navigation bar. Fields are platform-specific: native SwiftUI
 * Form on iOS, React Native layout on Android (MedicineFormFields).
 */
export function MedicineForm({
  mode,
  defaultValues,
  addingPackage = false,
  submitLabel,
  onSubmit,
  onClose,
}: MedicineFormProps) {
  const isCreate = mode === "create";

  const schema = useMemo(
    () => createMedicineFormSchema({ requirePackage: isCreate }),
    [isCreate],
  );
  const form = useForm<MedicineFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const saved = useRef(false);
  const save = () =>
    void form.handleSubmit((values) => {
      if (saved.current) return;
      saved.current = onSubmit(values);
      if (saved.current) onClose();
    })();

  useFormHeaderButtons({
    saveLabel: submitLabel,
    onSave: save,
    onCancel: onClose,
  });

  return (
    <FormProvider {...form}>
      <MedicineFormFields showPackage={isCreate} locked={addingPackage} />
    </FormProvider>
  );
}
