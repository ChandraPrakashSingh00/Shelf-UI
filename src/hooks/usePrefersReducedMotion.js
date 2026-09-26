import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const getMediaQueryList = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(QUERY)
    : null;

function subscribe(onChange) {
  const mediaQueryList = getMediaQueryList();
  if (!mediaQueryList) return () => {};
  mediaQueryList.addEventListener("change", onChange);
  return () => mediaQueryList.removeEventListener("change", onChange);
}

const getSnapshot = () => getMediaQueryList()?.matches ?? false;
const getServerSnapshot = () => false;

/**
 * `true` when the user asked their system to reduce motion
 * (`prefers-reduced-motion: reduce`), and follows changes to that setting.
 * SSR-safe: it is `false` during server rendering and hydration, and in
 * environments without `matchMedia`.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
