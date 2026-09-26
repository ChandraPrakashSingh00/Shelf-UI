import { useId } from "react";
import { NavLink } from "react-router";
import { componentDocs } from "../content/components/index.js";
import { aboutGuide, changelogGuide, installationGuide } from "../content/guides.js";

export function SidebarNav() {
  const id = useId();

  return (
    <nav aria-label="Documentation" className="docs-sidebar-nav">
      <p id={`${id}-start`} className="docs-sidebar-nav__title">
        Getting started
      </p>
      <ul aria-labelledby={`${id}-start`}>
        {[installationGuide, changelogGuide, aboutGuide].map((guide) => (
          <li key={guide.href}>
            <NavLink to={guide.href} className="docs-sidebar-nav__link">
              {guide.title}
            </NavLink>
          </li>
        ))}
      </ul>

      <p id={`${id}-components`} className="docs-sidebar-nav__title">
        Components
      </p>
      <ul aria-labelledby={`${id}-components`}>
        <li>
          <NavLink to="/components" end className="docs-sidebar-nav__link">
            Overview
          </NavLink>
        </li>
        {componentDocs.map((doc) => (
          <li key={doc.slug}>
            <NavLink to={`/components/${doc.slug}`} className="docs-sidebar-nav__link">
              {doc.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
