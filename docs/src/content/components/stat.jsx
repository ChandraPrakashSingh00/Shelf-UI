import { Stat } from "shelf-ui-react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import InCard from "../../examples/stat/InCard.jsx";
import inCardCode from "../../examples/stat/InCard.jsx?raw";
import Loading from "../../examples/stat/Loading.jsx";
import loadingCode from "../../examples/stat/Loading.jsx?raw";
import LowerIsBetter from "../../examples/stat/LowerIsBetter.jsx";
import lowerIsBetterCode from "../../examples/stat/LowerIsBetter.jsx?raw";
import Overview from "../../examples/stat/Overview.jsx";
import overviewCode from "../../examples/stat/Overview.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const variants = ["card", "plain"];
const sizes = ["sm", "md"];

const parseChange = (text) => {
  const number = Number.parseFloat(text);
  return Number.isFinite(number) ? number : undefined;
};

function StatThumbnail() {
  return (
    <Stat
      size="sm"
      label="Revenue"
      value="₹4,52,300"
      change={12.5}
      changeLabel="vs last week"
      style={{ width: "100%", maxWidth: 200 }}
    />
  );
}

export const statDoc = {
  slug: "stat",
  name: "Stat",
  category: "Data display",
  summary: "Key figure for dashboards, with a label and an up or down trend.",
  description:
    "Shows a key number — revenue, orders, refunds — with its label and how it changed. The trend has an arrow, a color and hidden text for screen readers, and `higherIsBetter` flips the colors for figures where a drop is good news.",
  keywords: [
    "statistic",
    "metric",
    "kpi",
    "dashboard",
    "number",
    "trend",
    "analytics",
    "revenue",
    "summary card",
  ],
  imports: ["Stat"],
  Thumbnail: StatThumbnail,
  Playground: definePlayground({
    defaults: {
      label: "Revenue",
      value: "₹4,52,300",
      change: "12.5",
      changeLabel: "vs last week",
      higherIsBetter: true,
      variant: "card",
      size: "md",
      loading: false,
    },
    controls: {
      label: { type: "text", label: "Label" },
      value: { type: "text", label: "Value" },
      change: { type: "text", label: "Change (number)" },
      changeLabel: { type: "text", label: "Change label" },
      variant: { type: "select", label: "Variant", options: variants },
      size: { type: "select", label: "Size", options: sizes },
      higherIsBetter: { type: "boolean", label: "Higher is better" },
      loading: { type: "boolean", label: "Loading" },
    },
    render: (values) => (
      <Stat
        label={values.label}
        value={values.value}
        change={parseChange(values.change)}
        changeLabel={values.changeLabel || undefined}
        higherIsBetter={values.higherIsBetter}
        variant={values.variant}
        size={values.size}
        loading={values.loading}
        style={{ width: "100%", maxWidth: 280 }}
      />
    ),
    code: (values) =>
      withImport(
        ["Stat"],
        formatJsx(
          "Stat",
          {
            label: values.label,
            value: values.value,
            change: parseChange(values.change),
            changeLabel: values.changeLabel || undefined,
            higherIsBetter: values.higherIsBetter ? undefined : expr("false"),
            variant: values.variant,
            size: values.size,
            loading: values.loading,
          },
          undefined,
          { defaults: { variant: "card", size: "md" } },
        ),
      ),
  }),
  examples: [
    {
      id: "overview",
      title: "Dashboard overview",
      description:
        "A responsive grid of stats with icons. Refunds set `higherIsBetter={false}`, so their drop shows in green.",
      Component: Overview,
      code: overviewCode,
      responsive: true,
    },
    {
      id: "lower-is-better",
      title: "When a decrease is good news",
      description:
        "For cancellations, delivery times or returns, set `higherIsBetter={false}`. `formatChange` turns the number into text — here days instead of a percentage — and `description` adds a note.",
      Component: LowerIsBetter,
      code: lowerIsBetterCode,
    },
    {
      id: "loading",
      title: "Loading",
      description:
        "`loading` keeps the label and swaps the figures for skeletons of the same size, so the layout doesn't jump. The stat is marked `aria-busy` and tells screen readers it's loading.",
      Component: Loading,
      code: loadingCode,
    },
    {
      id: "in-card",
      title: "Plain stats inside a card",
      description:
        '`variant="plain"` drops the border and padding to group several stats in one surface; `size="sm"` makes the value smaller. A change of `0` is neutral.',
      Component: InCard,
      code: inCardCode,
    },
  ],
  api: [
    {
      title: "Stat",
      description:
        "Renders a `<div>` around a description list (`<dt>` for the label, `<dd>` for the value and change) and accepts the `<div>`'s native attributes. The `ref` points to the `<div>`.",
      props: [
        {
          name: "label",
          type: "node",
          required: true,
          description: 'What the figure measures, e.g. "Revenue".',
        },
        {
          name: "value",
          type: "node",
          description: 'The figure, already formatted, e.g. "₹4,52,300".',
        },
        {
          name: "change",
          type: "number",
          description:
            "Change as a number, e.g. `12.5` or `-3.2`. Positive shows an up arrow, negative a down arrow, zero is neutral.",
        },
        {
          name: "formatChange",
          type: "function(change)",
          default: "(n) => `${Math.abs(n)}%`",
          description:
            "Returns the text for the change. The arrow and the hidden text already say the direction, so show the absolute value.",
        },
        {
          name: "changeLabel",
          type: "node",
          description: 'Context after the change, e.g. "vs last week".',
        },
        {
          name: "higherIsBetter",
          type: "boolean",
          default: "true",
          description:
            "Whether an increase is good news (green). Set `false` for refunds or cancellations, so a decrease is green.",
        },
        {
          name: "trendLabels",
          type: "object",
          default: '{ increase: "Increased by", decrease: "Decreased by", none: "No change," }',
          description:
            "Screen reader text before the change. Pass only the keys you want to change, e.g. to translate them.",
        },
        { name: "icon", type: "node", description: "Decorative icon in the corner." },
        {
          name: "description",
          type: "node",
          description: "Supporting text below the figures.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          description:
            "Shows skeletons instead of the value and change, and marks the stat `aria-busy`.",
        },
        {
          name: "loadingLabel",
          type: "string",
          default: '"Loading…"',
          description: "Screen reader text in place of the value while loading.",
        },
        {
          name: "variant",
          type: '"card" | "plain"',
          default: '"card"',
          description: "`card` draws a bordered surface; `plain` has no border or padding.",
        },
        {
          name: "size",
          type: '"sm" | "md"',
          default: '"md"',
          description: "Size of the value, the icon and the padding.",
        },
      ],
    },
  ],
  accessibility: [
    "The label and figures form a description list, so screen readers read them as a pair: “Revenue: ₹4,52,300, Increased by 12.5% vs last week”.",
    "The trend isn't conveyed by color alone: it has an arrow and visually hidden text (“Increased by”, “Decreased by”, “No change”). Translate that text with `trendLabels`.",
    "The success and danger text colors meet contrast requirements on the card surface in both themes.",
    "The icon and the arrows are decorative (`aria-hidden`).",
    'While `loading`, the stat has `aria-busy="true"` and a hidden “Loading…” in place of the value; the skeletons are hidden from screen readers.',
  ],
};
