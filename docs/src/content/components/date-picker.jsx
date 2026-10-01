import { DatePicker } from "@codecps/ui";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Availability from "../../examples/date-picker/Availability.jsx";
import availabilityCode from "../../examples/date-picker/Availability.jsx?raw";
import Basic from "../../examples/date-picker/Basic.jsx";
import basicCode from "../../examples/date-picker/Basic.jsx?raw";
import FormSubmit from "../../examples/date-picker/FormSubmit.jsx";
import formSubmitCode from "../../examples/date-picker/FormSubmit.jsx?raw";
import Formatting from "../../examples/date-picker/Formatting.jsx";
import formattingCode from "../../examples/date-picker/Formatting.jsx?raw";
import ReportPeriod from "../../examples/date-picker/ReportPeriod.jsx";
import reportPeriodCode from "../../examples/date-picker/ReportPeriod.jsx?raw";
import States from "../../examples/date-picker/States.jsx";
import statesCode from "../../examples/date-picker/States.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const modes = ["single", "range"];
const sizes = ["sm", "md", "lg"];
const errorMessage = "Choose a delivery date.";
const thumbnailDate = new Date(2026, 9, 6);

const thumbnailWeek = (days, selected) =>
  days.map((day) => (
    <span
      key={day}
      style={{
        lineHeight: "16px",
        borderRadius: 3,
        ...(day === selected && {
          backgroundColor: "var(--cps-color-primary)",
          color: "var(--cps-color-on-primary)",
          fontWeight: 600,
        }),
      }}
    >
      {day}
    </span>
  ));

// The real field (closed), over a static look-alike of the open popup.
function DatePickerThumbnail() {
  return (
    <div style={{ display: "grid", gap: 6, width: "100%", maxWidth: 200 }}>
      <DatePicker size="sm" label="Delivery date" locale="en-IN" defaultValue={thumbnailDate} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          padding: 8,
          border: "1px solid var(--cps-color-border)",
          borderRadius: "var(--cps-radius-lg)",
          backgroundColor: "var(--cps-color-surface)",
          boxShadow: "var(--cps-shadow-md)",
          color: "var(--cps-color-text)",
          fontFamily: "var(--cps-font-sans)",
          fontSize: 9,
          textAlign: "center",
        }}
      >
        {thumbnailWeek([4, 5, 6, 7, 8, 9, 10], 6)}
        {thumbnailWeek([11, 12, 13, 14, 15, 16, 17])}
      </div>
    </div>
  );
}

export const datePickerDoc = {
  slug: "date-picker",
  name: "DatePicker",
  category: "Forms",
  summary: "Date field that opens a calendar in a popup, for a single day or a range.",
  description:
    "A form field that opens a Calendar in a popup: a delivery date at checkout, a store pickup slot, or the period of a sales report with quick presets. It shows the value in the user's locale, submits it as `YYYY-MM-DD` in local time, and supports `min`, `max`, disabled days and ranges.",
  keywords: [
    "date",
    "datepicker",
    "date input",
    "calendar",
    "date range",
    "range picker",
    "presets",
    "delivery date",
    "report",
    "form",
  ],
  imports: ["DatePicker"],
  Thumbnail: DatePickerThumbnail,
  Playground: definePlayground({
    defaults: {
      mode: "single",
      size: "md",
      label: "Delivery date",
      helperText: "",
      clearable: true,
      disabled: false,
      invalid: false,
    },
    controls: {
      mode: { type: "select", label: "Mode", options: modes },
      size: { type: "select", label: "Size", options: sizes },
      label: { type: "text", label: "Label" },
      helperText: { type: "text", label: "Helper text" },
      clearable: { type: "boolean", label: "Clearable" },
      disabled: { type: "boolean", label: "Disabled" },
      invalid: { type: "boolean", label: "Error" },
    },
    render: (values) => (
      // Room for the popup, which opens below the field.
      <div style={{ width: "100%", maxWidth: 320, minHeight: "26rem" }}>
        <DatePicker
          key={values.mode}
          mode={values.mode}
          size={values.size}
          label={values.label || undefined}
          aria-label={values.label ? undefined : "Delivery date"}
          helperText={values.helperText || undefined}
          clearable={values.clearable}
          disabled={values.disabled}
          error={values.invalid ? errorMessage : undefined}
        />
      </div>
    ),
    code: (values) =>
      withImport(
        ["DatePicker"],
        formatJsx(
          "DatePicker",
          {
            mode: values.mode,
            label: values.label || undefined,
            "aria-label": values.label ? undefined : "Delivery date",
            helperText: values.helperText || undefined,
            size: values.size,
            clearable: values.clearable ? undefined : expr("false"),
            disabled: values.disabled,
            error: values.invalid ? errorMessage : undefined,
          },
          undefined,
          { defaults: { mode: "single", size: "md" } },
        ),
      ),
  }),
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        "Click the field, or focus it and press Enter: the calendar opens on today. Picking a day closes it and shows the date, e.g. “6 Oct 2026”.",
      Component: Basic,
      code: basicCode,
      minHeight: "28rem",
    },
    {
      id: "report-period",
      title: "Report period with presets",
      description:
        '`mode="range"` picks a start and an end day; `onValueChange` only reports complete ranges. `presets` adds shortcuts such as “Last 7 days” next to the calendar.',
      Component: ReportPeriod,
      code: reportPeriodCode,
      minHeight: "30rem",
    },
    {
      id: "availability",
      title: "Available dates",
      description:
        "`min`, `max` and `isDateDisabled` are passed to the calendar: pickups from tomorrow for 30 days, never on Sundays or national holidays.",
      Component: Availability,
      code: availabilityCode,
      minHeight: "28rem",
    },
    {
      id: "form",
      title: "In a form",
      description:
        "With `name`, the value is submitted as `YYYY-MM-DD` in local time; a range adds `${name}Start` and `${name}End`. `required` blocks submitting an empty field, and resetting the form restores `defaultValue`.",
      Component: FormSubmit,
      code: formSubmitCode,
      minHeight: "28rem",
    },
    {
      id: "states",
      title: "Sizes and states",
      description:
        "`size` matches the other form fields. `error` replaces the helper text and marks the field invalid; a disabled field can't be opened and isn't submitted.",
      Component: States,
      code: statesCode,
    },
    {
      id: "formatting",
      title: "Formatting and locale",
      description:
        "`formatDate` controls the text in the field. `locale` formats the value and the calendar, and the text props translate the rest.",
      Component: Formatting,
      code: formattingCode,
      minHeight: "30rem",
    },
  ],
  api: [
    {
      title: "DatePicker",
      description:
        "Other props (`onFocus`, `data-*`, …) and the `ref` go to the field `<button>`; `className` and `style` go to the field wrapper. Like `Popover`, the popup is positioned with CSS below the field: it doesn't flip near the edges of the viewport, and an `overflow: hidden` ancestor can clip it.",
      props: [
        {
          name: "label",
          type: "node",
          description:
            "Visible label. The button is named by the label and the value. Without it, pass `aria-label`.",
        },
        {
          name: "helperText",
          type: "node",
          description: "Hint below the field, exposed as its accessible description.",
        },
        {
          name: "error",
          type: "node | boolean",
          description:
            "Error message; replaces `helperText` and marks the field `aria-invalid`. `true` marks it invalid without a message.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Field height and font size.",
        },
        {
          name: "placeholder",
          type: "string",
          default: '"Select date"',
          description: 'Text while empty; "Select date range" in range mode.',
        },
        {
          name: "mode",
          type: '"single" | "range"',
          default: '"single"',
          description: "Picks one day, or a start and an end day.",
        },
        {
          name: "value",
          type: "Date | { start, end }",
          description: "Current value (controlled): a `Date` or `null`, or `{ start, end }`.",
        },
        {
          name: "defaultValue",
          type: "Date | { start, end }",
          description: "Initial value (uncontrolled).",
        },
        {
          name: "onValueChange",
          type: "function(value)",
          description:
            "Called with the picked day (a local `Date` at midnight), a complete `{ start, end }` range, or `null` when cleared.",
        },
        { name: "min", type: "Date", description: "Earliest day that can be picked." },
        { name: "max", type: "Date", description: "Latest day that can be picked." },
        {
          name: "isDateDisabled",
          type: "function(date)",
          description: "Returns `true` for days that can't be picked.",
        },
        {
          name: "weekStartsOn",
          type: "number",
          default: "0",
          description: "First day of the week in the calendar, from 0 (Sunday) to 6.",
        },
        {
          name: "locale",
          type: "string",
          description:
            'Locale for the value and the calendar, e.g. `"en-IN"`. Defaults to the user\'s locale. While server rendering and hydrating, the value is shown in `"en-US"` until the field has mounted, so set it when you render on the server to avoid the switch.',
        },
        {
          name: "formatDate",
          type: "function(date)",
          description:
            "Returns the text shown for a date. Defaults to the locale's medium date (“6 Oct 2026”); a range shows “start – end”.",
        },
        {
          name: "presets",
          type: "array",
          description:
            "Shortcuts next to the calendar: `{ label, value }` objects, where `value` is a `Date` or a `{ start, end }` range.",
        },
        {
          name: "presetsLabel",
          type: "string",
          default: '"Presets"',
          description: "Accessible name of the group of presets.",
        },
        {
          name: "name",
          type: "string",
          description:
            'Adds hidden inputs with `"YYYY-MM-DD"` values: `name`, or `${name}Start` and `${name}End` in range mode.',
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          description:
            "Shows an asterisk after the label; the browser blocks submitting the form while the field is empty.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables the field; its value isn't submitted.",
        },
        {
          name: "clearable",
          type: "boolean",
          default: "true",
          description: "Shows a clear (×) button while there's a value.",
        },
        {
          name: "clearLabel",
          type: "string",
          default: '"Clear date"',
          description: "Accessible name of the clear button.",
        },
        {
          name: "closeOnSelect",
          type: "boolean",
          default: "true",
          description: "Closes the popup when a day, a complete range or a preset is picked.",
        },
        { name: "open", type: "boolean", description: "Controlled open state." },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          description: "Initial open state when uncontrolled.",
        },
        {
          name: "onOpenChange",
          type: "function(open)",
          description: "Called when the popup opens or closes.",
        },
        {
          name: "align",
          type: '"start" | "end"',
          default: '"start"',
          description: "Edge of the field the popup lines up with.",
        },
        {
          name: "showOutsideDays",
          type: "boolean",
          default: "true",
          description: "Shows the neighbouring months' days in the calendar.",
        },
        {
          name: "previousMonthLabel",
          type: "string",
          default: '"Previous month"',
          description: "Accessible name of the calendar's previous month button.",
        },
        {
          name: "nextMonthLabel",
          type: "string",
          default: '"Next month"',
          description: "Accessible name of the calendar's next month button.",
        },
        {
          name: "id",
          type: "string",
          description: "Id of the field button. Defaults to a generated id.",
        },
        {
          name: "className",
          type: "string",
          description: "Class for the field wrapper. `style` goes there too.",
        },
      ],
    },
  ],
  keyboard: [
    { keys: ["Enter", "Space"], description: "On the field: opens or closes the calendar." },
    {
      keys: ["←", "→", "↑", "↓"],
      description: "In the calendar: moves by a day or a week, changing the month when needed.",
    },
    {
      keys: ["Page Up", "Page Down"],
      description: "Moves by a month; with Shift, by a year.",
    },
    { keys: ["Home", "End"], description: "Moves to the first or last day of the week." },
    {
      keys: ["Enter", "Space"],
      description: "In the calendar: picks the focused day, and closes the popup.",
    },
    { keys: ["Escape"], description: "Closes the popup and returns focus to the field." },
    {
      keys: ["Tab", "Shift + Tab"],
      description:
        "Moves through the presets, the month buttons and the calendar. Moving focus out of the popup closes it.",
    },
  ],
  accessibility: [
    'The field is a `<button>` with `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`, named by the label followed by the value (“Delivery date 6 Oct 2026”). `helperText` or `error` is its description, and `error` sets `aria-invalid`.',
    'The popup is a non-modal `role="dialog"` named by the label. When it opens, focus moves to the selected day, else today; when it closes with focus inside (a day was picked, or Escape), focus returns to the field.',
    "The calendar inside follows the WAI-ARIA date picker grid pattern: see Calendar for the grid, the day names and the keyboard support.",
    "It renders right after the field, so the Tab order runs from the field through the popup to the rest of the page. A click outside closes it without moving focus.",
    "The clear button is a real button named “Clear date”; after clearing, focus stays on the field.",
  ],
};
