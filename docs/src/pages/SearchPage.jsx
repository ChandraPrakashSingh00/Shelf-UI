import { Badge, Button } from "@codecps/ui";
import { Link, useSearchParams } from "react-router";
import { ComponentIcon } from "../components/componentIcons.jsx";
import { ArrowRightIcon, BookIcon, FileTextIcon } from "../components/icons.jsx";
import { SearchForm } from "../components/SearchForm.jsx";
import { categories } from "../content/components/index.js";
import { searchIndex } from "../content/searchIndex.js";
import { PageHero } from "../layout/PageParts.jsx";
import { useDocumentTitle } from "../lib/document.js";
import { searchEntries } from "../lib/search.js";

const CATEGORY_ORDER = [
  ...categories.map((category) => category.name),
  "Examples",
  "Documentation",
  "Blog",
];

function ResultIcon({ entry }) {
  const [kind, slug] = entry.id.split(":");
  if (kind === "component" || kind === "example") return <ComponentIcon slug={slug} />;
  if (kind === "blog") return <FileTextIcon />;
  return <BookIcon />;
}

function countByCategory(results) {
  const counts = new Map();
  for (const entry of results) counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
  return CATEGORY_ORDER.filter((name) => counts.has(name)).map((name) => ({
    name,
    count: counts.get(name),
  }));
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const category = searchParams.get("category");
  useDocumentTitle(query ? `Search: ${query}` : "Search");

  const results = query ? searchEntries(searchIndex, query, Infinity) : [];
  const groups = countByCategory(results);
  const activeCategory = groups.some((group) => group.name === category) ? category : null;
  const visible = activeCategory
    ? results.filter((entry) => entry.category === activeCategory)
    : results;

  const href = (name) => {
    const next = new URLSearchParams({ q: query });
    if (name) next.set("category", name);
    return `/search?${next}`;
  };

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Search" }]}
        title="Search Results"
        lead={
          query
            ? `Here's what we found for “${query}”.`
            : "Search components, examples, documentation and articles."
        }
      >
        <SearchForm
          label="Search the site"
          placeholder="Search components, docs and articles…"
          defaultValue={query}
          onSearch={(value) => setSearchParams(value ? { q: value } : {})}
        />
      </PageHero>

      <div className="docs-container docs-browse">
        {results.length > 0 && (
          <aside className="docs-browse__aside">
            <nav className="docs-filter" aria-labelledby="filter-title">
              <h2 id="filter-title" className="docs-filter__title">
                Filter by Category
              </h2>
              <ul>
                <li>
                  <Link
                    to={href()}
                    replace
                    className="docs-category-nav__link"
                    aria-current={activeCategory ? undefined : "page"}
                  >
                    All results <span className="docs-category-nav__count">{results.length}</span>
                  </Link>
                </li>
                {groups.map((group) => (
                  <li key={group.name}>
                    <Link
                      to={href(group.name)}
                      replace
                      className="docs-category-nav__link"
                      aria-current={activeCategory === group.name ? "page" : undefined}
                    >
                      {group.name} <span className="docs-category-nav__count">{group.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {activeCategory && (
                <Link to={href()} replace className="docs-filter__clear">
                  Clear filter
                </Link>
              )}
            </nav>
          </aside>
        )}

        <div className="docs-browse__main">
          <p className="docs-results-count" role="status">
            {query
              ? `${visible.length} ${visible.length === 1 ? "result" : "results"}${
                  activeCategory ? ` in ${activeCategory}` : ""
                }`
              : ""}
          </p>

          {visible.length > 0 ? (
            <ul className="docs-results">
              {visible.map((entry) => (
                <li key={entry.id} className="docs-result">
                  <span className="docs-icon-tile">
                    <ResultIcon entry={entry} />
                  </span>
                  <div className="docs-result__body">
                    <h2 className="docs-result__title">
                      <Link to={entry.href} className="docs-result__link">
                        {entry.title}
                      </Link>
                      {entry.section !== "Components" && entry.section !== entry.category && (
                        <span className="docs-result__section"> · {entry.section}</span>
                      )}
                    </h2>
                    <p className="docs-result__description">{entry.description}</p>
                    <Badge size="sm" variant="primary">
                      {entry.category}
                    </Badge>
                  </div>
                  <span className="docs-result__more" aria-hidden="true">
                    View details <ArrowRightIcon />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            query && (
              <div className="docs-notice">
                <p>
                  No results for “{query}”. Try a component name like “button”, or a prop like
                  “disabled”.
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link to="/components">Browse all components</Link>
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
