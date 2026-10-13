import { Combobox } from "shelf-ui-react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/combobox/Basic.jsx";
import basicCode from "../../examples/combobox/Basic.jsx?raw";
import Controlled from "../../examples/combobox/Controlled.jsx";
import controlledCode from "../../examples/combobox/Controlled.jsx?raw";
import FormField from "../../examples/combobox/FormField.jsx";
import formFieldCode from "../../examples/combobox/FormField.jsx?raw";
import ProductSearch from "../../examples/combobox/ProductSearch.jsx";
import productSearchCode from "../../examples/combobox/ProductSearch.jsx?raw";
import ServerSearch from "../../examples/combobox/ServerSearch.jsx";
import serverSearchCode from "../../examples/combobox/ServerSearch.jsx?raw";
import Sizes from "../../examples/combobox/Sizes.jsx";
import sizesCode from "../../examples/combobox/Sizes.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const sizes = ["sm", "md", "lg"];
const playgroundCities = [
  "Ahmedabad",
  "Bengaluru",
  "Chennai",
  "Delhi",
  "Hyderabad",
  "Jaipur",
  "Kochi",
  "Kolkata",
  "Mumbai",
  "Pune",
];

// Static look-alike: the card preview is inert and clips anything positioned outside it.
function ComboboxThumbnail() {
  const surface = {
    border: "1px solid var(--shelf-color-border)",
    borderRadius: "var(--shelf-radius-md)",
    backgroundColor: "var(--shelf-color-surface)",
  };
  const rows = [
    ["", "Pu", "ne"],
    ["", "Pu", "ducherry"],
    ["Kan", "pu", "r"],
  ];

  return (
    <div
      style={{
        display: "grid",
        gap: 4,
        width: "100%",
        maxWidth: 210,
        color: "var(--shelf-color-text)",
        fontFamily: "var(--shelf-font-sans)",
        fontSize: "var(--shelf-font-size-xs)",
      }}
    >
      <div
        style={{
          ...surface,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 30,
          padding: "0 8px",
          borderColor: "var(--shelf-color-primary)",
          boxShadow: "0 0 0 3px var(--shelf-focus-ring-soft)",
        }}
      >
        <span>Pu</span>
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          style={{ color: "var(--shelf-color-text-subtle)", transform: "rotate(180deg)" }}
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div
        style={{
          ...surface,
          display: "grid",
          gap: 1,
          padding: 3,
          boxShadow: "var(--shelf-shadow-md)",
        }}
      >
        {rows.map(([before, match, after], index) => (
          <span
            key={index}
            style={{
              padding: "5px 7px",
              borderRadius: "var(--shelf-radius-sm)",
              backgroundColor: index === 0 ? "var(--shelf-color-primary-subtle)" : undefined,
              color: index === 0 ? "var(--shelf-color-primary-text)" : undefined,
            }}
          >
            {before}
            <strong style={{ textDecoration: "underline" }}>{match}</strong>
            {after}
          </span>
        ))}
      </div>
    </div>
  );
}

export const comboboxDoc = {
  slug: "combobox",
  name: "Combobox",
  category: "Forms",
  summary: "Text field that filters a list of options as you type, for picking one of many.",
  description:
    "A text field with a list of suggestions, for picking one value from a long list: a delivery city, a product, a customer. Typing filters the options (ignoring case and accents) and highlights the match, the arrow keys move through them, and the value is always one of the options. For a handful of fixed choices, a native `Select` is simpler.",
  keywords: [
    "autocomplete",
    "typeahead",
    "autosuggest",
    "search select",
    "searchable select",
    "listbox",
    "filter",
    "city picker",
  ],
  imports: ["Combobox"],
  Thumbnail: ComboboxThumbnail,
  Playground: definePlayground({
    defaults: {
      size: "md",
      label: "Delivery city",
      placeholder: "Search cities",
      helperText: "",
      error: "",
      clearable: true,
      openOnFocus: false,
      disabled: false,
    },
    controls: {
      size: { type: "select", label: "Size", options: sizes },
      label: { type: "text", label: "Label" },
      placeholder: { type: "text", label: "Placeholder" },
      helperText: { type: "text", label: "Helper text" },
      error: { type: "text", label: "Error" },
      clearable: { type: "boolean", label: "Clearable" },
      openOnFocus: { type: "boolean", label: "Open on focus" },
      disabled: { type: "boolean", label: "Disabled" },
    },
    render: (values) => (
      <div style={{ alignSelf: "flex-start", width: "100%", maxWidth: 320, minHeight: "20rem" }}>
        <Combobox
          options={playgroundCities}
          size={values.size}
          label={values.label || undefined}
          aria-label={values.label ? undefined : "Delivery city"}
          placeholder={values.placeholder || undefined}
          helperText={values.helperText || undefined}
          error={values.error || undefined}
          clearable={values.clearable}
          openOnFocus={values.openOnFocus}
          disabled={values.disabled}
        />
      </div>
    ),
    code: (values) =>
      withImport(
        ["Combobox"],
        formatJsx(
          "Combobox",
          {
            label: values.label || undefined,
            "aria-label": values.label ? undefined : "Delivery city",
            placeholder: values.placeholder || undefined,
            options: expr("cities"),
            helperText: values.helperText || undefined,
            error: values.error || undefined,
            size: values.size,
            clearable: values.clearable ? undefined : expr("false"),
            openOnFocus: values.openOnFocus,
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
        "Type to filter the cities, then pick one with ↓ and Enter or a click. Leaving the field puts the selected city back in the input, and typing a city's whole name selects it.",
      Component: Basic,
      code: basicCode,
      minHeight: "23rem",
    },
    {
      id: "product-search",
      title: "Descriptions and disabled options",
      description:
        "Options can be `{ value, label, description, disabled }` objects: here the price and category show under each product, and an out-of-stock product can't be picked. `leftIcon` adds a decorative icon.",
      Component: ProductSearch,
      code: productSearchCode,
      minHeight: "24rem",
    },
    {
      id: "controlled",
      title: "Controlled",
      description:
        "Pass `value` and `onValueChange` to use the selection elsewhere. The input follows `value` when you change it from your code; `null` clears it.",
      Component: Controlled,
      code: controlledCode,
      minHeight: "24rem",
    },
    {
      id: "server-search",
      title: "Server-side search",
      description:
        'With `filter={null}` the options are shown as given, so you can fetch them as the user types. `onInputChange` gets the text and a reason: search only for `"input"`, not when picking an option fills in the input. `loading` shows a spinner and marks the input busy.',
      Component: ServerSearch,
      code: serverSearchCode,
      minHeight: "22rem",
    },
    {
      id: "form",
      title: "In a form",
      description:
        "`name` submits the selected option's value (not its label) through a hidden input, and resetting the form goes back to `defaultValue`. `required` blocks submitting until an option is selected. Show validation messages with `error`.",
      Component: FormField,
      code: formFieldCode,
      minHeight: "24rem",
    },
    {
      id: "sizes",
      title: "Sizes and disabled",
      description: "`size` matches the other form fields: `sm`, `md` (default) and `lg`.",
      Component: Sizes,
      code: sizesCode,
    },
  ],
  api: [
    {
      title: "Combobox",
      description:
        'Also accepts native `<input>` attributes (`autoFocus`, `onBlur`, …). The `ref` points to the `<input role="combobox">`; `className` and `style` go to the field wrapper. The list opens below the field at its full width, positioned with CSS: an `overflow: hidden` ancestor can clip it.',
      props: [
        {
          name: "options",
          type: "array",
          default: "[]",
          description:
            "Strings (or numbers), or `{ value, label, description, disabled }` objects. Values must be unique and not `null`. `label` is a string: the text shown in the input once selected (defaults to the value).",
        },
        {
          name: "label",
          type: "node",
          description: "Visible label, linked to the input. Without it, pass `aria-label`.",
        },
        {
          name: "helperText",
          type: "node",
          description: "Hint below the field, exposed as its accessible description.",
        },
        {
          name: "error",
          type: "node",
          description:
            "Error message; replaces `helperText` and sets `aria-invalid`. `true` marks the field invalid without a message.",
        },
        {
          name: "value",
          type: "string | number | null",
          description: "Selected value (controlled).",
        },
        {
          name: "defaultValue",
          type: "string | number | null",
          default: "null",
          description: "Initial selected value (uncontrolled); also where a form reset returns.",
        },
        {
          name: "onValueChange",
          type: "function(value)",
          description:
            "Called with the new value when an option is picked, or with `null` when the field is cleared.",
        },
        {
          name: "inputValue",
          type: "string",
          description: "Text in the input (controlled). Usually you only listen to it.",
        },
        {
          name: "defaultInputValue",
          type: "string",
          description:
            "Initial text. Defaults to the selected option's label; set it when options load later.",
        },
        {
          name: "onInputChange",
          type: "function(text, reason)",
          description:
            'Called when the text changes, with the reason: `"input"` (typing), `"select"`, `"clear"`, `"restore"` (leaving the field puts the selected label back) or `"reset"`.',
        },
        {
          name: "filter",
          type: "function(option, query) | null",
          description:
            "Whether an option matches the typed text. The default keeps options whose label contains it, ignoring case and accents. `null` shows `options` as they are (server-side search).",
        },
        {
          name: "emptyMessage",
          type: "node",
          default: '"No results"',
          description: "Shown, and announced, when no option matches.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          description:
            "Shows a spinner in the field (and `loadingMessage` while there are no options) and sets `aria-busy`.",
        },
        {
          name: "loadingMessage",
          type: "node",
          default: '"Loading…"',
          description: "Text for the loading state.",
        },
        {
          name: "clearable",
          type: "boolean",
          default: "true",
          description:
            "Adds a × button while there's a value or text. Escape on a closed list and erasing the text also clear the value; with `false`, leaving the field restores it instead.",
        },
        {
          name: "open",
          type: "boolean",
          description: "Whether the list is open (controlled).",
        },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          description: "Initial open state (uncontrolled).",
        },
        {
          name: "onOpenChange",
          type: "function(open)",
          description: "Called when the list opens or closes.",
        },
        {
          name: "openOnFocus",
          type: "boolean",
          default: "false",
          description: "Opens the list when the input gets focus, not only when typing.",
        },
        {
          name: "name",
          type: "string",
          description: "Form field name. The selected value is submitted through a hidden input.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Control height and font size.",
        },
        { name: "placeholder", type: "string", description: "Placeholder text of the input." },
        {
          name: "leftIcon",
          type: "node",
          description: "Decorative icon inside the field, before the text.",
        },
        {
          name: "maxHeight",
          type: "string | number",
          default: '"16rem"',
          description: "Maximum height of the list before it scrolls (a CSS length, or px).",
        },
        {
          name: "required",
          type: "boolean",
          description:
            "An option must be selected to submit the form; typed text alone isn't enough. The browser shows its own message, the input gets `aria-required`, and an asterisk follows the label.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables the field; its value isn't submitted.",
        },
        {
          name: "readOnly",
          type: "boolean",
          default: "false",
          description: "Shows the value but doesn't open the list or change it.",
        },
        {
          name: "clearLabel",
          type: "string",
          default: '"Clear"',
          description: "Accessible name of the clear button.",
        },
        {
          name: "toggleLabel",
          type: "string",
          default: '"Show options"',
          description: "Accessible name of the button that opens the list.",
        },
        {
          name: "id",
          type: "string",
          description: "Id of the `<input>`. Defaults to a generated id.",
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
      keys: ["↓", "↑"],
      description:
        "Opens the list at the selected option (or the first / last), then moves through the options, skipping disabled ones and wrapping around.",
    },
    { keys: ["Alt + ↓"], description: "Opens the list without highlighting an option." },
    { keys: ["Alt + ↑"], description: "Closes the list." },
    {
      keys: ["Enter"],
      description:
        "Selects the highlighted option and closes the list. With no option highlighted, selects the option whose whole label was typed; the form still submits.",
    },
    {
      keys: ["Escape"],
      description: "Closes the list. When it's already closed, clears the field (if `clearable`).",
    },
    {
      keys: ["Tab"],
      description:
        "Closes the list and moves on without selecting; the input goes back to the selected option's label.",
    },
    {
      keys: ["Home", "End"],
      description: "Move the text cursor in the input, as in any text field.",
    },
  ],
  accessibility: [
    'Follows the WAI-ARIA combobox pattern with list autocomplete and manual selection: the `<input>` has `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded` and `aria-controls`, and the options are a `role="listbox"` named by the label.',
    "Focus stays in the input. The highlighted option is announced through `aria-activedescendant`, and scrolled into view. The selected option has `aria-selected` and a check mark, and disabled options have `aria-disabled`.",
    "No option is highlighted while typing, so Enter never picks something you didn't choose: move into the list with ↓ first. Typing an option's whole label and leaving the field, or pressing Enter, selects it.",
    "“No results” and the loading message are announced through a polite live region.",
    "The clear and toggle buttons have accessible names but stay out of the Tab order: from the keyboard, use Escape to clear and ↓ to open. `label` is linked with `htmlFor`, and `helperText` or `error` with `aria-describedby`.",
    "The match highlight is bold and underlined, so it doesn't rely on color, and the highlighted option gets an outline in forced-colors mode.",
  ],
};
