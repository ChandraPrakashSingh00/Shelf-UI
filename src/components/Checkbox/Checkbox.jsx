import { forwardRef, useEffect, useId, useMemo, useRef } from "react";
import { CheckIcon, MinusIcon } from "../../icons/index.jsx";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";
import { mergeRefs } from "../../utils/mergeRefs.js";

/**
 * Checkbox following the WAI-ARIA checkbox pattern. A real, visually replaced
 * `<input type="checkbox">` receives clicks and focus, so it toggles with Space
 * and takes part in forms. `className` and `style` apply to the root element;
 * every other native attribute (and the `ref`) goes to the `<input>`.
 *
 * - `label`: visible label, linked to the checkbox. Without it, pass `aria-label`.
 * - `description`: supporting text below the label, exposed as its accessible description.
 * - `error`: error message below the label; marks the checkbox `aria-invalid`.
 *   Pass `true` to mark it invalid without a message.
 * - `checked` / `defaultChecked` / `onCheckedChange`: controlled or uncontrolled
 *   checked state (`defaultChecked` defaults to `false`). `onCheckedChange` receives
 *   the new state; a native `onChange` runs first.
 * - `indeterminate`: shows the mixed ("partially checked") state (default `false`),
 *   e.g. on a "select all" checkbox while only some items are selected.
 * - `size`: "sm" or "md" (default) — box and label size.
 * - `required`: native `required`, plus an asterisk after the label.
 */
export const Checkbox = forwardRef(function Checkbox(
  {
    label,
    description,
    error,
    checked,
    defaultChecked,
    onCheckedChange,
    indeterminate = false,
    size = "md",
    id,
    required,
    disabled,
    className,
    style,
    onChange,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  forwardedRef,
) {
  const generatedId = useId();
  const inputId = id ?? `shelf-checkbox-${generatedId}`;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  const inputRef = useRef(null);
  const ref = useMemo(() => mergeRefs(inputRef, forwardedRef), [forwardedRef]);

  // `indeterminate` only exists as a DOM property; there is no HTML attribute for it.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const hasError = error != null && error !== false && error !== "";
  const errorMessage = hasError && error !== true ? error : null;
  const describedBy = [
    ariaDescribedBy,
    description != null ? descriptionId : null,
    errorMessage != null ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ");

  const handleChange = composeEventHandlers(onChange, (event) => {
    // A click clears `indeterminate` natively; the prop stays in charge of it.
    event.target.indeterminate = indeterminate;
    onCheckedChange?.(event.target.checked);
  });

  return (
    <div
      className={cx(
        "shelf-checkbox",
        `shelf-checkbox--${size}`,
        indeterminate && "shelf-checkbox--indeterminate",
        hasError && "shelf-checkbox--invalid",
        disabled && "shelf-checkbox--disabled",
        className,
      )}
      style={style}
    >
      <span className="shelf-checkbox__control">
        <input
          {...rest}
          ref={ref}
          type="checkbox"
          id={inputId}
          checked={checked}
          defaultChecked={defaultChecked}
          required={required}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy || undefined}
          className="shelf-checkbox__input"
          onChange={handleChange}
        />
        <span className="shelf-checkbox__box" aria-hidden="true">
          {indeterminate ? (
            <MinusIcon className="shelf-checkbox__icon" strokeWidth={3} />
          ) : (
            <CheckIcon className="shelf-checkbox__icon" strokeWidth={3} />
          )}
        </span>
      </span>

      {(label != null || description != null || errorMessage != null) && (
        <div className="shelf-checkbox__text">
          {label != null && (
            <label className="shelf-checkbox__label" htmlFor={inputId}>
              {label}
              {required && (
                <span className="shelf-checkbox__required" aria-hidden="true">
                  *
                </span>
              )}
            </label>
          )}
          {description != null && (
            <p id={descriptionId} className="shelf-checkbox__description">
              {description}
            </p>
          )}
          {errorMessage != null && (
            <p id={errorId} className="shelf-checkbox__error">
              {errorMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
});
