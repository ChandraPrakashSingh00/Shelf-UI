import { productName } from "../content/site.js";

/**
 * The Shelf UI wordmark. `tone="inverse"` is for dark backgrounds, and
 * `byline` adds a short description under the name. The wordmark is
 * decorative; label its link.
 */
export function BrandLogo({ tone = "default", size = "md", byline = false, className }) {
  const [name, suffix] = productName.split(" ");
  const classes = [
    "docs-brand",
    `docs-brand--${size}`,
    tone === "inverse" && "docs-brand--inverse",
    className,
  ];

  return (
    <span className={classes.filter(Boolean).join(" ")} aria-hidden="true">
      <span className="docs-brand__text">
        <span className="docs-brand__name">
          {name}
          {suffix && <span className="docs-brand__suffix">{suffix}</span>}
        </span>
        {byline && <span className="docs-brand__byline">Open-source React components</span>}
      </span>
    </span>
  );
}
