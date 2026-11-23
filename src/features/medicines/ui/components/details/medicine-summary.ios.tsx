import { LabeledContent, Section, Text } from "@expo/ui/swift-ui";
import { useTranslation } from "react-i18next";

import type { MedicineSummaryProps } from "./medicine-summary";

/**
 * Medicine facts as SwiftUI Form sections: form, dosage and tags, then the
 * notes in a section of their own. Must be rendered inside a Form.
 */
export function MedicineSummary({ medicine, tags }: MedicineSummaryProps) {
  const { t } = useTranslation();

  return (
    <>
      <Section>
        <LabeledContent label={t("medicineDetails.form")}>
          <Text>{t(`medicineForms.${medicine.form}`)}</Text>
        </LabeledContent>
        {medicine.dosage && (
          <LabeledContent label={t("medicineDetails.dosage")}>
            <Text>{medicine.dosage}</Text>
          </LabeledContent>
        )}
        {tags.length > 0 && (
          <LabeledContent label={t("medicineDetails.tags")}>
            <Text>{tags.map((tag) => tag.name).join(", ")}</Text>
          </LabeledContent>
        )}
      </Section>
      {medicine.notes && (
        <Section title={t("medicineDetails.notes")}>
          <Text>{medicine.notes}</Text>
        </Section>
      )}
    </>
  );
}
