import { Button, SwipeActions, Text, VStack } from "@expo/ui/swift-ui";
import {
  font,
  foregroundStyle,
  strikethrough,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { useTranslation } from "react-i18next";
import { PlatformColor } from "react-native";

import { formatDate } from "@/i18n/format";

import { formatPackageDetails } from "../../utils/medicine-display";
import type { ArchivedPackageRowProps } from "./archived-package-row";

const secondaryText = foregroundStyle({
  type: "hierarchical",
  style: "secondary",
});

/**
 * Used or discarded package as a SwiftUI list row; swipe left to restore it.
 * Must be rendered inside a Form/Section.
 */
export function ArchivedPackageRow({
  pkg,
  onRestore,
}: ArchivedPackageRowProps) {
  const { t } = useTranslation();
  const details = formatPackageDetails(pkg);
  const status = t(`packageStatuses.${pkg.status}`);

  return (
    <SwipeActions>
      <VStack alignment="leading" spacing={2}>
        <Text
          modifiers={[
            secondaryText,
            strikethrough({ isActive: true, pattern: "solid" }),
          ]}
        >
          {t("expiry.until", { date: formatDate(pkg.expiryDate) })}
        </Text>
        <Text modifiers={[font({ textStyle: "footnote" }), secondaryText]}>
          {details ? `${status} · ${details}` : status}
        </Text>
      </VStack>
      <SwipeActions.Actions edge="trailing">
        <Button
          label={t("package.restore")}
          systemImage="arrow.uturn.backward"
          onPress={onRestore}
          modifiers={[tint(PlatformColor("systemBlue"))]}
        />
      </SwipeActions.Actions>
    </SwipeActions>
  );
}
