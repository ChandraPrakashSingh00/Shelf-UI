import { Outlet, useLocation } from "react-router";
import { docsPages, introductionPage } from "../content/docsPages.js";
import { Breadcrumbs } from "./PageParts.jsx";
import { SidebarNav } from "./SidebarNav.jsx";

/** "Documentation" band, sidebar and content shell for the docs pages. */
export function DocsLayout() {
  const { pathname } = useLocation();
  const page = docsPages.find((entry) => entry.href === pathname);
  const breadcrumbs =
    page && page !== introductionPage
      ? [{ label: "Documentation", to: "/docs" }, { label: page.title }]
      : [{ label: "Documentation" }];

  return (
    <>
      <div className="docs-page-hero docs-page-hero--compact">
        <div className="docs-container">
          <Breadcrumbs items={breadcrumbs} />
          {/* The page's own title is its h1, so this band title isn't a heading. */}
          <p className="docs-page-hero__title">Documentation</p>
          <p className="docs-page-hero__lead">
            Everything you need to get started with CodeCPS UI.
          </p>
        </div>
      </div>
      <div className="docs-container docs-layout">
        <aside className="docs-sidebar">
          <SidebarNav />
        </aside>
        <div className="docs-content">
          {/* Below 1024px the sidebar moves into this disclosure; the key closes it on navigation. */}
          <details key={pathname} className="docs-mobile-nav">
            <summary>Browse documentation</summary>
            <SidebarNav />
          </details>
          <Outlet />
        </div>
      </div>
    </>
  );
}
