import { Radio, RadioGroup } from "@codecps/ui";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/radio-group/Basic.jsx";
import basicCode from "../../examples/radio-group/Basic.jsx?raw";
import Descriptions from "../../examples/radio-group/Descriptions.jsx";
import descriptionsCode from "../../examples/radio-group/Descriptions.jsx?raw";
import Disabled from "../../examples/radio-group/Disabled.jsx";
import disabledCode from "../../examples/radio-group/Disabled.jsx?raw";
import Horizontal from "../../examples/radio-group/Horizontal.jsx";
import horizontalCode from "../../examples/radio-group/Horizontal.jsx?raw";
import Validation from "../../examples/radio-group/Validation.jsx";
import validationCode from "../../examples/radio-group/Validation.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const orientations = ["vertical", "horizontal"];
const sizes = ["sm", "md"];
const regions = [
  { value: "mumbai", label: "Mumbai" },
  { value: "hyderabad", label: "Hyderabad" },
  { value: "singapore", label: "Singapore" },
];

function RadioGroupThumbnail() {
  return (
    <RadioGroup label="Plan" defaultValue="pro" size="sm">
      <Radio value="starter" label="Starter" />
      <Radio value="pro" label="Pro" />
      <Radio value="enterprise" label="Enterprise" />
    </RadioGroup>
  );
}

function radioGroupCode(values) {
  // `formatJsx` writes a self-closing tag; reopen it so the radios can go inside.
  const openingTag = formatJsx(
    "RadioGroup",
    {
      label: values.label || undefined,
      "aria-label": values.label ? undefined : "Deployment region",
      description: values.description || undefined,
      error: values.error || undefined,
      defaultValue: "mumbai",
      orientation: values.orientation,
      size: values.size,
      required: values.required,
      disabled: values.disabled,
    },
    undefined,
    { defaults: { orientation: "vertical", size: "md" } },
  ).replace(/ ?\/>$/, ">");
  const radios = regions.map((region) => `  ${formatJsx("Radio", region)}`);
  return withImport(["RadioGroup", "Radio"], [openingTag, ...radios, "</RadioGroup>"].join("\n"));
}

export const radioGroupDoc = {
  slug: "radio-group",
  name: "RadioGroup",
  category: "Forms",
  summary: "Lets people choose exactly one option from a short list.",
  description:
    "A set of options where only one can be selected, like a deployment region or a billing plan. Put `Radio` items inside a `RadioGroup`: the group shows the label, hint and error message and manages the selected `value`. Native radios underneath provide keyboard support and form submission.",
  keywords: ["radio", "radio button", "option", "choice", "single select", "fieldset", "form"],
  imports: ["RadioGroup", "Radio"],
  Thumbnail: RadioGroupThumbnail,
  Playground: definePlayground({
    defaults: {
      orientation: "vertical",
      size: "md",
      label: "Deployment region",
      description: "",
      error: "",
      required: false,
      disabled: false,
    },
    controls: {
      orientation: { type: "select", label: "Orientation", options: orientations },
      size: { type: "select", label: "Size", options: sizes },
      label: { type: "text", label: "Label" },
      description: { type: "text", label: "Description" },
      error: { type: "text", label: "Error" },
      required: { type: "boolean", label: "Required" },
      disabled: { type: "boolean", label: "Disabled" },
    },
    render: (values) => (
      <RadioGroup
        label={values.label || undefined}
        aria-label={values.label ? undefined : "Deployment region"}
        description={values.description || undefined}
        error={values.error || undefined}
        defaultValue="mumbai"
        orientation={values.orientation}
        size={values.size}
        required={values.required}
        disabled={values.disabled}
      >
        {regions.map((region) => (
          <Radio key={region.value} value={region.value} label={region.label} />
        ))}
      </RadioGroup>
    ),
    code: radioGroupCode,
  }),
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        "Click an option, or Tab into the group and use the arrow keys to move the selection.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "descriptions",
      title: "With descriptions",
      description:
        "`description` on the group adds a hint under its label; on a `Radio`, it explains that option. Both are read out by screen readers.",
      Component: Descriptions,
      code: descriptionsCode,
    },
    {
      id: "horizontal",
      title: "Horizontal",
      description:
        'For a few short options, `orientation="horizontal"` puts them in a row that wraps on narrow screens. `size="sm"` fits dense layouts.',
      Component: Horizontal,
      code: horizontalCode,
    },
    {
      id: "validation",
      title: "Validation",
      description:
        "A controlled group with `value` and `onValueChange`. Submit without choosing to see the `error`. The form uses `noValidate`, so it shows this message instead of the browser's.",
      Component: Validation,
      code: validationCode,
    },
    {
      id: "disabled",
      title: "Disabled",
      description:
        "Disable a single `Radio`, or the whole group with `disabled` on `RadioGroup`. The arrow keys skip disabled radios.",
      Component: Disabled,
      code: disabledCode,
    },
  ],
  api: [
    {
      title: "RadioGroup",
      description:
        'Renders a `<fieldset>` with `role="radiogroup"`. Other props (`id`, `aria-label`, `style`, …) go to the fieldset, and so does the `ref`.',
      props: [
        {
          name: "label",
          type: "node",
          description: "Visible label, rendered as the `<legend>`. It names the group.",
        },
        {
          name: "description",
          type: "node",
          description: "Hint below the label, exposed as the group's accessible description.",
        },
        {
          name: "error",
          type: "node",
          description:
            "Error message below the options. Highlights the radios and sets `aria-invalid`. Pass `true` to mark the group invalid without a message.",
        },
        { name: "value", type: "string", description: "Selected value (controlled)." },
        {
          name: "defaultValue",
          type: "string",
          description: "Initially selected value (uncontrolled). Nothing is selected by default.",
        },
        {
          name: "onValueChange",
          type: "function(value)",
          description: "Called with the `value` of the newly selected radio.",
        },
        {
          name: "name",
          type: "string",
          description:
            "Form field name shared by every radio. Defaults to a unique generated name.",
        },
        {
          name: "orientation",
          type: '"vertical" | "horizontal"',
          default: '"vertical"',
          description: "Stacks the options, or lays them out in a row that wraps.",
        },
        {
          name: "size",
          type: '"sm" | "md"',
          default: '"md"',
          description: "Size of the radios and their labels.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          description:
            "Native `required` on every radio, `aria-required` on the group and an asterisk after the label.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables every radio in the group.",
        },
        { name: "children", type: "node", description: "The `Radio` items." },
      ],
    },
    {
      title: "Radio",
      description:
        'Must be rendered inside a `RadioGroup`. Other props (`onChange`, `autoFocus`, …) and the `ref` go to the `<input type="radio">`.',
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          description: "The group's value while this radio is selected.",
        },
        {
          name: "label",
          type: "node",
          description:
            "Visible label, linked to the radio: clicking it selects the radio. Without it, pass `aria-label`.",
        },
        {
          name: "description",
          type: "node",
          description: "Hint below the label, exposed as the radio's accessible description.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Prevents selecting this radio.",
        },
        {
          name: "id",
          type: "string",
          description: "Id of the `<input>`. Defaults to a generated id.",
        },
        {
          name: "className",
          type: "string",
          description:
            "Class for the radio's wrapper (circle, label and description). `style` goes there too.",
        },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["Tab", "Shift + Tab"],
      description:
        "Moves focus into or out of the group. Focus lands on the selected radio, or on the first (or last) radio when none is selected.",
    },
    {
      keys: ["↓", "→"],
      description: "Selects the next radio, skipping disabled ones and wrapping around.",
    },
    {
      keys: ["↑", "←"],
      description: "Selects the previous radio, skipping disabled ones and wrapping around.",
    },
    { keys: ["Space"], description: "Selects the focused radio if it isn't selected yet." },
  ],
  accessibility: [
    "Follows the WAI-ARIA radio group pattern with native radios that share one `name`: the group is a single Tab stop and the browser moves the selection with the arrow keys.",
    '`RadioGroup` renders a `<fieldset>` with `role="radiogroup"`, labelled by its `<legend>` through `aria-labelledby`. Without a visible `label`, pass `aria-label`.',
    "`description` and `error` are connected to the group with `aria-describedby`, and `error` sets `aria-invalid`. A radio's own `description` is connected to that radio.",
    "`required` sets the native attribute on every radio and `aria-required` on the group. The asterisk is visual only and hidden from screen readers.",
    "The real radio input sits on top of the custom circle, so clicks, focus and screen readers all use the native control. It shows a focus ring when focused from the keyboard.",
    "Radios with the same `name` in one form act as one group. If you pass your own `name`, keep it unique within the form.",
  ],
};
