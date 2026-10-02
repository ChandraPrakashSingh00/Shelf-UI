import { Link } from "react-router";
import { readingTime } from "../content/blog.js";
import { formatDate } from "../lib/document.js";
import { BlogCover } from "./BlogCover.jsx";

/** Blog post card; the title link stretches over the whole card. */
export function PostCard({ post, headingLevel = 2 }) {
  const Heading = `h${headingLevel}`;

  return (
    <article className="docs-post-card">
      <div className="docs-post-card__cover">
        <BlogCover variant={post.cover} />
        <span className="docs-post-card__badge">{post.category}</span>
      </div>
      <div className="docs-post-card__body">
        <Heading className="docs-post-card__title">
          <Link to={`/blog/${post.slug}`} className="docs-post-card__link">
            {post.title}
          </Link>
        </Heading>
        <p className="docs-post-card__excerpt">{post.excerpt}</p>
        <p className="docs-post-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{readingTime(post)} min read</span>
        </p>
      </div>
    </article>
  );
}
