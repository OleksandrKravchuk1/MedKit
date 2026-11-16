/**
 * Tags created on first launch. Names come from i18n (defaultTags.<key>) in the
 * device language at that moment; afterwards they are ordinary user data.
 */
export const DEFAULT_TAGS = [
  { key: "pain", color: "#EF4444" },
  { key: "fever", color: "#F97316" },
  { key: "cold", color: "#3B82F6" },
  { key: "allergy", color: "#A855F7" },
  { key: "stomach", color: "#22C55E" },
  { key: "firstAid", color: "#EC4899" },
] as const;

export type DefaultTagKey = (typeof DEFAULT_TAGS)[number]["key"];
