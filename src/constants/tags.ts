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

export const TAG_NAME_MAX_LENGTH = 30;

/** "#RRGGBB": the format tag colours are stored in. */
export const HEX_COLOR_PATTERN = /^#[0-9A-F]{6}$/i;

/**
 * Colours offered on Android (no native colour picker there); the first one
 * is also the default for a new tag on both platforms.
 */
export const TAG_COLOR_PALETTE = [
  "#3B82F6",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#14B8A6",
  "#06B6D4",
  "#6366F1",
  "#A855F7",
  "#EC4899",
  "#78716C",
  "#64748B",
] as const;
