import {
  Button,
  DisclosureGroup,
  Form,
  Host,
  Section,
  Text,
} from "@expo/ui/swift-ui";
import { useTranslation } from "react-i18next";

import { secondaryText } from "@/constants/swift-ui-styles";

import { ActivePackageRow } from "../components/details/active-package-row";
import { ArchivedPackageRow } from "../components/details/archived-package-row";
import type { MedicineDetailsViewProps } from "./medicine-details-view";
import { MedicineSummary } from "../components/details/medicine-summary";

/**
 * Medicine details as a native SwiftUI Form: facts, packages (swipe actions,
 * compact date pickers), a collapsed archive and a destructive Delete button.
 * Edit lives in the navigation bar (useSetMedicineDetailsHeader).
 */
export function MedicineDetailsView({
  details,
  onDelete,
  onAddPackage,
  onPackageUsed,
  onPackageDiscarded,
  onPackageRestored,
  onChangeExpiry,
}: MedicineDetailsViewProps) {
  const { t } = useTranslation();
  const { medicine, activePackages, archivedPackages, tags } = details;

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <MedicineSummary medicine={medicine} tags={tags} />

        <Section
          title={t("medicineDetails.packages")}
          footer={
            activePackages.length > 0 ? (
              <Text modifiers={[secondaryText]}>
                {t("medicineDetails.packagesFooter")}
              </Text>
            ) : undefined
          }
        >
          {activePackages.length === 0 ? (
            <Text modifiers={[secondaryText]}>
              {t("medicineDetails.noActivePackages")}
            </Text>
          ) : (
            activePackages.map((pkg) => (
              <ActivePackageRow
                key={pkg.id}
                pkg={pkg}
                onUsed={() => onPackageUsed(pkg.id)}
                onDiscarded={() => onPackageDiscarded(pkg.id)}
                onChangeExpiry={(iso) => onChangeExpiry(pkg.id, iso)}
              />
            ))
          )}
          <Button
            label={t("medicineDetails.addPackageAction")}
            systemImage="plus.circle.fill"
            onPress={onAddPackage}
          />
        </Section>

        {archivedPackages.length > 0 ? (
          <Section>
            <DisclosureGroup
              label={`${t("medicineDetails.archive")} (${archivedPackages.length})`}
            >
              {archivedPackages.map((pkg) => (
                <ArchivedPackageRow
                  key={pkg.id}
                  pkg={pkg}
                  onRestore={() => onPackageRestored(pkg.id)}
                />
              ))}
            </DisclosureGroup>
          </Section>
        ) : null}

        <Section>
          <Button
            label={t("medicineDetails.delete")}
            role="destructive"
            onPress={onDelete}
          />
        </Section>
      </Form>
    </Host>
  );
}
