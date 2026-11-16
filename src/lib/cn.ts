export type ClassValue = string | false | null | undefined;

/**
 * Joins conditional class names: cn("p-4", isActive && "bg-primary").
 * Does not resolve conflicting utilities, so pass overrides that don't clash.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
