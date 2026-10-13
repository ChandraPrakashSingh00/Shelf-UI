import { Checkbox } from "shelf-ui-react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/checkbox/Basic.jsx";
import basicCode from "../../examples/checkbox/Basic.jsx?raw";
import Notifications from "../../examples/checkbox/Notifications.jsx";
import notificationsCode from "../../examples/checkbox/Notifications.jsx?raw";
import SelectAll from "../../examples/checkbox/SelectAll.jsx";
import selectAllCode from "../../examples/checkbox/SelectAll.jsx?raw";
import States from "../../examples/checkbox/States.jsx";
import statesCode from "../../examples/checkbox/States.jsx?raw";
import Validation from "../../examples/checkbox/Validation.jsx";
import validationCode from "../../examples/checkbox/Validation.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const sizes = ["sm", "md"];

function CheckboxThumbnail() {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <Checkbox label="All environments" indeterminate />
      <div style={{ display: "grid", gap: 8, paddingInlineStart: 24 }}>
        <Checkbox label="Production" defaultChecked />
        <Checkbox label="Preview" />
      </div>
    </div>
  );
}

export const checkboxDoc = {
  slug: "checkbox",
  name: "Checkbox",
  category: "Forms",
  summary: "Turns an option on or off, with a mixed state for “select all”.",
  description:
    'A checkbox for independent choices that take effect when a form is saved, like notification settings or accepting terms. It\'s a real `<input type="checkbox">` with a custom look, and supports a description, an error message and the `indeterminate` state for “select all” checkboxes.',
  keywords: [
    "check box",
    "tick",
    "option",
    "select all",
    "indeterminate",
    "mixed",
    "partially checked",
    "terms",
    "consent",
    "form",
  ],
  imports: ["Checkbox"],
  Thumbnail: CheckboxThumbnail,
  Playground: definePlayground({
    defaults: {
      size: "md",
      label: "Email me when a deployment fails",
      description: "Sent to every owner of the project.",
      error: "",
      indeterminate: false,
      required: false,
      disabled: false,
    },
    controls: {
      size: { type: "select", label: "Size", options: sizes },
      label: { type: "text", label: "Label" },
      description: { type: "text", label: "Description" },
      error: { type: "text", label: "Error" },
      indeterminate: { type: "boolean", label: "Indeterminate" },
      required: { type: "boolean", label: "Required" },
      disabled: { type: "boolean", label: "Disabled" },
    },
    render: (values) => (
      <Checkbox
        size={values.size}
        label={values.label || undefined}
        aria-label={values.label ? undefined : "Checkbox"}
        description={values.description || undefined}
        error={values.error || undefined}
        indeterminate={values.indeterminate}
        required={values.required}
        disabled={values.disabled}
      />
    ),
    code: (values) =>
      withImport(
        ["Checkbox"],
        formatJsx(
          "Checkbox",
          {
            size: values.size,
            label: values.label || undefined,
            "aria-label": values.label ? undefined : "Checkbox",
            description: values.description || undefined,
            error: values.error || undefined,
            indeterminate: values.indeterminate,
            required: values.required,
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
      description: "Click the box or its label, or focus it and press Space.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "notification-settings",
      title: "With descriptions",
      description:
        "`description` adds supporting text below the label, read out as the checkbox's description. Group related checkboxes in a `<fieldset>` with a `<legend>`.",
      Component: Notifications,
      code: notificationsCode,
    },
    {
      id: "select-all",
      title: "Select all",
      description:
        "`indeterminate` shows the mixed state while only some items are selected. Checking the parent selects every item, and unchecking it clears them.",
      Component: SelectAll,
      code: selectAllCode,
    },
    {
      id: "validation",
      title: "Required with an error",
      description:
        "Click **Create workspace** without ticking the box to see the error. `error` also marks the checkbox invalid.",
      Component: Validation,
      code: validationCode,
    },
    { id: "states", title: "Sizes and disabled", Component: States, code: statesCode },
  ],
  api: [
    {
      title: "Checkbox",
      description:
        'Also accepts every native `<input>` attribute (`name`, `value`, `onChange`, …). The `ref` points to the `<input type="checkbox">`.',
      props: [
        {
          name: "label",
          type: "node",
          description:
            "Visible label, linked to the checkbox: clicking it toggles the checkbox. Without it, pass `aria-label`.",
        },
        {
          name: "description",
          type: "node",
          description: "Supporting text below the label; the checkbox's accessible description.",
        },
        {
          name: "error",
          type: "node",
          description:
            "Error message below the label. Also sets `aria-invalid`. Pass `true` to mark the checkbox invalid without a message.",
        },
        { name: "checked", type: "boolean", description: "Checked state (controlled)." },
        {
          name: "defaultChecked",
          type: "boolean",
          default: "false",
          description: "Initial checked state (uncontrolled).",
        },
        {
          name: "onCheckedChange",
          type: "function(checked)",
          description:
            "Called with the new checked state. A native `onChange` runs first; calling `event.preventDefault()` there cancels the change.",
        },
        {
          name: "indeterminate",
          type: "boolean",
          default: "false",
          description:
            "Shows the mixed state, e.g. on a “select all” checkbox while only some items are selected. It's controlled: a click doesn't clear it, so update it from your state.",
        },
        {
          name: "size",
          type: '"sm" | "md"',
          default: '"md"',
          description: "Box and label size.",
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
          description: "Disables the checkbox.",
        },
        {
          name: "className",
          type: "string",
          description:
            "Class for the root element (box, label and messages). `style` goes there too.",
        },
      ],
    },
  ],
  keyboard: [
    { keys: ["Space"], description: "Checks or unchecks the focused checkbox." },
    {
      keys: ["Tab", "Shift + Tab"],
      description: "Moves focus to the next or previous checkbox. Each checkbox is a Tab stop.",
    },
  ],
  accessibility: [
    'Uses a native `<input type="checkbox">` with only its look replaced: it is what receives clicks and focus, so it keeps the checkbox role, Space-key toggling and form behavior.',
    "The `label` is linked with `htmlFor`, so clicking the text toggles the checkbox. Without a visible label, pass `aria-label`.",
    "`description` and `error` are connected with `aria-describedby`; an error also sets `aria-invalid`. `required` is native, and the asterisk is hidden from screen readers.",
    "`indeterminate` sets the input's DOM property, so screen readers announce the checkbox as “mixed” or “partially checked”.",
    "The focus ring is drawn around the box when the input has keyboard focus.",
  ],
};
