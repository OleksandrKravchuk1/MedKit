import { SymbolView } from "expo-symbols";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useThemeColors } from "@/hooks/use-theme-colors";

const CORE_SIZE = 64;
/** Outer size reserved for the rings so they don't overlap the text below. */
const AREA_SIZE = 112;
const RING_DURATION_MS = 2200;
const RING_MAX_SCALE = 1.7;
const RING_START_OPACITY = 0.35;

type PulseRingProps = {
  color: string;
  delayMs: number;
};

/** A ring that grows from the core and fades out, repeatedly. */
function PulseRing({ color, delayMs }: PulseRingProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delayMs,
      withRepeat(
        withTiming(1, {
          duration: RING_DURATION_MS,
          easing: Easing.out(Easing.cubic),
        }),
        -1,
      ),
    );
    return () => cancelAnimation(progress);
  }, [delayMs, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: RING_START_OPACITY * (1 - progress.value),
    transform: [{ scale: 1 + (RING_MAX_SCALE - 1) * progress.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          width: CORE_SIZE,
          height: CORE_SIZE,
          borderRadius: CORE_SIZE / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

/**
 * Warning icon with pulsing red rings, used on the error screen.
 * Respects the system "reduce motion" setting by rendering static circles.
 */
export function PulsingAlertIcon() {
  const { colors } = useThemeColors();
  const reduceMotion = useReducedMotion();
  const breath = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      // cancelAnimation freezes the value mid-pulse; settle at the rest size.
      breath.value = 1;
      return;
    }
    breath.value = withRepeat(
      withSequence(
        withTiming(1.06, {
          duration: RING_DURATION_MS / 2,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(1, {
          duration: RING_DURATION_MS / 2,
          easing: Easing.inOut(Easing.quad),
        }),
      ),
      -1,
    );
    return () => cancelAnimation(breath);
  }, [reduceMotion, breath]);

  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breath.value }],
  }));

  return (
    <View
      className="items-center justify-center"
      style={{ width: AREA_SIZE, height: AREA_SIZE }}
    >
      {reduceMotion ? (
        <View className="absolute h-24 w-24 rounded-full bg-danger/15" />
      ) : (
        <>
          <PulseRing color={colors.danger} delayMs={0} />
          <PulseRing color={colors.danger} delayMs={RING_DURATION_MS / 2} />
        </>
      )}

      {/* Animated.View only animates; NativeWind classes go on a plain View. */}
      <Animated.View style={coreStyle}>
        <View
          className="items-center justify-center rounded-full bg-danger/20"
          style={{ width: CORE_SIZE, height: CORE_SIZE }}
        >
          <SymbolView
            name={{
              ios: "exclamationmark.triangle.fill",
              android: "warning",
              web: "warning",
            }}
            tintColor={colors.danger}
            size={32}
            fallback={<Text className="text-3xl text-danger">!</Text>}
          />
        </View>
      </Animated.View>
    </View>
  );
}
