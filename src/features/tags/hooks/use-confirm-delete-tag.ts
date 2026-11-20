import { useTranslation } from "react-i18next";

import type { Tag } from "@/db/schema";
import { confirmDestructive, runSafely } from "@/lib/alerts";

import { deleteTag } from "../mutations/tag-mutations";

/**
 * Returns a function that asks for confirmation and deletes the tag.
 * Lets other features delete tags without importing tag mutations.
 */
export function useConfirmDeleteTag() {
  const { t } = useTranslation();

  return (tag: Pick<Tag, "id" | "name">) =>
    confirmDestructive({
      title: t("settings.deleteTagConfirmTitle"),
      message: t("settings.deleteTagConfirmMessage", { name: tag.name }),
      confirmLabel: t("settings.deleteTag"),
      onConfirm: () => runSafely(() => deleteTag(tag.id)),
    });
}
