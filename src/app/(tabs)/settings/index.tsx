import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "@/components/feedback/placeholder-screen";

export default function SettingsScreen() {
  const { t } = useTranslation();
  return <PlaceholderScreen title={t("navigation.settings")} stage={3} />;
}
