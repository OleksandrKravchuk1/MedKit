import type { ParseKeys } from "i18next";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";

export function FieldLabel({ children }: { children: string }) {
  return (
    <Text className="mb-1.5 text-sm font-medium text-foreground">
      {children}
    </Text>
  );
}

/**
 * Validation message under a field. `message` is an i18n key (zod schemas use
 * keys from `validation.*`), translated here so messages follow the app language.
 */
export function FieldError({ message }: { message?: string }) {
  const { t } = useTranslation();
  if (!message) return null;
  return (
    <Text className="mt-1 text-sm text-danger">
      {t(message as ParseKeys, { defaultValue: message })}
    </Text>
  );
}
