import { NumberInput } from "shelf-ui-react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/number-input/Basic.jsx";
import basicCode from "../../examples/number-input/Basic.jsx?raw";
import CartQuantity from "../../examples/number-input/CartQuantity.jsx";
import cartQuantityCode from "../../examples/number-input/CartQuantity.jsx?raw";
import Form from "../../examples/number-input/Form.jsx";
import formCode from "../../examples/number-input/Form.jsx?raw";
import FormatValue from "../../examples/number-input/FormatValue.jsx";
import formatValueCode from "../../examples/number-input/FormatValue.jsx?raw";
import States from "../../examples/number-input/States.jsx";
import statesCode from "../../examples/number-input/States.jsx?raw";
import Validation from "../../examples/number-input/Validation.jsx";
import validationCode from "../../examples/number-input/Validation.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const sizes = ["sm", "md", "lg"];
const variants = ["default", "compact"];

function NumberInputThumbnail() {
  return (
    <div style={{ display: "grid", justifyItems: "start", gap: 12, width: "100%", maxWidth: 200 }}>
      <NumberInput label="Quantity" min={1} max={10} defaultValue={2} size="sm" />
      <NumberInput
        aria-label="Cart quantity"
        variant="compact"
        size="sm"
        min={1}
        defaultValue={1}
      />
    </div>
  );
}

export const numberInputDoc = {
  slug: "number-input",
  name: "NumberInput",
  category: "Forms",
  summary: "Number field with − and + buttons, arrow-key stepping and a min / max range.",
  description:
    "A number field for quantities, prices and limits, following the WAI-ARIA spinbutton pattern. People can type a number or step it with the − / + buttons (press and hold to repeat), the arrow keys and Page Up / Page Down. Values stay within `min` and `max`, decimals are rounded without floating-point noise, and the mouse wheel never changes the value by accident. The `compact` variant is the small − 1 + pill used in carts.",
  keywords: [
    "number",
    "numeric",
    "quantity",
    "stepper",
    "spinbutton",
    "counter",
    "increment",
    "decrement",
    "cart",
    "price",
    "form",
  ],
  imports: ["NumberInput"],
  Thumbnail: NumberInputThumbnail,
  Playground: definePlayground({
    defaults: {
      variant: "default",
      size: "md",
      label: "Quantity",
      helperText: "Maximum 10 per order.",
      error: "",
      readOnly: false,
      disabled: false,
    },
    controls: {
      variant: { type: "select", label: "Variant", options: variants },
      size: { type: "select", label: "Size", options: sizes },
      label: { type: "text", label: "Label" },
      helperText: { type: "text", label: "Helper text" },
      error: { type: "text", label: "Error" },
      readOnly: { type: "boolean", label: "Read-only" },
      disabled: { type: "boolean", label: "Disabled" },
    },
    render: (values) => (
      <div style={{ width: "100%", maxWidth: 320 }}>
        <NumberInput
          variant={values.variant}
          size={values.size}
          label={values.label || undefined}
          aria-label={values.label ? undefined : "Quantity"}
          helperText={values.helperText || undefined}
          error={values.error || undefined}
          readOnly={values.readOnly}
          disabled={values.disabled}
          min={1}
          max={10}
          defaultValue={1}
        />
      </div>
    ),
    code: (values) =>
      withImport(
        ["NumberInput"],
        formatJsx(
          "NumberInput",
          {
            label: values.label || undefined,
            "aria-label": values.label ? undefined : "Quantity",
            min: 1,
            max: 10,
            defaultValue: 1,
            variant: values.variant,
            size: values.size,
            helperText: values.helperText || undefined,
            error: values.error || undefined,
            readOnly: values.readOnly,
            disabled: values.disabled,
          },
          undefined,
          { defaults: { size: "md", variant: "default" } },
        ),
      ),
  }),
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        "Type a number, use the − and + buttons, or focus the field and press ↑ / ↓. The buttons are disabled at `min` and `max`.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "cart-quantity",
      title: "Cart quantity",
      description:
        '`variant="compact"` is a small pill for cart rows. Without a visible label, name each field with `aria-label`, and make the button labels specific. `allowEmpty={false}` puts the quantity back if someone clears the field.',
      Component: CartQuantity,
      code: cartQuantityCode,
      responsive: true,
    },
    {
      id: "format-value",
      title: "Prices and percentages",
      description:
        "`formatValue` shows “₹2,499” while the field isn't focused and sets `aria-valuetext`; the plain number is shown for editing. A decimal `step` (or `precision`) allows decimals, rounded without floating-point noise.",
      Component: FormatValue,
      code: formatValueCode,
    },
    {
      id: "validation",
      title: "Validation",
      description:
        "By default a value typed outside the range is brought back to `min` or `max` when the field loses focus. With `clampOnBlur={false}` it stays, the field is marked invalid, and you can explain why with `error`.",
      Component: Validation,
      code: validationCode,
    },
    {
      id: "states",
      title: "Sizes and states",
      Component: States,
      code: statesCode,
    },
    {
      id: "form",
      title: "In a form",
      description:
        "With `name`, the number itself (not the formatted text) is submitted through a hidden input. Resetting the form restores `defaultValue`.",
      Component: Form,
      code: formCode,
    },
  ],
  api: [
    {
      title: "NumberInput",
      description:
        "Also accepts native `<input>` attributes (`placeholder`, `autoFocus`, `onBlur`, …). The `ref` points to the `<input>`; `className` and `style` go to the field wrapper.",
      props: [
        {
          name: "label",
          type: "node",
          description: "Visible label, linked to the input. Without it, pass `aria-label`.",
        },
        {
          name: "helperText",
          type: "node",
          description: "Hint below the field, exposed as the input's accessible description.",
        },
        {
          name: "error",
          type: "node",
          description:
            "Error message. Replaces `helperText`, highlights the field and sets `aria-invalid`. Pass `true` to mark the field invalid without a message.",
        },
        {
          name: "value",
          type: "number",
          description: "Current value (controlled). `null` means empty.",
        },
        {
          name: "defaultValue",
          type: "number",
          default: "null",
          description: "Initial value (uncontrolled).",
        },
        {
          name: "onValueChange",
          type: "function(value)",
          description:
            "Called with the new number, or `null` when the field is emptied. Also runs while typing, with each complete number.",
        },
        {
          name: "min",
          type: "number",
          description:
            "Smallest allowed value. With 0 or more, phones show a number keypad; without a `min` (or with a negative one) they keep the full keyboard, because iOS keypads have no minus key.",
        },
        { name: "max", type: "number", description: "Largest allowed value." },
        {
          name: "step",
          type: "number",
          default: "1",
          description: "Amount added or removed by the buttons and the arrow keys.",
        },
        {
          name: "largeStep",
          type: "number",
          default: "10 × step",
          description: "Amount added or removed by Page Up and Page Down.",
        },
        {
          name: "precision",
          type: "number",
          default: "decimals of step",
          description:
            "Decimal places kept. With 0, a decimal point can't be typed. Without a negative `min`, a minus sign can't be typed either.",
        },
        {
          name: "formatValue",
          type: "function(value)",
          description:
            "Returns the display text for a value, e.g. a price in rupees. Shown while the field isn't focused and used for `aria-valuetext`.",
        },
        {
          name: "clampOnBlur",
          type: "boolean",
          default: "true",
          description:
            "Brings a typed value into the range (and rounds it to `precision`) when the field loses focus or Enter is pressed.",
        },
        {
          name: "allowEmpty",
          type: "boolean",
          default: "true",
          description:
            "Whether the field can be left empty. With `false`, clearing the text doesn't change the value, and leaving the field shows it again.",
        },
        {
          name: "variant",
          type: '"default" | "compact"',
          default: '"default"',
          description:
            "`default` fills the width with the buttons at the end; `compact` is a small − value + pill.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Control height and font size.",
        },
        {
          name: "decrementLabel",
          type: "string",
          default: '"Decrease"',
          description: "Accessible name of the − button.",
        },
        {
          name: "incrementLabel",
          type: "string",
          default: '"Increase"',
          description: "Accessible name of the + button.",
        },
        {
          name: "name",
          type: "string",
          description:
            "Form field name. The number is submitted through a hidden input; resetting the form restores `defaultValue`.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          description: "Native `required`, plus an asterisk after the label.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Prevents interaction.",
        },
        {
          name: "readOnly",
          type: "boolean",
          default: "false",
          description: "Shows the value without allowing changes; the buttons are disabled.",
        },
        {
          name: "id",
          type: "string",
          description: "Id of the `<input>`. Defaults to a generated id.",
        },
        {
          name: "inputClassName",
          type: "string",
          description: "Class name for the `<input>` element itself.",
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
    { keys: ["↑", "↓"], description: "Increases or decreases the value by one `step`." },
    {
      keys: ["Page Up", "Page Down"],
      description: "Increases or decreases the value by `largeStep`.",
    },
    {
      keys: ["Home", "End"],
      description:
        "Sets the value to `min` or `max`, when they're set. Otherwise they move the caret.",
    },
    {
      keys: ["Enter"],
      description:
        "Commits the typed value: rounds it and brings it into the range. The form still submits.",
    },
  ],
  accessibility: [
    'Follows the WAI-ARIA spinbutton pattern: the input has `role="spinbutton"` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, and `formatValue` also sets `aria-valuetext`, so screen readers say “₹2,499” instead of a bare number.',
    "The − and + buttons are left out of the Tab order (`tabIndex={-1}`), as the pattern recommends: the arrow keys do the same from the input. They keep an accessible name for screen reader and voice control users, and clicking them doesn't move focus.",
    "`label` is linked with `htmlFor`, and `helperText` or `error` is connected with `aria-describedby`. A value outside `min` and `max` sets `aria-invalid`.",
    'The field is a text input rather than `type="number"`, so scrolling the page over it never changes the value. With a `min` of 0 or more it sets `inputMode` numeric or decimal and phones show a number keypad; a field that allows negative numbers keeps the full keyboard, since iOS keypads have no minus key.',
    "The focus ring and the disabled buttons stay visible in forced-colors mode.",
  ],
};
