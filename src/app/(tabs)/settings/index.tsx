import { router } from "expo-router";

import { SettingsScreenView } from "@/features/settings/components/settings-screen-view";

export default function SettingsScreen() {
  return (
    <SettingsScreenView
      onOpenTag={(id) =>
        router.push({ pathname: "/tag/[id]", params: { id: String(id) } })
      }
      onAddTag={() => router.push("/tag/new")}
    />
  );
}
