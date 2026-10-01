import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { StarIcon } from "../../icons/index.jsx";
import { cx } from "../../utils/cx.js";
import { mergeRefs } from "../../utils/mergeRefs.js";

const defaultGetLabel = (value) => (value === 1 ? "1 star" : `${value} stars`);

// Digit grouping as used in India: 1,284 and 1,28,400.
const defaultFormatCount = (count) => Number(count).toLocaleString("en-IN");

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return value != null && Number.isFinite(number) ? number : fallback;
};

/** One star: an empty star, with a filled star clipped to `fill` (0–1) on top. */
function Star({ fill }) {
  return (
    <span className="cps-rating__star" aria-hidden="true">
      <StarIcon className="cps-rating__icon cps-rating__icon--empty" />
      {fill > 0 && (
        <span
          className="cps-rating__fill"
          style={fill < 1 ? { width: `${Math.round(fill * 1000) / 10}%` } : undefined}
        >
          <StarIcon className="cps-rating__icon cps-rating__icon--filled" />
        </span>
      )}
    </span>
  );
}

/**
 * Star rating. Interactive, it's a group of native radio buttons (one per star,
 * visually replaced), so the arrow keys and forms work natively; hovering with a
 * mouse previews the rating. With `readOnly` it displays a rating, fractions
 * included (an average like 4.3), as an image with a text alternative. Other props
 * (and the `ref`) go to the root element: a `<fieldset>`, or a `<span role="img">`
 * when read-only.
 *
 * - `value` / `defaultValue` / `onValueChange`: controlled or uncontrolled rating,
 *   a number from 0 (no rating, the default) to `max`. Interactive ratings are whole
 *   stars; `onValueChange` receives the new number, or 0 when cleared.
 * - `max`: number of stars (default 5).
 * - `label`: visible label (the group's `<legend>`). Without it, pass `aria-label`.
 * - `helperText`: hint below the stars, exposed as the group's accessible description.
 * - `error`: error message; replaces `helperText` and marks the group `aria-invalid`.
 *   Pass `true` to mark it invalid without a message.
 * - `getLabel`: function(value) returning each star's accessible name
 *   (default "1 star", "2 stars", …).
 * - `clearable`: clicking the selected star again, or pressing Backspace / Delete,
 *   clears the rating (default `true`).
 * - `size`: "sm", "md" (default) or "lg" — star size.
 * - `name`: form field name shared by the radios (default: a generated name).
 *   Resetting the form restores `defaultValue`.
 * - `required`: a star must be chosen to submit the form (default `false`).
 * - `disabled`: prevents changes (default `false`).
 * - `readOnly`: display mode (default `false`). Its accessible name is
 *   "Rated 4.3 out of 5" (plus the count), or pass `aria-label`.
 * - `showValue`: read-only — shows the value next to the stars, e.g. "4.3".
 * - `count`: read-only — number of ratings, shown as "(1,284)".
 * - `formatCount`: function(count) returning the count's text (default Indian digit
 *   grouping, "1,28,400").
 */
export const Rating = forwardRef(function Rating(
  {
    value,
    defaultValue = 0,
    onValueChange,
    max = 5,
    label,
    helperText,
    error,
    getLabel = defaultGetLabel,
    clearable = true,
    size = "md",
    name,
    form,
    required = false,
    disabled = false,
    readOnly = false,
    showValue = false,
    count,
    formatCount = defaultFormatCount,
    className,
    style,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  forwardedRef,
) {
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const messageId = `${baseId}-message`;
  const rootRef = useRef(null);
  const ref = useMemo(() => mergeRefs(rootRef, forwardedRef), [forwardedRef]);

  const starCount = Math.max(1, Math.round(toNumber(max, 5)));
  const stars = Array.from({ length: starCount }, (_, index) => index + 1);

  const [currentValue, setValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [hoverValue, setHoverValue] = useState(null);

  // Resetting the form restores `defaultValue` for an uncontrolled rating.
  const isControlled = value !== undefined;
  const resetValue = defaultValue;
  useEffect(() => {
    // The radios carry the `form` attribute, so they know their form even outside it.
    const formElement = readOnly ? null : rootRef.current?.querySelector("input")?.form;
    if (!formElement) return;
    const handleReset = () => {
      if (!isControlled) setValue(resetValue);
    };
    formElement.addEventListener("reset", handleReset);
    return () => formElement.removeEventListener("reset", handleReset);
  }, [readOnly, isControlled, resetValue, setValue]);

  if (readOnly) {
    const rating = Math.min(Math.max(toNumber(currentValue), 0), starCount);
    const shownValue = rating.toFixed(1);
    const countText = count != null ? formatCount(count) : null;
    const text = [
      `Rated ${Number(shownValue)} out of ${starCount}`,
      countText != null ? `${countText} ${Number(count) === 1 ? "rating" : "ratings"}` : null,
    ]
      .filter(Boolean)
      .join(", ");

    return (
      <span
        {...rest}
        ref={ref}
        role="img"
        aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : text)}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={cx("cps-rating", `cps-rating--${size}`, "cps-rating--readonly", className)}
        style={style}
      >
        <span className="cps-rating__stars">
          {stars.map((star) => (
            <Star key={star} fill={Math.min(Math.max(rating - (star - 1), 0), 1)} />
          ))}
        </span>
        {showValue && <span className="cps-rating__value">{shownValue}</span>}
        {countText != null && <span className="cps-rating__count">({countText})</span>}
      </span>
    );
  }

  const selected = Math.min(Math.max(Math.round(toNumber(currentValue)), 0), starCount);
  const shown = hoverValue ?? selected;

  const hasError = error != null && error !== false && error !== "";
  const message = hasError && error !== true ? error : helperText;
  const describedBy = [ariaDescribedBy, message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");
  const groupName = name ?? `cps-rating-${baseId}`;

  // Clearing also drops the hover preview, so the stars visibly empty.
  const clear = () => {
    setHoverValue(null);
    setValue(0);
  };

  const handleClick = (star) => (event) => {
    // A pointer click on the selected star clears it. Space on a selected radio
    // also fires a click, but with `detail` 0, so it doesn't clear.
    if (clearable && star === selected && event.detail > 0) clear();
  };

  const handleKeyDown = (event) => {
    if (clearable && (event.key === "Backspace" || event.key === "Delete") && selected > 0) {
      event.preventDefault();
      clear();
    }
  };

  // Only a mouse previews: a tap would leave its "hover" stuck on touch screens.
  const handlePointerEnter = (star) => (event) => {
    if (event.pointerType === "mouse") setHoverValue(star);
  };

  return (
    <fieldset
      {...rest}
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy ?? (label != null ? labelId : undefined)}
      aria-describedby={describedBy || undefined}
      aria-invalid={hasError || undefined}
      aria-required={required || undefined}
      disabled={disabled}
      className={cx(
        "cps-rating-field",
        hasError && "cps-rating-field--invalid",
        disabled && "cps-rating-field--disabled",
        className,
      )}
      style={style}
    >
      {label != null && (
        <legend id={labelId} className="cps-field__label cps-rating-field__label">
          {label}
          {required && (
            <span className="cps-field__required" aria-hidden="true">
              *
            </span>
          )}
        </legend>
      )}

      <span
        className={cx("cps-rating", `cps-rating--${size}`)}
        onMouseLeave={() => setHoverValue(null)}
        onKeyDown={handleKeyDown}
      >
        {stars.map((star) => (
          <label
            key={star}
            className={cx("cps-rating__item", star <= shown && "cps-rating__item--active")}
            onPointerEnter={disabled ? undefined : handlePointerEnter(star)}
          >
            <input
              type="radio"
              name={groupName}
              form={form}
              value={star}
              checked={star === selected}
              required={required}
              disabled={disabled}
              className="cps-rating__input"
              onChange={() => setValue(star)}
              onClick={handleClick(star)}
            />
            <Star fill={star <= shown ? 1 : 0} />
            <span className="cps-visually-hidden">{getLabel(star)}</span>
          </label>
        ))}
      </span>

      {message != null && (
        <p id={messageId} className="cps-field__message cps-rating-field__message">
          {message}
        </p>
      )}
    </fieldset>
  );
});
