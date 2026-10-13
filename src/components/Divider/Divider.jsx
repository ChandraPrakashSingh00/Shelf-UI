import { forwardRef } from "react";
import { cx } from "../../utils/cx.js";

/**
 * Line that separates content, optionally with a label like "OR". The `ref`
 * points to the root element, which receives the remaining props.
 *
 * Without a label, a horizontal divider is an `<hr>` and a vertical one a
 * `<span role="separator" aria-orientation="vertical">`, which stretches to the
 * height of a flex row and, being inline, can also sit between links inside a
 * `<p>`. With a label, it's a `<div>` whose label is plain text that screen
 * readers read; the lines are drawn with CSS.
 *
 * - `orientation`: "horizontal" (default) or "vertical".
 * - `label`: text (or other content) in the middle of the line, e.g. "OR".
 * - `labelPosition`: "start", "center" (default) or "end" — where the label sits.
 * - `variant`: "solid" (default) or "dashed".
 * - `spacing`: "sm", "md" (default) or "lg" — the margin on both sides of the
 *   line (above and below, or left and right when vertical).
 * - `decorative`: hides the divider from assistive technology (default `false`),
 *   for lines that only add visual rhythm.
 */
export const Divider = forwardRef(function Divider(
  {
    orientation = "horizontal",
    label,
    labelPosition = "center",
    variant = "solid",
    spacing = "md",
    decorative = false,
    className,
    ...rest
  },
  ref,
) {
  const vertical = orientation === "vertical";
  const hasLabel = label != null && label !== false && label !== "";
  const classes = cx(
    "shelf-divider",
    vertical ? "shelf-divider--vertical" : "shelf-divider--horizontal",
    `shelf-divider--${variant}`,
    `shelf-divider--spacing-${spacing}`,
    hasLabel && "shelf-divider--labelled",
    hasLabel && `shelf-divider--label-${labelPosition}`,
    className,
  );
  const ariaHidden = decorative || undefined;

  // A separator's children are presentational, so a labelled divider stays a
  // plain element: its label is read as text.
  if (hasLabel) {
    return (
      <div {...rest} ref={ref} aria-hidden={ariaHidden} className={classes}>
        <span className="shelf-divider__label">{label}</span>
      </div>
    );
  }

  if (!vertical) {
    return <hr {...rest} ref={ref} aria-hidden={ariaHidden} className={classes} />;
  }

  return (
    <span
      role={decorative ? undefined : "separator"}
      aria-orientation={decorative ? undefined : "vertical"}
      {...rest}
      ref={ref}
      aria-hidden={ariaHidden}
      className={classes}
    />
  );
});
