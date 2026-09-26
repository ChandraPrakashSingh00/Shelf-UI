import { Outlet, useLocation } from "react-router";
import { SidebarNav } from "./SidebarNav.jsx";

/** Sidebar + content shell for the documentation pages. */
export function DocsLayout() {
  const { pathname } = useLocation();

  return (
    <div className="docs-container docs-layout">
      <div className="docs-sidebar">
        <SidebarNav />
      </div>
      <div className="docs-content">
        {/* Below 1024px the sidebar moves into this disclosure; the key closes it on navigation. */}
        <details key={pathname} className="docs-mobile-nav">
          <summary>Browse documentation</summary>
          <SidebarNav />
        </details>
        <Outlet />
      </div>
    </div>
  );
}
