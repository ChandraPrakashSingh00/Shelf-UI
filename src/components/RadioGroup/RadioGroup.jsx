import { createContext, forwardRef, useContext, useId, useMemo } from "react";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";

const RadioGroupContext = createContext(null);

function useRadioGroupContext() {
  const context = useContext(RadioGroupContext);
  if (!context) throw new Error("<Radio> must be rendered inside <RadioGroup>.");
  return context;
}

/**
 * A set of options where exactly one can be selected, following the WAI-ARIA
 * radio group pattern. It renders a `<fieldset>` of native radios that share one
 * `name`, so the browser provides the keyboard support: the group is a single Tab
 * stop and the arrow keys move the selection. Other props (and the `ref`) go to
 * the `<fieldset>`.
 *
 * - `label`: visible label, rendered as the `<legend>`; it names the group.
 *   Without it, pass `aria-label`.
 * - `description`: hint below the label, exposed as the group's accessible description.
 * - `error`: error message below the options; marks the group `aria-invalid`.
 *   Pass `true` to mark the group invalid without a message.
 * - `name`: form field name shared by every radio. Defaults to a unique generated name.
 * - `value` / `defaultValue` / `onValueChange`: controlled or uncontrolled selected
 *   value. Nothing is selected by default. Uncontrolled, the browser keeps track of
 *   the selection, so resetting the form selects `defaultValue` again.
 * - `orientation`: "vertical" (default) stacks the options, "horizontal" lays them
 *   out in a row that wraps.
 * - `size`: "sm" or "md" (default) — radio and label size.
 * - `disabled`: disables every radio in the group (default `false`).
 * - `required`: sets the native `required` attribute on the radios and `aria-required`
 *   on the group, and shows an asterisk after the label (default `false`).
 */
export const RadioGroup = forwardRef(function RadioGroup(
  {
    label,
    description,
    error,
    name,
    value,
    defaultValue,
    onValueChange,
    orientation = "vertical",
    size = "md",
    disabled = false,
    required = false,
    className,
    children,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;

  const hasError = error != null && error !== false && error !== "";
  const errorMessage = hasError && error !== true ? error : null;
  const describedBy = [
    ariaDescribedBy,
    description != null ? descriptionId : null,
    errorMessage != null ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ");

  const context = useMemo(
    () => ({
      name: name ?? baseId,
      value,
      defaultValue,
      onValueChange,
      disabled,
      required,
    }),
    [name, baseId, value, defaultValue, onValueChange, disabled, required],
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <fieldset
        {...rest}
        ref={ref}
        role="radiogroup"
        aria-labelledby={ariaLabelledBy ?? (label != null ? labelId : undefined)}
        aria-describedby={describedBy || undefined}
        aria-invalid={hasError || undefined}
        aria-required={required || undefined}
        aria-orientation={orientation}
        disabled={disabled}
        className={cx(
          "shelf-radio-group",
          `shelf-radio-group--${size}`,
          orientation === "horizontal" && "shelf-radio-group--horizontal",
          hasError && "shelf-radio-group--invalid",
          disabled && "shelf-radio-group--disabled",
          className,
        )}
      >
        {label != null && (
          <legend id={labelId} className="shelf-field__label shelf-radio-group__label">
            {label}
            {required && (
              <span className="shelf-field__required" aria-hidden="true">
                *
              </span>
            )}
          </legend>
        )}
        {description != null && (
          <p id={descriptionId} className="shelf-field__message">
            {description}
          </p>
        )}
        <div className="shelf-radio-group__options">{children}</div>
        {errorMessage != null && (
          <p id={errorId} className="shelf-field__message shelf-radio-group__error">
            {errorMessage}
          </p>
        )}
      </fieldset>
    </RadioGroupContext.Provider>
  );
});

/**
 * One option of a `RadioGroup` (it throws outside one). Renders a native
 * `<input type="radio">` on top of a custom circle: the `ref` and any other native
 * attribute (`onChange`, `autoFocus`, …) go to the input, while `className` and
 * `style` go to the option's wrapper.
 *
 * - `value` (required): the group's value while this radio is selected.
 * - `label`: visible label, linked to the radio; clicking it selects the radio.
 *   Without it, pass `aria-label`.
 * - `description`: hint below the label, exposed as the radio's accessible description.
 * - `disabled`: prevents selecting this radio (default `false`). The arrow keys skip it.
 * - `id`: id of the input. Defaults to a generated id.
 */
export const Radio = forwardRef(function Radio(
  {
    value,
    label,
    description,
    disabled = false,
    id,
    className,
    style,
    onChange,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const group = useRadioGroupContext();
  const generatedId = useId();
  const inputId = id ?? `shelf-radio-${generatedId}`;
  const descriptionId = `${inputId}-description`;
  const isDisabled = group.disabled || disabled;
  const isControlled = group.value !== undefined;
  const describedBy = [ariaDescribedBy, description != null ? descriptionId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cx("shelf-radio", isDisabled && "shelf-radio--disabled", className)}
      style={style}
    >
      <span className="shelf-radio__control">
        <input
          {...rest}
          ref={ref}
          type="radio"
          id={inputId}
          name={group.name}
          value={value}
          checked={isControlled ? group.value === value : undefined}
          defaultChecked={isControlled ? undefined : group.defaultValue === value}
          disabled={isDisabled}
          required={group.required}
          aria-describedby={describedBy || undefined}
          className="shelf-radio__input"
          onChange={composeEventHandlers(onChange, () => group.onValueChange?.(value))}
        />
        <span className="shelf-radio__circle" aria-hidden="true" />
      </span>
      {(label != null || description != null) && (
        <div className="shelf-radio__text">
          {label != null && (
            <label htmlFor={inputId} className="shelf-radio__label">
              {label}
            </label>
          )}
          {description != null && (
            <p id={descriptionId} className="shelf-radio__description">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
});
