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

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" });

/** Formats an ISO date (YYYY-MM-DD) like "Oct 2, 2026", the same in every time zone. */
export function formatDate(isoDate) {
  return dateFormat.format(new Date(`${isoDate}T00:00:00Z`));
}
