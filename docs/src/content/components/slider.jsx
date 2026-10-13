import { Slider } from "shelf-ui-react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/slider/Basic.jsx";
import basicCode from "../../examples/slider/Basic.jsx?raw";
import Controlled from "../../examples/slider/Controlled.jsx";
import controlledCode from "../../examples/slider/Controlled.jsx?raw";
import Disabled from "../../examples/slider/Disabled.jsx";
import disabledCode from "../../examples/slider/Disabled.jsx?raw";
import FormatValue from "../../examples/slider/FormatValue.jsx";
import formatValueCode from "../../examples/slider/FormatValue.jsx?raw";
import Range from "../../examples/slider/Range.jsx";
import rangeCode from "../../examples/slider/Range.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const sizes = ["sm", "md"];

function SliderThumbnail() {
  return (
    <div style={{ width: "100%", maxWidth: 220 }}>
      <Slider label="Volume" defaultValue={60} formatValue={(value) => `${value}%`} />
    </div>
  );
}

export const sliderDoc = {
  slug: "slider",
  name: "Slider",
  category: "Forms",
  summary: "Picks a number from a range by dragging a thumb or using the arrow keys.",
  description:
    'Selects a number within a range, like a volume, a budget or a storage limit. It renders a native `<input type="range">` and shows the current value next to the label, formatted the way you want with `formatValue`.',
  keywords: ["range", "input range", "volume", "price", "number", "track", "form"],
  imports: ["Slider"],
  Thumbnail: SliderThumbnail,
  Playground: definePlayground({
    defaults: {
      size: "md",
      label: "Volume",
      helperText: "",
      showValue: true,
      disabled: false,
    },
    controls: {
      size: { type: "select", label: "Size", options: sizes },
      label: { type: "text", label: "Label" },
      helperText: { type: "text", label: "Helper text" },
      showValue: { type: "boolean", label: "Show value" },
      disabled: { type: "boolean", label: "Disabled" },
    },
    render: (values) => (
      <div style={{ width: "100%", maxWidth: 360 }}>
        <Slider
          size={values.size}
          label={values.label || undefined}
          aria-label={values.label ? undefined : "Volume"}
          helperText={values.helperText || undefined}
          showValue={values.showValue}
          disabled={values.disabled}
          defaultValue={40}
        />
      </div>
    ),
    code: (values) =>
      withImport(
        ["Slider"],
        formatJsx(
          "Slider",
          {
            label: values.label || undefined,
            "aria-label": values.label ? undefined : "Volume",
            defaultValue: 40,
            helperText: values.helperText || undefined,
            showValue: values.showValue ? undefined : expr("false"),
            size: values.size,
            disabled: values.disabled,
          },
          undefined,
          { defaults: { size: "md" } },
        ),
      ),
  }),
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        "Drag the thumb, or focus it and use the arrow keys, Page Up / Page Down, Home and End.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "format-value",
      title: "Formatted value",
      description:
        "`formatValue` turns the number into text for the visible value and for screen readers (`aria-valuetext`), here as rupees.",
      Component: FormatValue,
      code: formatValueCode,
    },
    {
      id: "range",
      title: "Min, max and step",
      description:
        "`min`, `max` and `step` define the range. Without a `defaultValue`, the slider starts at `min`.",
      Component: Range,
      code: rangeCode,
    },
    {
      id: "controlled",
      title: "Controlled",
      description:
        "Pass `value` and `onValueChange` to use the number elsewhere, like this price estimate. `onValueChange` receives a number.",
      Component: Controlled,
      code: controlledCode,
    },
    { id: "disabled", title: "Disabled", Component: Disabled, code: disabledCode },
  ],
  api: [
    {
      title: "Slider",
      description:
        'Also accepts native `<input>` attributes (`name`, `onChange`, …). The `ref` points to the `<input type="range">`; `className` and `style` go to the field wrapper.',
      props: [
        {
          name: "label",
          type: "node",
          description: "Visible label, linked to the slider. Without it, pass `aria-label`.",
        },
        {
          name: "helperText",
          type: "node",
          description: "Hint below the slider, exposed as its accessible description.",
        },
        { name: "value", type: "number", description: "Current value (controlled)." },
        {
          name: "defaultValue",
          type: "number",
          default: "min",
          description: "Initial value (uncontrolled).",
        },
        {
          name: "onValueChange",
          type: "function(value)",
          description: "Called with the new value as a number, after the native `onChange`.",
        },
        { name: "min", type: "number", default: "0", description: "Smallest value." },
        { name: "max", type: "number", default: "100", description: "Largest value." },
        {
          name: "step",
          type: "number",
          default: "1",
          description:
            "Increment between values. Values outside the range or between steps are clamped and rounded, as the browser does.",
        },
        {
          name: "showValue",
          type: "boolean",
          default: "true",
          description: "Shows the current value next to the label.",
        },
        {
          name: "formatValue",
          type: "function(value)",
          description:
            'Returns the text for a value, e.g. `(value) => value + "%"`. Used for the visible value and for `aria-valuetext`.',
        },
        {
          name: "size",
          type: '"sm" | "md"',
          default: '"md"',
          description: "Height of the track and size of the thumb.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Prevents changes.",
        },
        { name: "name", type: "string", description: "Form field name." },
        {
          name: "id",
          type: "string",
          description: "Id of the `<input>`. Defaults to a generated id.",
        },
        {
          name: "className",
          type: "string",
          description:
            "Class for the field wrapper (label, value, slider and helper text). `style` goes there too.",
        },
      ],
    },
  ],
  keyboard: [
    { keys: ["→", "↑"], description: "Increases the value by one `step`." },
    { keys: ["←", "↓"], description: "Decreases the value by one `step`." },
    {
      keys: ["Page Up", "Page Down"],
      description:
        "Increases or decreases the value by a larger amount, typically a tenth of the range.",
    },
    { keys: ["Home", "End"], description: "Sets the value to `min` or `max`." },
  ],
  accessibility: [
    'Follows the WAI-ARIA slider pattern with a native `<input type="range">`: browsers provide the keyboard support, and screen readers announce the value, minimum and maximum.',
    "`label` is linked with `htmlFor` and `helperText` is connected with `aria-describedby`. Without a visible label, pass `aria-label`.",
    "`formatValue` also sets `aria-valuetext`, so screen readers say “₹25,000” or “100 GB” instead of a bare number.",
    "The value shown next to the label is hidden from screen readers (`aria-hidden`), because the slider already announces its value.",
    "The thumb shows a focus ring when focused from the keyboard, and the track and thumb use system colors in forced-colors mode.",
  ],
};
