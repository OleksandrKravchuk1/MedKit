import { LoadingView } from "@/components/feedback/loading-view";
import {
  LANGUAGE_SETTINGS,
  LanguageSetting,
  REMIND_DAYS_MAX,
  REMIND_DAYS_MIN,
} from "@/constants/settings";
import {
  primaryText,
  secondaryText,
  tertiaryText,
} from "@/constants/swift-ui-styles";
import { useNotificationPermission } from "@/features/notifications/hooks/use-notification-permission";
import { useConfirmDeleteTag } from "@/features/tags/hooks/use-confirm-delete-tag";
import { useTags } from "@/features/tags/hooks/use-tags";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { applyLanguage } from "@/i18n";
import { formatRemindDaysBefore } from "@/i18n/format";
import { runSafely } from "@/lib/alerts";
import { timeToDate } from "@/lib/dates";
import {
  Button,
  DatePicker,
  Form,
  Host,
  HStack,
  Image,
  LabeledContent,
  Picker,
  Section,
  Spacer,
  Stepper,
  SwipeActions,
  Text,
  VStack,
} from "@expo/ui/swift-ui";
import {
  datePickerStyle,
  font,
  pickerStyle,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../hooks/use-settings";
import {
  setLanguage,
  setNotifyTime,
  setRemindDaysBefore,
} from "../../mutations/settings-mutations";
import type { SettingsViewProps } from "./settings-view";

export function SettingsView({ onOpenTag, onAddTag }: SettingsViewProps) {
  const { t } = useTranslation();
  const { data: tags } = useTags();
  const confirmDeleteTag = useConfirmDeleteTag();
  const { data: settings, isLoading } = useSettings();
  const { colors } = useThemeColors();
  const notifications = useNotificationPermission();

  const version = Constants.expoConfig?.version;

  const languageLabels: Record<LanguageSetting, string> = {
    system: t("settings.languageSystem"),
    uk: t("settings.languageUk"),
    en: t("settings.languageEn"),
  };

  if (isLoading) return <LoadingView />;

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section
          title={t("settings.sectionReminders")}
          footer={
            <Text modifiers={[secondaryText]}>
              {t("settings.remindersFooter")}
            </Text>
          }
        >
          {notifications.allowed === false && (
            <Button onPress={() => void notifications.enable()}>
              <HStack spacing={12}>
                <Image
                  systemName="bell.slash.fill"
                  color={colors.danger}
                  size={17}
                />
                <VStack alignment="leading" spacing={2}>
                  <Text modifiers={[primaryText]}>
                    {t("settings.notificationsOff")}
                  </Text>
                  <Text
                    modifiers={[font({ textStyle: "footnote" }), secondaryText]}
                  >
                    {t("settings.notificationsOffHint")}
                  </Text>
                </VStack>
                <Spacer />
                <Image
                  systemName="chevron.right"
                  size={13}
                  modifiers={[tertiaryText]}
                />
              </HStack>
            </Button>
          )}
          <Stepper
            label={formatRemindDaysBefore(settings.remindDaysBefore)}
            value={settings.remindDaysBefore}
            min={REMIND_DAYS_MIN}
            max={REMIND_DAYS_MAX}
            step={1}
            onValueChange={(days) => runSafely(() => setRemindDaysBefore(days))}
          />
          <DatePicker
            title={t("settings.notifyTime")}
            selection={timeToDate(settings.notifyTime)}
            displayedComponents={["hourAndMinute"]}
            onDateChange={(date) => runSafely(() => setNotifyTime(date))}
            modifiers={[datePickerStyle("compact")]}
          />
        </Section>

        <Section title={t("settings.sectionLanguage")}>
          <Picker<LanguageSetting>
            label={t("settings.language")}
            selection={settings.language}
            onSelectionChange={(value) => {
              runSafely(() => setLanguage(value));
              void applyLanguage(value);
            }}
            modifiers={[pickerStyle("menu")]}
          >
            {LANGUAGE_SETTINGS.map((value) => (
              <Text key={value} modifiers={[tag(value)]}>
                {languageLabels[value]}
              </Text>
            ))}
          </Picker>
        </Section>

        <Section
          title={t("settings.sectionTags")}
          footer={
            <Text modifiers={[secondaryText]}>{t("settings.tagsFooter")}</Text>
          }
        >
          {tags.map((item) => (
            <SwipeActions key={item.id}>
              <Button onPress={() => onOpenTag(item.id)}>
                <HStack spacing={12}>
                  <Image
                    systemName="circle.fill"
                    color={item.color}
                    size={12}
                  />
                  <Text modifiers={[primaryText]}>{item.name}</Text>
                  <Spacer />
                  <Image
                    systemName="chevron.right"
                    size={13}
                    modifiers={[tertiaryText]}
                  />
                </HStack>
              </Button>
              <SwipeActions.Actions edge="trailing">
                <Button
                  label={t("settings.deleteTag")}
                  systemImage="trash"
                  role="destructive"
                  onPress={() => confirmDeleteTag(item)}
                />
              </SwipeActions.Actions>
            </SwipeActions>
          ))}
          <Button
            label={t("settings.addTag")}
            systemImage="plus.circle.fill"
            onPress={onAddTag}
          />
        </Section>

        <Section title={t("settings.sectionAbout")}>
          <LabeledContent label={t("settings.version")}>
            <Text>{version ?? "—"}</Text>
          </LabeledContent>
        </Section>
      </Form>
    </Host>
  );
}
