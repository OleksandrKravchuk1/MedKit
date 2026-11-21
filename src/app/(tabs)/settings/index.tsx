import { router } from "expo-router";

import { SettingsView } from "@/features/settings/components/settings-view";

export default function SettingsScreen() {
  return (
    <SettingsView
      onOpenTag={(id) =>
        router.push({ pathname: "/tag/[id]", params: { id: String(id) } })
      }
      onAddTag={() => router.push("/tag/new")}
    />
  );
}
