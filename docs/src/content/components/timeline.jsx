import { Timeline } from "@codecps/ui";
import { definePlayground } from "../../components/LivePlayground.jsx";
import ActivityLog from "../../examples/timeline/ActivityLog.jsx";
import activityLogCode from "../../examples/timeline/ActivityLog.jsx?raw";
import FailedStep from "../../examples/timeline/FailedStep.jsx";
import failedStepCode from "../../examples/timeline/FailedStep.jsx?raw";
import Horizontal from "../../examples/timeline/Horizontal.jsx";
import horizontalCode from "../../examples/timeline/Horizontal.jsx?raw";
import OrderTracking from "../../examples/timeline/OrderTracking.jsx";
import orderTrackingCode from "../../examples/timeline/OrderTracking.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const orientations = ["vertical", "horizontal"];
const sizes = ["sm", "md"];
const steps = [
  { title: "Order placed", time: "6 Oct, 10:42 AM" },
  { title: "Packed", time: "6 Oct, 6:15 PM" },
  { title: "Shipped", time: "7 Oct, 9:30 AM" },
  { title: "Out for delivery", time: "8 Oct, 8:05 AM" },
  { title: "Delivered", time: "8 Oct, 5:12 PM" },
];
const stepTitles = steps.map((step) => step.title);

// Steps before the current one are complete; the current one fails with `failed`;
// the last step is complete rather than current once it's reached.
function getSteps({ current, failed }) {
  const currentIndex = stepTitles.indexOf(current);
  const done = currentIndex === steps.length - 1 && !failed;
  return steps.map((step, index) => {
    const status =
      index < currentIndex || (done && index === currentIndex)
        ? "complete"
        : index === currentIndex
          ? failed
            ? "error"
            : "current"
          : "upcoming";
    return { ...step, status, time: status === "upcoming" ? undefined : step.time };
  });
}

function TimelineThumbnail() {
  return (
    <Timeline size="sm" style={{ width: "100%", maxWidth: 180 }}>
      <Timeline.Item status="complete" title="Order placed" time="6 Oct, 10:42 AM" />
      <Timeline.Item status="current" title="Shipped" time="7 Oct, 9:30 AM" />
      <Timeline.Item title="Delivered" />
    </Timeline>
  );
}

export const timelineDoc = {
  slug: "timeline",
  name: "Timeline",
  category: "Data display",
  summary: "Ordered list of events, for order tracking and activity logs.",
  description:
    "Shows the steps of a process or a history of events in order — like an order moving from placed to delivered, or who changed a product and when. Each item has a status (complete, current, upcoming or failed) that sets its dot, and the line fills in as the steps complete.",
  keywords: [
    "order tracking",
    "tracking",
    "history",
    "activity",
    "audit log",
    "events",
    "progress",
    "steps",
    "feed",
  ],
  imports: ["Timeline"],
  Thumbnail: TimelineThumbnail,
  Playground: definePlayground({
    defaults: {
      orientation: "vertical",
      size: "md",
      current: "Out for delivery",
      failed: false,
    },
    controls: {
      orientation: { type: "select", label: "Orientation", options: orientations },
      size: { type: "select", label: "Size", options: sizes },
      current: { type: "select", label: "Current step", options: stepTitles },
      failed: { type: "boolean", label: "Current step failed" },
    },
    render: (values) => (
      <Timeline
        aria-label="Order status"
        orientation={values.orientation}
        size={values.size}
        style={{ width: "100%", maxWidth: values.orientation === "vertical" ? 360 : undefined }}
      >
        {getSteps(values).map((step) => (
          <Timeline.Item
            key={step.title}
            status={step.status}
            title={step.title}
            time={step.time}
          />
        ))}
      </Timeline>
    ),
    code: (values) => {
      const items = getSteps(values)
        .map((step) =>
          formatJsx(
            "Timeline.Item",
            { status: step.status, title: step.title, time: step.time },
            undefined,
            { defaults: { status: "upcoming" } },
          )
            .split("\n")
            .map((line) => `  ${line}`)
            .join("\n"),
        )
        .join("\n");
      const open = formatJsx(
        "Timeline",
        { "aria-label": "Order status", orientation: values.orientation, size: values.size },
        undefined,
        { defaults: { orientation: "vertical", size: "md" } },
      ).replace(/ ?\/>$/, ">");
      return withImport(["Timeline"], `${open}\n${items}\n</Timeline>`);
    },
  }),
  examples: [
    {
      id: "order-tracking",
      title: "Order tracking",
      description:
        'Completed steps get a check and a colored line; the current step is highlighted and has `aria-current="step"`. `dateTime` puts the time in a `<time>` element.',
      Component: OrderTracking,
      code: orderTrackingCode,
    },
    {
      id: "horizontal",
      title: "Horizontal",
      description:
        '`orientation="horizontal"` lays the steps out in a row. When the timeline\'s container is narrower than 36rem, it stacks vertically — switch the preview to mobile to see it.',
      Component: Horizontal,
      code: horizontalCode,
      responsive: true,
    },
    {
      id: "activity-log",
      title: "Activity log",
      description:
        'Custom `icon`s in the dots and `size="sm"` make a compact audit trail. Every entry has already happened, so `statusLabels={{ complete: null }}` leaves out the hidden “Completed” text.',
      Component: ActivityLog,
      code: activityLogCode,
    },
    {
      id: "failed-step",
      title: "Failed step",
      description:
        '`status="error"` marks a step that failed, with a cross and danger colors. Children go below the description — here, a button to fix the problem.',
      Component: FailedStep,
      code: failedStepCode,
    },
  ],
  api: [
    {
      title: "Timeline",
      description:
        "Renders an `<ol>` and accepts its native attributes, like `aria-label`. The `ref` points to it.",
      props: [
        {
          name: "orientation",
          type: '"vertical" | "horizontal"',
          default: '"vertical"',
          description:
            "Direction of the timeline. A horizontal timeline stacks vertically when its container is narrower than 36rem.",
        },
        {
          name: "size",
          type: '"sm" | "md"',
          default: '"md"',
          description: "Size of the dots and the text.",
        },
        {
          name: "statusLabels",
          type: "object",
          default:
            '{ complete: "Completed", current: "Current", upcoming: "Upcoming", error: "Failed" }',
          description:
            "Hidden status text read before each item. Pass only the keys to change; `null` leaves a status's text out.",
        },
        { name: "children", type: "node", description: "`Timeline.Item` elements." },
      ],
    },
    {
      title: "Timeline.Item",
      description:
        "Also exported as `TimelineItem`. Renders an `<li>`; other props and the `ref` go to it.",
      props: [
        { name: "title", type: "node", description: 'What happened, e.g. "Shipped".' },
        { name: "description", type: "node", description: "Supporting text below the title." },
        {
          name: "time",
          type: "node",
          description: 'When it happened, as display text, e.g. "6 Oct, 10:42 AM".',
        },
        {
          name: "dateTime",
          type: "string",
          description:
            'Machine-readable date for `time`, e.g. "2026-10-06T10:42". Renders `time` in a `<time>` element.',
        },
        {
          name: "status",
          type: '"complete" | "current" | "upcoming" | "error"',
          default: '"upcoming"',
          description:
            'Sets the dot and the hidden status text. The current item gets `aria-current="step"`; the line after a complete item is colored.',
        },
        {
          name: "icon",
          type: "node",
          description:
            "Content of the dot, replacing the default check (complete) or cross (error). `null` shows a plain dot.",
        },
        {
          name: "children",
          type: "node",
          description: "Extra content below the description, like a link or a button.",
        },
      ],
    },
  ],
  accessibility: [
    "The timeline is an ordered list (`<ol>`), so screen readers announce the number of steps and each step's position. Name it with `aria-label`, e.g. “Order #1042 status”.",
    "Each item starts with visually hidden status text (“Completed:”, “Current:”, “Upcoming:”, “Failed:”), so the status isn't conveyed by color alone. Change or remove it with `statusLabels`.",
    'The current item has `aria-current="step"`.',
    "The dots, icons and connecting lines are decorative (`aria-hidden`). In forced-colors mode they use system colors.",
    "Use `dateTime` with `time` so the date is machine-readable in a `<time>` element.",
  ],
};
