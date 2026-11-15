import { Text, View } from "react-native";

import type { Medicine, Tag } from "@/db/schema";
import { TagBadge } from "@/features/tags/components/tag-badge";

import { formatMedicineSubtitle } from "../labels";

type MedicineSummaryProps = {
  medicine: Medicine;
  tags: Tag[];
};

/** Header card on the details screen: name, form/dosage, tags, notes. */
export function MedicineSummary({ medicine, tags }: MedicineSummaryProps) {
  return (
    <View className="rounded-2xl border border-border bg-card p-4">
      <Text className="text-xl font-bold text-foreground">{medicine.name}</Text>
      <Text className="mt-1 text-muted">
        {formatMedicineSubtitle(medicine)}
      </Text>
      {tags.length > 0 ? (
        <View className="mt-3 flex-row flex-wrap gap-2">
          {tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </View>
      ) : null}
      {medicine.notes ? (
        <Text className="mt-3 text-foreground">{medicine.notes}</Text>
      ) : null}
    </View>
  );
}
