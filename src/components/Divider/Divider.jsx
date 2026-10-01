import { forwardRef } from "react";
import { cx } from "../../utils/cx.js";

/**
 * Line that separates content, optionally with a label like "OR". The `ref`
 * points to the root element, which receives the remaining props.
 *
 * Without a label, a horizontal divider is an `<hr>` and a vertical one a
 * `<div role="separator" aria-orientation="vertical">`, which stretches to the
 * height of a flex row. With a label, it's a `<div>` whose label is plain text
 * that screen readers read; the lines are drawn with CSS.
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
    "cps-divider",
    vertical ? "cps-divider--vertical" : "cps-divider--horizontal",
    `cps-divider--${variant}`,
    `cps-divider--spacing-${spacing}`,
    hasLabel && "cps-divider--labelled",
    hasLabel && `cps-divider--label-${labelPosition}`,
    className,
  );
  const ariaHidden = decorative || undefined;

  // A separator's children are presentational, so a labelled divider stays a
  // plain element: its label is read as text.
  if (hasLabel) {
    return (
      <div {...rest} ref={ref} aria-hidden={ariaHidden} className={classes}>
        <span className="cps-divider__label">{label}</span>
      </div>
    );
  }

  if (!vertical) {
    return <hr {...rest} ref={ref} aria-hidden={ariaHidden} className={classes} />;
  }

  return (
    <div
      role={decorative ? undefined : "separator"}
      aria-orientation={decorative ? undefined : "vertical"}
      {...rest}
      ref={ref}
      aria-hidden={ariaHidden}
      className={classes}
    />
  );
});
