/** Feature highlights on the onboarding screen, top to bottom. */
export const ONBOARDING_FEATURES = [
  {
    key: "medicines",
    icon: { ios: "cross.case.fill", android: "medical_services" },
  },
  {
    key: "scan",
    icon: { ios: "barcode.viewfinder", android: "barcode_scanner" },
  },
  {
    key: "reminders",
    icon: { ios: "bell.badge.fill", android: "notifications_active" },
  },
] as const;

export type OnboardingFeature = (typeof ONBOARDING_FEATURES)[number];
