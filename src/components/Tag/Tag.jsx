import { forwardRef, useId } from "react";
import { CloseIcon } from "../../icons/index.jsx";
import { cx } from "../../utils/cx.js";

/**
 * Compact label for a category, an attribute or an applied filter, like
 * "Electronics" or "Under ₹999", optionally with a remove (✕) button. The `ref`
 * points to the root `<span>`, which receives the remaining props.
 *
 * - `children`: the tag's text.
 * - `variant`: color scheme — "neutral" (default), "primary", "success",
 *   "warning" or "danger" (the Badge palette).
 * - `size`: "sm" or "md" (default).
 * - `icon`: decorative icon before the text.
 * - `onRemove`: adds a remove button and is called with the click (or key) event
 *   when it's activated. Backspace and Delete on the focused button remove the
 *   tag too. Moving focus after the tag is gone (e.g. to the next tag) is up to you.
 * - `removeLabel`: first part of the remove button's accessible name, followed by
 *   the tag's text — "Remove" (default) gives "Remove Red".
 * - `disabled`: dims the tag and disables its remove button (default `false`).
 */
export const Tag = forwardRef(function Tag(
  {
    variant = "neutral",
    size = "md",
    icon,
    onRemove,
    removeLabel = "Remove",
    disabled = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const baseId = `shelf-tag-${useId()}`;
  const labelId = `${baseId}-label`;
  const removeId = `${baseId}-remove`;
  const removable = typeof onRemove === "function";

  const handleRemoveKeyDown = (event) => {
    if (event.key !== "Backspace" && event.key !== "Delete") return;
    event.preventDefault();
    onRemove(event);
  };

  return (
    <span
      {...rest}
      ref={ref}
      className={cx(
        "shelf-tag",
        `shelf-tag--${variant}`,
        `shelf-tag--${size}`,
        removable && "shelf-tag--removable",
        disabled && "shelf-tag--disabled",
        className,
      )}
    >
      {icon != null && (
        <span className="shelf-tag__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span id={labelId} className="shelf-tag__label">
        {children}
      </span>
      {removable && (
        <button
          type="button"
          id={removeId}
          // Named by its own label plus the tag's text: "Remove" + "Red".
          aria-label={removeLabel}
          aria-labelledby={`${removeId} ${labelId}`}
          disabled={disabled}
          className="shelf-tag__remove"
          onClick={onRemove}
          onKeyDown={handleRemoveKeyDown}
        >
          <CloseIcon />
        </button>
      )}
    </span>
  );
});
