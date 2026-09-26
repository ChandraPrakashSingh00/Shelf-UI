import { forwardRef, useId } from "react";
import { cx } from "../../utils/cx.js";

/**
 * Text field with an optional label, helper text and error message.
 * `className` and `style` apply to the field wrapper; every other native
 * attribute (and the `ref`) goes to the underlying `<input>`.
 *
 * - `label`: visible label, programmatically linked to the input.
 * - `helperText`: hint shown below the input and exposed as its accessible description.
 * - `error`: error message; replaces `helperText` and marks the input `aria-invalid`.
 *   Pass `true` to mark the field invalid without a message.
 * - `size`: "sm", "md" (default) or "lg" — control height and font size.
 * - `leftIcon` / `rightIcon`: decorative icons inside the field, before / after the text.
 * - `inputClassName`: class name for the `<input>` element itself.
 */
export const Input = forwardRef(function Input(
  {
    label,
    helperText,
    error,
    size = "md",
    leftIcon,
    rightIcon,
    id,
    required,
    disabled,
    className,
    style,
    inputClassName,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? `cps-input-${generatedId}`;
  const messageId = `${inputId}-message`;

  const hasError = error != null && error !== false && error !== "";
  const message = hasError && error !== true ? error : helperText;
  const describedBy = [ariaDescribedBy, message != null ? messageId : null].filter(Boolean).join(" ");

  return (
    <div
      className={cx(
        "cps-field",
        `cps-field--${size}`,
        hasError && "cps-field--invalid",
        disabled && "cps-field--disabled",
        className,
      )}
      style={style}
    >
      {label != null && (
        <label className="cps-field__label" htmlFor={inputId}>
          {label}
          {required && (
            <span className="cps-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="cps-input">
        {leftIcon && (
          <span className="cps-input__icon" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          {...rest}
          ref={ref}
          id={inputId}
          required={required}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy || undefined}
          className={cx("cps-input__control", inputClassName)}
        />
        {rightIcon && (
          <span className="cps-input__icon" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>

      {message != null && (
        <p id={messageId} className="cps-field__message">
          {message}
        </p>
      )}
    </div>
  );
});
