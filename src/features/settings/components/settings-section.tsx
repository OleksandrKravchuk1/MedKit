import { Children, type ReactNode } from "react";
import { Text, View } from "react-native";

type SettingsSectionProps = {
  title: string;
  footer?: string;
  children: ReactNode;
};

/** Android: titled card of settings rows with dividers between them. */
export function SettingsSection({
  title,
  footer,
  children,
}: SettingsSectionProps) {
  const rows = Children.toArray(children);

  return (
    <View className="gap-2">
      <Text className="px-4 text-sm font-semibold text-primary">{title}</Text>
      <View className="overflow-hidden rounded-2xl bg-card">
        {rows.map((row, index) => (
          <View
            key={index}
            className={index > 0 ? "border-t border-border" : undefined}
          >
            {row}
          </View>
        ))}
      </View>
      {footer ? (
        <Text className="px-4 text-sm text-muted">{footer}</Text>
      ) : null}
    </View>
  );
}
