import { Input } from "@shelf-ui/react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/input/Basic.jsx";
import basicCode from "../../examples/input/Basic.jsx?raw";
import HelperText from "../../examples/input/HelperText.jsx";
import helperTextCode from "../../examples/input/HelperText.jsx?raw";
import Icons from "../../examples/input/Icons.jsx";
import iconsCode from "../../examples/input/Icons.jsx?raw";
import Sizes from "../../examples/input/Sizes.jsx";
import sizesCode from "../../examples/input/Sizes.jsx?raw";
import States from "../../examples/input/States.jsx";
import statesCode from "../../examples/input/States.jsx?raw";
import Validation from "../../examples/input/Validation.jsx";
import validationCode from "../../examples/input/Validation.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const sizes = ["sm", "md", "lg"];

function InputThumbnail() {
  return (
    <div style={{ width: "100%", maxWidth: 220 }}>
      <Input size="sm" label="Email" placeholder="you@company.com" />
    </div>
  );
}

export const inputDoc = {
  slug: "input",
  name: "Input",
  category: "Forms",
  summary: "Text field with a label, helper text and validation message.",
  description:
    "A text field with its label, helper text and error message wired up for you. It accepts every native `<input>` attribute, so it works with any form library.",
  keywords: ["text field", "form", "textbox", "validation", "error", "email", "password", "search"],
  imports: ["Input"],
  Thumbnail: InputThumbnail,
  Playground: definePlayground({
    defaults: {
      size: "md",
      label: "Email",
      placeholder: "you@company.com",
      helperText: "We'll never share your email.",
      error: "",
      required: false,
      disabled: false,
    },
    controls: {
      size: { type: "select", label: "Size", options: sizes },
      label: { type: "text", label: "Label" },
      placeholder: { type: "text", label: "Placeholder" },
      helperText: { type: "text", label: "Helper text" },
      error: { type: "text", label: "Error" },
      required: { type: "boolean", label: "Required" },
      disabled: { type: "boolean", label: "Disabled" },
    },
    render: (values) => (
      <div style={{ width: "100%", maxWidth: 360 }}>
        <Input
          size={values.size}
          label={values.label || undefined}
          aria-label={values.label ? undefined : "Input"}
          placeholder={values.placeholder}
          helperText={values.helperText || undefined}
          error={values.error || undefined}
          required={values.required}
          disabled={values.disabled}
        />
      </div>
    ),
    code: (values) =>
      withImport(
        ["Input"],
        formatJsx(
          "Input",
          {
            size: values.size,
            label: values.label || undefined,
            placeholder: values.placeholder || undefined,
            helperText: values.helperText || undefined,
            error: values.error || undefined,
            required: values.required,
            disabled: values.disabled,
          },
          undefined,
          { defaults: { size: "md" } },
        ),
      ),
  }),
  examples: [
    { id: "basic", title: "Basic", Component: Basic, code: basicCode },
    {
      id: "helper-text",
      title: "Helper text",
      description: "Helper text sits below the field and is read out as its description.",
      Component: HelperText,
      code: helperTextCode,
    },
    {
      id: "validation",
      title: "Validation",
      description:
        "Pass a message to `error` to show it in place of the helper text and mark the field invalid. Type a valid email to clear it.",
      Component: Validation,
      code: validationCode,
    },
    { id: "sizes", title: "Sizes", Component: Sizes, code: sizesCode },
    {
      id: "icons",
      title: "With an icon",
      description:
        "Icons are decorative. Without a visible label, name the field with `aria-label`.",
      Component: Icons,
      code: iconsCode,
    },
    { id: "states", title: "Required and disabled", Component: States, code: statesCode },
  ],
  api: [
    {
      title: "Input",
      description:
        "Also accepts every native `<input>` attribute (`type`, `value`, `onChange`, …). The `ref` points to the `<input>` element.",
      props: [
        { name: "label", type: "node", description: "Visible label, linked to the input." },
        {
          name: "placeholder",
          type: "string",
          description: "Hint shown while the field is empty. Not a replacement for a label.",
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
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Height and font size.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          description: "Native `required`, plus an asterisk after the label.",
        },
        { name: "disabled", type: "boolean", default: "false", description: "Disables the field." },
        {
          name: "leftIcon",
          type: "node",
          description: "Decorative icon inside the field, before the text.",
        },
        {
          name: "rightIcon",
          type: "node",
          description: "Decorative icon inside the field, after the text.",
        },
        {
          name: "className",
          type: "string",
          description:
            "Class for the field wrapper (label, input and message). `style` goes there too.",
        },
        {
          name: "inputClassName",
          type: "string",
          description: "Class for the `<input>` element itself.",
        },
      ],
    },
  ],
  accessibility: [
    "The `label` is linked to the input with `htmlFor`, so clicking it focuses the field and screen readers announce it.",
    "`helperText` and `error` are connected with `aria-describedby`; an error also sets `aria-invalid`.",
    "`required` uses the native attribute. The asterisk is visual only and hidden from screen readers.",
    "Without a visible label, pass `aria-label`. Placeholder text disappears while typing and is not a label.",
  ],
};
