import { forwardRef, useEffect, useId, useMemo, useRef } from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";
import { mergeRefs } from "../../utils/mergeRefs.js";

const toNumber = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const decimalPlaces = (number) => String(number).split(".")[1]?.length ?? 0;

// Mirrors how browsers sanitize a range input's value: clamp it to [min, max] and
// round it to the nearest step, so the readout and the fill always match the thumb.
function sanitizeValue(value, min, max, step) {
  const clamped = Math.min(Math.max(value, min), max);
  const stepped = min + Math.round((clamped - min) / step) * step;
  const inRange = stepped > max ? stepped - step : stepped;
  // Drops floating-point noise, e.g. 0.1 * 3 = 0.30000000000000004.
  return Number(inRange.toFixed(Math.max(decimalPlaces(min), decimalPlaces(step))));
}

/**
 * Picks a number from a range, following the WAI-ARIA slider pattern. It renders a
 * native `<input type="range">`, so the arrow keys, Page Up / Page Down, Home and End
 * work in every browser. `className` and `style` apply to the field wrapper; every
 * other native attribute (`name`, `onChange`, …) and the `ref` go to the `<input>`.
 *
 * - `label`: visible label, linked to the input. Without it, pass `aria-label`.
 * - `helperText`: hint below the slider, exposed as its accessible description.
 * - `value` / `defaultValue` / `onValueChange`: controlled or uncontrolled value.
 *   `defaultValue` defaults to `min`, and resetting the form of an uncontrolled slider
 *   goes back to it. `onValueChange` receives a number, after the native `onChange`
 *   has run.
 * - `min` (default 0), `max` (default 100) and `step` (default 1): the range and its
 *   increment. Values outside the range or between steps are clamped and rounded,
 *   as the browser does.
 * - `showValue`: shows the current value next to the label (default `true`).
 * - `formatValue`: function that turns the value into display text, e.g. a
 *   percentage or a price. Used for the visible value and for `aria-valuetext`.
 * - `size`: "sm" or "md" (default) — track and thumb size.
 * - `disabled`: prevents changes (default `false`).
 * - `id`: id of the input. Defaults to a generated id.
 */
export const Slider = forwardRef(function Slider(
  {
    label,
    helperText,
    value,
    defaultValue,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    showValue = true,
    formatValue,
    size = "md",
    disabled = false,
    id,
    className,
    style,
    onChange,
    "aria-describedby": ariaDescribedBy,
    "aria-valuetext": ariaValueText,
    ...rest
  },
  forwardedRef,
) {
  const generatedId = useId();
  const inputId = id ?? `cps-slider-${generatedId}`;
  const inputRef = useRef(null);
  const ref = useMemo(() => mergeRefs(inputRef, forwardedRef), [forwardedRef]);
  const messageId = `${inputId}-message`;
  const describedBy = [ariaDescribedBy, helperText != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  const minValue = toNumber(min, 0);
  const maxValue = Math.max(toNumber(max, 100), minValue);
  const stepValue = toNumber(step, 1) > 0 ? toNumber(step, 1) : 1;

  const [currentValue, setValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? minValue,
    onChange: onValueChange,
  });

  const sliderValue = sanitizeValue(
    toNumber(currentValue, minValue),
    minValue,
    maxValue,
    stepValue,
  );
  const fill = maxValue > minValue ? ((sliderValue - minValue) / (maxValue - minValue)) * 100 : 0;
  const valueText = formatValue ? formatValue(sliderValue) : String(sliderValue);

  // Resetting the form fires no change event, and the input's value attribute
  // follows the current value, so the browser alone would leave the thumb where
  // it is: go back to the default value when an uncontrolled slider's form resets.
  const isControlled = value !== undefined;
  const resetValue = sanitizeValue(toNumber(defaultValue, minValue), minValue, maxValue, stepValue);
  useEffect(() => {
    const form = inputRef.current?.form;
    if (isControlled || !form) return;
    const handleReset = () => setValue(resetValue);
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, [isControlled, resetValue, setValue]);

  return (
    <div
      className={cx(
        "cps-field",
        "cps-slider",
        `cps-slider--${size}`,
        disabled && "cps-field--disabled",
        className,
      )}
      style={style}
    >
      {(label != null || showValue) && (
        <div className="cps-slider__header">
          {label != null && (
            <label className="cps-field__label" htmlFor={inputId}>
              {label}
            </label>
          )}
          {/* The input already announces its value, so this copy is hidden from screen readers. */}
          {showValue && (
            <span className="cps-slider__value" aria-hidden="true">
              {valueText}
            </span>
          )}
        </div>
      )}

      <input
        {...rest}
        ref={ref}
        type="range"
        id={inputId}
        min={minValue}
        max={maxValue}
        step={stepValue}
        value={sliderValue}
        disabled={disabled}
        aria-valuetext={ariaValueText ?? (formatValue ? valueText : undefined)}
        aria-describedby={describedBy || undefined}
        className="cps-slider__input"
        style={{ "--cps-slider-fill": `${fill}%` }}
        onChange={composeEventHandlers(onChange, (event) => setValue(Number(event.target.value)))}
      />

      {helperText != null && (
        <p id={messageId} className="cps-field__message">
          {helperText}
        </p>
      )}
    </div>
  );
});
