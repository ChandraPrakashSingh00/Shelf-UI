import { Link } from "@shelf-ui/react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import External from "../../examples/link/External.jsx";
import externalCode from "../../examples/link/External.jsx?raw";
import RouterLinks from "../../examples/link/RouterLinks.jsx";
import routerLinksCode from "../../examples/link/RouterLinks.jsx?raw";
import Underline from "../../examples/link/Underline.jsx";
import underlineCode from "../../examples/link/Underline.jsx?raw";
import Variants from "../../examples/link/Variants.jsx";
import variantsCode from "../../examples/link/Variants.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const variants = ["primary", "muted", "inherit"];
const underlines = ["hover", "always", "none"];

function LinkThumbnail() {
  return (
    <div style={{ display: "grid", gap: 10, justifyItems: "start", fontSize: 14 }}>
      <Link href="#orders">Track your order</Link>
      <Link href="#returns" underline="always">
        7-day return policy
      </Link>
      <Link href="https://www.gst.gov.in" external>
        GST portal
      </Link>
    </div>
  );
}

export const linkDoc = {
  slug: "link",
  name: "Link",
  category: "Navigation",
  summary: "Styled text link, with safe new-tab handling for external links.",
  description:
    'A text link in the brand color (or muted, or inheriting the text color) with a clear focus ring and a configurable underline. `external` opens it in a new tab with `rel="noopener noreferrer"`, adds an icon and tells screen reader users. Use `asChild` for router links.',
  keywords: ["anchor", "a", "href", "hyperlink", "external", "new tab", "router", "navigation"],
  imports: ["Link"],
  Thumbnail: LinkThumbnail,
  Playground: definePlayground({
    defaults: {
      variant: "primary",
      underline: "hover",
      label: "Track your order",
      external: false,
      showExternalIcon: true,
    },
    controls: {
      variant: { type: "select", label: "Variant", options: variants },
      underline: { type: "select", label: "Underline", options: underlines },
      label: { type: "text", label: "Label" },
      external: { type: "boolean", label: "External" },
      showExternalIcon: { type: "boolean", label: "External icon" },
    },
    render: (values) => (
      <p style={{ margin: 0 }}>
        Order #ORD-10428 has shipped.{" "}
        <Link
          href={values.external ? "https://www.indiapost.gov.in" : "#track"}
          variant={values.variant}
          underline={values.underline}
          external={values.external}
          showExternalIcon={values.showExternalIcon}
        >
          {values.label || "Track your order"}
        </Link>
      </p>
    ),
    code: (values) =>
      withImport(
        ["Link"],
        formatJsx(
          "Link",
          {
            href: values.external ? "https://www.indiapost.gov.in" : "/orders/ORD-10428",
            variant: values.variant,
            underline: values.underline,
            external: values.external,
            showExternalIcon:
              values.external && !values.showExternalIcon ? expr("false") : undefined,
          },
          values.label || "Track your order",
          { defaults: { variant: "primary", underline: "hover" } },
        ),
      ),
  }),
  examples: [
    {
      id: "variants",
      title: "Variants",
      description:
        "`primary` for links that stand out, `muted` for footers and secondary navigation, `inherit` to take the color of the surrounding text, e.g. inside a warning.",
      Component: Variants,
      code: variantsCode,
    },
    {
      id: "underline",
      title: "Underline",
      description:
        'Links are underlined on hover by default. Inside a paragraph use `underline="always"`, so they don\'t rely on color alone.',
      Component: Underline,
      code: underlineCode,
    },
    {
      id: "external",
      title: "External links",
      description:
        '`external` opens the link in a new tab, adds `rel="noopener noreferrer"` and an icon, and appends visually hidden “(opens in a new tab)” text. Change that text with `externalLabel`.',
      Component: External,
      code: externalCode,
    },
    {
      id: "router-links",
      title: "Router links",
      description:
        "With `asChild`, the styling goes onto your router's link, e.g. React Router's `Link` imported as `RouterLink`. Put `to` and any `ref` on the child.",
      Component: RouterLinks,
      code: routerLinksCode,
    },
  ],
  api: [
    {
      title: "Link",
      description:
        "Also accepts every native `<a>` attribute (`target`, `rel`, `download`…). The `ref` points to the `<a>`.",
      props: [
        { name: "href", type: "string", description: "Link target." },
        { name: "children", type: "node", description: "The link text." },
        {
          name: "variant",
          type: '"primary" | "muted" | "inherit"',
          default: '"primary"',
          description: "Brand color, secondary text color, or the surrounding text color.",
        },
        {
          name: "underline",
          type: '"hover" | "always" | "none"',
          default: '"hover"',
          description: "When the underline shows. Use `always` for links inside running text.",
        },
        {
          name: "external",
          type: "boolean",
          default: "false",
          description:
            'Opens in a new tab (`target="_blank"`, unless you pass `target`) and merges `noopener noreferrer` into `rel` (with `asChild`, also into the child\'s own `rel`). Adds the icon and the hidden text.',
        },
        {
          name: "externalLabel",
          type: "string",
          default: '"(opens in a new tab)"',
          description:
            'Visually hidden text added to external links for screen reader users. Pass `""` to leave it out.',
        },
        {
          name: "showExternalIcon",
          type: "boolean",
          default: "true",
          description: "Shows the external-link icon on `external` links.",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          description:
            "Renders the single child (e.g. a router `Link`) with link styling instead of an `<a>`. Put the link target and any `ref` on the child.",
        },
      ],
    },
  ],
  keyboard: [{ keys: ["Enter"], description: "Follows the link." }],
  accessibility: [
    "Renders a native `<a>`, so it's focusable, follows with Enter and keeps browser features like opening in a new tab. Use a Button for actions that don't navigate.",
    "External links get visually hidden “(opens in a new tab)” text, so the change of context isn't a surprise, and a decorative icon (`aria-hidden`) for sighted users.",
    'Color alone doesn\'t identify a link inside text: use `underline="always"` there. The default hover underline suits navigation and lists where links are clearly links.',
    "A focus ring shows on keyboard focus. Visited links keep the same color.",
  ],
};
