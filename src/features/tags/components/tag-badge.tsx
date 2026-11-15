import { Text, View } from "react-native";

import type { Tag } from "@/db/schema";

/** Read-only colored tag pill. */
export function TagBadge({ tag }: { tag: Pick<Tag, "name" | "color"> }) {
  return (
    <View
      className="rounded-full px-2.5 py-1"
      style={{ backgroundColor: tag.color }}
    >
      <Text className="text-xs font-medium text-white">{tag.name}</Text>
    </View>
  );
}
