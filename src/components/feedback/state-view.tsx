import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

type StateViewProps = {
  title: string;
  description?: string;
  /** "error" highlights the title; use for load/save failures. */
  tone?: "neutral" | "error";
  /** Optional action, e.g. a Button. */
  action?: ReactNode;
};

/** Full-area message for empty, not-found and error states. */
export function StateView({
  title,
  description,
  tone = "neutral",
  action,
}: StateViewProps) {
  return (
    <View
      accessibilityRole={tone === "error" ? "alert" : undefined}
      className="flex-1 items-center justify-center bg-background px-8 py-16"
    >
      <Text
        className={cn(
          "mb-2 text-center text-lg font-semibold",
          tone === "error" ? "text-danger" : "text-foreground",
        )}
      >
        {title}
      </Text>
      {description ? (
        <Text className="text-center text-muted">{description}</Text>
      ) : null}
      {action ? <View className="mt-4">{action}</View> : null}
    </View>
  );
}
