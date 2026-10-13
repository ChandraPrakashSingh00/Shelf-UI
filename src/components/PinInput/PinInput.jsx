import { forwardRef, useEffect, useId, useMemo, useRef } from "react";
import { flushSync } from "react-dom";
import { useControllableState } from "../../hooks/useControllableState.js";
import { cx } from "../../utils/cx.js";
import { mergeRefs } from "../../utils/mergeRefs.js";

const CHARACTER_PATTERNS = {
  numeric: /^\d$/,
  alphanumeric: /^[a-z\d]$/i,
};

// Keeps the characters allowed by `type`; drops spaces, dashes and anything else.
const filterCharacters = (text, pattern) =>
  Array.from(text)
    .filter((character) => pattern.test(character))
    .join("");

const defaultInputLabel = (type) => (index, length) =>
  `${type === "alphanumeric" ? "Character" : "Digit"} ${index + 1} of ${length}`;

/**
 * One-time code / PIN field: a row of single-character boxes, e.g. for an OTP
 * sent by SMS or an order verification code. Typing fills a box and moves to the
 * next one, Backspace clears and moves back, and pasting or SMS autofill fills
 * every box at once. The code is always filled from the start, without gaps, so
 * only one box is in the Tab order. `className` and `style` apply to the field
 * wrapper, other props to the `role="group"` element, and the `ref` to the
 * first box (so `ref.current.focus()` works).
 *
 * - `length`: number of boxes (default 6).
 * - `value` / `defaultValue` / `onValueChange`: controlled or uncontrolled code, a
 *   string (default `""`). Characters not allowed by `type` are dropped.
 * - `onComplete`: called with the code when every box gets filled.
 * - `type`: "numeric" (default, digits only) or "alphanumeric" (letters and digits).
 * - `mask`: hides the characters like a password (default `false`).
 * - `placeholder`: text of each empty box, e.g. "○" (default none).
 * - `label`: visible label; it names the group. Without it, pass `aria-label`.
 * - `helperText`: hint below the boxes, exposed as their accessible description.
 * - `error`: error message; replaces `helperText` and marks the boxes `aria-invalid`.
 *   Pass `true` to mark the field invalid without a message.
 * - `getInputLabel`: function(index, length) returning each box's accessible name
 *   (default "Digit 2 of 6", or "Character 2 of 6" for alphanumeric codes).
 * - `size`: "sm", "md" (default) or "lg" — box size.
 * - `otp`: sets `autocomplete="one-time-code"` on the first box, so phones offer
 *   the code from an SMS (default `true`).
 * - `name`: form field name; the whole code is submitted through a hidden input,
 *   and resetting the form restores `defaultValue`.
 * - `autoFocus`, `disabled`, `required` (every box must be filled): native states.
 * - `id`: id of the first box (the others get `${id}-2`, `${id}-3`, …).
 */
export const PinInput = forwardRef(function PinInput(
  {
    length = 6,
    value,
    defaultValue = "",
    onValueChange,
    onComplete,
    type = "numeric",
    mask = false,
    placeholder,
    label,
    helperText,
    error,
    getInputLabel,
    size = "md",
    otp = true,
    name,
    form,
    id,
    autoFocus = false,
    disabled = false,
    required = false,
    className,
    style,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  forwardedRef,
) {
  const generatedId = useId();
  const baseId = id ?? `shelf-pin-input-${generatedId}`;
  const boxId = (index) => (index === 0 ? baseId : `${baseId}-${index + 1}`);
  const labelId = `${baseId}-label`;
  const messageId = `${baseId}-message`;

  const boxCount = Math.max(1, Math.floor(Number(length)) || 1);
  const pattern = CHARACTER_PATTERNS[type] ?? CHARACTER_PATTERNS.numeric;
  const normalize = (code) => filterCharacters(String(code ?? ""), pattern).slice(0, boxCount);
  const labelFor = getInputLabel ?? defaultInputLabel(type);

  const [currentValue, setValue] = useControllableState({
    value: value === undefined ? undefined : normalize(value),
    defaultValue: normalize(defaultValue),
    onChange: onValueChange,
  });
  const code = normalize(currentValue);
  // The box that takes the next character, and the only one in the Tab order.
  const activeIndex = Math.min(code.length, boxCount - 1);

  const hasError = error != null && error !== false && error !== "";
  const message = hasError && error !== true ? error : helperText;
  const describedBy = [ariaDescribedBy, message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  const groupRef = useRef(null);
  const firstBoxRef = useRef(null);
  const ref = useMemo(() => mergeRefs(firstBoxRef, forwardedRef), [forwardedRef]);

  const focusBox = (index) => {
    const boxes = groupRef.current?.querySelectorAll(".shelf-pin-input__box");
    boxes?.[Math.max(0, Math.min(index, boxCount - 1))]?.focus();
  };

  // Commits a new code, then moves focus. Rendering synchronously first means the
  // box being focused already knows the new code (and isn't sent back as empty).
  const update = (nextCode, focusIndex) => {
    if (nextCode !== code) {
      flushSync(() => setValue(nextCode));
      if (nextCode.length === boxCount) onComplete?.(nextCode);
    }
    focusBox(focusIndex);
  };

  // Writes characters from a box onwards, overwriting what's there. A whole code
  // (pasted or autofilled) always starts at the first box.
  const write = (characters, index) => {
    const start = characters.length >= boxCount ? 0 : Math.min(index, code.length);
    const nextCode = (
      code.slice(0, start) +
      characters +
      code.slice(start + characters.length)
    ).slice(0, boxCount);
    update(nextCode, start + characters.length);
  };

  const removeAt = (index) => code.slice(0, index) + code.slice(index + 1);

  const handleKeyDown = (index) => (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.nativeEvent?.isComposing) return;
    switch (event.key) {
      case "Backspace":
        event.preventDefault();
        // A filled box is cleared; an empty one clears the box before it.
        if (index < code.length) update(removeAt(index), index);
        else if (index > 0) update(removeAt(index - 1), index - 1);
        return;
      case "Delete":
        event.preventDefault();
        if (index < code.length) update(removeAt(index), index);
        return;
      case "ArrowLeft":
        event.preventDefault();
        focusBox(index - 1);
        return;
      case "ArrowRight":
        event.preventDefault();
        if (index < activeIndex) focusBox(index + 1);
        return;
      case "Home":
        event.preventDefault();
        focusBox(0);
        return;
      case "End":
        event.preventDefault();
        focusBox(activeIndex);
        return;
      default:
        // Printable keys are handled here, so typing the character a box already
        // holds still moves on. Other keys (Tab, Enter, …) keep working.
        if (event.key.length === 1) {
          event.preventDefault();
          if (pattern.test(event.key)) write(event.key, index);
        }
    }
  };

  // Input that doesn't come from a key press: SMS autofill, virtual keyboards, IMEs.
  const handleChange = (index) => (event) => {
    const text = event.target.value;
    const previous = code[index] ?? "";
    if (text === "") {
      if (previous) update(removeAt(index), index);
      return;
    }
    const typed = filterCharacters(text, pattern);
    let characters = typed;
    if (previous && text.length > 1) {
      // The box's old character is still in the text, before or after what was added.
      let added = typed;
      if (typed.startsWith(previous)) added = typed.slice(previous.length);
      else if (typed.endsWith(previous)) added = typed.slice(0, -previous.length);
      // A whole code that replaced it (SMS autofill over a filled box) is kept as it is.
      const wholeCode =
        typed.length !== previous.length + 1 && added.length < boxCount && typed.length >= boxCount;
      if (!wholeCode) characters = added;
    }
    // Nothing allowed was typed: React puts the previous character back.
    if (characters) write(characters, index);
  };

  const handlePaste = (index) => (event) => {
    event.preventDefault();
    const characters = filterCharacters(event.clipboardData?.getData("text") ?? "", pattern);
    if (characters) write(characters, index);
  };

  const handleFocus = (index) => (event) => {
    // Boxes fill from the start: an empty box further on sends focus back.
    if (index > activeIndex) {
      focusBox(activeIndex);
      return;
    }
    // Selected, so the next character replaces it.
    event.target.select();
  };

  // Resetting the form fires no change event on the hidden input: go back to the
  // default code when an uncontrolled field's form resets.
  const isControlled = value !== undefined;
  const resetValue = normalize(defaultValue);
  useEffect(() => {
    const formElement = firstBoxRef.current?.form;
    if (!formElement) return;
    const handleReset = () => {
      if (!isControlled) setValue(resetValue);
    };
    formElement.addEventListener("reset", handleReset);
    return () => formElement.removeEventListener("reset", handleReset);
  }, [isControlled, resetValue, setValue]);

  return (
    <div
      className={cx(
        "shelf-field",
        `shelf-field--${size}`,
        "shelf-pin-input-field",
        hasError && "shelf-field--invalid",
        disabled && "shelf-field--disabled",
        className,
      )}
      style={style}
    >
      {label != null && (
        // Clicking the label focuses the box that takes the next character.
        <label id={labelId} className="shelf-field__label" htmlFor={boxId(activeIndex)}>
          {label}
          {required && (
            <span className="shelf-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div
        {...rest}
        ref={groupRef}
        role="group"
        aria-labelledby={ariaLabelledBy ?? (label != null ? labelId : undefined)}
        // Codes read left to right, also on right-to-left pages.
        dir="ltr"
        className="shelf-pin-input"
      >
        {Array.from({ length: boxCount }, (_, index) => {
          const character = code[index] ?? "";
          return (
            <input
              key={index}
              ref={index === 0 ? ref : undefined}
              id={boxId(index)}
              type={mask ? "password" : "text"}
              inputMode={type === "alphanumeric" ? "text" : "numeric"}
              autoComplete={otp && index === 0 ? "one-time-code" : "off"}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              autoFocus={autoFocus && index === activeIndex}
              value={character}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              form={form}
              tabIndex={index === activeIndex ? 0 : -1}
              aria-label={labelFor(index, boxCount)}
              aria-invalid={hasError || undefined}
              aria-describedby={describedBy || undefined}
              data-filled={character ? "" : undefined}
              className="shelf-pin-input__box"
              onChange={handleChange(index)}
              onKeyDown={handleKeyDown(index)}
              onFocus={handleFocus(index)}
              onPaste={handlePaste(index)}
            />
          );
        })}
      </div>

      {name != null && (
        <input type="hidden" name={name} form={form} value={code} disabled={disabled} />
      )}

      {message != null && (
        <p id={messageId} className="shelf-field__message">
          {message}
        </p>
      )}
    </div>
  );
});
