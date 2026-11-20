@AGENTS.md
@docs/SPEC.md

# MedKit: трекер строку придатності ліків

Мобільний застосунок для домашньої аптечки. Користувач додає препарати (вручну або сканує
штрихкод), вказує строк придатності й отримує локальне сповіщення за N днів до кінця терміну.
MVP повністю офлайн: без бекенду й акаунтів, дані в локальній SQLite. Інтерфейс двомовний
(українська, англійська), мова за замовчуванням з налаштувань пристрою.
Повна специфікація: docs/SPEC.md.

## Стек (не змінювати без погодження)

- Expo (поточний SDK) + Expo Router + TypeScript strict
- expo-sqlite + Drizzle ORM + drizzle-kit (driver: 'expo'); міграції через `useMigrations`
- Реактивні дані: `useLiveQuery` з `drizzle-orm/expo-sqlite`
- expo-camera, expo-notifications (тільки локальні)
- react-hook-form + zod, date-fns (локалі uk, en)
- i18next + react-i18next + expo-localization (uk, en)
- NativeWind (вже налаштований), семантичні кольори через CSS-змінні
- react-native-keyboard-controller (форми: `FormScrollView`)
- @expo/ui: swift-ui для UI iOS версії застосунку
- НЕ використовувати: TanStack Query, Redux, Zustand, будь-який бекенд
- Розробка в development build (expo-dev-client), не в Expo Go

## Структура

```
src/
  app/          # тільки екрани (Expo Router); вкладки з власним Stack: (tabs)/(medicines), (tabs)/settings
  db/           # schema.ts, client.ts, seed.ts, use-database-ready.ts
  lib/          # чиста логіка без React: dates.ts, cn.ts, alerts.ts; далі gs1.ts, notifications.ts
  features/     # medicines/, tags/ (settings/ — етап 3); будова фічі — нижче
  components/
    ui/         # базові елементи: button, chip, fab
    form/       # поля форм: text-field, date-field, date-picker, stepper, field, form-scroll-view
    feedback/   # стани: state-view, loading-view, placeholder-screen
  constants/    # доменні значення (medicine, settings, tags) і тема (theme.ts)
  hooks/        # спільні хуки без доменної логіки: use-theme-colors, use-today, use-form-header-buttons
  i18n/         # index.ts, format.ts, plural.ts, locales/{uk,en}.json
drizzle/        # згенеровані міграції (корінь)
drizzle.config.ts  # schema: './src/db/schema.ts', out: './drizzle', dialect: 'sqlite', driver: 'expo'
```

- Запити до БД тільки в `src/features/*` (хуки/функції), не в JSX екранів.

### Будова фічі

Файли розкладаються по підпапках за роллю; папку створюємо, коли з'являється перший файл
цієї ролі. Назва файлу містить сутність і роль: `medicine-form-schema.ts`, а не `schema.ts`.

```
features/<feature>/
  components/   # React-компоненти, один на файл, у підпапках за частиною UI:
                #   list/, filter/, form/, details/ (form/medicine-form.tsx)
  hooks/        # хуки фічі, один на файл: читання (use-medicine-list.ts),
                #   спільний стан-контекст (use-medicine-filter.tsx), опції екрана;
                #   коли їх багато — підпапки як у components/ (list/, details/)
  mutations/    # записи в БД, файл на сутність: medicine-mutations.ts, package-mutations.ts
  schemas/      # zod-схеми: medicine-form-schema.ts
  constants/    # константи фічі, дефолти форм, класи кольорів: medicine-form-constants.ts
  utils/        # чиста логіка без React і БД (тестується): medicine-list.ts, medicine-form-mappers.ts
  types/        # типи фічі: medicine-types.ts
```

- `utils/` не імпортує `db/client`, хуки й компоненти — щоб юніт-тести не тягнули expo-sqlite.
- Підпапки `components/` групують за частиною інтерфейсу (що змінюється разом), а не за типом.
  Платформні версії поруч: `medicine-form-fields.tsx` (Android) і `.ios.tsx` (SwiftUI).
- Фічі імпортують одна одну тільки через `hooks/`, `components/`, `types/` (не внутрішні `utils/`).
- Імпорти через аліас `@/` → `src/`; всередині фічі — відносні. Без barrel-файлів
  (`index.ts` з реекспортами): Metro не робить tree-shaking, а barrel провокує цикли.
- Файли в kebab-case; компоненти — іменовані експорти; пропси типізуються як `<Name>Props`.
- Шари: `app` → `features` → `components` / `lib` / `db` / `constants`. Нижні шари не
  імпортують з `features`; `db` не імпортує `i18n` (локалізовані дані передаються параметрами).

## Тексти та i18n

- Жодних рядків інтерфейсу в коді: тільки `t("…")` (у компонентах `useTranslation`, поза ними
  `i18n.t`). Ключі типізовані за `uk.json`; `en.json` мусить мати ті самі ключі (перевіряє tsc).
- Повідомлення zod — ключі `validation.*`, перекладаються у `FieldError`.
- Дати й «залишилось N днів» — тільки через `src/i18n/format.ts`. Множина рахується
  `pluralCategory` (без `Intl.PluralRules`); параметр у рядках — `{{n}}`, не `{{count}}`.

## Стилі

- Кольори тільки семантичні (`bg-card`, `text-foreground`, `text-muted`, `bg-primary`…),
  значення в `src/global.css` і дубль у `src/constants/theme.ts` (тримати синхронними).
- На `TextInput` розмір шрифту як `text-[14px]`, не `text-sm/base` (ті задають lineHeight).
- Екрани зі скролом під заголовком: `contentInsetAdjustmentBehavior="automatic"`, скрол —
  перший дочірній елемент (або обгортка з `collapsable={false}`).
- Умовні класи через `cn()` з `@/lib/cn`.

## Правила роботи

- Нативні пакети встановлювати через `npx expo install`.
- Якщо не впевнений в актуальному API бібліотеки, звіряйся з документацією, не вгадуй.
- Нові бібліотеки поза стеком: тільки після мого погодження.
- Перед кожним етапом коротко опиши план; при неоднозначності питай.
- Після кожного етапу: `npm run typecheck`, `npm run lint` і `npm run format:check` без помилок,
  застосунок запускається.
  Потім ЗУПИНИСЬ і коротко звітуй: що зроблено і як це перевірити.
- Не комітити без мого прохання.
