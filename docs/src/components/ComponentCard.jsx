import { Link } from "react-router";

/**
 * Card linking to a component page. The preview is decorative (`inert`), and
 * the title link stretches over the whole card, so each card is one Tab stop.
 */
export function ComponentCard({ doc }) {
  const { Thumbnail } = doc;

  return (
    <article className="docs-component-card">
      <div className="docs-component-card__preview" inert>
        <Thumbnail />
      </div>
      <div className="docs-component-card__body">
        <h3 className="docs-component-card__title">
          <Link to={`/components/${doc.slug}`} className="docs-component-card__link">
            {doc.name}
          </Link>
        </h3>
        <p className="docs-component-card__summary">{doc.summary}</p>
      </div>
    </article>
  );
}
