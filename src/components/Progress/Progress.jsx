import { forwardRef, useId } from "react";
import { cx } from "../../utils/cx.js";

/**
 * Progress bar for a task, following the WAI-ARIA progressbar pattern. Renders
 * a `<div>`; other props and the `ref` go to it, except `aria-label`,
 * `aria-labelledby` and `aria-describedby`, which go to the progress bar itself.
 *
 * - `value`: current progress, from 0 to `max` (values outside are clamped).
 *   Leave it out (or pass `null`) for an indeterminate bar.
 * - `max`: value of a finished task (default 100).
 * - `label`: visible label above the bar; also its accessible name.
 *   Without it, pass `aria-label`.
 * - `showValue`: shows the percentage (or `formatValue`'s text) next to the label
 *   (default `false`).
 * - `formatValue`: `(value, max) => string` for the value text, e.g. "12 MB of 24 MB".
 *   Also sets `aria-valuetext`, so screen readers read the same text.
 * - `size`: bar thickness — "sm", "md" (default) or "lg".
 * - `variant`: "primary" (default), "success", "warning" or "danger".
 */
export const Progress = forwardRef(function Progress(
  {
    value,
    max = 100,
    label,
    showValue = false,
    formatValue,
    size = "md",
    variant = "primary",
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const labelId = `cps-progress-${useId()}-label`;
  const isIndeterminate = value == null;
  const current = isIndeterminate ? undefined : Math.min(Math.max(Number(value) || 0, 0), max);
  const percent = isIndeterminate || max <= 0 ? 0 : (current / max) * 100;

  let valueText;
  if (!isIndeterminate) {
    valueText = formatValue ? formatValue(current, max) : `${Math.round(percent)}%`;
  }

  const hasLabel = label != null && label !== "";
  const showValueText = showValue && !isIndeterminate;

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        "cps-progress",
        `cps-progress--${size}`,
        `cps-progress--${variant}`,
        isIndeterminate && "cps-progress--indeterminate",
        className,
      )}
    >
      {(hasLabel || showValueText) && (
        <div className="cps-progress__header">
          {hasLabel && (
            <span id={labelId} className="cps-progress__label">
              {label}
            </span>
          )}
          {showValueText && (
            // The progress bar already exposes its value to screen readers.
            <span className="cps-progress__value" aria-hidden="true">
              {valueText}
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy ?? (hasLabel ? labelId : undefined)}
        aria-describedby={ariaDescribedBy}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={current}
        aria-valuetext={formatValue && typeof valueText === "string" ? valueText : undefined}
        className="cps-progress__track"
      >
        <div
          className="cps-progress__bar"
          style={isIndeterminate ? undefined : { width: `${percent}%` }}
        />
      </div>
    </div>
  );
});
