import { Breadcrumb } from "@shelf-ui/react";
import { Link } from "react-router";
import { ArrowLeftIcon, ArrowRightIcon } from "../components/icons.jsx";
import { InlineMarkdown } from "../components/InlineMarkdown.jsx";
import { getAdjacentDocsPages } from "../content/docsPages.js";

/**
 * Home › … › current page. `items` are `{ label, to }`; the last item is the
 * current page and needs no `to`.
 */
export function Breadcrumbs({ items }) {
  return (
    <Breadcrumb className="docs-breadcrumb">
      <Breadcrumb.Item asChild>
        <Link to="/">Home</Link>
      </Breadcrumb.Item>
      {items.map((item, index) =>
        index === items.length - 1 ? (
          <Breadcrumb.Item key={item.label} current>
            {item.label}
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={item.label} asChild>
            <Link to={item.to}>{item.label}</Link>
          </Breadcrumb.Item>
        ),
      )}
    </Breadcrumb>
  );
}

/**
 * The band at the top of a page: breadcrumbs, title, lead (inline markdown)
 * and optional actions beside the title.
 */
export function PageHero({ breadcrumbs, title, lead, actions, children, className }) {
  return (
    <header className={["docs-page-hero", className].filter(Boolean).join(" ")}>
      <div className="docs-container">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className="docs-page-hero__row">
          <div className="docs-page-hero__text">
            <h1 className="docs-page-hero__title">{title}</h1>
            {lead && (
              <p className="docs-page-hero__lead">
                <InlineMarkdown text={lead} />
              </p>
            )}
          </div>
          {actions && <div className="docs-page-hero__actions">{actions}</div>}
        </div>
        {children}
      </div>
    </header>
  );
}

/** Title and lead of a page inside the docs layout. */
export function PageHeader({ title, lead, children }) {
  return (
    <header className="docs-page-header">
      <h1 className="docs-h1">{title}</h1>
      {lead && (
        <p className="docs-lead">
          <InlineMarkdown text={lead} />
        </p>
      )}
      {children}
    </header>
  );
}

/** Previous / next page links; each is `{ to, label }` and both are optional. */
export function PageNav({ previous, next }) {
  return (
    <nav className="docs-page-nav" aria-label="Previous and next pages">
      {previous ? (
        <Link to={previous.to} className="docs-page-nav__link">
          <span className="docs-page-nav__hint">Previous</span>
          <span className="docs-page-nav__label">
            <ArrowLeftIcon />
            {previous.label}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link to={next.to} className="docs-page-nav__link docs-page-nav__link--next">
          <span className="docs-page-nav__hint">Next</span>
          <span className="docs-page-nav__label">
            {next.label}
            <ArrowRightIcon />
          </span>
        </Link>
      )}
    </nav>
  );
}

/** Previous / next links for a docs page, in sidebar order. */
export function DocsPageNav({ page }) {
  const { previous, next } = getAdjacentDocsPages(page.href);
  return (
    <PageNav
      previous={previous && { to: previous.href, label: previous.title }}
      next={next && { to: next.href, label: next.title }}
    />
  );
}
