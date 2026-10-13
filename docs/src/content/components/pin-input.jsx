import { PinInput } from "@shelf-ui/react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Alphanumeric from "../../examples/pin-input/Alphanumeric.jsx";
import alphanumericCode from "../../examples/pin-input/Alphanumeric.jsx?raw";
import Basic from "../../examples/pin-input/Basic.jsx";
import basicCode from "../../examples/pin-input/Basic.jsx?raw";
import Form from "../../examples/pin-input/Form.jsx";
import formCode from "../../examples/pin-input/Form.jsx?raw";
import Masked from "../../examples/pin-input/Masked.jsx";
import maskedCode from "../../examples/pin-input/Masked.jsx?raw";
import States from "../../examples/pin-input/States.jsx";
import statesCode from "../../examples/pin-input/States.jsx?raw";
import Verify from "../../examples/pin-input/Verify.jsx";
import verifyCode from "../../examples/pin-input/Verify.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const sizes = ["sm", "md", "lg"];
const lengths = ["4", "6"];
const types = ["numeric", "alphanumeric"];

function PinInputThumbnail() {
  return <PinInput label="Enter OTP" size="sm" defaultValue="482" />;
}

export const pinInputDoc = {
  slug: "pin-input",
  name: "PinInput",
  category: "Forms",
  summary: "One-time code field with a box per digit, paste and SMS autofill support.",
  description:
    'A row of single-character boxes for one-time passwords, UPI-style PINs and verification codes. Typing moves to the next box and Backspace moves back; pasting a code or accepting it from an SMS (`autocomplete="one-time-code"`) fills every box at once, and `onComplete` fires when the last box is filled.',
  keywords: [
    "otp",
    "one-time password",
    "pin",
    "verification code",
    "2fa",
    "two-factor",
    "sms code",
    "passcode",
    "code input",
    "form",
  ],
  imports: ["PinInput"],
  Thumbnail: PinInputThumbnail,
  Playground: definePlayground({
    defaults: {
      length: "6",
      type: "numeric",
      size: "md",
      label: "Enter OTP",
      helperText: "Sent to +91 98XXX XX210.",
      error: "",
      mask: false,
      disabled: false,
    },
    controls: {
      length: { type: "select", label: "Length", options: lengths },
      type: { type: "select", label: "Type", options: types },
      size: { type: "select", label: "Size", options: sizes },
      label: { type: "text", label: "Label" },
      helperText: { type: "text", label: "Helper text" },
      error: { type: "text", label: "Error" },
      mask: { type: "boolean", label: "Mask" },
      disabled: { type: "boolean", label: "Disabled" },
    },
    render: (values) => (
      <PinInput
        // Remount when the length changes, so the boxes start empty.
        key={values.length}
        length={Number(values.length)}
        type={values.type}
        size={values.size}
        label={values.label || undefined}
        aria-label={values.label ? undefined : "One-time password"}
        helperText={values.helperText || undefined}
        error={values.error || undefined}
        mask={values.mask}
        disabled={values.disabled}
      />
    ),
    code: (values) =>
      withImport(
        ["PinInput"],
        formatJsx(
          "PinInput",
          {
            label: values.label || undefined,
            "aria-label": values.label ? undefined : "One-time password",
            length: Number(values.length),
            type: values.type,
            size: values.size,
            helperText: values.helperText || undefined,
            error: values.error || undefined,
            mask: values.mask,
            disabled: values.disabled,
          },
          undefined,
          { defaults: { length: 6, type: "numeric", size: "md" } },
        ),
      ),
  }),
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        "Type the code, paste it, or let the phone fill it in from the SMS. Backspace clears a box and moves back; ← and → move between the filled boxes.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "verify",
      title: "Verify on complete",
      description:
        "`onComplete` receives the code as soon as the last box is filled, so there's no need for a submit button. Show a wrong code with `error`, and clear the value to let people start again.",
      Component: Verify,
      code: verifyCode,
    },
    {
      id: "masked",
      title: "Masked PIN",
      description:
        "`mask` hides the characters like a password. For a PIN people know by heart, turn off `otp` so phones don't offer SMS codes.",
      Component: Masked,
      code: maskedCode,
    },
    {
      id: "alphanumeric",
      title: "Letters and numbers",
      description:
        '`type="alphanumeric"` accepts letters and digits, e.g. for gift cards or order verification codes. `getInputLabel` customises the accessible name of each box.',
      Component: Alphanumeric,
      code: alphanumericCode,
    },
    { id: "states", title: "Sizes and states", Component: States, code: statesCode },
    {
      id: "form",
      title: "In a form",
      description:
        "With `name`, the whole code is submitted through one hidden input. `required` makes every box required, and resetting the form clears the boxes.",
      Component: Form,
      code: formCode,
    },
  ],
  api: [
    {
      title: "PinInput",
      description:
        'Other props go to the `role="group"` element around the boxes. The `ref` points to the first box, so `ref.current.focus()` works; `className` and `style` go to the field wrapper.',
      props: [
        {
          name: "length",
          type: "number",
          default: "6",
          description: "Number of boxes.",
        },
        {
          name: "value",
          type: "string",
          description:
            "The code (controlled). Characters not allowed by `type` are dropped, and it's cut to `length`.",
        },
        {
          name: "defaultValue",
          type: "string",
          default: '""',
          description: "Initial code (uncontrolled).",
        },
        {
          name: "onValueChange",
          type: "function(value)",
          description: "Called with the new code, a string, whenever a box changes.",
        },
        {
          name: "onComplete",
          type: "function(value)",
          description: "Called with the code when every box has been filled.",
        },
        {
          name: "type",
          type: '"numeric" | "alphanumeric"',
          default: '"numeric"',
          description:
            "Characters allowed: digits only, or letters and digits. Also picks the phone keyboard.",
        },
        {
          name: "mask",
          type: "boolean",
          default: "false",
          description: "Hides the characters like a password.",
        },
        {
          name: "placeholder",
          type: "string",
          description: 'Text shown in each empty box, e.g. "○".',
        },
        {
          name: "label",
          type: "node",
          description:
            "Visible label; it names the group. Clicking it focuses the next box to fill. Without it, pass `aria-label`.",
        },
        {
          name: "helperText",
          type: "node",
          description: "Hint below the boxes, exposed as their accessible description.",
        },
        {
          name: "error",
          type: "node",
          description:
            "Error message. Replaces `helperText`, highlights the boxes and sets `aria-invalid`. Pass `true` to mark the field invalid without a message.",
        },
        {
          name: "getInputLabel",
          type: "function(index, length)",
          description:
            'Returns the accessible name of a box (`index` starts at 0). Defaults to "Digit 2 of 6", or "Character 2 of 6" for alphanumeric codes.',
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Size of the boxes.",
        },
        {
          name: "otp",
          type: "boolean",
          default: "true",
          description:
            'Sets `autocomplete="one-time-code"` on the first box, so phones offer the code from an SMS.',
        },
        {
          name: "name",
          type: "string",
          description:
            "Form field name. The code is submitted through a hidden input; resetting the form restores `defaultValue`.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          description:
            "Every box must be filled to submit the form. Adds an asterisk to the label.",
        },
        {
          name: "autoFocus",
          type: "boolean",
          default: "false",
          description: "Focuses the next box to fill on mount, e.g. on a verification screen.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables every box.",
        },
        {
          name: "id",
          type: "string",
          description:
            "Id of the first box; the others get `${id}-2`, `${id}-3`, … Defaults to a generated id.",
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
    {
      keys: ["Tab"],
      description:
        "Moves focus to the next box to fill, and out of the field: only one box is in the Tab order.",
    },
    {
      keys: ["0–9", "A–Z"],
      description:
        "Fills the focused box (replacing its character) and moves to the next one. Other characters are ignored.",
    },
    {
      keys: ["Backspace"],
      description:
        "Clears the focused box; in an empty box, clears the previous one and moves back.",
    },
    { keys: ["Delete"], description: "Clears the focused box." },
    { keys: ["←", "→"], description: "Moves to the previous or next filled box." },
    { keys: ["Home", "End"], description: "Moves to the first box, or the next box to fill." },
    {
      keys: ["Ctrl + V"],
      description:
        "Pastes a code: a full code fills every box, a shorter one fills from the focused box.",
    },
  ],
  accessibility: [
    'The boxes are wrapped in a `role="group"` named by the label, and each box has its own name, like “Digit 2 of 6”, so screen reader users know where they are.',
    "The code fills from the first box without gaps: only the next box to fill is in the Tab order, and focusing an empty box further on moves focus back to it.",
    "`helperText` or `error` is connected to every box with `aria-describedby`, and `error` sets `aria-invalid`, so the message is read wherever focus is.",
    'The first box has `autocomplete="one-time-code"` (turn it off with `otp={false}`), so iOS and Android offer the code from an SMS; `inputMode="numeric"` brings up the number pad.',
    "Codes read left to right, also on right-to-left pages.",
  ],
};
