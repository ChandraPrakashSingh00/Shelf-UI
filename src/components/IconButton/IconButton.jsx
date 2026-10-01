import { Children, cloneElement, forwardRef, isValidElement } from "react";
import { Spinner } from "../../primitives/Spinner.jsx";
import { cx } from "../../utils/cx.js";
import { Tooltip } from "../Tooltip/Tooltip.jsx";

const isHandlerName = (name) => /^on[A-Z]/.test(name);

// `asChild`: merges the props into the single child element, like the `Slot`
// primitive (class names and styles merge, both event handlers run, the child's
// first). It returns the child element itself rather than a component around it,
// so a Tooltip wrapped around it attaches its ref and handlers to the real element.
function mergeIntoChild(children, props) {
  const child = Children.only(children);
  if (!isValidElement(child)) return null;

  const childProps = child.props;
  const merged = { ...props, ...childProps };
  for (const [name, value] of Object.entries(props)) {
    const childValue = childProps[name];
    if (isHandlerName(name) && typeof value === "function" && typeof childValue === "function") {
      merged[name] = (...args) => {
        childValue(...args);
        value(...args);
      };
    }
  }
  merged.className = cx(props.className, childProps.className) || undefined;
  merged.style = { ...props.style, ...childProps.style };

  return cloneElement(child, merged);
}

/**
 * Icon-only button with Button's variants and sizes, but square (or round).
 * Accepts every native `<button>` attribute; the `ref` points to the `<button>`.
 *
 * - `label` (required): accessible name (`aria-label`). The button has no
 *   visible text, so this is what screen readers announce.
 * - `children`: the icon. It's decorative (hidden from screen readers).
 * - `variant`: "ghost" (default), "primary", "secondary", "outline" or "danger".
 * - `size`: "sm", "md" (default) or "lg" — width, height and icon size.
 * - `shape`: "square" (default, rounded corners) or "circle".
 * - `pressed`: makes it a toggle button (`aria-pressed`), e.g. "Add to wishlist".
 *   Leave it `undefined` (default) for an ordinary button. Keep `label` the same
 *   in both states; the pressed state is announced separately.
 * - `loading`: shows a spinner instead of the icon and ignores clicks
 *   (`aria-busy` + `aria-disabled`). Unlike `disabled`, the button stays focusable.
 * - `disabled`: native `disabled` (default `false`).
 * - `tooltip`: also shows `label` in a Tooltip on hover and keyboard focus
 *   (default `false`). The tooltip text is hidden from screen readers, because it
 *   repeats the accessible name. Disabled buttons get no pointer or focus events,
 *   so their tooltip never shows.
 * - `tooltipSide`: preferred side of the tooltip — "top" (default), "right",
 *   "bottom" or "left".
 * - `type`: native button type (default "button", so it never submits a form by accident).
 * - `asChild`: renders the single child element (e.g. a router `<Link>` or `<a>`
 *   wrapping an icon) with icon button styling instead of a `<button>`. The child
 *   keeps its own content, so `loading`, `disabled` and `type` don't apply, and
 *   any `ref` should go on the child itself.
 */
export const IconButton = forwardRef(function IconButton(
  {
    label,
    variant = "ghost",
    size = "md",
    shape = "square",
    pressed,
    loading = false,
    disabled = false,
    tooltip = false,
    tooltipSide = "top",
    // A plain button never submits a surrounding form by accident.
    type = "button",
    asChild = false,
    className,
    children,
    onClick,
    "aria-label": ariaLabel,
    "aria-pressed": ariaPressedProp,
    ...rest
  },
  ref,
) {
  const classes = cx(
    "cps-button",
    `cps-button--${variant}`,
    `cps-button--${size}`,
    "cps-button--icon-only",
    shape === "circle" && "cps-button--circle",
    loading && !asChild && "cps-button--loading",
    className,
  );
  const accessibleName = label ?? ariaLabel;
  const ariaPressed = pressed === undefined ? ariaPressedProp : Boolean(pressed);

  let element;
  if (asChild) {
    element = mergeIntoChild(children, {
      ...rest,
      "aria-label": accessibleName,
      "aria-pressed": ariaPressed,
      onClick,
      className: classes,
    });
  } else {
    // A loading button uses `aria-disabled` instead of `disabled` so it keeps
    // keyboard focus; clicks (and form submission) are blocked here instead.
    const handleClick = (event) => {
      if (loading) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    element = (
      <button
        {...rest}
        ref={ref}
        type={type}
        disabled={disabled}
        aria-label={accessibleName}
        aria-pressed={ariaPressed}
        aria-disabled={loading || rest["aria-disabled"]}
        aria-busy={loading || undefined}
        onClick={handleClick}
        className={classes}
      >
        {loading ? (
          <Spinner className="cps-button__icon" />
        ) : (
          <span className="cps-button__icon" aria-hidden="true">
            {children}
          </span>
        )}
      </button>
    );
  }

  if (!tooltip || element == null) return element;

  return (
    // The tooltip repeats the accessible name, so its text is hidden from screen
    // readers: they would otherwise announce the label twice.
    <Tooltip content={<span aria-hidden="true">{accessibleName}</span>} side={tooltipSide}>
      {element}
    </Tooltip>
  );
});
