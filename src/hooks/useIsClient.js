import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` during server rendering and hydration, `true` afterwards. Lets
 * components render browser-only output (portals) without hydration mismatches.
 */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
