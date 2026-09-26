import { forwardRef, useId } from "react";
import { ChevronDownIcon } from "../../icons/index.jsx";
import { cx } from "../../utils/cx.js";

// Options can be plain strings (or numbers) or `{ value, label, disabled }` objects.
const toOption = (option) =>
  option !== null && typeof option === "object" ? option : { value: option, label: option };

/**
 * Styled native `<select>` with an optional label, helper text and error message.
 * It keeps the browser's keyboard behavior, form participation and mobile pickers.
 * `className` and `style` apply to the field wrapper; every other native attribute
 * (and the `ref`) goes to the underlying `<select>`.
 *
 * - `label`: visible label, programmatically linked to the select.
 * - `helperText`: hint shown below the select and exposed as its accessible description.
 * - `error`: error message; replaces `helperText` and marks the select `aria-invalid`.
 *   Pass `true` to mark the field invalid without a message.
 * - `size`: "sm", "md" (default) or "lg" — control height and font size.
 * - `placeholder`: text of a first, disabled option with an empty value. Without
 *   `value` or `defaultValue`, the select starts on it.
 * - `options`: array of strings or `{ value, label, disabled }` objects. When it's
 *   omitted, `children` (`<option>` and `<optgroup>` elements) are rendered instead.
 * - `leftIcon`: decorative icon inside the field, before the selected option.
 * - `selectClassName`: class name for the `<select>` element itself.
 */
export const Select = forwardRef(function Select(
  {
    label,
    helperText,
    error,
    size = "md",
    placeholder,
    options,
    leftIcon,
    id,
    required,
    disabled,
    value,
    defaultValue,
    className,
    style,
    selectClassName,
    children,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? `cps-select-${generatedId}`;
  const messageId = `${selectId}-message`;

  const hasError = error != null && error !== false && error !== "";
  const message = hasError && error !== true ? error : helperText;
  const describedBy = [ariaDescribedBy, message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  // Without a value of its own, start on the placeholder rather than the first option.
  const startOnPlaceholder = placeholder != null && value == null && defaultValue == null;

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
        <label className="cps-field__label" htmlFor={selectId}>
          {label}
          {required && (
            <span className="cps-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className={cx("cps-select", leftIcon && "cps-select--with-icon")}>
        {leftIcon && (
          <span className="cps-select__icon" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <select
          {...rest}
          ref={ref}
          id={selectId}
          required={required}
          disabled={disabled}
          value={value}
          defaultValue={startOnPlaceholder ? "" : defaultValue}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy || undefined}
          className={cx("cps-select__control", selectClassName)}
        >
          {placeholder != null && (
            <option value="" disabled className="cps-select__placeholder">
              {placeholder}
            </option>
          )}
          {options
            ? options.map((option) => {
                const {
                  value: optionValue,
                  label: optionLabel = optionValue,
                  disabled: optionDisabled,
                } = toOption(option);
                return (
                  <option key={optionValue} value={optionValue} disabled={optionDisabled}>
                    {optionLabel}
                  </option>
                );
              })
            : children}
        </select>
        {/* The select spans the whole box, so a click on the chevron still opens it. */}
        <ChevronDownIcon className="cps-select__chevron" />
      </div>

      {message != null && (
        <p id={messageId} className="cps-field__message">
          {message}
        </p>
      )}
    </div>
  );
});
