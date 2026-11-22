import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import { LoadingView } from "@/components/feedback/loading-view";
import { StateView } from "@/components/feedback/state-view";
import { TagForm } from "@/features/tags/ui/views/tag-form";
import { useTag } from "@/features/tags/hooks/use-tag";
import { updateTag } from "@/features/tags/mutations/tag-mutations";

export default function EditTagScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id: string }>();
  const id = Number(params.id);
  const { data: tag, error, isLoading } = useTag(id);

  if (error) {
    return (
      <StateView
        tone="error"
        title={t("tagEditor.loadFailed")}
        description={error.message}
      />
    );
  }
  if (isLoading) return <LoadingView />;
  if (!tag) return <StateView title={t("tagEditor.notFound")} />;

  return (
    <TagForm
      // Remount if the route switches to another tag: defaultValues are read once.
      key={tag.id}
      defaultValues={{ name: tag.name, color: tag.color }}
      onSubmit={(values) => updateTag(tag.id, values)}
      onClose={() => router.back()}
    />
  );
}
