import { Switch } from "@codecps/ui";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/switch/Basic.jsx";
import basicCode from "../../examples/switch/Basic.jsx?raw";
import Controlled from "../../examples/switch/Controlled.jsx";
import controlledCode from "../../examples/switch/Controlled.jsx?raw";
import Description from "../../examples/switch/Description.jsx";
import descriptionCode from "../../examples/switch/Description.jsx?raw";
import Disabled from "../../examples/switch/Disabled.jsx";
import disabledCode from "../../examples/switch/Disabled.jsx?raw";
import Sizes from "../../examples/switch/Sizes.jsx";
import sizesCode from "../../examples/switch/Sizes.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const sizes = ["sm", "md"];

function SwitchThumbnail() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Switch label="Auto-deploy" defaultChecked />
      <Switch label="Preview comments" />
    </div>
  );
}

export const switchDoc = {
  slug: "switch",
  name: "Switch",
  category: "Forms",
  summary: "Turns a single setting on or off, with immediate effect.",
  description:
    'A toggle for settings that apply right away, like auto-deploy or email notifications. It is a native checkbox with `role="switch"`, so it works with forms and the keyboard out of the box.',
  keywords: ["toggle", "on off", "checkbox", "setting", "preference", "form"],
  imports: ["Switch"],
  Thumbnail: SwitchThumbnail,
  Playground: definePlayground({
    defaults: {
      size: "md",
      label: "Auto-deploy",
      description: "Deploy every push to the main branch.",
      disabled: false,
    },
    controls: {
      size: { type: "select", label: "Size", options: sizes },
      label: { type: "text", label: "Label" },
      description: { type: "text", label: "Description" },
      disabled: { type: "boolean", label: "Disabled" },
    },
    render: (values) => (
      <Switch
        size={values.size}
        label={values.label || undefined}
        aria-label={values.label ? undefined : "Auto-deploy"}
        description={values.description || undefined}
        disabled={values.disabled}
        defaultChecked
      />
    ),
    code: (values) =>
      withImport(
        ["Switch"],
        formatJsx(
          "Switch",
          {
            label: values.label || undefined,
            "aria-label": values.label ? undefined : "Auto-deploy",
            description: values.description || undefined,
            defaultChecked: true,
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
      description: "Click the switch or its label, or focus it and press Space.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "description",
      title: "With a description",
      description: "`description` explains what the setting does and is read out as a hint.",
      Component: Description,
      code: descriptionCode,
    },
    {
      id: "controlled",
      title: "Controlled",
      description:
        "Pass `checked` and `onCheckedChange` to keep the state in your component and react to it.",
      Component: Controlled,
      code: controlledCode,
    },
    { id: "sizes", title: "Sizes", Component: Sizes, code: sizesCode },
    {
      id: "disabled",
      title: "Disabled",
      description: "A disabled switch keeps showing its state but can't be changed.",
      Component: Disabled,
      code: disabledCode,
    },
  ],
  api: [
    {
      title: "Switch",
      description:
        'Also accepts native `<input>` attributes (`name`, `value`, `onChange`, …). The `ref` points to the `<input type="checkbox">`; `className` and `style` go to the wrapper.',
      props: [
        {
          name: "label",
          type: "node",
          description:
            "Visible label, linked to the switch: clicking it toggles the switch. Without it, pass `aria-label`.",
        },
        {
          name: "description",
          type: "node",
          description: "Hint below the label, exposed as the switch's accessible description.",
        },
        { name: "checked", type: "boolean", description: "Whether the switch is on (controlled)." },
        {
          name: "defaultChecked",
          type: "boolean",
          default: "false",
          description: "Initial state (uncontrolled).",
        },
        {
          name: "onCheckedChange",
          type: "function(checked)",
          description: "Called with the new state, after the native `onChange`.",
        },
        {
          name: "size",
          type: '"sm" | "md"',
          default: '"md"',
          description: "Size of the track and the label.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Prevents toggling.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          description:
            "Native `required`: the form only submits while the switch is on. Adds an asterisk after the label.",
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
            "Class for the wrapper (switch, label and description). `style` goes there too.",
        },
      ],
    },
  ],
  keyboard: [
    { keys: ["Space"], description: "Toggles the switch." },
    { keys: ["Tab"], description: "Moves focus to the next focusable element." },
  ],
  accessibility: [
    'Follows the WAI-ARIA switch pattern with a native `<input type="checkbox" role="switch">`: screen readers announce a switch that is on or off, and Space toggles it.',
    "The `label` is linked with `htmlFor`, so clicking it toggles the switch. Without a visible label, pass `aria-label`.",
    "`description` is connected with `aria-describedby`.",
    "It stays a real checkbox: it submits with forms (`name`, `value`) and supports `required`.",
    "Use a switch for settings that apply immediately. For choices that are submitted with a form, like accepting terms, a checkbox is clearer.",
    "The thumb doesn't slide when the user prefers reduced motion, and the track and thumb use system colors in forced-colors mode.",
  ],
};
