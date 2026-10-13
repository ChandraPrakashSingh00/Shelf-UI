import { Button } from "shelf-ui-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ComponentCard } from "../components/ComponentCard.jsx";
import { CategoryIcon, ComponentIcon } from "../components/componentIcons.jsx";
import { BoxesIcon } from "../components/icons.jsx";
import { SearchForm } from "../components/SearchForm.jsx";
import {
  categories,
  componentDocs,
  getCategory,
  getComponentDoc,
  getComponentsInCategory,
} from "../content/components/index.js";
import { PageHero } from "../layout/PageParts.jsx";
import { useDocumentTitle } from "../lib/document.js";

const featuredSlugs = ["button", "card", "input", "modal"];

function CategoryNav({ activeSlug }) {
  return (
    <nav className="docs-category-nav" aria-label="Component categories">
      <ul>
        <li>
          <Link
            to="/components"
            className="docs-category-nav__link"
            aria-current={activeSlug ? undefined : "page"}
          >
            <BoxesIcon className="docs-category-nav__icon" />
            All Components <span className="docs-category-nav__count">{componentDocs.length}</span>
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              to={`/components?category=${category.slug}`}
              className="docs-category-nav__link"
              aria-current={activeSlug === category.slug ? "page" : undefined}
            >
              <CategoryIcon slug={category.slug} className="docs-category-nav__icon" />
              {category.name}{" "}
              <span className="docs-category-nav__count">
                {getComponentsInCategory(category.name).length}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Overview() {
  return (
    <>
      <section aria-labelledby="featured-title">
        <h2 id="featured-title" className="docs-subsection-title">
          Featured Components
        </h2>
        <div className="docs-card-grid docs-card-grid--two">
          {featuredSlugs.map((slug) => (
            <ComponentCard key={slug} doc={getComponentDoc(slug)} />
          ))}
        </div>
      </section>

      <section aria-labelledby="categories-title">
        <h2 id="categories-title" className="docs-subsection-title">
          Browse by Category
        </h2>
        <ul className="docs-category-tiles">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                to={`/components?category=${category.slug}`}
                className="docs-category-tile"
                data-category={category.slug}
              >
                <span className="docs-category-tile__icon">
                  <CategoryIcon slug={category.slug} />
                </span>
                <span className="docs-category-tile__name">{category.name}</span>
                <span className="docs-category-tile__count">
                  {getComponentsInCategory(category.name).length} components
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="index-title">
        <h2 id="index-title" className="docs-subsection-title">
          All {componentDocs.length} components, A–Z
        </h2>
        <ul className="docs-component-index">
          {componentDocs.map((doc) => (
            <li key={doc.slug}>
              <Link to={`/components/${doc.slug}`}>
                <ComponentIcon slug={doc.slug} className="docs-component-index__icon" />
                {doc.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function CategoryListing({ category }) {
  const docs = getComponentsInCategory(category.name);

  return (
    <section aria-labelledby="category-title">
      <div className="docs-category-header">
        <span className="docs-category-tile__icon" data-category={category.slug}>
          <CategoryIcon slug={category.slug} />
        </span>
        <div>
          <h2 id="category-title" className="docs-subsection-title">
            {category.name}
          </h2>
          <p className="docs-muted">
            {docs.length} components · {category.description}
          </p>
        </div>
      </div>
      <div className="docs-card-grid docs-card-grid--two">
        {docs.map((doc) => (
          <ComponentCard key={doc.slug} doc={doc} preview />
        ))}
      </div>
    </section>
  );
}

export function ComponentsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");
  const category = categorySlug ? getCategory(categorySlug) : undefined;
  useDocumentTitle(category ? `${category.name} components` : "Components");

  return (
    <>
      <PageHero
        breadcrumbs={
          category
            ? [{ label: "Components", to: "/components" }, { label: category.name }]
            : [{ label: "Components" }]
        }
        title="All Components"
        lead={`Explore ${componentDocs.length} accessible, themeable components for your next project. Each one has a live preview, examples to copy and a full API reference.`}
      >
        <SearchForm
          label="Search components"
          placeholder="Search components, props and examples…"
          onSearch={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)}
        />
      </PageHero>

      <div className="docs-container docs-browse">
        <aside className="docs-browse__aside">
          <CategoryNav activeSlug={category?.slug} />
        </aside>
        <div className="docs-browse__main">
          {category ? (
            <CategoryListing category={category} />
          ) : categorySlug ? (
            <div className="docs-notice" role="status">
              <p>There's no “{categorySlug}” category.</p>
              <Button asChild size="sm" variant="outline">
                <Link to="/components">Show all components</Link>
              </Button>
            </div>
          ) : (
            <Overview />
          )}
        </div>
      </div>
    </>
  );
}
