import { useEffect, useRef, useState } from "react";

/** Keep the pull-to-refresh spinner visible long enough to be noticed. */
const DEFAULT_MIN_SPINNER_MS = 700;

/**
 * State for a `RefreshControl` around a synchronous action: shows the spinner
 * for at least `minSpinnerMs`, then hides it and runs the action.
 *
 * The spinner is hidden *before* the action runs, so it can't get stuck if the
 * action re-renders the component without remounting it (e.g. a retry that
 * fails again).
 *
 * @example
 * const { refreshing, onRefresh } = usePullToRefresh(retry);
 * <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
 */
export function usePullToRefresh(
  action: () => void,
  minSpinnerMs = DEFAULT_MIN_SPINNER_MS,
) {
  const [refreshing, setRefreshing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const onRefresh = () => {
    setRefreshing(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setRefreshing(false);
      action();
    }, minSpinnerMs);
  };

  return { refreshing, onRefresh };
}
