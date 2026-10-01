import { Stepper } from "@codecps/ui";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Checkout from "../../examples/stepper/Checkout.jsx";
import checkoutCode from "../../examples/stepper/Checkout.jsx?raw";
import Clickable from "../../examples/stepper/Clickable.jsx";
import clickableCode from "../../examples/stepper/Clickable.jsx?raw";
import ErrorState from "../../examples/stepper/ErrorState.jsx";
import errorStateCode from "../../examples/stepper/ErrorState.jsx?raw";
import Vertical from "../../examples/stepper/Vertical.jsx";
import verticalCode from "../../examples/stepper/Vertical.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const orientations = ["horizontal", "vertical"];
const sizes = ["sm", "md"];
const activeSteps = ["0", "1", "2", "3"];

const thumbnailSteps = [{ title: "Address" }, { title: "Payment" }, { title: "Review" }];

function StepperThumbnail() {
  return (
    <div style={{ width: "100%", maxWidth: 260 }}>
      <Stepper steps={thumbnailSteps} activeStep={1} size="sm" />
    </div>
  );
}

function getPlaygroundSteps(values) {
  return [
    { title: "Address", description: "Mumbai 400050" },
    values.paymentError
      ? { title: "Payment", description: "Payment failed", status: "error" }
      : { title: "Payment", description: "UPI or card" },
    { title: "Review", description: "Place your order" },
  ].map((step) => (values.descriptions ? step : { ...step, description: undefined }));
}

// Writes the `steps` array the way a developer would.
function formatSteps(steps) {
  const lines = steps.map((step) => {
    const parts = [`title: "${step.title}"`];
    if (step.description) parts.push(`description: "${step.description}"`);
    if (step.status) parts.push(`status: "${step.status}"`);
    return `  { ${parts.join(", ")} },`;
  });
  return `const steps = [\n${lines.join("\n")}\n];`;
}

export const stepperDoc = {
  slug: "stepper",
  name: "Stepper",
  category: "Navigation",
  summary: "Shows progress through a multi-step flow, like a checkout or onboarding.",
  description:
    "Shows where people are in a flow with several steps, like Address → Payment → Review at checkout, or a seller's onboarding. You own the flow and pass `activeStep`; add `onStepClick` to let people go back to completed steps.",
  keywords: [
    "steps",
    "wizard",
    "progress",
    "checkout",
    "onboarding",
    "multi-step form",
    "timeline",
    "stages",
  ],
  imports: ["Stepper"],
  Thumbnail: StepperThumbnail,
  Playground: definePlayground({
    defaults: {
      orientation: "horizontal",
      size: "md",
      activeStep: "1",
      descriptions: true,
      paymentError: false,
    },
    controls: {
      orientation: { type: "select", label: "Orientation", options: orientations },
      size: { type: "select", label: "Size", options: sizes },
      activeStep: { type: "select", label: "Active step", options: activeSteps },
      descriptions: { type: "boolean", label: "Descriptions" },
      paymentError: { type: "boolean", label: "Payment error" },
    },
    render: (values) => (
      <div style={{ width: "100%", maxWidth: values.orientation === "vertical" ? 320 : 640 }}>
        <Stepper
          steps={getPlaygroundSteps(values)}
          activeStep={Number(values.activeStep)}
          orientation={values.orientation}
          size={values.size}
        />
      </div>
    ),
    code: (values) =>
      withImport(
        ["Stepper"],
        `${formatSteps(getPlaygroundSteps(values))}\n\n${formatJsx(
          "Stepper",
          {
            steps: expr("steps"),
            activeStep: Number(values.activeStep),
            orientation: values.orientation,
            size: values.size,
          },
          undefined,
          { defaults: { orientation: "horizontal", size: "md" } },
        )}`,
      ),
  }),
  examples: [
    {
      id: "checkout",
      title: "Checkout flow",
      description:
        "The parent owns the flow: Back and Continue change `activeStep`. Pass `steps.length` when everything is done. Switch the preview to Mobile to see the compact layout, which shows only the current step's title.",
      Component: Checkout,
      code: checkoutCode,
      responsive: true,
    },
    {
      id: "vertical",
      title: "Vertical onboarding",
      description:
        '`orientation="vertical"` stacks the steps with their descriptions, which suits side panels and longer flows. `optional` marks steps that can be skipped.',
      Component: Vertical,
      code: verticalCode,
    },
    {
      id: "clickable",
      title: "Going back to completed steps",
      description:
        "With `onStepClick`, completed steps become buttons that call it with their index. Upcoming steps stay plain text, so people can't skip ahead.",
      Component: Clickable,
      code: clickableCode,
      responsive: true,
    },
    {
      id: "error",
      title: "Error state",
      description:
        '`status: "error"` marks a step as failed, with an exclamation mark and red text. Use its `description` to say what went wrong.',
      Component: ErrorState,
      code: errorStateCode,
    },
  ],
  api: [
    {
      title: "Stepper",
      description: "Renders an `<ol>`. Other props and the `ref` go to it.",
      props: [
        {
          name: "steps",
          type: "array",
          required: true,
          description:
            '`{ id, title, description, optional, status }` objects. `title` (node) is required; `id` defaults to the index; `optional` shows an “Optional” hint; `status: "error"` marks the step as failed.',
        },
        {
          name: "activeStep",
          type: "number",
          required: true,
          description:
            "Index of the current step. Steps before it are complete; pass `steps.length` when the flow is finished.",
        },
        {
          name: "onStepClick",
          type: "function(index)",
          description:
            "Makes completed steps buttons; called with the index of the step that was clicked.",
        },
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description:
            "Layout. A horizontal stepper narrower than 36rem shows only the current step's title; the others stay available to screen readers.",
        },
        {
          name: "size",
          type: '"sm" | "md"',
          default: '"md"',
          description: "Size of the step circles and text.",
        },
        {
          name: "label",
          type: "string",
          default: '"Progress"',
          description: "Accessible name of the list, like “Checkout progress”.",
        },
        {
          name: "statusLabels",
          type: "object",
          default:
            '{ complete: "Completed", current: "Current", upcoming: "Not started", error: "Error" }',
          description:
            "Visually hidden status text read after each step. Pass the keys you want to translate.",
        },
        {
          name: "optionalLabel",
          type: "node",
          default: '"Optional"',
          description: "Hint shown for optional steps.",
        },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["Tab", "Shift + Tab"],
      description: "With `onStepClick`, moves focus between the completed steps' buttons.",
    },
    {
      keys: ["Enter", "Space"],
      description: "Goes back to the focused completed step.",
    },
  ],
  accessibility: [
    'Renders an ordered list named by `label`, so screen readers announce “list, 3 items” and each step\'s position. The current step has `aria-current="step"`.',
    "Every step ends with visually hidden status text (“Completed”, “Current”, “Not started” or “Error”), so status never depends on color or icons alone. Translate it with `statusLabels`.",
    "Numbers, checks and connector lines are decorative (`aria-hidden`).",
    "With `onStepClick`, only completed steps are buttons; their accessible name includes the title, description and status.",
    "The compact horizontal layout hides titles visually only; screen readers still hear every step. In forced-colors mode, completed and current steps use system highlight colors.",
  ],
};
