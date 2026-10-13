import { Badge } from "shelf-ui-react";
import { Link, useParams } from "react-router";
import { BlogCover } from "../components/BlogCover.jsx";
import { CodeBlock } from "../components/CodeBlock.jsx";
import { ArrowLeftIcon } from "../components/icons.jsx";
import { InlineMarkdown } from "../components/InlineMarkdown.jsx";
import { PostCard } from "../components/PostCard.jsx";
import { toAnchorId } from "../components/PropsTable.jsx";
import { blogPosts, getBlogPost, readingTime } from "../content/blog.js";
import { productName } from "../content/site.js";
import { Breadcrumbs } from "../layout/PageParts.jsx";
import { formatDate, useDocumentTitle } from "../lib/document.js";
import { NotFoundContent } from "./NotFoundPage.jsx";

function Block({ block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 id={toAnchorId(block.text)} className="docs-h2">
          {block.text}
        </h2>
      );
    case "list":
      return (
        <ul className="docs-list">
          {block.items.map((item) => (
            <li key={item}>
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ul>
      );
    case "code":
      return <CodeBlock code={block.code} language={block.language} title={block.title} />;
    default:
      return (
        <p className="docs-text">
          <InlineMarkdown text={block.text} />
        </p>
      );
  }
}

/** Up to two other posts, preferring the same category. */
function relatedPosts(post) {
  const others = blogPosts.filter((other) => other !== post);
  return [
    ...others.filter((other) => other.category === post.category),
    ...others.filter((other) => other.category !== post.category),
  ].slice(0, 2);
}

export function BlogPostPage() {
  const { slug = "" } = useParams();
  const post = getBlogPost(slug);
  useDocumentTitle(post?.title ?? "Page not found");

  if (!post) {
    return (
      <div className="docs-container">
        <NotFoundContent />
      </div>
    );
  }

  return (
    <>
      <article className="docs-post">
        <header className="docs-page-hero docs-post__hero">
          <div className="docs-container docs-post__container">
            <Breadcrumbs items={[{ label: "Blog", to: "/blog" }, { label: post.title }]} />
            <Badge variant="primary">{post.category}</Badge>
            <h1 className="docs-page-hero__title">{post.title}</h1>
            <p className="docs-page-hero__lead">{post.excerpt}</p>
            <p className="docs-post-meta">
              <span>{productName} Team</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{readingTime(post)} min read</span>
            </p>
          </div>
        </header>
        <div className="docs-container docs-post__container">
          <BlogCover variant={post.cover} className="docs-post__cover" />
          <div className="docs-post__body">
            {post.body.map((block, index) => (
              <Block key={index} block={block} />
            ))}
          </div>
          <Link to="/blog" className="docs-arrow-link">
            <ArrowLeftIcon /> All articles
          </Link>
        </div>
      </article>

      <section className="docs-container docs-section docs-section--last" aria-labelledby="more">
        <h2 id="more" className="docs-section__title">
          Keep reading
        </h2>
        <div className="docs-post-grid">
          {relatedPosts(post).map((other) => (
            <PostCard key={other.slug} post={other} headingLevel={3} />
          ))}
        </div>
      </section>
    </>
  );
}
