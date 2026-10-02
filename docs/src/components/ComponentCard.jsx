import { Link } from "react-router";
import { ComponentIcon } from "./componentIcons.jsx";
import { ArrowRightIcon } from "./icons.jsx";

/**
 * Card linking to a component page. The title link stretches over the whole
 * card, so each card is one Tab stop. With `preview`, the card shows the
 * component's thumbnail, which is decorative (`inert`).
 */
export function ComponentCard({ doc, preview = false, headingLevel = 3 }) {
  const { Thumbnail } = doc;
  const Heading = `h${headingLevel}`;

  return (
    <article
      className={
        preview ? "docs-component-card docs-component-card--preview" : "docs-component-card"
      }
    >
      {preview && (
        <div className="docs-component-card__preview" inert>
          <Thumbnail />
        </div>
      )}
      <div className="docs-component-card__body">
        <span className="docs-icon-tile">
          <ComponentIcon slug={doc.slug} />
        </span>
        <Heading className="docs-component-card__title">
          <Link to={`/components/${doc.slug}`} className="docs-component-card__link">
            {doc.name}
          </Link>
        </Heading>
        <p className="docs-component-card__summary">{doc.summary}</p>
        <span className="docs-component-card__more" aria-hidden="true">
          View details <ArrowRightIcon />
        </span>
      </div>
    </article>
  );
}
