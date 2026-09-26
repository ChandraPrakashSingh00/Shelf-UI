import { Alert } from "@codecps/ui";
import { definePlayground } from "../../components/LivePlayground.jsx";
import CustomIcon from "../../examples/alert/CustomIcon.jsx";
import customIconCode from "../../examples/alert/CustomIcon.jsx?raw";
import Dismissible from "../../examples/alert/Dismissible.jsx";
import dismissibleCode from "../../examples/alert/Dismissible.jsx?raw";
import Variants from "../../examples/alert/Variants.jsx";
import variantsCode from "../../examples/alert/Variants.jsx?raw";
import WithAction from "../../examples/alert/WithAction.jsx";
import withActionCode from "../../examples/alert/WithAction.jsx?raw";
import { expr, formatJsx, withImport } from "../../lib/jsx.js";

const variants = ["info", "success", "warning", "error"];

function AlertThumbnail() {
  return (
    <div style={{ width: "100%", maxWidth: 240 }}>
      <Alert variant="success" title="Payment received" />
    </div>
  );
}

export const alertDoc = {
  slug: "alert",
  name: "Alert",
  category: "Feedback",
  summary: "Inline message for information, success, warnings and errors.",
  description:
    "An inline message that stays on the page until it's resolved or dismissed. Use it for page-level information, the result of an action, or problems that need attention. For short-lived confirmations, use a Toast instead.",
  keywords: ["banner", "callout", "notice", "message", "notification", "error", "warning"],
  imports: ["Alert"],
  Thumbnail: AlertThumbnail,
  Playground: definePlayground({
    defaults: {
      variant: "info",
      title: "Scheduled maintenance",
      description: "The dashboard is read-only on Sunday, 02:00–03:00 IST.",
      dismissible: false,
      showIcon: true,
    },
    controls: {
      variant: { type: "select", label: "Variant", options: variants },
      title: { type: "text", label: "Title" },
      description: { type: "text", label: "Description" },
      dismissible: { type: "boolean", label: "Dismissible" },
      showIcon: { type: "boolean", label: "Icon" },
    },
    render: (values) => (
      <div style={{ width: "100%" }}>
        <Alert
          variant={values.variant}
          title={values.title || undefined}
          description={values.description || undefined}
          icon={values.showIcon ? undefined : null}
          onDismiss={values.dismissible ? () => {} : undefined}
        />
      </div>
    ),
    code: (values) =>
      withImport(
        ["Alert"],
        formatJsx(
          "Alert",
          {
            variant: values.variant,
            title: values.title || undefined,
            description: values.description || undefined,
            icon: values.showIcon ? undefined : expr("null"),
            onDismiss: values.dismissible ? expr("() => setVisible(false)") : undefined,
          },
          undefined,
          { defaults: { variant: "info" } },
        ),
      ),
  }),
  examples: [
    { id: "variants", title: "Variants", Component: Variants, code: variantsCode },
    {
      id: "with-action",
      title: "With an action",
      description: "Give people a way to resolve the message right where they read it.",
      Component: WithAction,
      code: withActionCode,
    },
    {
      id: "dismissible",
      title: "Dismissible",
      description:
        "Passing `onDismiss` adds a close button. The alert is controlled: hide it in your state when it's called.",
      Component: Dismissible,
      code: dismissibleCode,
    },
    {
      id: "custom-icon",
      title: "Custom icon",
      description: "Replace the status icon with `icon`, or pass `null` to hide it.",
      Component: CustomIcon,
      code: customIconCode,
    },
  ],
  api: [
    {
      title: "Alert",
      description: "Renders a `<div>` and accepts its native attributes. The `ref` points to it.",
      props: [
        {
          name: "variant",
          type: '"info" | "success" | "warning" | "error"',
          default: '"info"',
          description: "Tone of the message; also picks the icon and the ARIA role.",
        },
        { name: "title", type: "node", description: "Short summary, shown in bold." },
        { name: "description", type: "node", description: "Supporting text." },
        { name: "icon", type: "node", description: "Replaces the status icon. `null` hides it." },
        { name: "action", type: "node", description: "Actions under the text, e.g. a small `Button`." },
        { name: "onDismiss", type: "function", description: "Shows a dismiss button that calls this handler." },
        { name: "dismissLabel", type: "string", default: '"Dismiss"', description: "Accessible name of the dismiss button." },
        {
          name: "role",
          type: "string",
          description: '`"alert"` for errors and warnings, `"status"` otherwise. Override if needed.',
        },
        { name: "children", type: "node", description: "Extra content below the description." },
      ],
    },
  ],
  accessibility: [
    '`error` and `warning` alerts use `role="alert"`, which screen readers announce immediately. `info` and `success` use the polite `role="status"`.',
    "Alerts that are on the page when it loads are not announced. The roles matter for alerts that appear after an action.",
    "The dismiss button is named by `dismissLabel` (“Dismiss” by default).",
    "The icon is decorative; the title and description carry the meaning.",
  ],
};
