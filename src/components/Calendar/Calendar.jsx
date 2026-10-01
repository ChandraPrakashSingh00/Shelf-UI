import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { useControllableState } from "../../hooks/useControllableState.js";
import { useIsClient } from "../../hooks/useIsClient.js";
import { useToday } from "../../hooks/useToday.js";
import { ChevronLeftIcon, ChevronRightIcon } from "../../icons/index.jsx";
import { IconButton } from "../../primitives/IconButton.jsx";
import { cx } from "../../utils/cx.js";
import {
  addDays,
  addMonths,
  addYears,
  clampDate,
  compareDays,
  endOfWeek,
  formatISODate,
  getDateFormatter,
  getDaysInMonth,
  getMonthGrid,
  getWeekdayNames,
  isDayDisabled,
  isSameDay,
  isSameMonth,
  isWithinRange,
  normalizeRange,
  parseISODate,
  startOfDay,
  startOfMonth,
  startOfWeek,
  toWeekStart,
} from "../../utils/date.js";
import { mergeRefs } from "../../utils/mergeRefs.js";

const DAY_LABEL_FORMAT = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
const MONTH_TITLE_FORMAT = { month: "long", year: "numeric" };
const DAY_NUMBER_FORMAT = { day: "numeric" };
// Used while server rendering and hydrating when no `locale` is given.
const SERVER_LOCALE = "en-US";

// The date a value points the calendar at: the selected day, or the range's start.
const getValueDate = (mode, value) =>
  mode === "range" ? normalizeRange(value).start : startOfDay(value);

// Form reset needs the default value; a string key keeps the effect from
// re-subscribing when `defaultValue` is a new Date object on every render.
function toResetKey(mode, value) {
  if (mode !== "range") return formatISODate(value);
  const { start, end } = normalizeRange(value);
  return `${formatISODate(start)}/${formatISODate(end)}`;
}

function fromResetKey(mode, key) {
  if (mode !== "range") return parseISODate(key);
  const [start, end] = key.split("/").map(parseISODate);
  return start ? { start, end } : null;
}

// The next date to focus for a navigation key, or null for other keys.
function getKeyTarget(key, date, { shiftKey, weekStart }) {
  switch (key) {
    case "ArrowLeft":
      return addDays(date, -1);
    case "ArrowRight":
      return addDays(date, 1);
    case "ArrowUp":
      return addDays(date, -7);
    case "ArrowDown":
      return addDays(date, 7);
    case "Home":
      return startOfWeek(date, weekStart);
    case "End":
      return endOfWeek(date, weekStart);
    case "PageUp":
      return shiftKey ? addYears(date, -1) : addMonths(date, -1);
    case "PageDown":
      return shiftKey ? addYears(date, 1) : addMonths(date, 1);
    default:
      return null;
  }
}

/**
 * Inline month calendar following the WAI-ARIA date picker grid pattern: the
 * days are buttons in a `role="grid"` table with one Tab stop, the arrow keys
 * move between days, Page Up / Page Down change the month (with Shift, the
 * year), and Enter or Space pick the focused day. Every date is a local `Date`
 * at 00:00. Other props go to the root `<div>`, and the `ref` points to it.
 *
 * - `mode`: "single" (default) picks one day; "range" picks a start and an end
 *   day — the first click sets the start, the second the end (the two swap when
 *   the end comes first), and hovering or focusing a day previews the range.
 * - `value` / `defaultValue` / `onValueChange`: controlled or uncontrolled
 *   selection — a `Date` or `null` in single mode, `{ start, end }` (Dates or
 *   `null`) or `null` in range mode. Nothing is selected by default.
 * - `month` / `defaultMonth` / `onMonthChange`: the visible month (any Date in
 *   it). Defaults to the selected day's month, else the current month.
 *   `onMonthChange` receives the first day of the new month.
 * - `min` / `max`: earliest and latest selectable days. The month buttons and
 *   the keyboard stop there.
 * - `isDateDisabled`: function that returns `true` for days that can't be
 *   picked, e.g. `(date) => date.getDay() === 0` for no Sunday deliveries.
 *   Disabled days stay focusable, as the pattern recommends, but can't be picked.
 * - `weekStartsOn`: first day of the week, 0 (Sunday, default) to 6 (Saturday).
 * - `locale`: BCP 47 locale for month and weekday names, e.g. "en-IN" or
 *   "hi-IN". Defaults to the user's locale; while server rendering and hydrating,
 *   when the user's locale isn't known yet, names are in "en-US" until the
 *   calendar has mounted. Set it when you render on the server to avoid the switch.
 * - `showOutsideDays`: shows the days of the previous and next months that fill
 *   the first and last weeks (default `true`). Picking one moves to its month.
 * - `label`: accessible name of the grid, e.g. "Delivery date", announced with
 *   the month ("Delivery date October 2026").
 * - `name`: adds hidden inputs with "YYYY-MM-DD" values for forms — `name` in
 *   single mode, `${name}Start` and `${name}End` in range mode. Resetting the
 *   form of an uncontrolled calendar selects `defaultValue` again.
 * - `autoFocus`: moves focus to the selected day (else today, else the first
 *   available day) when it mounts (default `false`).
 * - `previousMonthLabel` / `nextMonthLabel`: accessible names of the month
 *   buttons (default "Previous month" / "Next month").
 */
export const Calendar = forwardRef(function Calendar(
  {
    mode = "single",
    value,
    defaultValue,
    onValueChange,
    month,
    defaultMonth,
    onMonthChange,
    min,
    max,
    isDateDisabled,
    weekStartsOn = 0,
    locale,
    showOutsideDays = true,
    label,
    name,
    autoFocus = false,
    previousMonthLabel = "Previous month",
    nextMonthLabel = "Next month",
    className,
    ...rest
  },
  forwardedRef,
) {
  const isRange = mode === "range";
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const titleId = `${baseId}-title`;

  const rootRef = useRef(null);
  const ref = useMemo(() => mergeRefs(rootRef, forwardedRef), [forwardedRef]);
  const gridRef = useRef(null);
  // Set when the keyboard (or `autoFocus`) moves focus: the tabbable day is
  // focused once it has rendered, which may be in another month.
  const focusPendingRef = useRef(autoFocus);

  const today = useToday();
  // Without a locale, names follow the browser only once mounted: the server's own
  // locale would differ from the user's and break hydration.
  const isClient = useIsClient();
  const formatLocale = locale ?? (isClient ? undefined : SERVER_LOCALE);
  const weekStart = toWeekStart(weekStartsOn);
  const minDate = startOfDay(min);
  const maxDate = startOfDay(max);

  const [currentValue, setValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? null,
    onChange: onValueChange,
  });
  const selectedDate = isRange ? null : startOfDay(currentValue);
  const range = normalizeRange(isRange ? currentValue : null);

  const [monthValue, setMonthValue] = useControllableState({
    value: month,
    defaultValue: defaultMonth ?? getValueDate(mode, value ?? defaultValue),
    onChange: onMonthChange,
  });
  // `null` only while server rendering without a value or month: today is unknown there.
  const visibleMonth = startOfMonth(monthValue) ?? startOfMonth(today);

  const [focusedDate, setFocusedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

  const isDisabled = (date) => isDayDisabled(date, { min: minDate, max: maxDate, isDateDisabled });
  const isInBounds = (date) => isWithinRange(date, minDate, maxDate);

  const showMonthOf = (date) => {
    if (!isSameMonth(date, visibleMonth)) setMonthValue(startOfMonth(date));
  };

  // Roving tabindex: the focused day if it's in view, else the selection, else
  // today, else the first day that can be picked.
  let tabbableDate = null;
  if (visibleMonth) {
    const isCandidate = (date) => isSameMonth(date, visibleMonth) && isInBounds(date);
    const length = getDaysInMonth(visibleMonth.getFullYear(), visibleMonth.getMonth());
    const monthDays = Array.from({ length }, (_, index) => addDays(visibleMonth, index));
    tabbableDate =
      [focusedDate, isRange ? range.start : selectedDate, today].find(isCandidate) ??
      monthDays.find((date) => !isDisabled(date)) ??
      monthDays.find(isInBounds) ??
      visibleMonth;
  }

  useEffect(() => {
    if (!focusPendingRef.current) return;
    const target = gridRef.current?.querySelector('button[tabindex="0"]');
    if (!target) return;
    focusPendingRef.current = false;
    target.focus();
  });

  // Form reset: back to `defaultValue` (and its month) when uncontrolled.
  const isControlled = value !== undefined;
  const isMonthControlled = month !== undefined;
  const resetKey = toResetKey(mode, defaultValue);
  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (isControlled || !form) return;
    const handleReset = () => {
      const next = fromResetKey(mode, resetKey);
      setValue(next);
      setFocusedDate(null);
      const date = getValueDate(mode, next);
      if (date && !isMonthControlled) setMonthValue(startOfMonth(date));
    };
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, [isControlled, isMonthControlled, mode, resetKey, setValue, setMonthValue]);

  // A month can be shown when at least one of its days is within `min`…`max`.
  const canGoBack = Boolean(visibleMonth) && (!minDate || compareDays(visibleMonth, minDate) > 0);
  const canGoForward =
    Boolean(visibleMonth) && (!maxDate || compareDays(addMonths(visibleMonth, 1), maxDate) <= 0);

  // The month buttons keep focus and carry the tabbable day along, like the APG example.
  const goToMonth = (offset) => {
    const target = addMonths(visibleMonth, offset);
    setFocusedDate(clampDate(addMonths(tabbableDate, offset), minDate, maxDate));
    setMonthValue(target);
  };

  const selectDate = (date) => {
    if (!isRange) {
      setValue(date);
      return;
    }
    const { start, end } = range;
    setHoveredDate(null);
    if (!start || end) setValue({ start: date, end: null });
    else if (compareDays(date, start) < 0) setValue({ start: date, end: start });
    else setValue({ start, end: date });
  };

  const handleDayClick = (date) => {
    if (isDisabled(date)) return;
    setFocusedDate(date);
    if (!isSameMonth(date, visibleMonth)) {
      // A day from the next or previous month: show its month and keep focus on it.
      focusPendingRef.current = true;
      showMonthOf(date);
    }
    selectDate(date);
  };

  const handleGridKeyDown = (event) => {
    // Leave browser and system shortcuts (e.g. Alt + ← for Back) alone.
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const current = parseISODate(event.target.getAttribute?.("data-date"));
    if (!current) return;
    const next = getKeyTarget(event.key, current, { shiftKey: event.shiftKey, weekStart });
    if (!next) return;
    event.preventDefault();
    const target = clampDate(next, minDate, maxDate);
    focusPendingRef.current = true;
    setHoveredDate(null);
    setFocusedDate(target);
    showMonthOf(target);
  };

  // Range drawn in the grid: the selection, or its preview towards the hovered
  // or focused day while only the start is picked.
  const isPicking = isRange && range.start !== null && range.end === null;
  let bandStart = null;
  let bandEnd = null;
  if (isRange && range.start) {
    const other = range.end ?? (isPicking ? (hoveredDate ?? focusedDate) : null) ?? range.start;
    [bandStart, bandEnd] =
      compareDays(other, range.start) < 0 ? [other, range.start] : [range.start, other];
  }
  const hasBand = bandStart !== null && !isSameDay(bandStart, bandEnd);

  const dayLabel = getDateFormatter(formatLocale, DAY_LABEL_FORMAT);
  const dayNumber = getDateFormatter(formatLocale, DAY_NUMBER_FORMAT);
  const weekdays = getWeekdayNames(formatLocale, weekStart);
  const weeks = visibleMonth ? getMonthGrid(visibleMonth, weekStart) : null;

  const renderDay = (date) => {
    const iso = formatISODate(date);
    const isOutside = !isSameMonth(date, visibleMonth);
    if (isOutside && !showOutsideDays) {
      return <td key={iso} role="gridcell" className="cps-calendar__cell" />;
    }

    const disabled = isDisabled(date);
    const isToday = isSameDay(date, today);
    const isSelected = isRange
      ? range.end
        ? isWithinRange(date, range.start, range.end)
        : isSameDay(date, range.start)
      : isSameDay(date, selectedDate);
    const isEndpoint = isRange
      ? isSameDay(date, range.start) || isSameDay(date, range.end)
      : isSelected;
    const inBand = hasBand && isWithinRange(date, bandStart, bandEnd);

    return (
      <td
        key={iso}
        role="gridcell"
        aria-selected={isSelected || undefined}
        className={cx(
          "cps-calendar__cell",
          inBand && (isPicking ? "cps-calendar__cell--in-preview" : "cps-calendar__cell--in-range"),
          inBand && isSameDay(date, bandStart) && "cps-calendar__cell--range-start",
          inBand && isSameDay(date, bandEnd) && "cps-calendar__cell--range-end",
        )}
      >
        <button
          type="button"
          tabIndex={isSameDay(date, tabbableDate) ? 0 : -1}
          aria-label={dayLabel.format(date)}
          aria-current={isToday ? "date" : undefined}
          aria-disabled={disabled || undefined}
          data-date={iso}
          className={cx(
            "cps-calendar__day",
            isOutside && "cps-calendar__day--outside",
            isToday && "cps-calendar__day--today",
            isEndpoint && "cps-calendar__day--selected",
            disabled && "cps-calendar__day--disabled",
          )}
          onClick={() => handleDayClick(date)}
          onFocus={() => setFocusedDate(date)}
          onMouseEnter={isPicking && !disabled ? () => setHoveredDate(date) : undefined}
        >
          {dayNumber.format(date)}
        </button>
      </td>
    );
  };

  return (
    <div
      {...rest}
      ref={ref}
      className={cx("cps-calendar", `cps-calendar--${isRange ? "range" : "single"}`, className)}
    >
      {label != null && (
        <span id={labelId} hidden>
          {label}
        </span>
      )}

      <div className="cps-calendar__header">
        <IconButton
          label={previousMonthLabel}
          className="cps-calendar__nav"
          aria-disabled={!canGoBack || undefined}
          onClick={() => canGoBack && goToMonth(-1)}
        >
          <ChevronLeftIcon />
        </IconButton>
        <div id={titleId} className="cps-calendar__title" aria-live="polite">
          {visibleMonth
            ? getDateFormatter(formatLocale, MONTH_TITLE_FORMAT).format(visibleMonth)
            : null}
        </div>
        <IconButton
          label={nextMonthLabel}
          className="cps-calendar__nav"
          aria-disabled={!canGoForward || undefined}
          onClick={() => canGoForward && goToMonth(1)}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>

      <table
        ref={gridRef}
        role="grid"
        aria-labelledby={label != null ? `${labelId} ${titleId}` : titleId}
        aria-multiselectable={isRange || undefined}
        className="cps-calendar__grid"
        onKeyDown={handleGridKeyDown}
        onMouseLeave={isPicking ? () => setHoveredDate(null) : undefined}
      >
        <thead>
          <tr>
            {weekdays.map((weekday) => (
              <th
                key={weekday.long}
                scope="col"
                abbr={weekday.long}
                aria-label={weekday.long}
                className="cps-calendar__weekday"
              >
                {weekday.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks
            ? weeks.map((week) => <tr key={formatISODate(week[0])}>{week.map(renderDay)}</tr>)
            : Array.from({ length: 6 }, (_, week) => (
                <tr key={week}>
                  {weekdays.map((weekday) => (
                    <td key={weekday.long} role="gridcell" className="cps-calendar__cell" />
                  ))}
                </tr>
              ))}
        </tbody>
      </table>

      {name != null &&
        (isRange ? (
          <>
            <input type="hidden" name={`${name}Start`} value={formatISODate(range.start)} />
            <input type="hidden" name={`${name}End`} value={formatISODate(range.end)} />
          </>
        ) : (
          <input type="hidden" name={name} value={formatISODate(selectedDate)} />
        ))}
    </div>
  );
});
