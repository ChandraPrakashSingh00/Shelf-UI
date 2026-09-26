import { Button } from "@codecps/ui";
import { definePlayground } from "../../components/LivePlayground.jsx";
import AsLink from "../../examples/button/AsLink.jsx";
import asLinkCode from "../../examples/button/AsLink.jsx?raw";
import Disabled from "../../examples/button/Disabled.jsx";
import disabledCode from "../../examples/button/Disabled.jsx?raw";
import Icons from "../../examples/button/Icons.jsx";
import iconsCode from "../../examples/button/Icons.jsx?raw";
import Loading from "../../examples/button/Loading.jsx";
import loadingCode from "../../examples/button/Loading.jsx?raw";
import Sizes from "../../examples/button/Sizes.jsx";
import sizesCode from "../../examples/button/Sizes.jsx?raw";
import Variants from "../../examples/button/Variants.jsx";
import variantsCode from "../../examples/button/Variants.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const variants = ["primary", "secondary", "outline", "ghost", "danger"];
const sizes = ["sm", "md", "lg"];

function ButtonThumbnail() {
  return (
    <>
      <Button size="sm">Primary</Button>
      <Button size="sm" variant="outline">
        Outline
      </Button>
    </>
  );
}

export const buttonDoc = {
  slug: "button",
  name: "Button",
  category: "Actions",
  summary: "Triggers an action, like saving a form or opening a dialog.",
  description:
    "Buttons trigger actions. Use one `primary` button for the main action in a view and `secondary`, `outline` or `ghost` buttons for the rest. For navigation, render a link with button styling using `asChild`.",
  keywords: ["action", "submit", "cta", "call to action", "link", "icon button", "spinner"],
  imports: ["Button"],
  Thumbnail: ButtonThumbnail,
  Playground: definePlayground({
    defaults: {
      variant: "primary",
      size: "md",
      label: "Start Project",
      loading: false,
      disabled: false,
      fullWidth: false,
    },
    controls: {
      variant: { type: "select", label: "Variant", options: variants },
      size: { type: "select", label: "Size", options: sizes },
      label: { type: "text", label: "Label" },
      loading: { type: "boolean", label: "Loading" },
      disabled: { type: "boolean", label: "Disabled" },
      fullWidth: { type: "boolean", label: "Full width" },
    },
    render: (values) => (
      <Button
        variant={values.variant}
        size={values.size}
        loading={values.loading}
        disabled={values.disabled}
        fullWidth={values.fullWidth}
      >
        {values.label}
      </Button>
    ),
    code: (values) =>
      withImport(
        ["Button"],
        formatJsx(
          "Button",
          {
            variant: values.variant,
            size: values.size,
            loading: values.loading,
            disabled: values.disabled,
            fullWidth: values.fullWidth,
          },
          values.label,
          { defaults: { variant: "primary", size: "md" } },
        ),
      ),
  }),
  examples: [
    {
      id: "variants",
      title: "Variants",
      description:
        "`primary` for the main action, `secondary` and `outline` for supporting actions, `ghost` for low-emphasis actions and `danger` for destructive ones.",
      Component: Variants,
      code: variantsCode,
    },
    { id: "sizes", title: "Sizes", Component: Sizes, code: sizesCode },
    {
      id: "icons",
      title: "With icons",
      description:
        "Icons are decorative. An icon-only button needs an `aria-label` so screen readers can name it.",
      Component: Icons,
      code: iconsCode,
    },
    {
      id: "loading",
      title: "Loading",
      description:
        "Click the button. While `loading`, it shows a spinner and ignores clicks but keeps keyboard focus.",
      Component: Loading,
      code: loadingCode,
    },
    { id: "disabled", title: "Disabled", Component: Disabled, code: disabledCode },
    {
      id: "as-link",
      title: "As a link",
      description:
        "Use `asChild` to render a router `Link` (or `<a>`) with button styling. It stays a real link, so it can be opened in a new tab.",
      Component: AsLink,
      code: asLinkCode,
    },
  ],
  api: [
    {
      title: "Button",
      description:
        "Also accepts every native `<button>` attribute. The `ref` points to the `<button>` element.",
      props: [
        {
          name: "variant",
          type: '"primary" | "secondary" | "outline" | "ghost" | "danger"',
          default: '"primary"',
          description: "Visual style.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Height, padding and font size.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          description:
            "Shows a spinner and ignores clicks. The button stays focusable and is marked `aria-busy` and `aria-disabled`.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables the button (native `disabled`).",
        },
        {
          name: "leftIcon",
          type: "node",
          description: "Decorative icon before the label. Replaced by the spinner while loading.",
        },
        { name: "rightIcon", type: "node", description: "Decorative icon after the label." },
        {
          name: "fullWidth",
          type: "boolean",
          default: "false",
          description: "Stretches the button to its container's width.",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          description:
            "Renders the single child (e.g. a router `Link`) with button styling instead of a `<button>`. `loading`, `disabled`, icons and `type` don't apply.",
        },
        {
          name: "type",
          type: '"button" | "submit" | "reset"',
          default: '"button"',
          description:
            "Native button type. Defaults to `button`, so it never submits a form by accident.",
        },
        { name: "children", type: "node", description: "The button's label." },
      ],
    },
  ],
  keyboard: [
    { keys: ["Enter", "Space"], description: "Activates the button." },
    { keys: ["Tab"], description: "Moves focus to the next focusable element." },
  ],
  accessibility: [
    "Renders a native `<button>`, so it is focusable and works with Enter and Space out of the box.",
    '`type` defaults to `"button"`. Pass `type="submit"` for buttons that submit a form.',
    "While `loading`, the button keeps focus and is announced as busy and unavailable (`aria-busy`, `aria-disabled`) instead of being removed from the Tab order.",
    "Icon-only buttons need an accessible name: pass `aria-label`.",
    "Use links for navigation. With `asChild`, a `Link` keeps its link semantics and only looks like a button.",
  ],
};
