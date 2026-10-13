import { forwardRef } from "react";
import { cx } from "../../utils/cx.js";

/**
 * Compact label for statuses, counts and categories.
 *
 * - `variant`: color scheme — "primary", "success", "warning", "danger" or "neutral" (default).
 * - `size`: "sm" or "md" (default).
 */
export const Badge = forwardRef(function Badge(
  { variant = "neutral", size = "md", className, ...rest },
  ref,
) {
  return (
    <span
      {...rest}
      ref={ref}
      className={cx("shelf-badge", `shelf-badge--${variant}`, `shelf-badge--${size}`, className)}
    />
  );
});
