import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { cn } from "@/lib/cn";

type SettingsRowProps = {
  label: string;
  value?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
};

/** Android: one row of a settings section. Pressable when onPress is set. */
export function SettingsRow({
  label,
  value,
  leading,
  trailing,
  onPress,
}: SettingsRowProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      disabled={!onPress}
      onPress={onPress}
      className={cn(
        "min-h-14 flex-row items-center gap-4 px-4 py-3",
        onPress && "active:bg-subtle",
      )}
    >
      {leading}
      <View className="flex-1">
        <Text className="text-base text-foreground">{label}</Text>
        {value ? <Text className="text-sm text-muted">{value}</Text> : null}
      </View>
      {trailing}
    </Pressable>
  );
}
