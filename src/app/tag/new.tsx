import { router } from "expo-router";

import { TAG_COLOR_PALETTE } from "@/constants/tags";
import { TagForm } from "@/features/tags/ui/views/tag-form";
import { createTag } from "@/features/tags/mutations/tag-mutations";

export default function NewTagScreen() {
  return (
    <TagForm
      defaultValues={{ name: "", color: TAG_COLOR_PALETTE[0] }}
      onSubmit={(values) => {
        createTag(values);
      }}
      onClose={() => router.back()}
    />
  );
}
