import { useMemo, useSyncExternalStore } from "react";
import { addDays, formatISODate, parseISODate, startOfDay } from "../utils/date.js";

// The snapshot is a string, so it stays equal (and React skips re-rendering)
// until the day actually changes.
const getSnapshot = () => formatISODate(new Date());
const getServerSnapshot = () => null;

function subscribe(onChange) {
  let timeout;
  const scheduleMidnight = () => {
    const now = new Date();
    // A second past midnight, so the new day has surely started when it fires.
    const delay = addDays(startOfDay(now), 1).getTime() - now.getTime() + 1000;
    timeout = setTimeout(() => {
      onChange();
      scheduleMidnight();
    }, delay);
  };
  scheduleMidnight();
  // Timers pause while a laptop sleeps: check again when the page is shown.
  document.addEventListener("visibilitychange", onChange);
  return () => {
    clearTimeout(timeout);
    document.removeEventListener("visibilitychange", onChange);
  };
}

/**
 * Today's date (local time, at 00:00), updated when the day changes. It is
 * `null` during server rendering and hydration, so the server and the browser
 * render the same markup even when their clocks or time zones disagree.
 */
export function useToday() {
  const today = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => parseISODate(today), [today]);
}
