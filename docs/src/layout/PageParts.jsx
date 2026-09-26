import { Link } from "react-router";
import { ArrowLeftIcon, ArrowRightIcon } from "../components/icons.jsx";
import { InlineMarkdown } from "../components/InlineMarkdown.jsx";

export function PageHeader({ eyebrow, title, lead, children }) {
  return (
    <header className="docs-page-header">
      <p className="docs-eyebrow">{eyebrow}</p>
      <h1 className="docs-h1">{title}</h1>
      <p className="docs-lead">
        <InlineMarkdown text={lead} />
      </p>
      {children}
    </header>
  );
}

/**
 * "On this page" links. Each item is `{ id, label, nested }`; nested entries
 * (e.g. examples under "Examples") are indented.
 */
export function TableOfContents({ items }) {
  return (
    <nav className="docs-toc" aria-label="On this page">
      <p className="docs-toc__title">On this page</p>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={item.nested ? "docs-toc__nested" : undefined}>
            <a href={`#${item.id}`}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
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
