import "@/global.css";

import { Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { StateView } from "@/components/feedback/state-view";
import { DEFAULT_TAGS } from "@/constants/tags";
import { navigationThemes } from "@/constants/theme";
import { useDatabaseReady } from "@/db/use-database-ready";
import { useThemeColors } from "@/hooks/use-theme-colors";
// Importing @/i18n also initializes it, before any screen renders.
import i18n from "@/i18n";

// Keep the native splash visible until the database is migrated and seeded.
void SplashScreen.preventAutoHideAsync();

/** First-launch tags, named in the current language. */
const getDefaultTags = () =>
  DEFAULT_TAGS.map(({ key, color }) => ({
    name: i18n.t(`defaultTags.${key}`),
    color,
  }));

export default function RootLayout() {
  const { t } = useTranslation();
  const { scheme } = useThemeColors();
  const { ready, error } = useDatabaseReady(getDefaultTags);

  useEffect(() => {
    if (ready || error) SplashScreen.hide();
  }, [ready, error]);

  if (!ready && !error) return null;

  return (
    // KeyboardProvider is required by react-native-keyboard-controller (FormScrollView).
    <KeyboardProvider>
      <ThemeProvider value={navigationThemes[scheme]}>
        <StatusBar style="auto" />
        {error ? (
          <StateView
            tone="error"
            title={t("app.databaseFailed")}
            description={error.message}
          />
        ) : (
          <Stack screenOptions={{ headerBackButtonDisplayMode: "minimal" }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="medicine/new"
              options={{ title: t("navigation.newMedicine") }}
            />
            <Stack.Screen
              name="medicine/[id]"
              options={{ title: t("navigation.medicine") }}
            />
            <Stack.Screen
              name="medicine/[id]/edit"
              options={{ title: t("navigation.editMedicine") }}
            />
            <Stack.Screen
              name="scanner"
              options={{
                presentation: "modal",
                title: t("navigation.scanner"),
              }}
            />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          </Stack>
        )}
      </ThemeProvider>
    </KeyboardProvider>
  );
}
