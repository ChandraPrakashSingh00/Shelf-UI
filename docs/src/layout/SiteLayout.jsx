import { ToastProvider } from "@codecps/ui";
import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { SearchDialog } from "../components/SearchDialog.jsx";
import { SiteFooter } from "./SiteFooter.jsx";
import { SiteHeader } from "./SiteHeader.jsx";

/**
 * After client-side navigation, moves focus to the new page's heading so
 * screen readers announce the page (browsers only do this on full loads).
 */
function useFocusHeadingOnNavigate() {
  const { pathname } = useLocation();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    const heading = document.querySelector("#main h1");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, [pathname]);
}

/** ⌘K / Ctrl+K anywhere, or "/" when not typing, opens search. */
function useSearchShortcut(openSearch) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      const isModifierShortcut =
        event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);

      if (isModifierShortcut || (event.key === "/" && !isTyping)) {
        event.preventDefault();
        openSearch();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openSearch]);
}

export function SiteLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useSearchShortcut(openSearch);
  useFocusHeadingOnNavigate();

  return (
    <ToastProvider>
      <a href="#main" className="docs-skip-link">
        Skip to content
      </a>
      <SiteHeader onOpenSearch={openSearch} />
      <main id="main" className="docs-main" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
      <ScrollRestoration getKey={scrollKey} />
    </ToastProvider>
  );
}

// Pages opened directly (typed URL, new tab) all share the key "default", so
// one page's saved scroll position would be restored on another. Key those
// entries by path instead; in-app navigations keep their unique keys.
function scrollKey(location) {
  return location.key === "default" ? location.pathname : location.key;
}
