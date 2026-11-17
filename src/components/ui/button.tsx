import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

import { useThemeColors } from "@/hooks/use-theme-colors";
import { cn } from "@/lib/cn";

/**
 * - primary: main action
 * - secondary: neutral action on a card surface (bg-card)
 * - outline: neutral action on the screen background (bg-background)
 * - danger: destructive action
 * - ghost: text-only action
 */
export type ButtonVariant =
  "primary" | "secondary" | "outline" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const CONTAINER: Record<ButtonVariant, string> = {
  primary: "bg-primary active:bg-primary/80",
  secondary: "bg-subtle active:bg-border",
  outline: "border border-border bg-card active:bg-subtle",
  danger: "bg-danger/15 active:bg-danger/25",
  ghost: "active:bg-subtle",
};

const LABEL: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-foreground",
  outline: "text-foreground",
  danger: "text-danger",
  ghost: "text-primary",
};

const SIZE: Record<ButtonSize, { container: string; label: string }> = {
  sm: { container: "rounded-xl px-3 py-2", label: "text-sm" },
  md: { container: "rounded-xl px-4 py-3", label: "text-base" },
  lg: { container: "rounded-2xl px-6 py-4", label: "text-base" },
};

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  className?: string;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  icon,
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
        "flex-row items-center justify-center gap-2",
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
        />
      ) : (
        icon
      )}
      <Text className={cn("font-semibold", SIZE[size].label, LABEL[variant])}>
        {title}
      </Text>
    </Pressable>
  );
}
