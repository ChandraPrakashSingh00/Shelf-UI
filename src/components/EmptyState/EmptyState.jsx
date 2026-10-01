import { forwardRef } from "react";
import { cx } from "../../utils/cx.js";

/**
 * Placeholder for a view with nothing to show yet, like an empty cart, a search
 * with no results or an orders table before the first order. Renders a `<div>`
 * that receives the remaining props and the `ref`. When it appears in response to
 * a search or filter, render it inside a `role="status"` region that is already on
 * the page, so screen readers announce it.
 *
 * - `title` (required): short heading, e.g. "Your cart is empty".
 * - `description`: one or two sentences on why it's empty or what to do next.
 * - `icon`: decorative icon shown in a soft circle.
 * - `image`: illustration shown instead of the icon, e.g. an `<img>` (give it `alt=""`
 *   when it's decorative).
 * - `actions`: buttons or links below the text, e.g. "Continue shopping".
 * - `children`: extra content between the text and the actions.
 * - `headingLevel`: level of the title heading, 2–6 (default 3). Match your page outline.
 * - `size`: "sm", "md" (default) or "lg" — spacing, icon and text size. Use "sm"
 *   inside tables and cards.
 * - `variant`: "plain" (default) or "bordered" (dashed box).
 * - `tone`: color of the icon circle — "neutral" (default), "primary", "success",
 *   "warning" or "danger".
 * - `align`: "center" (default) or "start".
 */
export const EmptyState = forwardRef(function EmptyState(
  {
    title,
    description,
    icon,
    image,
    actions,
    headingLevel = 3,
    size = "md",
    variant = "plain",
    tone = "neutral",
    align = "center",
    className,
    children,
    ...rest
  },
  ref,
) {
  const Heading = `h${Math.min(Math.max(Math.floor(headingLevel) || 3, 2), 6)}`;

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        "cps-empty-state",
        `cps-empty-state--${size}`,
        `cps-empty-state--${variant}`,
        `cps-empty-state--${tone}`,
        `cps-empty-state--align-${align}`,
        className,
      )}
    >
      {image != null ? (
        <div className="cps-empty-state__image">{image}</div>
      ) : (
        icon != null && (
          <span className="cps-empty-state__icon" aria-hidden="true">
            {icon}
          </span>
        )
      )}
      <div className="cps-empty-state__text">
        <Heading className="cps-empty-state__title">{title}</Heading>
        {description != null && <p className="cps-empty-state__description">{description}</p>}
      </div>
      {children}
      {actions != null && <div className="cps-empty-state__actions">{actions}</div>}
    </div>
  );
});
