import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Tag } from "@/db/schema";
import { useTags } from "@/features/tags/hooks/use-tags";

/*
 * Tag filter of the medicines list, shared by the list screen and the
 * filter sheet (two routes of the medicines tab stack). In memory only:
 * the filter resets when the app restarts.
 *
 * Tags are loaded here, not in the sheet: useLiveQuery returns an empty array
 * on the first render, and a sheet sized to its content must render its final
 * content on the first frame.
 */

type MedicineFilter = {
  /** All tags, sorted by name. */
  tags: Tag[];
  tagsLoaded: boolean;
  /** Selected tag ids; a medicine matches if it has any of them. */
  tagIds: number[];
  /** Selected tag ids that still exist (a selected tag may have been deleted). */
  activeTagIds: number[];
  isActive: boolean;
  toggleTag: (id: number) => void;
  reset: () => void;
};

const MedicineFilterContext = createContext<MedicineFilter | null>(null);

export function MedicineFilterProvider({ children }: { children: ReactNode }) {
  const { data: tags, updatedAt } = useTags();
  const [tagIds, setTagIds] = useState<number[]>([]);
  const tagsLoaded = updatedAt !== undefined;

  const value = useMemo<MedicineFilter>(() => {
    const activeTagIds = tags
      .filter((tag) => tagIds.includes(tag.id))
      .map((tag) => tag.id);
    return {
      tags,
      tagsLoaded,
      tagIds,
      activeTagIds,
      isActive: activeTagIds.length > 0,
      toggleTag: (id) =>
        setTagIds((ids) =>
          ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
        ),
      reset: () => setTagIds([]),
    };
  }, [tags, tagsLoaded, tagIds]);

  return (
    <MedicineFilterContext.Provider value={value}>
      {children}
    </MedicineFilterContext.Provider>
  );
}

export function useMedicineFilter(): MedicineFilter {
  const filter = useContext(MedicineFilterContext);
  if (!filter) {
    throw new Error(
      "useMedicineFilter must be used inside MedicineFilterProvider",
    );
  }
  return filter;
}
