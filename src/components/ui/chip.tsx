import { Pressable, Text, View } from "react-native";

import { cn } from "@/lib/cn";

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Optional color dot (e.g. tag color). */
  color?: string;
  disabled?: boolean;
};

export function Chip({ label, selected, onPress, color, disabled }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      onPress={onPress}
      disabled={disabled}
      className={cn(
        "flex-row items-center rounded-full border px-3 py-1.5",
        selected ? "border-primary bg-primary-soft" : "border-input bg-card",
        disabled && "opacity-50",
      )}
    >
      {color ? (
        <View
          className="mr-1.5 h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      ) : null}
      <Text
        className={cn(
          "text-sm",
          selected ? "font-semibold text-primary" : "text-foreground",
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
