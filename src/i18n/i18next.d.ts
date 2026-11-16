import "i18next";

import type uk from "./locales/uk.json";

// Type-checked translation keys: t("medicineList.emptyTitle") is validated against uk.json.
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: { translation: typeof uk };
  }
}
