import { forwardRef } from "react";
import { cx } from "../utils/cx.js";

/**
 * Square, icon-only button used for close / dismiss / menu toggles. `label` is
 * required: it is the accessible name, because the button has no visible text.
 */
export const IconButton = forwardRef(function IconButton(
  { label, className, children, type = "button", ...rest },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      aria-label={label}
      className={cx("shelf-icon-button", className)}
    >
      {children}
    </button>
  );
});
