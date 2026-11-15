import { SymbolView } from "expo-symbols";
import { Pressable, Text } from "react-native";

type FabProps = {
  onPress: () => void;
  accessibilityLabel: string;
};

/** Floating "add" action button, bottom-right of the screen. */
export function Fab({ onPress, accessibilityLabel }: FabProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg active:bg-primary/80"
      style={{ elevation: 6 }}
    >
      <SymbolView
        name={{ ios: "plus", android: "add", web: "add" }}
        tintColor="#FFFFFF"
        size={26}
        fallback={<Text className="text-3xl font-light text-white">+</Text>}
      />
    </Pressable>
  );
}
