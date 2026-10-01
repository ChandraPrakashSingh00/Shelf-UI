import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { useIsClient } from "../../hooks/useIsClient.js";
import { useOnClickOutside } from "../../hooks/useOnClickOutside.js";
import { CalendarIcon, CloseIcon } from "../../icons/index.jsx";
import { IconButton } from "../../primitives/IconButton.jsx";
import { cx } from "../../utils/cx.js";
import {
  formatISODate,
  getDateFormatter,
  isSameDay,
  normalizeRange,
  parseISODate,
  startOfDay,
} from "../../utils/date.js";
import { mergeRefs } from "../../utils/mergeRefs.js";
import { Calendar } from "../Calendar/Calendar.jsx";

const DISPLAY_FORMAT = { day: "numeric", month: "short", year: "numeric" };
// Used while server rendering and hydrating when no `locale` is given.
const SERVER_LOCALE = "en-US";

// Text shown in the field: "6 Oct 2026", or "6–12 Oct 2026" for a range.
function getDisplayText(mode, value, { locale, formatDate }) {
  const formatter = getDateFormatter(locale, DISPLAY_FORMAT);
  const format = formatDate ?? ((date) => formatter.format(date));
  if (mode !== "range") {
    const date = startOfDay(value);
    return date ? format(date) : "";
  }
  const { start, end } = normalizeRange(value);
  if (!start) return "";
  if (!end) return `${format(start)} –`;
  if (!formatDate && typeof formatter.formatRange === "function") {
    return formatter.formatRange(start, end);
  }
  return `${format(start)} – ${format(end)}`;
}

// Whether a value picks something: a day, or a range with both ends.
function isComplete(mode, value) {
  if (mode !== "range") return startOfDay(value) !== null;
  const { start, end } = normalizeRange(value);
  return start !== null && end !== null;
}

function isSameValue(mode, a, b) {
  if (mode !== "range") return isSameDay(a, b);
  const rangeA = normalizeRange(a);
  const rangeB = normalizeRange(b);
  return isSameDay(rangeA.start, rangeB.start) && isSameDay(rangeA.end, rangeB.end);
}

// See Calendar: a string key keeps the reset effect stable across renders.
function toResetKey(mode, value) {
  if (mode !== "range") return formatISODate(value);
  const { start, end } = normalizeRange(value);
  return start && end ? `${formatISODate(start)}/${formatISODate(end)}` : "";
}

function fromResetKey(mode, key) {
  if (mode !== "range") return parseISODate(key);
  const [start, end] = key.split("/").map(parseISODate);
  return start && end ? { start, end } : null;
}

// The popup's content. It mounts on open, so a half-picked range (only the
// start day) is dropped when the popup closes before the end day is picked.
function DatePickerPopup({
  mode,
  value,
  onCommit,
  presets,
  presetsLabel,
  align,
  calendarProps,
  popupRef,
  ...rest
}) {
  const [draft, setDraft] = useState(null);
  const [month, setMonth] = useState(() =>
    mode === "range" ? normalizeRange(value).start : startOfDay(value),
  );

  const handleCalendarChange = (next) => {
    if (mode === "range" && !isComplete(mode, next)) {
      setDraft(next);
      return;
    }
    setDraft(null);
    onCommit(next);
  };

  const handlePresetClick = (preset) => {
    setDraft(null);
    const date = mode === "range" ? normalizeRange(preset.value).start : startOfDay(preset.value);
    if (date) setMonth(date);
    onCommit(preset.value);
  };

  return (
    <div
      {...rest}
      ref={popupRef}
      role="dialog"
      className={cx("cps-date-picker__popup", `cps-date-picker__popup--${align}`)}
    >
      {presets?.length > 0 && (
        <div role="group" aria-label={presetsLabel} className="cps-date-picker__presets">
          {presets.map((preset, index) => {
            const isActive = draft === null && isSameValue(mode, preset.value, value);
            return (
              <button
                key={index}
                type="button"
                aria-current={isActive || undefined}
                className={cx(
                  "cps-date-picker__preset",
                  isActive && "cps-date-picker__preset--active",
                )}
                onClick={() => handlePresetClick(preset)}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      )}
      <Calendar
        {...calendarProps}
        mode={mode}
        value={draft ?? value ?? null}
        onValueChange={handleCalendarChange}
        month={month}
        onMonthChange={setMonth}
        autoFocus
        className="cps-date-picker__calendar"
      />
    </div>
  );
}

/**
 * Date field that opens a Calendar in a popup, for a delivery date or a report
 * period. The field is a button (`aria-haspopup="dialog"`) showing the value;
 * the popup is a non-modal dialog. When it opens, focus moves to the selected
 * day (else today); Escape closes it and returns focus to the field, and a click
 * outside or moving focus out of it closes it too. `className` and `style`
 * apply to the field wrapper; every other native attribute (and the `ref`) goes
 * to the button.
 *
 * - `label`: visible label. The button is named by the label and the value.
 * - `helperText`: hint below the field, exposed as its accessible description.
 * - `error`: error message; replaces `helperText` and marks the field
 *   `aria-invalid`. Pass `true` to mark it invalid without a message.
 * - `size`: "sm", "md" (default) or "lg" — field height and font size.
 * - `placeholder`: text while empty (default "Select date", or "Select date
 *   range" in range mode).
 * - `mode`: "single" (default) or "range", like Calendar.
 * - `value` / `defaultValue` / `onValueChange`: controlled or uncontrolled value —
 *   a `Date` or `null`, or `{ start, end }` or `null` in range mode.
 *   `onValueChange` receives complete ranges only (after the end day is picked),
 *   and `null` when the field is cleared.
 * - `min`, `max`, `isDateDisabled`, `weekStartsOn`, `showOutsideDays`,
 *   `previousMonthLabel`, `nextMonthLabel`: passed to the Calendar.
 * - `locale`: BCP 47 locale for the value and the calendar, e.g. "en-IN".
 *   Defaults to the user's locale; while server rendering and hydrating, when the
 *   user's locale isn't known yet, the value is shown in "en-US" until the field
 *   has mounted. Set it when you render on the server to avoid the switch.
 * - `formatDate`: function that turns a Date into the text shown in the field.
 *   Defaults to the locale's medium date, e.g. "6 Oct 2026"; a range is shown as
 *   "6–12 Oct 2026" (or "start – end" with `formatDate`).
 * - `presets`: shortcuts shown next to the calendar, as `{ label, value }`
 *   objects, e.g. `{ label: "Last 7 days", value: { start, end } }` in range mode.
 *   `presetsLabel` names the group (default "Presets").
 * - `name`: adds hidden inputs with "YYYY-MM-DD" values for forms — `name` in
 *   single mode, `${name}Start` and `${name}End` in range mode. Resetting the
 *   form of an uncontrolled date picker goes back to `defaultValue`.
 * - `required`: shows an asterisk after the label, and the browser blocks
 *   submitting the form while the field is empty.
 * - `disabled`: disables the field (default `false`).
 * - `clearable`: shows a clear (×) button while there's a value (default `true`).
 *   `clearLabel` is its accessible name (default "Clear date").
 * - `closeOnSelect`: closes the popup once a day (or, in range mode, the end
 *   day) or a preset is picked (default `true`).
 * - `open` / `defaultOpen` / `onOpenChange`: controlled or uncontrolled open state
 *   (`defaultOpen` defaults to `false`).
 * - `align`: "start" (default) or "end" — which edge of the field the popup
 *   lines up with.
 * - `id`: id of the button. Defaults to a generated id.
 */
export const DatePicker = forwardRef(function DatePicker(
  {
    label,
    helperText,
    error,
    size = "md",
    placeholder,
    mode = "single",
    value,
    defaultValue,
    onValueChange,
    min,
    max,
    isDateDisabled,
    weekStartsOn = 0,
    locale,
    showOutsideDays = true,
    previousMonthLabel,
    nextMonthLabel,
    formatDate,
    presets,
    presetsLabel = "Presets",
    name,
    required = false,
    disabled = false,
    clearable = true,
    clearLabel = "Clear date",
    closeOnSelect = true,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    align = "start",
    id,
    className,
    style,
    onClick,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    ...rest
  },
  forwardedRef,
) {
  const isRange = mode === "range";
  const baseId = useId();
  const triggerId = id ?? `cps-date-picker-${baseId}`;
  const labelId = `${triggerId}-label`;
  const valueId = `${triggerId}-value`;
  const popupId = `${triggerId}-popup`;
  const messageId = `${triggerId}-message`;

  const rootRef = useRef(null);
  const popupRef = useRef(null);
  const triggerRef = useRef(null);
  const ref = useMemo(() => mergeRefs(triggerRef, forwardedRef), [forwardedRef]);
  // Whether the last close came from a click or focus outside: focus then stays where it went.
  const closedFromOutsideRef = useRef(false);

  const [currentValue, setValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? null,
    onChange: onValueChange,
  });
  const [openState, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const open = Boolean(openState) && !disabled;

  const hasError = error != null && error !== false && error !== "";
  const message = hasError && error !== true ? error : helperText;
  const describedBy = [ariaDescribedBy, message != null ? messageId : null]
    .filter(Boolean)
    .join(" ");

  // Without a locale, the value follows the browser only once mounted: the server's
  // own locale would differ from the user's and break hydration.
  const isClient = useIsClient();
  const displayText = getDisplayText(mode, currentValue, {
    locale: locale ?? (isClient ? undefined : SERVER_LOCALE),
    formatDate,
  });
  const hasValue = displayText !== "";
  const placeholderText = placeholder ?? (isRange ? "Select date range" : "Select date");

  // Named by the label (or its own `aria-label`) followed by the value, e.g.
  // "Delivery date 6 Oct 2026".
  let labelledBy = ariaLabelledBy;
  if (labelledBy === undefined && label != null) labelledBy = `${labelId} ${valueId}`;
  else if (labelledBy === undefined && ariaLabel != null) labelledBy = `${triggerId} ${valueId}`;

  // When it closes with focus inside (a day was picked, Escape, your own code),
  // focus returns to the field, unless it closed from a click or focus outside.
  useEffect(() => {
    if (!open) return;
    const popup = popupRef.current;
    const trigger = triggerRef.current;
    closedFromOutsideRef.current = false;
    return () => {
      if (popup?.isConnected || closedFromOutsideRef.current) return;
      // Focus falls back to <body> when the focused element inside is removed.
      const active = document.activeElement;
      if (active === null || active === document.body) trigger?.focus();
    };
  }, [open]);

  const close = ({ fromOutside }) => {
    closedFromOutsideRef.current = fromOutside;
    setOpen(false);
  };

  useOnClickOutside(rootRef, () => close({ fromOutside: true }), open);

  // Close when focus moves to an element outside (not when the window itself loses focus).
  const handleBlur = (event) => {
    const next = event.relatedTarget;
    if (open && next instanceof Node && !rootRef.current?.contains(next)) {
      close({ fromOutside: true });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Escape" || !open || event.defaultPrevented) return;
    // Keep a surrounding Modal or Popover open.
    event.stopPropagation();
    close({ fromOutside: false });
  };

  const handleTriggerClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (open) close({ fromOutside: false });
    else setOpen(true);
  };

  const handleCommit = (next) => {
    setValue(next);
    if (closeOnSelect) close({ fromOutside: false });
  };

  const handleClear = () => {
    setValue(null);
    // The clear button disappears: keep focus in the field.
    triggerRef.current?.focus();
  };

  // Form reset: back to `defaultValue` when uncontrolled.
  const isControlled = value !== undefined;
  const resetKey = toResetKey(mode, defaultValue);
  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (isControlled || !form) return;
    const handleReset = () => setValue(fromResetKey(mode, resetKey));
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, [isControlled, mode, resetKey, setValue]);

  const range = normalizeRange(isRange ? currentValue : null);
  const complete = isComplete(mode, currentValue);

  return (
    <div
      ref={rootRef}
      className={cx(
        "cps-field",
        `cps-field--${size}`,
        "cps-date-picker",
        open && "cps-date-picker--open",
        hasError && "cps-field--invalid",
        disabled && "cps-field--disabled",
        className,
      )}
      style={style}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {label != null && (
        <label id={labelId} className="cps-field__label" htmlFor={triggerId}>
          {label}
          {required && (
            <span className="cps-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="cps-date-picker__anchor">
        <div className="cps-date-picker__control">
          <button
            {...rest}
            ref={ref}
            type="button"
            id={triggerId}
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? popupId : undefined}
            aria-label={ariaLabel}
            aria-labelledby={labelledBy}
            aria-describedby={describedBy || undefined}
            aria-invalid={hasError || undefined}
            className="cps-date-picker__trigger"
            onClick={handleTriggerClick}
          >
            <CalendarIcon className="cps-date-picker__icon" />
            <span
              id={valueId}
              className={cx(
                "cps-date-picker__value",
                !hasValue && "cps-date-picker__value--placeholder",
              )}
            >
              {hasValue ? displayText : placeholderText}
            </span>
          </button>
          {clearable && hasValue && !disabled && (
            <IconButton label={clearLabel} className="cps-date-picker__clear" onClick={handleClear}>
              <CloseIcon />
            </IconButton>
          )}
        </div>

        {/*
         * Hidden inputs can't be required, so a visually hidden one lets the
         * browser block submitting an empty required field. It sends focus on
         * to the button when the browser points the user at it.
         */}
        {required && !disabled && (
          <input
            tabIndex={-1}
            aria-hidden="true"
            required
            value={complete ? formatISODate(isRange ? range.start : startOfDay(currentValue)) : ""}
            onChange={() => {}}
            onFocus={() => triggerRef.current?.focus()}
            className="cps-date-picker__validation"
          />
        )}

        {open && (
          <DatePickerPopup
            id={popupId}
            popupRef={popupRef}
            aria-labelledby={label != null ? labelId : undefined}
            aria-label={label != null ? undefined : (ariaLabel ?? placeholderText)}
            mode={mode}
            value={currentValue}
            onCommit={handleCommit}
            presets={presets}
            presetsLabel={presetsLabel}
            align={align}
            calendarProps={{
              min,
              max,
              isDateDisabled,
              weekStartsOn,
              locale,
              showOutsideDays,
              previousMonthLabel,
              nextMonthLabel,
            }}
          />
        )}
      </div>

      {name != null &&
        (isRange ? (
          <>
            <input
              type="hidden"
              name={`${name}Start`}
              value={complete ? formatISODate(range.start) : ""}
              disabled={disabled}
            />
            <input
              type="hidden"
              name={`${name}End`}
              value={complete ? formatISODate(range.end) : ""}
              disabled={disabled}
            />
          </>
        ) : (
          <input
            type="hidden"
            name={name}
            value={formatISODate(startOfDay(currentValue))}
            disabled={disabled}
          />
        ))}

      {message != null && (
        <p id={messageId} className="cps-field__message">
          {message}
        </p>
      )}
    </div>
  );
});
