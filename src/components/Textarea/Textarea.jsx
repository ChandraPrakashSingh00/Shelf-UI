import { forwardRef, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cx } from "../../utils/cx.js";
import { mergeRefs } from "../../utils/mergeRefs.js";

// React 18 warns about layout effects during server rendering, where there is
// nothing to measure anyway.
const useIsomorphicLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;

/**
 * Saves the scroll position of every scrolled ancestor and returns a function
 * that restores them. Collapsing the textarea to measure it can briefly make
 * the page shorter, which would otherwise make it jump.
 */
function saveScrollPositions(element) {
  const saved = [];
  for (let node = element.parentElement; node; node = node.parentElement) {
    if (node.scrollTop > 0) saved.push([node, node.scrollTop]);
  }
  return () => {
    for (const [node, scrollTop] of saved) {
      // Jump straight back, even where `scroll-behavior: smooth` is set.
      const { scrollBehavior } = node.style;
      node.style.scrollBehavior = "auto";
      node.scrollTop = scrollTop;
      node.style.scrollBehavior = scrollBehavior;
    }
  };
}

/** Sets the height of the textarea to fit its content; `rows` stays the minimum. */
function fitToContent(textarea) {
  const restoreScrollPositions = saveScrollPositions(textarea);
  const { style } = textarea;
  style.height = "auto";
  style.overflowY = "";
  // `scrollHeight` is 0 while the textarea isn't rendered, e.g. inside a hidden panel.
  if (textarea.scrollHeight > 0) {
    const borders = textarea.offsetHeight - textarea.clientHeight;
    const height = textarea.scrollHeight + borders;
    style.height = `${height}px`;
    // A `max-height` stopped the growth: let the content scroll again.
    if (textarea.offsetHeight < height) style.overflowY = "auto";
  }
  restoreScrollPositions();
}

/**
 * Multi-line text field with an optional label, helper text, error message and
 * character count. `className` and `style` apply to the field wrapper; every
 * other native attribute (and the `ref`) goes to the underlying `<textarea>`.
 *
 * - `label`: visible label, programmatically linked to the textarea.
 * - `helperText`: hint shown below the textarea and exposed as its accessible description.
 * - `error`: error message; replaces `helperText` and marks the textarea `aria-invalid`.
 *   Pass `true` to mark the field invalid without a message.
 * - `size`: "sm", "md" (default) or "lg" — font size and padding.
 * - `rows`: number of visible text lines (default 3). With `autoResize`, the minimum height.
 * - `resize`: "vertical" (default), "none" or "both" — which way people can drag
 *   the corner to resize the field. Ignored with `autoResize`.
 * - `autoResize`: grows the height to fit the content (default `false`). The resize
 *   handle and the scrollbar stay hidden while the content fits; a CSS `max-height`
 *   on the textarea caps the growth, and past it the content scrolls.
 * - `showCount`: shows a character count below the field (default `false`):
 *   "n / maxLength" when `maxLength` is set, otherwise "n characters". The count is
 *   part of the textarea's accessible description, and turns red when a value (for
 *   example a controlled one) is longer than `maxLength`.
 * - `textareaClassName`: class name for the `<textarea>` element itself.
 */
export const Textarea = forwardRef(function Textarea(
  {
    label,
    helperText,
    error,
    size = "md",
    rows = 3,
    resize = "vertical",
    autoResize = false,
    showCount = false,
    id,
    required,
    disabled,
    maxLength,
    value,
    defaultValue,
    onChange,
    className,
    style,
    textareaClassName,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  forwardedRef,
) {
  const generatedId = useId();
  const textareaId = id ?? `cps-textarea-${generatedId}`;
  const messageId = `${textareaId}-message`;
  const countId = `${textareaId}-count`;

  const textareaRef = useRef(null);
  const ref = useMemo(() => mergeRefs(textareaRef, forwardedRef), [forwardedRef]);

  // A controlled value is counted directly; an uncontrolled one is tracked on change.
  const isControlled = value != null;
  const [uncontrolledLength, setUncontrolledLength] = useState(
    () => String(defaultValue ?? "").length,
  );
  const length = isControlled ? String(value).length : uncontrolledLength;
  const count =
    maxLength != null
      ? `${length} / ${maxLength}`
      : `${length} ${length === 1 ? "character" : "characters"}`;

  const hasError = error != null && error !== false && error !== "";
  const message = hasError && error !== true ? error : helperText;
  const describedBy = [
    ariaDescribedBy,
    message != null ? messageId : null,
    showCount ? countId : null,
  ]
    .filter(Boolean)
    .join(" ");

  // Fits on mount and whenever the value or the text metrics change. Typing in
  // an uncontrolled textarea is handled in `handleChange`.
  useIsomorphicLayoutEffect(() => {
    if (autoResize && textareaRef.current) fitToContent(textareaRef.current);
  }, [autoResize, value, size, rows]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!autoResize || !textarea) return;

    // The text wraps differently when the width changes (window resize, a
    // sidebar opening, …), so fit again.
    let width = textarea.offsetWidth;
    let frame = 0;
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            if (textarea.offsetWidth === width) return;
            width = textarea.offsetWidth;
            // Resizing inside the callback would trigger a "ResizeObserver loop" error.
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => fitToContent(textarea));
          });
    observer?.observe(textarea);

    return () => {
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);
      // Hand the height back to `rows` and the resize handle.
      textarea.style.height = "";
      textarea.style.overflowY = "";
    };
  }, [autoResize]);

  // Resetting the form restores the value without a change event.
  useEffect(() => {
    const textarea = textareaRef.current;
    const form = textarea?.form;
    if (!form) return;

    let timeout;
    const handleReset = () => {
      // The form restores its fields right after dispatching "reset".
      timeout = setTimeout(() => {
        setUncontrolledLength(textarea.value.length);
        if (autoResize) fitToContent(textarea);
      });
    };
    form.addEventListener("reset", handleReset);
    return () => {
      form.removeEventListener("reset", handleReset);
      clearTimeout(timeout);
    };
  }, [autoResize]);

  const handleChange = (event) => {
    onChange?.(event);
    if (isControlled) return;
    setUncontrolledLength(event.target.value.length);
    if (autoResize) fitToContent(event.target);
  };

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
        <label className="cps-field__label" htmlFor={textareaId}>
          {label}
          {required && (
            <span className="cps-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <textarea
        {...rest}
        ref={ref}
        id={textareaId}
        rows={rows}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy || undefined}
        className={cx(
          "cps-textarea",
          autoResize ? "cps-textarea--auto-resize" : `cps-textarea--resize-${resize}`,
          textareaClassName,
        )}
      />

      {(message != null || showCount) && (
        <div className="cps-textarea__footer">
          {message != null && (
            <p id={messageId} className="cps-field__message">
              {message}
            </p>
          )}
          {showCount && (
            <p
              id={countId}
              className={cx(
                "cps-textarea__count",
                maxLength != null && length > maxLength && "cps-textarea__count--over",
              )}
            >
              {count}
            </p>
          )}
        </div>
      )}
    </div>
  );
});
