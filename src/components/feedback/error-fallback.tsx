import type { ErrorBoundaryProps } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { useThemeColors } from "@/hooks/use-theme-colors";

import { PulsingAlertIcon } from "./pulsing-alert-icon";

const MONOSPACE_FONT = Platform.select({ ios: "Menlo", default: "monospace" });

/**
 * Screen shown by an Expo Router `ErrorBoundary` when rendering throws.
 * Retry with the button or by pulling the screen down.
 * In development builds the error message and stack can be expanded.
 */
export function ErrorFallback({ error, retry }: ErrorBoundaryProps) {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { refreshing, onRefresh } = usePullToRefresh(retry);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="flex-grow items-center justify-center px-8 py-16"
      // The root error screen has no header: keep content and the iOS spinner
      // below the status bar.
      contentInsetAdjustmentBehavior="automatic"
      // Bounce even when the content fits, so the pull gesture is always available.
      alwaysBounceVertical
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.muted}
          colors={[colors.primary]}
          progressBackgroundColor={colors.card}
          // Android draws edge-to-edge: start the spinner below the status bar.
          progressViewOffset={insets.top}
        />
      }
    >
      <View accessibilityRole="alert" className="w-full max-w-sm items-center">
        <View className="mb-4">
          <PulsingAlertIcon />
        </View>

        <Text className="text-center text-2xl font-bold text-foreground">
          {t("errorBoundary.title")}
        </Text>
        <Text className="mt-3 text-center text-base leading-6 text-muted">
          {t("errorBoundary.description")}
        </Text>

        <Button
          title={t("errorBoundary.retry")}
          onPress={retry}
          size="lg"
          className="mt-8 w-full"
          icon={
            <SymbolView
              name={{
                ios: "arrow.clockwise",
                android: "refresh",
                web: "refresh",
              }}
              tintColor="#FFFFFF"
              size={18}
            />
          }
        />

        {__DEV__ ? (
          <View className="mt-6 w-full">
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: detailsOpen }}
              onPress={() => setDetailsOpen((open) => !open)}
              className="self-center rounded-lg px-3 py-2 active:bg-subtle"
            >
              <Text className="text-sm font-medium text-primary">
                {detailsOpen
                  ? t("errorBoundary.hideDetails")
                  : t("errorBoundary.showDetails")}
              </Text>
            </Pressable>

            {detailsOpen ? (
              <View className="mt-2 rounded-xl border border-border bg-card p-4">
                <Text
                  selectable
                  className="text-sm font-semibold text-danger"
                  style={{ fontFamily: MONOSPACE_FONT }}
                >
                  {error.name}: {error.message}
                </Text>
                {error.stack ? (
                  <Text
                    selectable
                    numberOfLines={12}
                    className="mt-2 text-xs text-muted"
                    style={{ fontFamily: MONOSPACE_FONT }}
                  >
                    {error.stack}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
