import { Select } from "@codecps/ui";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/select/Basic.jsx";
import basicCode from "../../examples/select/Basic.jsx?raw";
import Groups from "../../examples/select/Groups.jsx";
import groupsCode from "../../examples/select/Groups.jsx?raw";
import OptionObjects from "../../examples/select/OptionObjects.jsx";
import optionObjectsCode from "../../examples/select/OptionObjects.jsx?raw";
import Sizes from "../../examples/select/Sizes.jsx";
import sizesCode from "../../examples/select/Sizes.jsx?raw";
import Validation from "../../examples/select/Validation.jsx";
import validationCode from "../../examples/select/Validation.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const sizes = ["sm", "md", "lg"];
const frameworks = ["Vite", "Next.js", "Remix", "Astro"];

function LayersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
    >
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  );
}

function SelectThumbnail() {
  return (
    <div style={{ width: "100%", maxWidth: 220 }}>
      <Select
        size="sm"
        label="Region"
        defaultValue="ap-south-1"
        options={[
          { value: "ap-south-1", label: "Mumbai (ap-south-1)" },
          { value: "ap-southeast-1", label: "Singapore (ap-southeast-1)" },
        ]}
      />
    </div>
  );
}

export const selectDoc = {
  slug: "select",
  name: "Select",
  category: "Forms",
  summary: "Native dropdown for choosing one option from a list.",
  description:
    "A styled native `<select>` for choosing one option, like a region or a plan. Because it's the browser's own control, keyboard support, form submission, autofill and the mobile pickers all work as people expect. The label, helper text and error message are wired up like `Input`.",
  keywords: [
    "dropdown",
    "picker",
    "combobox",
    "options",
    "optgroup",
    "choose",
    "native select",
    "form",
  ],
  imports: ["Select"],
  Thumbnail: SelectThumbnail,
  Playground: definePlayground({
    defaults: {
      size: "md",
      label: "Framework preset",
      placeholder: "Choose a framework",
      helperText: "Sets the build command and output folder.",
      error: "",
      icon: false,
      required: false,
      disabled: false,
    },
    controls: {
      size: { type: "select", label: "Size", options: sizes },
      label: { type: "text", label: "Label" },
      placeholder: { type: "text", label: "Placeholder" },
      helperText: { type: "text", label: "Helper text" },
      error: { type: "text", label: "Error" },
      icon: { type: "boolean", label: "Icon" },
      required: { type: "boolean", label: "Required" },
      disabled: { type: "boolean", label: "Disabled" },
    },
    render: (values) => (
      <div style={{ width: "100%", maxWidth: 360 }}>
        <Select
          size={values.size}
          label={values.label || undefined}
          aria-label={values.label ? undefined : "Framework preset"}
          placeholder={values.placeholder || undefined}
          options={frameworks}
          helperText={values.helperText || undefined}
          error={values.error || undefined}
          leftIcon={values.icon ? <LayersIcon /> : undefined}
          required={values.required}
          disabled={values.disabled}
        />
      </div>
    ),
    code: (values) =>
      withImport(
        ["Select"],
        formatJsx(
          "Select",
          {
            size: values.size,
            label: values.label || undefined,
            "aria-label": values.label ? undefined : "Framework preset",
            placeholder: values.placeholder || undefined,
            options: expr(`[${frameworks.map((name) => `"${name}"`).join(", ")}]`),
            helperText: values.helperText || undefined,
            error: values.error || undefined,
            leftIcon: values.icon ? expr("<LayersIcon />") : undefined,
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
      description:
        "Pass `options` as strings. `placeholder` adds a first, disabled option, and the select starts on it.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "option-objects",
      title: "Option objects",
      description:
        "Use `{ value, label, disabled }` objects when the submitted value differs from the text people see. Disabled options stay visible but can't be chosen.",
      Component: OptionObjects,
      code: optionObjectsCode,
    },
    {
      id: "groups",
      title: "Groups and icons",
      description:
        "Without `options`, the select renders its children, so you can group options with `<optgroup>`. `leftIcon` adds a decorative icon.",
      Component: Groups,
      code: groupsCode,
    },
    {
      id: "validation",
      title: "Validation",
      description:
        "A controlled, required select. Click **Send invite** without choosing a role to see the error.",
      Component: Validation,
      code: validationCode,
    },
    { id: "sizes", title: "Sizes", Component: Sizes, code: sizesCode },
  ],
  api: [
    {
      title: "Select",
      description:
        "Also accepts every native `<select>` attribute (`name`, `value`, `defaultValue`, `onChange`, …) except `multiple`: it picks a single option. The `ref` points to the `<select>` element.",
      props: [
        { name: "label", type: "node", description: "Visible label, linked to the select." },
        {
          name: "options",
          type: "array",
          description:
            "The options, as strings or `{ value, label, disabled }` objects (see below). Without it, `children` are rendered.",
        },
        {
          name: "children",
          type: "node",
          description: "`<option>` and `<optgroup>` elements, used when `options` isn't set.",
        },
        {
          name: "placeholder",
          type: "string",
          description:
            "Text of a first, disabled option with an empty value. Without `value` or `defaultValue`, the select starts on it.",
        },
        {
          name: "helperText",
          type: "node",
          description: "Hint below the field, exposed as the select's accessible description.",
        },
        {
          name: "error",
          type: "node",
          description:
            "Error message. Replaces `helperText`, highlights the field and sets `aria-invalid`. Pass `true` to mark the field invalid without a message.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description:
            "Height and font size. It replaces the native `size` attribute, which isn't supported.",
        },
        {
          name: "leftIcon",
          type: "node",
          description: "Decorative icon inside the field, before the selected option.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          description: "Native `required`, plus an asterisk after the label.",
        },
        { name: "disabled", type: "boolean", default: "false", description: "Disables the field." },
        {
          name: "className",
          type: "string",
          description:
            "Class for the field wrapper (label, select and message). `style` goes there too.",
        },
        {
          name: "selectClassName",
          type: "string",
          description: "Class for the `<select>` element itself.",
        },
      ],
    },
    {
      title: "Select option",
      description:
        "Each object in `options` has these keys. A plain string is both the value and the label.",
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          description: "Submitted value, and what `value` and `defaultValue` refer to.",
        },
        { name: "label", type: "string", description: "Visible text. Defaults to `value`." },
        {
          name: "disabled",
          type: "boolean",
          description: "Shown in the list, but can't be chosen.",
        },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["↓", "↑"],
      description: "Selects the next or previous option. On macOS, opens the list instead.",
    },
    {
      keys: ["Alt + ↓", "Space"],
      description: "Opens the list of options. The exact keys depend on the browser and platform.",
    },
    {
      keys: ["A–Z"],
      description: "Jumps to the next option that starts with the typed characters.",
    },
    {
      keys: ["Enter"],
      description: "In the open list: chooses the highlighted option and closes the list.",
    },
    { keys: ["Escape"], description: "Closes the list without changing the selection." },
  ],
  accessibility: [
    "It's a native `<select>`, so the browser provides the keyboard support, the screen reader semantics and the platform's own picker on phones.",
    "The `label` is linked with `htmlFor`. `helperText` and `error` are connected with `aria-describedby`, and an error also sets `aria-invalid`.",
    "The chevron and `leftIcon` are decorative and hidden from screen readers.",
    "The `placeholder` option is disabled, so it can't be chosen again. With `required`, the form won't submit while it's selected.",
  ],
};
