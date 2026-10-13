import { Button, Input, Pagination } from "shelf-ui-react";
import { Link, useSearchParams } from "react-router";
import { SearchIcon } from "../components/icons.jsx";
import { PostCard } from "../components/PostCard.jsx";
import { blogCategories, blogPosts } from "../content/blog.js";
import { PageHero } from "../layout/PageParts.jsx";
import { useDocumentTitle } from "../lib/document.js";

const PAGE_SIZE = 4;

function matches(post, query) {
  const text = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => text.includes(word));
}

export function BlogPage() {
  useDocumentTitle("Blog & Resources");
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const category = blogCategories.find(
    (name) => name.toLowerCase() === searchParams.get("category"),
  );

  const posts = blogPosts.filter(
    (post) => (!category || post.category === category) && matches(post, query),
  );
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(searchParams.get("page")) || 1), totalPages);
  const visible = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /** Updates the URL's filters; any change starts again from page 1. */
  const update = (changes) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const isPageChange = "page" in changes;
    if (!isPageChange) next.delete("page");
    // A new page of results starts at the top; filtering keeps the reader's place.
    setSearchParams(next, { replace: true, preventScrollReset: !isPageChange });
  };

  const categoryHref = (name) => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (name) next.set("category", name.toLowerCase());
    const search = next.toString();
    return search ? `/blog?${search}` : "/blog";
  };

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Blog" }]}
        title="Blog & Resources"
        lead="Tutorials, guides, tips and release notes from the Shelf UI team."
      />

      <div className="docs-container docs-blog">
        <div className="docs-blog__toolbar">
          <Input
            type="search"
            aria-label="Search articles"
            placeholder="Search articles…"
            leftIcon={<SearchIcon />}
            value={query}
            onChange={(event) => update({ q: event.target.value })}
            className="docs-blog__search"
          />
          <nav aria-label="Article categories">
            <ul className="docs-chips">
              {[undefined, ...blogCategories].map((name) => (
                <li key={name ?? "all"}>
                  <Link
                    to={categoryHref(name)}
                    replace
                    preventScrollReset
                    className="docs-chip"
                    aria-current={name === category ? "page" : undefined}
                  >
                    {name ?? "All"}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="docs-visually-hidden" role="status">
          {posts.length === 1 ? "1 article" : `${posts.length} articles`}
        </p>

        {visible.length > 0 ? (
          <div className="docs-post-grid">
            {visible.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="docs-notice">
            <p>No articles match your search.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSearchParams({}, { replace: true })}
            >
              Clear filters
            </Button>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            className="docs-blog__pagination"
            label="Article pages"
            totalPages={totalPages}
            page={page}
            onPageChange={(next) => update({ page: next > 1 ? String(next) : "" })}
          />
        )}
      </div>
    </>
  );
}
