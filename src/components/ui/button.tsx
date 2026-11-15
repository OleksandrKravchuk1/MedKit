import { ActivityIndicator, Pressable, Text } from "react-native";

import { useThemeColors } from "@/hooks/use-theme-colors";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "md" | "sm";

const CONTAINER: Record<ButtonVariant, string> = {
  primary: "bg-primary active:bg-primary/80",
  secondary: "bg-subtle active:bg-border",
  danger: "bg-danger-soft active:bg-danger/20",
  ghost: "active:bg-subtle",
};

const LABEL: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-foreground",
  danger: "text-danger",
  ghost: "text-primary",
};

const SIZE: Record<ButtonSize, { container: string; label: string }> = {
  md: { container: "px-4 py-3", label: "text-base" },
  sm: { container: "px-3 py-2", label: "text-sm" },
};

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  /** Shows a spinner and blocks presses. */
  loading?: boolean;
  accessibilityLabel?: string;
  className?: string;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  accessibilityLabel,
  className,
}: ButtonProps) {
  const { colors } = useThemeColors();
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: inactive, busy: loading }}
      onPress={onPress}
      disabled={inactive}
      className={cn(
        "flex-row items-center justify-center rounded-xl",
        SIZE[size].container,
        CONTAINER[variant],
        inactive && "opacity-50",
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "#FFFFFF" : colors.muted}
          style={{ marginRight: 8 }}
        />
      ) : null}
      <Text className={cn("font-semibold", SIZE[size].label, LABEL[variant])}>
        {title}
      </Text>
    </Pressable>
  );
}
