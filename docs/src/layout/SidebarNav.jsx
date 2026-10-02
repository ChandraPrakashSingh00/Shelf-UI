import { useId, useState } from "react";
import { Link, NavLink } from "react-router";
import { ChevronDownIcon, ChevronRightIcon } from "../components/icons.jsx";
import { categories, getComponentsInCategory } from "../content/components/index.js";
import { docsGroups } from "../content/docsPages.js";

const [gettingStarted, ...otherGroups] = docsGroups;

const componentLinks = [
  { title: "All components", href: "/components" },
  ...categories.map((category) => ({
    title: category.name,
    href: `/components?category=${category.slug}`,
    count: getComponentsInCategory(category.name).length,
  })),
];

/** A sidebar section whose list can be collapsed with its heading button. */
function NavGroup({ title, children }) {
  const id = useId();
  const [open, setOpen] = useState(true);

  return (
    <div className="docs-sidebar-nav__group">
      <h2 className="docs-sidebar-nav__heading">
        <button
          type="button"
          className="docs-sidebar-nav__toggle"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
        >
          {title}
          <ChevronDownIcon className="docs-sidebar-nav__chevron" />
        </button>
      </h2>
      <ul id={id} hidden={!open}>
        {children}
      </ul>
    </div>
  );
}

function PageLinks({ pages }) {
  return pages.map((page) => (
    <li key={page.href}>
      <NavLink to={page.href} end className="docs-sidebar-nav__link">
        <ChevronRightIcon className="docs-sidebar-nav__bullet" />
        {page.title}
      </NavLink>
    </li>
  ));
}

export function SidebarNav() {
  return (
    <nav aria-label="Documentation" className="docs-sidebar-nav">
      <NavGroup title={gettingStarted.title}>
        <PageLinks pages={gettingStarted.pages} />
      </NavGroup>

      <NavGroup title="Components">
        {componentLinks.map((link) => (
          <li key={link.href}>
            <Link to={link.href} className="docs-sidebar-nav__link">
              <ChevronRightIcon className="docs-sidebar-nav__bullet" />
              {link.title}{" "}
              {link.count !== undefined && (
                <span className="docs-sidebar-nav__count">{link.count}</span>
              )}
            </Link>
          </li>
        ))}
      </NavGroup>

      {otherGroups.map((group) => (
        <NavGroup key={group.title} title={group.title}>
          <PageLinks pages={group.pages} />
        </NavGroup>
      ))}
    </nav>
  );
}
