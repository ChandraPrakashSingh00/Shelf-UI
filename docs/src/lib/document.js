import { useEffect } from "react";

const SITE_NAME = "CodeCPS UI";

/** Sets `document.title` for the current page. */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} · ${SITE_NAME}`
      : `${SITE_NAME} — React components by CodeCPS`;
  }, [title]);
}

/** Whether the reader is on macOS / iOS, where shortcuts use ⌘ instead of Ctrl. */
export function isApplePlatform() {
  return typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);
}
