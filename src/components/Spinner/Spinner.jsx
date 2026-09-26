import { forwardRef } from "react";
import { Spinner as SpinnerIcon } from "../../primitives/Spinner.jsx";
import { cx } from "../../utils/cx.js";

/**
 * Loading indicator for a section or a page that is loading. Renders a
 * `<span role="status">` with a visually hidden label; other props and the
 * `ref` go to it. For buttons, use `Button`'s `loading` prop instead.
 *
 * - `size`: "sm" (1rem), "md" (default, 1.5rem) or "lg" (2.25rem).
 * - `label`: text for screen readers (default "Loading…"). Pass `""` when visible
 *   text already says what is loading: the spinner is then decorative, with no
 *   role, and hidden from screen readers.
 *
 * The spinner uses the primary color; set `color` (with a class or `style`) to change it.
 */
export const Spinner = forwardRef(function Spinner(
  { size = "md", label = "Loading…", className, ...rest },
  ref,
) {
  const isDecorative = label == null || label === "";

  return (
    <span
      {...rest}
      ref={ref}
      role={isDecorative ? undefined : "status"}
      aria-hidden={isDecorative || undefined}
      className={cx("cps-spinner-status", `cps-spinner-status--${size}`, className)}
    >
      <SpinnerIcon />
      {!isDecorative && <span className="cps-visually-hidden">{label}</span>}
    </span>
  );
});
