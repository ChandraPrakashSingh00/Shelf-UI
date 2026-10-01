import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { MinusIcon, PlusIcon } from "../../icons/index.jsx";
import { composeEventHandlers } from "../../utils/composeEventHandlers.js";
import { cx } from "../../utils/cx.js";
import { mergeRefs } from "../../utils/mergeRefs.js";
import {
  clampNumber,
  countDecimals,
  parseNumber,
  roundToPrecision,
  sanitizeNumberText,
  toDecimalString,
  toFiniteNumber,
} from "../../utils/number.js";

// Press and hold a − / + button: the first repeat after HOLD_DELAY, then every HOLD_INTERVAL.
const HOLD_DELAY = 400;
const HOLD_INTERVAL = 75;

const toBound = (bound) => toFiniteNumber(bound) ?? undefined;

/**
 * Number field following the WAI-ARIA spinbutton pattern: a text input with
 * − and + buttons. Typing is allowed (other characters are ignored), the arrow
 * keys step the value and the mouse wheel never changes it. `className` and
 * `style` apply to the field wrapper; every other native attribute (and the `ref`)
 * goes to the `<input>`.
 *
 * - `label`: visible label, linked to the input. Without it, pass `aria-label`.
 * - `helperText`: hint below the field, exposed as its accessible description.
 * - `error`: error message; replaces `helperText` and marks the input `aria-invalid`.
 *   Pass `true` to mark the field invalid without a message.
 * - `value` / `defaultValue` / `onValueChange`: controlled or uncontrolled value — a
 *   number, or `null` when the field is empty (`defaultValue` defaults to `null`).
 *   `onValueChange` also runs while typing, with each complete number typed.
 * - `min` / `max`: allowed range (no limits by default). The buttons are disabled at
 *   the limits; without a negative `min`, a minus sign can't be typed. Phones show a
 *   number keypad only when `min` is 0 or more: iOS keypads have no minus key, so a
 *   field that allows negative numbers keeps the full keyboard.
 * - `step`: amount added by the buttons and the arrow keys (default 1).
 * - `largeStep`: amount added by Page Up / Page Down (default 10 × `step`).
 * - `precision`: number of decimal places kept (default: those of `step` or `min`).
 *   With 0, a decimal point can't be typed.
 * - `formatValue`: function that turns the value into display text, e.g. "₹1,299".
 *   Shown while the field isn't focused and used for `aria-valuetext`; the raw
 *   number is shown for editing.
 * - `clampOnBlur`: brings a typed value back into `min`–`max` when the field loses
 *   focus or Enter is pressed (default `true`).
 * - `allowEmpty`: whether the field can be left empty (default `true`). With `false`,
 *   clearing the text doesn't change the value, and leaving the field restores it.
 * - `variant`: "default" (full-width field, buttons at the end) or "compact"
 *   (small − value + pill, e.g. for cart quantities).
 * - `size`: "sm", "md" (default) or "lg" — control height and font size.
 * - `decrementLabel` / `incrementLabel`: accessible names of the buttons
 *   (default "Decrease" / "Increase").
 * - `name`: form field name. The number (not the formatted text) is submitted
 *   through a hidden input; resetting the form restores `defaultValue`.
 * - `required`, `disabled`, `readOnly`: native states; `readOnly` also disables stepping.
 * - `inputClassName`: class name for the `<input>` element itself.
 */
export const NumberInput = forwardRef(function NumberInput(
  {
    label,
    helperText,
    error,
    value,
    defaultValue = null,
    onValueChange,
    min,
    max,
    step = 1,
    largeStep,
    precision,
    formatValue,
    clampOnBlur = true,
    allowEmpty = true,
    variant = "default",
    size = "md",
    decrementLabel = "Decrease",
    incrementLabel = "Increase",
    name,
    form,
    id,
    required,
    disabled = false,
    readOnly = false,
    className,
    style,
    inputClassName,
    onChange,
    onKeyDown,
    onFocus,
    onBlur,
    "aria-describedby": ariaDescribedBy,
    "aria-valuetext": ariaValueText,
    ...rest
  },
  forwardedRef,
) {
  const generatedId = useId();
  const inputId = id ?? `cps-number-input-${generatedId}`;
  const messageId = `${inputId}-message`;
  const inputRef = useRef(null);
  const ref = useMemo(() => mergeRefs(inputRef, forwardedRef), [forwardedRef]);

  const minValue = toBound(min);
  const maxValue = toBound(max);
  const stepValue = toFiniteNumber(step) > 0 ? toFiniteNumber(step) : 1;
  const precisionValue =
    toFiniteNumber(precision) ?? Math.max(countDecimals(stepValue), countDecimals(minValue ?? 0));
  const largeStepValue =
    toFiniteNumber(largeStep) > 0
      ? toFiniteNumber(largeStep)
      : roundToPrecision(stepValue * 10, precisionValue);
  const allowNegative = minValue == null || minValue < 0;
  // iOS number keypads have no minus key: allowing negatives keeps the full keyboard.
  const inputMode = allowNegative ? undefined : precisionValue > 0 ? "decimal" : "numeric";

  const [currentValue, setValue] = useControllableState({
    value: value === undefined ? undefined : toFiniteNumber(value),
    defaultValue: toFiniteNumber(defaultValue),
    onChange: onValueChange,
  });
  const numberValue = toFiniteNumber(currentValue);

  // `draft` is the text being typed; `null` shows the value itself.
  const [draft, setDraft] = useState(null);
  const [focused, setFocused] = useState(false);

  // Plain decimals (never "5e-7"), so every digit can be edited.
  const rawText = numberValue == null ? "" : toDecimalString(numberValue);
  const formattedText = numberValue != null && formatValue ? formatValue(numberValue) : rawText;
  const displayText = draft ?? (focused ? rawText : formattedText);

  const outOfRange =
    numberValue != null &&
    ((minValue != null && numberValue < minValue) || (maxValue != null && numberValue > maxValue));
  const hasError = error != null && error !== false && error !== "";
  const invalid = hasError || outOfRange;
  const message = hasError && error !== true ? error : helperText;
  const describedBy = [ariaDescribedBy, message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  const interactive = !disabled && !readOnly;
  const canDecrement =
    interactive && !(numberValue != null && minValue != null && numberValue <= minValue);
  const canIncrement =
    interactive && !(numberValue != null && maxValue != null && numberValue >= maxValue);

  // An empty field steps from 0.
  const getNext = (base, amount) =>
    clampNumber(roundToPrecision((base ?? 0) + amount, precisionValue), minValue, maxValue);

  const setTo = (next) => {
    setDraft(null);
    setValue(next);
  };

  const stepBy = (amount) => {
    if (interactive) setTo(getNext(numberValue, amount));
  };

  // The press-and-hold timers outlive a render, so they use the latest props.
  const latestRef = useRef(null);
  useEffect(() => {
    latestRef.current = { interactive, getNext, setTo };
  });

  // Rounds a typed value to the precision and, with `clampOnBlur`, into the range.
  const commit = () => {
    setDraft(null);
    if (numberValue == null) return;
    const rounded = roundToPrecision(numberValue, precisionValue);
    setValue(clampOnBlur ? clampNumber(rounded, minValue, maxValue) : rounded);
  };

  const handleChange = composeEventHandlers(onChange, (event) => {
    const text = sanitizeNumberText(event.target.value, {
      allowNegative,
      allowDecimal: precisionValue > 0,
    });
    // Invalid characters are ignored: React puts the previous text back.
    if (text == null) return;
    setDraft(text);
    const parsed = parseNumber(text);
    if (parsed != null) setValue(parsed);
    else if (text === "" && allowEmpty) setValue(null);
  });

  const handleKeyDown = composeEventHandlers(onKeyDown, (event) => {
    if (!interactive || event.altKey || event.ctrlKey || event.metaKey) return;
    switch (event.key) {
      case "ArrowUp":
        stepBy(stepValue);
        break;
      case "ArrowDown":
        stepBy(-stepValue);
        break;
      case "PageUp":
        stepBy(largeStepValue);
        break;
      case "PageDown":
        stepBy(-largeStepValue);
        break;
      case "Home":
        // Without a limit, Home and End move the caret as usual.
        if (minValue == null) return;
        setTo(minValue);
        break;
      case "End":
        if (maxValue == null) return;
        setTo(maxValue);
        break;
      case "Enter":
        // Commits the typed value; the form still submits.
        commit();
        return;
      default:
        return;
    }
    event.preventDefault();
  });

  const handleFocus = composeEventHandlers(onFocus, () => setFocused(true));
  const handleBlur = composeEventHandlers(onBlur, () => {
    setFocused(false);
    commit();
  });

  // Press and hold a button to keep stepping. The click that ends a hold is
  // ignored, so a plain click (or a screen reader activation) steps exactly once.
  const holdRef = useRef({ timeout: 0, interval: 0, repeated: false, value: null, stop: null });
  const stopHold = () => {
    const hold = holdRef.current;
    clearTimeout(hold.timeout);
    clearInterval(hold.interval);
    if (hold.stop) {
      window.removeEventListener("pointerup", hold.stop);
      window.removeEventListener("pointercancel", hold.stop);
      window.removeEventListener("blur", hold.stop);
      hold.stop = null;
    }
  };

  useEffect(() => {
    const hold = holdRef.current;
    return () => {
      clearTimeout(hold.timeout);
      clearInterval(hold.interval);
      if (hold.stop) {
        window.removeEventListener("pointerup", hold.stop);
        window.removeEventListener("pointercancel", hold.stop);
        window.removeEventListener("blur", hold.stop);
      }
    };
  }, []);

  const buttonHandlers = (amount) => ({
    // Keeps focus where it is (the input, or nothing on touch screens).
    onMouseDown: (event) => event.preventDefault(),
    onContextMenu: (event) => event.preventDefault(),
    onPointerDown: (event) => {
      if (event.button !== 0) return;
      stopHold();
      const hold = holdRef.current;
      hold.repeated = false;
      // Counted here rather than read from state, which may not have re-rendered
      // between two ticks.
      hold.value = numberValue;
      hold.stop = stopHold;
      window.addEventListener("pointerup", stopHold);
      window.addEventListener("pointercancel", stopHold);
      window.addEventListener("blur", stopHold);
      hold.timeout = setTimeout(() => {
        hold.interval = setInterval(() => {
          const latest = latestRef.current;
          const next = latest.getNext(hold.value, amount);
          // Stops at a limit (where the button becomes disabled) or once disabled.
          if (!latest.interactive || next === hold.value) {
            stopHold();
            return;
          }
          hold.value = next;
          hold.repeated = true;
          latest.setTo(next);
        }, HOLD_INTERVAL);
      }, HOLD_DELAY);
    },
    onPointerLeave: stopHold,
    onClick: () => {
      const hold = holdRef.current;
      stopHold();
      if (hold.repeated) {
        hold.repeated = false;
        return;
      }
      stepBy(amount);
    },
  });

  // Stop repeating once the buttons can't be used any more.
  useEffect(() => {
    if (!interactive) stopHold();
  });

  // Resetting the form fires no change event on the hidden input: go back to the
  // default value when an uncontrolled field's form resets.
  const isControlled = value !== undefined;
  const resetValue = toFiniteNumber(defaultValue);
  useEffect(() => {
    const formElement = inputRef.current?.form;
    if (!formElement) return;
    const handleReset = () => {
      setDraft(null);
      if (!isControlled) setValue(resetValue);
    };
    formElement.addEventListener("reset", handleReset);
    return () => formElement.removeEventListener("reset", handleReset);
  }, [isControlled, resetValue, setValue]);

  const decrementButton = (
    <button
      type="button"
      tabIndex={-1}
      aria-label={decrementLabel}
      aria-controls={inputId}
      disabled={!canDecrement}
      className="cps-number-input__button"
      {...buttonHandlers(-stepValue)}
    >
      <MinusIcon />
    </button>
  );

  const incrementButton = (
    <button
      type="button"
      tabIndex={-1}
      aria-label={incrementLabel}
      aria-controls={inputId}
      disabled={!canIncrement}
      className="cps-number-input__button"
      {...buttonHandlers(stepValue)}
    >
      <PlusIcon />
    </button>
  );

  const compact = variant === "compact";

  return (
    <div
      className={cx(
        "cps-field",
        `cps-field--${size}`,
        "cps-number-input-field",
        compact && "cps-number-input-field--compact",
        invalid && "cps-field--invalid",
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

      <div
        className={cx(
          "cps-number-input",
          `cps-number-input--${compact ? "compact" : "default"}`,
          readOnly && "cps-number-input--readonly",
        )}
      >
        {compact && decrementButton}
        <input
          inputMode={inputMode}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          {...rest}
          ref={ref}
          type="text"
          id={inputId}
          form={form}
          role="spinbutton"
          value={displayText}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-valuenow={numberValue ?? undefined}
          aria-valuemin={minValue}
          aria-valuemax={maxValue}
          aria-valuetext={
            ariaValueText ?? (formatValue && numberValue != null ? formattedText : undefined)
          }
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy || undefined}
          className={cx("cps-number-input__control", inputClassName)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {compact ? (
          incrementButton
        ) : (
          <span className="cps-number-input__buttons">
            {decrementButton}
            {incrementButton}
          </span>
        )}
      </div>

      {name != null && (
        <input
          type="hidden"
          name={name}
          form={form}
          value={numberValue ?? ""}
          disabled={disabled}
        />
      )}

      {message != null && (
        <p id={messageId} className="cps-field__message">
          {message}
        </p>
      )}
    </div>
  );
});
