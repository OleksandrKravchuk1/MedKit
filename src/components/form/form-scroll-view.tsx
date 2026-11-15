import { cssInterop } from "nativewind";
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewProps,
} from "react-native-keyboard-controller";

// Third-party component: map className props to styles for NativeWind.
cssInterop(KeyboardAwareScrollView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});

type FormScrollViewProps = KeyboardAwareScrollViewProps & {
  className?: string;
  contentContainerClassName?: string;
};

/**
 * Scroll container for forms: keeps the focused input above the keyboard and,
 * on iOS, insets content below the (translucent) navigation header.
 */
export function FormScrollView({ children, ...props }: FormScrollViewProps) {
  return (
    <KeyboardAwareScrollView
      bottomOffset={24}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
      {...props}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
