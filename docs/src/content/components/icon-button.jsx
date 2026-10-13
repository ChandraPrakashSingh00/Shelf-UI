import { IconButton } from "@shelf-ui/react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import AsLink from "../../examples/icon-button/AsLink.jsx";
import asLinkCode from "../../examples/icon-button/AsLink.jsx?raw";
import Loading from "../../examples/icon-button/Loading.jsx";
import loadingCode from "../../examples/icon-button/Loading.jsx?raw";
import SizesShapes from "../../examples/icon-button/SizesShapes.jsx";
import sizesShapesCode from "../../examples/icon-button/SizesShapes.jsx?raw";
import Tooltips from "../../examples/icon-button/Tooltips.jsx";
import tooltipsCode from "../../examples/icon-button/Tooltips.jsx?raw";
import Variants from "../../examples/icon-button/Variants.jsx";
import variantsCode from "../../examples/icon-button/Variants.jsx?raw";
import Wishlist from "../../examples/icon-button/Wishlist.jsx";
import wishlistCode from "../../examples/icon-button/Wishlist.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const variants = ["ghost", "secondary", "outline", "primary", "danger"];
const sizes = ["sm", "md", "lg"];
const shapes = ["square", "circle"];

function HeartIcon() {
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
      <path d="M12 20s-7.5-4.4-9.2-9.1C1.7 7.6 3.8 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.9 1.3-1.8 2.9-2.9 4.9-2.9 3.3 0 5.4 3.1 4.3 6.4C19.5 15.6 12 20 12 20Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}

function IconButtonThumbnail() {
  return (
    <>
      <IconButton label="Add to wishlist" variant="outline" pressed>
        <HeartIcon />
      </IconButton>
      <IconButton label="Share" variant="secondary">
        <ShareIcon />
      </IconButton>
      <IconButton label="Share" variant="primary" shape="circle">
        <ShareIcon />
      </IconButton>
    </>
  );
}

// `formatJsx` writes a self-closing tag; give it the icon as its child.
const withIconChild = (tag) => `${tag.replace(/ ?\/>$/, ">")}\n  <HeartIcon />\n</IconButton>`;

export const iconButtonDoc = {
  slug: "icon-button",
  name: "IconButton",
  category: "Actions",
  summary: "Square or round button with only an icon, like wishlist, share or close.",
  description:
    "A button that shows only an icon — add to wishlist, share, refresh, delete — with Button's variants and sizes. `label` is required: it's the button's accessible name, and with `tooltip` it's also shown on hover and focus. Pass `pressed` to make it a toggle.",
  keywords: [
    "icon",
    "icon button",
    "icon-only",
    "toggle",
    "wishlist",
    "favourite",
    "share",
    "toolbar",
    "round button",
    "fab",
  ],
  imports: ["IconButton"],
  Thumbnail: IconButtonThumbnail,
  Playground: definePlayground({
    defaults: {
      variant: "ghost",
      size: "md",
      shape: "square",
      label: "Add to wishlist",
      tooltip: true,
      loading: false,
      disabled: false,
    },
    controls: {
      variant: { type: "select", label: "Variant", options: variants },
      size: { type: "select", label: "Size", options: sizes },
      shape: { type: "select", label: "Shape", options: shapes },
      label: { type: "text", label: "Label" },
      tooltip: { type: "boolean", label: "Tooltip" },
      loading: { type: "boolean", label: "Loading" },
      disabled: { type: "boolean", label: "Disabled" },
    },
    render: (values) => (
      <IconButton
        label={values.label || "Add to wishlist"}
        variant={values.variant}
        size={values.size}
        shape={values.shape}
        tooltip={values.tooltip}
        loading={values.loading}
        disabled={values.disabled}
      >
        <HeartIcon />
      </IconButton>
    ),
    code: (values) =>
      withImport(
        ["IconButton"],
        withIconChild(
          formatJsx(
            "IconButton",
            {
              label: values.label || "Add to wishlist",
              variant: values.variant,
              size: values.size,
              shape: values.shape,
              tooltip: values.tooltip,
              loading: values.loading,
              disabled: values.disabled,
            },
            undefined,
            { defaults: { variant: "ghost", size: "md", shape: "square" } },
          ),
        ),
      ),
  }),
  examples: [
    {
      id: "variants",
      title: "Variants",
      description:
        "The Button variants. `ghost` (the default) suits toolbars and cards; use `danger` for destructive actions.",
      Component: Variants,
      code: variantsCode,
    },
    {
      id: "sizes-shapes",
      title: "Sizes and shapes",
      description:
        '`size` sets the width, height and icon size together; `shape="circle"` makes it round.',
      Component: SizesShapes,
      code: sizesShapesCode,
    },
    {
      id: "wishlist",
      title: "Toggle: add to wishlist",
      description:
        "`pressed` makes it a toggle button (`aria-pressed`). Keep `label` the same in both states — screen readers announce “pressed” or “not pressed” — and change the icon to show the state.",
      Component: Wishlist,
      code: wishlistCode,
    },
    {
      id: "tooltips",
      title: "With tooltips",
      description:
        '`tooltip` shows the label on hover and keyboard focus, so sighted users can tell the icons apart too. Group related buttons with `role="group"` and an `aria-label`.',
      Component: Tooltips,
      code: tooltipsCode,
    },
    {
      id: "loading",
      title: "Loading",
      description:
        "Click to refresh. While `loading`, a spinner replaces the icon and clicks are ignored, but the button keeps keyboard focus.",
      Component: Loading,
      code: loadingCode,
    },
    {
      id: "as-link",
      title: "As a link",
      description:
        "Use `asChild` to give a router `Link` (or `<a>`) icon button styling. It stays a real link; put the icon inside it.",
      Component: AsLink,
      code: asLinkCode,
    },
  ],
  api: [
    {
      title: "IconButton",
      description:
        "Also accepts every native `<button>` attribute. The `ref` points to the `<button>`.",
      props: [
        {
          name: "label",
          type: "string",
          required: true,
          description:
            "Accessible name (`aria-label`), e.g. “Add to wishlist”. Also the tooltip text with `tooltip`.",
        },
        {
          name: "children",
          type: "node",
          description: "The icon. It's decorative and hidden from screen readers.",
        },
        {
          name: "variant",
          type: '"ghost" | "secondary" | "outline" | "primary" | "danger"',
          default: '"ghost"',
          description: "Visual style, as on Button.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Width, height (32, 40 or 48 px) and icon size.",
        },
        {
          name: "shape",
          type: '"square" | "circle"',
          default: '"square"',
          description: "Rounded square or circle.",
        },
        {
          name: "pressed",
          type: "boolean",
          description:
            "Makes it a toggle button with `aria-pressed` and a tinted “on” state. Leave it out for an ordinary button.",
        },
        {
          name: "tooltip",
          type: "boolean",
          default: "false",
          description:
            "Shows `label` in a Tooltip on hover and keyboard focus. Disabled buttons don't show it.",
        },
        {
          name: "tooltipSide",
          type: '"top" | "right" | "bottom" | "left"',
          default: '"top"',
          description: "Preferred side of the tooltip; it flips when there isn't room.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          description:
            "Shows a spinner instead of the icon and ignores clicks. The button stays focusable and is marked `aria-busy` and `aria-disabled`.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables the button (native `disabled`).",
        },
        {
          name: "type",
          type: '"button" | "submit" | "reset"',
          default: '"button"',
          description: "Native button type, so it never submits a form by accident.",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          description:
            "Renders the single child (e.g. a router `Link` with an icon inside) with icon button styling instead of a `<button>`. `loading`, `disabled` and `type` don't apply; put any `ref` on the child.",
        },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["Enter", "Space"],
      description: "Activates the button, or toggles it with `pressed`.",
    },
    {
      keys: ["Escape"],
      description: "Hides the tooltip without moving focus (with `tooltip`).",
    },
  ],
  accessibility: [
    "Renders a native `<button>` named by `label` through `aria-label`; the icon is hidden from screen readers (`aria-hidden`).",
    "With `pressed`, the button exposes `aria-pressed`, so screen readers announce it as a toggle. Keep the label the same in both states and let the icon change.",
    "The tooltip repeats the accessible name, so its text is hidden from screen readers to avoid announcing the label twice. It opens on hover and keyboard focus and closes with Escape.",
    "While `loading`, the button keeps focus and is announced as busy and unavailable (`aria-busy`, `aria-disabled`) instead of leaving the Tab order.",
    "The focus ring is visible on keyboard focus, and the pressed state uses system highlight colors in forced-colors mode.",
  ],
};
