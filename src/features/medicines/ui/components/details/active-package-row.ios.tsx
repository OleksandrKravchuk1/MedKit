import {
  Button,
  DatePicker,
  HStack,
  Image,
  Spacer,
  SwipeActions,
  Text,
  VStack,
} from "@expo/ui/swift-ui";
import {
  datePickerStyle,
  font,
  foregroundStyle,
  labelsHidden,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { useTranslation } from "react-i18next";

import { secondaryText } from "@/constants/swift-ui-styles";
import { formatDaysLeft } from "@/i18n/format";
import { parseIsoDate, toIsoDate } from "@/lib/dates";

import { STATUS_SYSTEM_COLOR } from "../../../constants/expiry-status-colors";
import { formatPackageDetails } from "../../../utils/medicine-display";
import type { ActivePackageRowProps } from "./active-package-row";

/**
 * Active package as a SwiftUI list row: status dot, days left, details and a
 * compact date picker for the expiry date. Swipe left for "used" / "discarded".
 * Must be rendered inside a Form/Section.
 */
export function ActivePackageRow({
  pkg,
  onUsed,
  onDiscarded,
  onChangeExpiry,
}: ActivePackageRowProps) {
  const { t } = useTranslation();
  const color = STATUS_SYSTEM_COLOR[pkg.expiryStatus];
  const details = formatPackageDetails(pkg);

  return (
    <SwipeActions>
      <HStack spacing={12}>
        <Image systemName="circle.fill" color={color} size={10} />
        <VStack alignment="leading" spacing={2}>
          <Text modifiers={[foregroundStyle(color)]}>
            {formatDaysLeft(pkg.daysLeft)}
          </Text>
          {details ? (
            <Text modifiers={[font({ textStyle: "footnote" }), secondaryText]}>
              {details}
            </Text>
          ) : null}
        </VStack>
        <Spacer />
        <DatePicker
          title={t("medicineForm.expiryDate")}
          selection={parseIsoDate(pkg.expiryDate)}
          displayedComponents={["date"]}
          onDateChange={(date) => {
            const iso = toIsoDate(date);
            if (iso !== pkg.expiryDate) onChangeExpiry(iso);
          }}
          modifiers={[datePickerStyle("compact"), labelsHidden()]}
        />
      </HStack>
      <SwipeActions.Actions edge="leading">
        <Button
          label={t("package.markUsed")}
          systemImage="checkmark"
          onPress={onUsed}
          modifiers={[tint(STATUS_SYSTEM_COLOR.ok)]}
        />
      </SwipeActions.Actions>
      <SwipeActions.Actions edge="trailing">
        <Button
          label={t("package.markDiscarded")}
          systemImage="trash"
          role="destructive"
          onPress={onDiscarded}
        />
      </SwipeActions.Actions>
    </SwipeActions>
  );
}
