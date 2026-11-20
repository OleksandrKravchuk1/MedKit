import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import Constants from "expo-constants";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";

import { LoadingView } from "@/components/feedback/loading-view";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import {
  LANGUAGE_SETTINGS,
  REMIND_DAYS_MAX,
  REMIND_DAYS_MIN,
  type LanguageSetting,
} from "@/constants/settings";
import { useTags } from "@/features/tags/hooks/use-tags";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { applyLanguage } from "@/i18n";
import { formatRemindDaysBefore } from "@/i18n/format";
import { runSafely } from "@/lib/alerts";
import { timeToDate } from "@/lib/dates";

import { useSettings } from "../hooks/use-settings";
import {
  setLanguage,
  setNotifyTime,
  setRemindDaysBefore,
} from "../mutations/settings-mutations";
import { SettingsRow } from "./settings-row";
import { SettingsSection } from "./settings-section";

const noop = () => {};

/** Android: settings as Material-style cards of rows. */
export function SettingsScreenView() {
  const { t } = useTranslation();
  const { scheme, colors } = useThemeColors();
  const { data: tags } = useTags();
  const { data: settings, isLoading } = useSettings();
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  if (isLoading) return <LoadingView />;

  const days = settings.remindDaysBefore;
  const version = Constants.expoConfig?.version;

  const languageLabels: Record<LanguageSetting, string> = {
    system: t("settings.languageSystem"),
    uk: t("settings.languageUk"),
    en: t("settings.languageEn"),
  };

  const changeDays = (next: number) =>
    runSafely(() => setRemindDaysBefore(next));

  const changeLanguage = (value: LanguageSetting) => {
    runSafely(() => setLanguage(value));
    void applyLanguage(value);
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-6 p-4 pb-10"
    >
      <SettingsSection
        title={t("settings.sectionReminders")}
        footer={t("settings.remindersFooter")}
      >
        <SettingsRow
          label={formatRemindDaysBefore(days)}
          trailing={
            <View className="flex-row gap-2">
              <Button
                title="−"
                variant="secondary"
                size="sm"
                accessibilityLabel={`${formatRemindDaysBefore(days)} −1`}
                disabled={days <= REMIND_DAYS_MIN}
                onPress={() => changeDays(days - 1)}
                className="w-11"
              />
              <Button
                title="+"
                variant="secondary"
                size="sm"
                accessibilityLabel={`${formatRemindDaysBefore(days)} +1`}
                disabled={days >= REMIND_DAYS_MAX}
                onPress={() => changeDays(days + 1)}
                className="w-11"
              />
            </View>
          }
        />
        <SettingsRow
          label={t("settings.notifyTime")}
          value={settings.notifyTime}
          onPress={() => setTimePickerOpen(true)}
        />
      </SettingsSection>

      {timePickerOpen ? (
        <DateTimePicker
          value={timeToDate(settings.notifyTime)}
          mode="time"
          is24Hour
          presentation="dialog"
          themeVariant={scheme}
          accentColor={colors.primary}
          positiveButton={{ label: t("common.done") }}
          negativeButton={{ label: t("common.cancel") }}
          onValueChange={(_, selected) => {
            setTimePickerOpen(false);
            runSafely(() => setNotifyTime(selected));
          }}
          onDismiss={() => setTimePickerOpen(false)}
        />
      ) : null}

      <SettingsSection title={t("settings.sectionLanguage")}>
        <View className="flex-row flex-wrap gap-2 p-4">
          {LANGUAGE_SETTINGS.map((value) => (
            <Chip
              key={value}
              label={languageLabels[value]}
              selected={settings.language === value}
              onPress={() => changeLanguage(value)}
            />
          ))}
        </View>
      </SettingsSection>

      <SettingsSection title={t("settings.sectionTags")}>
        {tags.map((item) => (
          <SettingsRow
            key={item.id}
            label={item.name}
            onPress={noop}
            leading={
              <View
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            }
            trailing={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("settings.deleteTag")}
                hitSlop={12}
                onPress={noop}
                className="active:opacity-60"
              >
                <SymbolView
                  name={{ ios: "trash", android: "delete", web: "delete" }}
                  tintColor={colors.muted}
                  size={22}
                />
              </Pressable>
            }
          />
        ))}
        <SettingsRow
          label={t("settings.addTag")}
          onPress={noop}
          leading={
            <SymbolView
              name={{ ios: "plus", android: "add", web: "add" }}
              tintColor={colors.primary}
              size={20}
            />
          }
        />
      </SettingsSection>

      <SettingsSection title={t("settings.sectionAbout")}>
        <SettingsRow label={t("settings.version")} value={version ?? "—"} />
      </SettingsSection>
    </ScrollView>
  );
}
