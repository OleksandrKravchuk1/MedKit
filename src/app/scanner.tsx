import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "@/components/feedback/placeholder-screen";

export default function ScannerScreen() {
  const { t } = useTranslation();
  return <PlaceholderScreen title={t("navigation.scanner")} stage={4} />;
}
