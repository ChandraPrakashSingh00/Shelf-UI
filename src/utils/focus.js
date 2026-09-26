const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "summary",
  "[tabindex]",
].join(",");

/** Returns the keyboard-focusable descendants of `container`, in DOM order. */
export function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      element.getAttribute("tabindex") !== "-1" &&
      !element.hasAttribute("disabled") &&
      !element.closest("[hidden], [inert]"),
  );
}
