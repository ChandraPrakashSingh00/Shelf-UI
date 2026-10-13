import { Banner, Button } from "@shelf-ui/react";
import { useState } from "react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Dismissible from "../../examples/banner/Dismissible.jsx";
import dismissibleCode from "../../examples/banner/Dismissible.jsx?raw";
import Sale from "../../examples/banner/Sale.jsx";
import saleCode from "../../examples/banner/Sale.jsx?raw";
import StartAligned from "../../examples/banner/StartAligned.jsx";
import startAlignedCode from "../../examples/banner/StartAligned.jsx?raw";
import Sticky from "../../examples/banner/Sticky.jsx";
import stickyCode from "../../examples/banner/Sticky.jsx?raw";
import Variants from "../../examples/banner/Variants.jsx";
import variantsCode from "../../examples/banner/Variants.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const variants = ["primary", "info", "success", "warning", "danger", "neutral"];
const alignments = ["center", "start"];

function BannerThumbnail() {
  return (
    <div style={{ display: "grid", gap: 8, width: "100%", maxWidth: 280 }}>
      <Banner title="Diwali Sale" action={<a href="#sale">Shop now</a>}>
        50% off
      </Banner>
      <Banner variant="warning" align="start">
        COD unavailable for 110001
      </Banner>
    </div>
  );
}

function PlaygroundBanner(values) {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <Button variant="outline" onClick={() => setVisible(true)}>
        Show the banner again
      </Button>
    );
  }

  return (
    <Banner
      variant={values.variant}
      align={values.align}
      title={values.title || undefined}
      action={values.action ? <a href="#diwali-sale">Shop now</a> : undefined}
      onDismiss={values.dismissible ? () => setVisible(false) : undefined}
    >
      {values.message}
    </Banner>
  );
}

export const bannerDoc = {
  slug: "banner",
  name: "Banner",
  category: "Feedback",
  summary: "Full-width announcement bar for sales, shipping updates and service notices.",
  description:
    "A bar across the top of a page or app for news that applies everywhere: a festive sale, free-shipping thresholds or a payment outage. Add a link or button with `action`, let people hide it with `onDismiss`, and keep it in view with `sticky`.",
  keywords: [
    "announcement",
    "announcement bar",
    "promo",
    "promotion",
    "sale",
    "notice",
    "top bar",
    "site-wide message",
    "strip",
  ],
  imports: ["Banner"],
  Thumbnail: BannerThumbnail,
  Playground: definePlayground({
    defaults: {
      variant: "primary",
      align: "center",
      title: "Diwali Sale is live!",
      message: "Flat 50% off on electronics.",
      action: true,
      dismissible: true,
    },
    controls: {
      variant: { type: "select", label: "Variant", options: variants },
      align: { type: "select", label: "Align", options: alignments },
      title: { type: "text", label: "Title" },
      message: { type: "text", label: "Message" },
      action: { type: "boolean", label: "Action link" },
      dismissible: { type: "boolean", label: "Dismissible" },
    },
    render: (values) => <PlaygroundBanner {...values} />,
    code: (values) =>
      withImport(
        ["Banner"],
        formatJsx(
          "Banner",
          {
            variant: values.variant,
            align: values.align,
            title: values.title || undefined,
            action: values.action ? expr('<a href="/sale">Shop now</a>') : undefined,
            onDismiss: values.dismissible ? expr("() => setVisible(false)") : undefined,
          },
          values.message,
          { defaults: { variant: "primary", align: "center" } },
        ),
      ),
  }),
  examples: [
    {
      id: "sale",
      title: "Sale announcement",
      description:
        "The default `primary` banner is a solid brand-colored bar. `title` adds a bold lead-in, and plain links in `action` are underlined in the banner's text color.",
      Component: Sale,
      code: saleCode,
    },
    {
      id: "variants",
      title: "Variants",
      description:
        "`info`, `success`, `warning` and `danger` use subtle tints with a matching status icon; `neutral` is for low-key notices.",
      Component: Variants,
      code: variantsCode,
    },
    {
      id: "dismissible",
      title: "Dismissible",
      description:
        "`onDismiss` adds a × button. The banner doesn't hide itself: remove it from your state (and remember the choice, e.g. in `localStorage`, to keep it hidden on the next visit).",
      Component: Dismissible,
      code: dismissibleCode,
    },
    {
      id: "sticky",
      title: "Sticky",
      description:
        "With `sticky`, the banner stays at the top of its scroll container while the content scrolls underneath. Scroll the list to try it.",
      Component: Sticky,
      code: stickyCode,
    },
    {
      id: "start-aligned",
      title: "Start aligned with an icon",
      description:
        '`align="start"` lines the content up with the page instead of centering it. `icon` takes any icon, and `action` any button.',
      Component: StartAligned,
      code: startAlignedCode,
      responsive: true,
    },
  ],
  api: [
    {
      title: "Banner",
      description: "Renders a `<section>` landmark. Other props and the `ref` go to it.",
      props: [
        {
          name: "variant",
          type: '"primary" | "info" | "success" | "warning" | "danger" | "neutral"',
          default: '"primary"',
          description: "`primary` is a solid brand-colored bar; the others are subtle tints.",
        },
        {
          name: "title",
          type: "node",
          description: "Bold lead-in shown before the message.",
        },
        { name: "children", type: "node", description: "The message." },
        {
          name: "icon",
          type: "node",
          description:
            "Decorative icon before the message. The status variants show a default icon; pass `null` to hide it.",
        },
        {
          name: "action",
          type: "node",
          description: "A link or button after the message, like “Shop now”.",
        },
        {
          name: "onDismiss",
          type: "function",
          description:
            "Shows a dismiss (×) button that calls this function. Hide the banner in your state.",
        },
        {
          name: "dismissLabel",
          type: "string",
          default: '"Dismiss"',
          description: "Accessible name of the dismiss button.",
        },
        {
          name: "sticky",
          type: "boolean",
          default: "false",
          description: "Sticks to the top of the viewport or scroll container while scrolling.",
        },
        {
          name: "align",
          type: '"center" | "start"',
          default: '"center"',
          description:
            "Alignment of the content. Narrow banners (under 30rem) always start-align, so wrapped lines read naturally.",
        },
        {
          name: "label",
          type: "string",
          default: '"Announcement"',
          description: "Accessible name of the region landmark.",
        },
      ],
    },
  ],
  accessibility: [
    "Renders a `<section>` named by `label` (“Announcement” by default), so it is listed as a region landmark and easy to find or skip.",
    "It is not a live region: the banner is part of the page when it loads, so screen readers read it in order instead of interrupting. For messages that appear after something happens, use `Alert` or a toast.",
    "Status icons are decorative (`aria-hidden`); the text carries the meaning, so write messages that make sense without color.",
    "The dismiss button has an accessible name (“Dismiss”, configurable with `dismissLabel`). After dismissing, move focus to a sensible place, since the button is gone.",
    "Focus rings inside the solid `primary` banner switch to the banner's text color, so they stay visible against the brand blue.",
  ],
};
