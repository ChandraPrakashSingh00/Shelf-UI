import { useEffect, useState } from "react";
import { getFocusableElements } from "../utils/focus.js";

/**
 * Keeps keyboard focus inside `containerRef` while mounted: moves focus in on
 * mount, wraps Tab / Shift+Tab, and restores focus on unmount.
 *
 * - `initialFocusRef`: element to focus on activation. Defaults to the first
 *   focusable element.
 * - `restoreFocus`: return focus to the previously focused element on
 *   deactivation (default `true`).
 */
export function useFocusTrap(containerRef, { initialFocusRef, restoreFocus = true } = {}) {
  // Captured during the first render: by the time effects run, an `autoFocus`
  // element inside the container may already have taken focus.
  const [previouslyFocused] = useState(() =>
    typeof document !== "undefined" && document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null,
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initialTarget = initialFocusRef?.current;
    if (initialTarget) {
      initialTarget.focus();
    } else if (!container.contains(document.activeElement)) {
      // Respect an `autoFocus` element that already moved focus inside.
      (getFocusableElements(container)[0] ?? container).focus();
    }

    const handleKeyDown = (event) => {
      if (event.key !== "Tab") return;

      const focusable = getFocusableElements(container);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        container.focus();
        return;
      }

      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      // Only restore on a real unmount (the container has left the DOM), not
      // when the effect re-runs — e.g. React StrictMode's simulated remount.
      if (restoreFocus && !container.isConnected && previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [containerRef, initialFocusRef, restoreFocus, previouslyFocused]);
}
