import { Button, EmptyState } from "@shelf-ui/react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import EmptyCart from "../../examples/empty-state/EmptyCart.jsx";
import emptyCartCode from "../../examples/empty-state/EmptyCart.jsx?raw";
import ErrorRetry from "../../examples/empty-state/ErrorRetry.jsx";
import errorRetryCode from "../../examples/empty-state/ErrorRetry.jsx?raw";
import InTable from "../../examples/empty-state/InTable.jsx";
import inTableCode from "../../examples/empty-state/InTable.jsx?raw";
import NoResults from "../../examples/empty-state/NoResults.jsx";
import noResultsCode from "../../examples/empty-state/NoResults.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const sizes = ["sm", "md", "lg"];
const variants = ["plain", "bordered"];
const tones = ["neutral", "primary", "success", "warning", "danger"];
const alignments = ["center", "start"];

function InboxIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 13h5l1.5 3h5L16 13h5" />
      <path d="M5.5 5h13L21 13v6H3v-6l2.5-8Z" />
    </svg>
  );
}

function EmptyStateThumbnail() {
  return (
    <EmptyState
      size="sm"
      icon={<InboxIcon />}
      title="No orders yet"
      actions={<Button size="sm">Add product</Button>}
      style={{ padding: 0 }}
    />
  );
}

export const emptyStateDoc = {
  slug: "empty-state",
  name: "EmptyState",
  category: "Data display",
  summary: "Placeholder for an empty view, with a message and a next step.",
  description:
    "Fills a view that has nothing to show — an empty cart, a search with no results, an orders table before the first sale, or a list that failed to load — with an icon, a short explanation and the action that gets people moving again.",
  keywords: [
    "empty",
    "blank slate",
    "zero state",
    "no data",
    "no results",
    "empty cart",
    "placeholder",
    "error state",
  ],
  imports: ["EmptyState"],
  Thumbnail: EmptyStateThumbnail,
  Playground: definePlayground({
    defaults: {
      title: "No orders yet",
      description: "When customers buy from your store, their orders show up here.",
      size: "md",
      variant: "plain",
      tone: "neutral",
      align: "center",
      icon: true,
      actions: true,
    },
    controls: {
      title: { type: "text", label: "Title" },
      description: { type: "text", label: "Description" },
      size: { type: "select", label: "Size", options: sizes },
      variant: { type: "select", label: "Variant", options: variants },
      tone: { type: "select", label: "Tone", options: tones },
      align: { type: "select", label: "Align", options: alignments },
      icon: { type: "boolean", label: "Icon" },
      actions: { type: "boolean", label: "Actions" },
    },
    render: (values) => (
      <EmptyState
        title={values.title}
        description={values.description || undefined}
        size={values.size}
        variant={values.variant}
        tone={values.tone}
        align={values.align}
        icon={values.icon ? <InboxIcon /> : undefined}
        actions={values.actions ? <Button>Add product</Button> : undefined}
        style={{ maxWidth: 560 }}
      />
    ),
    code: (values) =>
      withImport(
        values.actions ? ["Button", "EmptyState"] : ["EmptyState"],
        formatJsx(
          "EmptyState",
          {
            icon: values.icon ? expr("<InboxIcon />") : undefined,
            title: values.title,
            description: values.description || undefined,
            actions: values.actions ? expr("<Button>Add product</Button>") : undefined,
            size: values.size,
            variant: values.variant,
            tone: values.tone,
            align: values.align,
          },
          undefined,
          { defaults: { size: "md", variant: "plain", tone: "neutral", align: "center" } },
        ),
      ),
  }),
  examples: [
    {
      id: "empty-cart",
      title: "Empty cart",
      description:
        "An icon in a tinted circle (`tone`), a friendly title and the next steps as `actions`. Buttons can be links with `asChild`.",
      Component: EmptyCart,
      code: emptyCartCode,
    },
    {
      id: "no-results",
      title: "No search results",
      description:
        '`variant="bordered"` frames the empty area. It sits in a `role="status"` region that is always on the page, so screen readers announce it when a search comes back empty. Clear the filters to see the other state.',
      Component: NoResults,
      code: noResultsCode,
    },
    {
      id: "in-table",
      title: "Empty table in a card",
      description:
        'Pass a small (`size="sm"`) empty state as the `emptyState` of a `Table`. `headingLevel={4}` keeps the heading outline right under the card\'s `h3` title.',
      Component: InTable,
      code: inTableCode,
    },
    {
      id: "error",
      title: "Error with retry",
      description:
        '`tone="danger"` for a view that failed to load, with a Retry button that shows its progress. If the error replaces content the person was looking at, announce it — e.g. with `role="alert"`.',
      Component: ErrorRetry,
      code: errorRetryCode,
    },
  ],
  api: [
    {
      title: "EmptyState",
      description: "Renders a `<div>` and accepts its native attributes. The `ref` points to it.",
      props: [
        {
          name: "title",
          type: "node",
          required: true,
          description: 'Short heading, e.g. "Your cart is empty".',
        },
        {
          name: "description",
          type: "node",
          description: "One or two sentences on why it's empty or what to do next.",
        },
        { name: "icon", type: "node", description: "Decorative icon, shown in a soft circle." },
        {
          name: "image",
          type: "node",
          description:
            'Illustration shown instead of the icon, e.g. an `<img>`. Give it `alt=""` when it\'s decorative.',
        },
        {
          name: "actions",
          type: "node",
          description: "Buttons or links below the text, e.g. “Continue shopping”.",
        },
        {
          name: "children",
          type: "node",
          description: "Extra content between the text and the actions.",
        },
        {
          name: "headingLevel",
          type: "2 | 3 | 4 | 5 | 6",
          default: "3",
          description: "Level of the title heading. Match your page outline.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description:
            "Spacing, icon and title size. Use `sm` inside tables and cards, `lg` for a whole page.",
        },
        {
          name: "variant",
          type: '"plain" | "bordered"',
          default: '"plain"',
          description: "`bordered` draws a dashed box around it.",
        },
        {
          name: "tone",
          type: '"neutral" | "primary" | "success" | "warning" | "danger"',
          default: '"neutral"',
          description: "Color of the icon circle.",
        },
        {
          name: "align",
          type: '"center" | "start"',
          default: '"center"',
          description: "Alignment of the content.",
        },
      ],
    },
  ],
  accessibility: [
    "The title is a real heading (`h3` by default), so screen reader users can find the empty state by heading. Set `headingLevel` to fit your page outline.",
    'The icon is decorative (`aria-hidden`). An `image` keeps its own `alt` text; use `alt=""` for decorative illustrations.',
    'An empty state that appears in response to something the person did — a search, a filter, a failed load — isn\'t announced by itself. Render it inside a `role="status"` region that is already on the page (or `role="alert"` for errors that need immediate attention), or move focus to it.',
    "Actions are ordinary buttons and links, reachable with Tab. Use `Button asChild` around a link when the action navigates.",
  ],
};
