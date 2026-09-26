import { forwardRef } from "react";
import { Slot } from "../../primitives/Slot.jsx";
import { Spinner } from "../../primitives/Spinner.jsx";
import { cx } from "../../utils/cx.js";

/**
 * Triggers an action. Accepts every native `<button>` attribute; the `ref`
 * points to the `<button>` element.
 *
 * - `variant`: "primary" (default), "secondary", "outline", "ghost" or "danger".
 * - `size`: "sm", "md" (default) or "lg" — height, padding and font size.
 * - `loading`: shows a spinner and ignores clicks (`aria-busy` + `aria-disabled`).
 *   Unlike `disabled`, the button stays focusable so keyboard users keep their place.
 * - `leftIcon` / `rightIcon`: decorative icons before / after the label. The
 *   spinner replaces `leftIcon` while loading.
 * - `fullWidth`: stretches the button to the full width of its container.
 * - `asChild`: renders the single child element (e.g. a router `<Link>` or `<a>`)
 *   with button styling instead of a `<button>`. The child keeps its own content,
 *   so `loading`, `disabled`, `leftIcon`, `rightIcon` and `type` don't apply,
 *   and any `ref` should go on the child itself.
 */
export const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    disabled,
    // A plain button never submits a surrounding form by accident.
    type = "button",
    asChild = false,
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const classes = cx(
    "cps-button",
    `cps-button--${variant}`,
    `cps-button--${size}`,
    fullWidth && "cps-button--full-width",
    loading && !asChild && "cps-button--loading",
    className,
  );

  if (asChild) {
    return (
      <Slot {...rest} onClick={onClick} className={classes}>
        {children}
      </Slot>
    );
  }

  // A loading button uses `aria-disabled` instead of `disabled` so it keeps
  // keyboard focus; clicks (and form submission) are blocked here instead.
  const handleClick = (event) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
      className={classes}
    >
      {loading ? (
        <Spinner className="cps-button__icon" />
      ) : (
        leftIcon && (
          <span className="cps-button__icon" aria-hidden="true">
            {leftIcon}
          </span>
        )
      )}
      {children}
      {rightIcon && (
        <span className="cps-button__icon" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
});
