import { forwardRef, useId } from "react";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";

/**
 * On/off control following the WAI-ARIA switch pattern. It renders a native
 * `<input type="checkbox" role="switch">`, so Space toggles it, clicking its label
 * toggles it and it submits with forms like a checkbox. The `ref` and every other
 * native attribute (`name`, `value`, `onChange`, …) go to the input; `className`
 * and `style` go to the wrapper.
 *
 * - `label`: visible label, linked to the input. Without it, pass `aria-label`.
 * - `description`: hint below the label, exposed as the switch's accessible description.
 * - `checked` / `defaultChecked` / `onCheckedChange`: controlled or uncontrolled state
 *   (off by default). `onCheckedChange` receives the new boolean after the native
 *   `onChange` has run. Uncontrolled, the browser keeps the state, so resetting the
 *   form turns the switch back to `defaultChecked`.
 * - `size`: "sm" or "md" (default) — track and label size.
 * - `disabled`: prevents toggling (default `false`).
 * - `required`: native `required` (the switch must be on to submit the form), plus an
 *   asterisk after the label (default `false`).
 * - `id`: id of the input. Defaults to a generated id.
 */
export const Switch = forwardRef(function Switch(
  {
    label,
    description,
    checked,
    defaultChecked,
    onCheckedChange,
    size = "md",
    disabled = false,
    required = false,
    id,
    className,
    style,
    onChange,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? `shelf-switch-${generatedId}`;
  const descriptionId = `${inputId}-description`;
  const describedBy = [ariaDescribedBy, description != null ? descriptionId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cx(
        "shelf-switch",
        `shelf-switch--${size}`,
        disabled && "shelf-switch--disabled",
        className,
      )}
      style={style}
    >
      <span className="shelf-switch__control">
        <input
          {...rest}
          ref={ref}
          type="checkbox"
          role="switch"
          id={inputId}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          required={required}
          aria-describedby={describedBy || undefined}
          className="shelf-switch__input"
          onChange={composeEventHandlers(onChange, (event) =>
            onCheckedChange?.(event.target.checked),
          )}
        />
        <span className="shelf-switch__track" aria-hidden="true">
          <span className="shelf-switch__thumb" />
        </span>
      </span>
      {(label != null || description != null) && (
        <div className="shelf-switch__text">
          {label != null && (
            <label htmlFor={inputId} className="shelf-switch__label">
              {label}
              {required && (
                <span className="shelf-field__required" aria-hidden="true">
                  *
                </span>
              )}
            </label>
          )}
          {description != null && (
            <p id={descriptionId} className="shelf-switch__description">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
});
