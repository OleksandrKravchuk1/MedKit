import { useTranslation } from "react-i18next";

import { StateView } from "./state-view";

type PlaceholderScreenProps = { title: string; stage: number };

/** Temporary screen body until the route is implemented. Remove in stage 5. */
export function PlaceholderScreen({ title, stage }: PlaceholderScreenProps) {
  const { t } = useTranslation();
  return (
    <StateView
      title={title}
      description={t("placeholder.comingInStage", { stage })}
    />
  );
}
