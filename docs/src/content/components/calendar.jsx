import { Calendar } from "@codecps/ui";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/calendar/Basic.jsx";
import basicCode from "../../examples/calendar/Basic.jsx?raw";
import Controlled from "../../examples/calendar/Controlled.jsx";
import controlledCode from "../../examples/calendar/Controlled.jsx?raw";
import DeliverySlots from "../../examples/calendar/DeliverySlots.jsx";
import deliverySlotsCode from "../../examples/calendar/DeliverySlots.jsx?raw";
import Localized from "../../examples/calendar/Localized.jsx";
import localizedCode from "../../examples/calendar/Localized.jsx?raw";
import Range from "../../examples/calendar/Range.jsx";
import rangeCode from "../../examples/calendar/Range.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const modes = ["single", "range"];
const weekStarts = ["Sunday", "Monday"];
const locales = ["en-IN", "en-US", "hi-IN"];
const isSunday = (date) => date.getDay() === 0;

// October 2026 starts on a Thursday: 4 blank cells, then 31 days.
const THUMBNAIL_CELLS = Array.from({ length: 35 }, (_, index) => index - 3);
const THUMBNAIL_WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function thumbnailDayStyle(day) {
  const base = { height: 13, borderRadius: 3, lineHeight: "13px" };
  if (day === 16 || day === 21) {
    return {
      ...base,
      backgroundColor: "var(--cps-color-primary)",
      color: "var(--cps-color-on-primary)",
      fontWeight: 600,
    };
  }
  if (day > 16 && day < 21) {
    return {
      ...base,
      backgroundColor: "var(--cps-color-primary-subtle)",
      color: "var(--cps-color-primary-text)",
    };
  }
  if (day === 6) return { ...base, boxShadow: "inset 0 0 0 1px var(--cps-color-primary)" };
  return base;
}

// A static look-alike: the real calendar keeps today up to date with global listeners.
function CalendarThumbnail() {
  return (
    <div
      style={{
        width: 172,
        padding: 8,
        border: "1px solid var(--cps-color-border)",
        borderRadius: "var(--cps-radius-lg)",
        backgroundColor: "var(--cps-color-surface)",
        boxShadow: "var(--cps-shadow-sm)",
        color: "var(--cps-color-text)",
        fontFamily: "var(--cps-font-sans)",
        fontSize: 9,
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
          padding: "0 4px",
          fontSize: 10,
          fontWeight: 600,
          lineHeight: "13px",
        }}
      >
        <span style={{ color: "var(--cps-color-text-subtle)" }}>‹</span>
        October 2026
        <span style={{ color: "var(--cps-color-text-subtle)" }}>›</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", rowGap: 1 }}>
        {THUMBNAIL_WEEKDAYS.map((weekday, index) => (
          <span key={index} style={{ color: "var(--cps-color-text-subtle)", lineHeight: "12px" }}>
            {weekday}
          </span>
        ))}
        {THUMBNAIL_CELLS.map((day, index) => (
          <span key={index} style={thumbnailDayStyle(day)}>
            {day > 0 && day <= 31 ? day : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

export const calendarDoc = {
  slug: "calendar",
  name: "Calendar",
  category: "Forms",
  summary: "Inline month calendar for picking a day or a range of days.",
  description:
    "An inline month view for picking a delivery slot, a booking date or a sale period. Pick one day or a range, limit the choice with `min`, `max` and `isDateDisabled`, and navigate the whole grid from the keyboard. Every date is a local `Date` at midnight, and names come from `Intl` in the locale you choose.",
  keywords: [
    "date",
    "day",
    "month",
    "date range",
    "booking",
    "delivery slot",
    "schedule",
    "datepicker",
    "grid",
    "form",
  ],
  imports: ["Calendar"],
  Thumbnail: CalendarThumbnail,
  Playground: definePlayground({
    defaults: {
      mode: "single",
      weekStartsOn: "Sunday",
      locale: "en-IN",
      showOutsideDays: true,
      disableSundays: false,
    },
    controls: {
      mode: { type: "select", label: "Mode", options: modes },
      weekStartsOn: { type: "select", label: "Week starts on", options: weekStarts },
      locale: { type: "select", label: "Locale", options: locales },
      showOutsideDays: { type: "boolean", label: "Show outside days" },
      disableSundays: { type: "boolean", label: "Disable Sundays" },
    },
    render: (values) => (
      <Calendar
        // A new calendar for each mode: single and range values have different shapes.
        key={values.mode}
        mode={values.mode}
        label="Delivery date"
        weekStartsOn={values.weekStartsOn === "Monday" ? 1 : 0}
        locale={values.locale}
        showOutsideDays={values.showOutsideDays}
        isDateDisabled={values.disableSundays ? isSunday : undefined}
      />
    ),
    code: (values) =>
      withImport(
        ["Calendar"],
        formatJsx(
          "Calendar",
          {
            mode: values.mode,
            label: "Delivery date",
            weekStartsOn: values.weekStartsOn === "Monday" ? 1 : undefined,
            locale: values.locale,
            showOutsideDays: values.showOutsideDays ? undefined : expr("false"),
            isDateDisabled: values.disableSundays
              ? expr("(date) => date.getDay() === 0")
              : undefined,
          },
          undefined,
          { defaults: { mode: "single" } },
        ),
      ),
  }),
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        "Opens on the current month with today outlined. Click a day, or Tab to the grid and use the arrow keys and Enter.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "controlled",
      title: "Controlled",
      description:
        "Pass `value` and `onValueChange` to use the picked day elsewhere. It's a local `Date` at midnight, or `null` once cleared.",
      Component: Controlled,
      code: controlledCode,
    },
    {
      id: "delivery-slots",
      title: "Delivery slots",
      description:
        "`min` and `max` limit the choice to the next two weeks, and `isDateDisabled` rules out Sundays. `weekStartsOn={1}` starts the week on Monday, as most Indian calendars do.",
      Component: DeliverySlots,
      code: deliverySlotsCode,
    },
    {
      id: "range",
      title: "Range selection",
      description:
        '`mode="range"` picks a start and an end day. The value is `{ start, end }`; `end` is `null` until the second day is picked, and hovering or focusing a day previews the range.',
      Component: Range,
      code: rangeCode,
    },
    {
      id: "localized",
      title: "Locale",
      description:
        "`locale` translates the month and weekday names and the date read out for each day. Name the month buttons in the same language with `previousMonthLabel` and `nextMonthLabel`. `showOutsideDays={false}` hides the days of the neighbouring months.",
      Component: Localized,
      code: localizedCode,
    },
  ],
  api: [
    {
      title: "Calendar",
      description:
        "Other props go to the root `<div>`, and the `ref` points to it. Dates are local `Date` objects; the time of day is ignored.",
      props: [
        {
          name: "mode",
          type: '"single" | "range"',
          default: '"single"',
          description: "Picks one day, or a start and an end day.",
        },
        {
          name: "value",
          type: "Date | { start, end }",
          description:
            "Selected day (controlled): a `Date` or `null`, or `{ start, end }` in range mode.",
        },
        {
          name: "defaultValue",
          type: "Date | { start, end }",
          description: "Initially selected day or range (uncontrolled).",
        },
        {
          name: "onValueChange",
          type: "function(value)",
          description:
            "Called with the picked day (a `Date` at midnight), or with `{ start, end }` in range mode — `end` is `null` after the first click.",
        },
        {
          name: "month",
          type: "Date",
          description: "Visible month, as any date in it (controlled).",
        },
        {
          name: "defaultMonth",
          type: "Date",
          description:
            "Initially visible month. Defaults to the selected day's month, else the current month.",
        },
        {
          name: "onMonthChange",
          type: "function(month)",
          description: "Called with the first day of the newly visible month.",
        },
        { name: "min", type: "Date", description: "Earliest day that can be picked." },
        { name: "max", type: "Date", description: "Latest day that can be picked." },
        {
          name: "isDateDisabled",
          type: "function(date)",
          description:
            "Returns `true` for days that can't be picked, e.g. `(date) => date.getDay() === 0`. They stay focusable.",
        },
        {
          name: "weekStartsOn",
          type: "number",
          default: "0",
          description: "First day of the week, from 0 (Sunday) to 6 (Saturday).",
        },
        {
          name: "locale",
          type: "string",
          description:
            'Locale for month and weekday names, e.g. `"en-IN"` or `"hi-IN"`. Defaults to the user\'s locale. While server rendering and hydrating, the names are in `"en-US"` until the calendar has mounted, so set it when you render on the server to avoid the switch.',
        },
        {
          name: "showOutsideDays",
          type: "boolean",
          default: "true",
          description:
            "Shows the days of the previous and next months in the first and last weeks.",
        },
        {
          name: "label",
          type: "string",
          description:
            "Accessible name of the grid, read before the month (“Delivery date October 2026”).",
        },
        {
          name: "name",
          type: "string",
          description:
            'Adds hidden inputs with `"YYYY-MM-DD"` values: `name`, or `${name}Start` and `${name}End` in range mode.',
        },
        {
          name: "autoFocus",
          type: "boolean",
          default: "false",
          description: "Focuses the selected day (else today) when the calendar mounts.",
        },
        {
          name: "previousMonthLabel",
          type: "string",
          default: '"Previous month"',
          description: "Accessible name of the previous month button.",
        },
        {
          name: "nextMonthLabel",
          type: "string",
          default: '"Next month"',
          description: "Accessible name of the next month button.",
        },
        { name: "className", type: "string", description: "Class for the root element." },
      ],
    },
  ],
  keyboard: [
    { keys: ["←", "→"], description: "Moves to the previous or next day." },
    { keys: ["↑", "↓"], description: "Moves to the same day in the previous or next week." },
    { keys: ["Home", "End"], description: "Moves to the first or last day of the week." },
    {
      keys: ["Page Up", "Page Down"],
      description: "Moves to the same day in the previous or next month.",
    },
    {
      keys: ["Shift + Page Up", "Shift + Page Down"],
      description: "Moves to the same day in the previous or next year.",
    },
    { keys: ["Enter", "Space"], description: "Picks the focused day." },
    {
      keys: ["Tab"],
      description: "Moves between the month buttons and the grid, which is a single Tab stop.",
    },
  ],
  accessibility: [
    'Follows the WAI-ARIA date picker grid pattern: a `role="grid"` table with weekday column headers, named by `label` and the month, and one Tab stop (roving `tabindex`) for the focused day.',
    'Each day is a button named by its full date, e.g. “Tuesday, 6 October 2026”. Today has `aria-current="date"`, selected days sit in cells with `aria-selected`, and a range grid has `aria-multiselectable`.',
    "Days outside `min`/`max` or rejected by `isDateDisabled` have `aria-disabled` and can't be picked. The keyboard stops at `min` and `max`, and the month buttons are marked disabled there but stay focusable.",
    "The month heading is a polite live region, so screen readers announce “November 2026” when the month changes. Moving focus past the first or last day of the month changes the month too.",
    "Selection doesn't rely on color alone: the picked day is filled, today is outlined, disabled days are struck through, and system colors are used in forced-colors mode.",
  ],
};
