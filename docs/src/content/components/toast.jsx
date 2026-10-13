import { Button, Toast, useToast } from "@shelf-ui/react";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Position from "../../examples/toast/Position.jsx";
import positionCode from "../../examples/toast/Position.jsx?raw";
import Standalone from "../../examples/toast/Standalone.jsx";
import standaloneCode from "../../examples/toast/Standalone.jsx?raw";
import Variants from "../../examples/toast/Variants.jsx";
import variantsCode from "../../examples/toast/Variants.jsx?raw";
import WithAction from "../../examples/toast/WithAction.jsx";
import withActionCode from "../../examples/toast/WithAction.jsx?raw";

const variants = ["success", "error", "warning", "info"];
const durations = ["3000", "5000", "10000", "Infinity"];

function ShowToastButton(values) {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          variant: values.variant,
          title: values.title || undefined,
          message: values.message || undefined,
          duration: Number(values.duration),
        })
      }
    >
      Show toast
    </Button>
  );
}

function ToastThumbnail() {
  return (
    <div style={{ width: "100%", maxWidth: 250 }}>
      <Toast variant="success" title="Project created" duration={Infinity} />
    </div>
  );
}

const quote = (text) => JSON.stringify(text);

export const toastDoc = {
  slug: "toast",
  name: "Toast",
  category: "Feedback",
  summary: "Brief notification that appears and dismisses itself.",
  description:
    "A short-lived notification about the result of an action, like “Project created”. Wrap your app in `ToastProvider` once, then call `toast()` from `useToast()` anywhere. Toasts dismiss themselves, so keep critical information on the page.",
  keywords: ["notification", "snackbar", "flash message", "notify", "toaster", "feedback"],
  imports: ["ToastProvider", "useToast"],
  Thumbnail: ToastThumbnail,
  Playground: definePlayground({
    defaults: {
      variant: "success",
      title: "Project created",
      message: "storefront-web is ready to deploy.",
      duration: "5000",
    },
    controls: {
      variant: { type: "select", label: "Variant", options: variants },
      title: { type: "text", label: "Title" },
      message: { type: "text", label: "Message" },
      duration: { type: "select", label: "Duration (ms)", options: durations },
    },
    render: (values) => <ShowToastButton {...values} />,
    code: (values) => {
      const options = [
        `  variant: ${quote(values.variant)},`,
        values.title && `  title: ${quote(values.title)},`,
        values.message && `  message: ${quote(values.message)},`,
        values.duration !== "5000" && `  duration: ${values.duration},`,
      ].filter(Boolean);
      return [
        'import { useToast } from "@shelf-ui/react";',
        "",
        "const { toast } = useToast();",
        "",
        `toast({\n${options.join("\n")}\n});`,
      ].join("\n");
    },
  }),
  examples: [
    {
      id: "variants",
      title: "Variants",
      description: "Hover over a toast to pause its timer.",
      Component: Variants,
      code: variantsCode,
    },
    {
      id: "with-action",
      title: "With an action",
      description:
        "Give toasts with actions a longer or infinite `duration` so people can reach the button. Reuse an `id` to update or dismiss a specific toast.",
      Component: WithAction,
      code: withActionCode,
    },
    {
      id: "position",
      title: "Position",
      description:
        "Set `position` on the provider. A nested provider shows its own toasts, which is how this example appears at the top.",
      Component: Position,
      code: positionCode,
    },
    {
      id: "standalone",
      title: "Standalone",
      description: "`Toast` can also render on its own, for example in a custom notification area.",
      Component: Standalone,
      code: standaloneCode,
    },
  ],
  api: [
    {
      title: "ToastProvider",
      description: "Hosts the toast stack. Render it once, near the root of your app.",
      props: [
        {
          name: "position",
          type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"',
          default: '"bottom-right"',
          description: "Where toasts stack on the screen.",
        },
        {
          name: "limit",
          type: "number",
          default: "5",
          description: "Maximum visible toasts; the oldest are removed first.",
        },
        {
          name: "defaultDuration",
          type: "number",
          default: "5000",
          description: "Auto-dismiss delay (ms) for toasts that don't set one.",
        },
        {
          name: "label",
          type: "string",
          default: '"Notifications"',
          description: "Accessible name of the notifications region.",
        },
        { name: "children", type: "node", required: true, description: "Your app." },
      ],
    },
    {
      title: "useToast()",
      description: "Returns the toast API. Must be called inside `ToastProvider`.",
      props: [
        {
          name: "toast",
          type: "function(options)",
          description: "Shows a toast and returns its id.",
        },
        { name: "dismiss", type: "function(id)", description: "Removes one toast." },
        { name: "dismissAll", type: "function", description: "Removes every toast." },
      ],
    },
    {
      title: "Toast options",
      description: "What you pass to `toast()`.",
      props: [
        {
          name: "variant",
          type: '"info" | "success" | "warning" | "error"',
          default: '"info"',
          description: "Tone of the toast.",
        },
        { name: "title", type: "node", description: "Short summary, shown in bold." },
        { name: "message", type: "node", description: "Supporting text." },
        {
          name: "duration",
          type: "number",
          description:
            "Milliseconds until it dismisses itself. `Infinity` keeps it until dismissed. Defaults to the provider's `defaultDuration`.",
        },
        { name: "action", type: "node", description: "An action, such as an Undo button." },
        {
          name: "id",
          type: "string",
          description: "Custom id. Reusing one replaces that toast instead of adding another.",
        },
      ],
    },
    {
      title: "Toast",
      description:
        "The toast itself, for rendering outside the provider. Accepts `<div>` attributes.",
      props: [
        {
          name: "variant",
          type: '"info" | "success" | "warning" | "error"',
          default: '"info"',
          description: "Tone of the toast.",
        },
        { name: "title", type: "node", description: "Short summary." },
        { name: "message", type: "node", description: "Supporting text." },
        {
          name: "duration",
          type: "number",
          default: "5000",
          description: "Milliseconds until `onDismiss` is called. `Infinity` disables it.",
        },
        {
          name: "onDismiss",
          type: "function",
          description: "Shows a dismiss button; also called when the timer runs out.",
        },
        { name: "action", type: "node", description: "An action under the text." },
        {
          name: "dismissLabel",
          type: "string",
          default: '"Dismiss"',
          description: "Accessible name of the dismiss button.",
        },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["Tab"],
      description: "Reaches the toast's buttons. The timer pauses while focus is inside the toast.",
    },
  ],
  accessibility: [
    'Success and info toasts use the polite `role="status"`; errors and warnings use `role="alert"` and are announced right away.',
    "The auto-dismiss timer pauses while a toast is hovered or focused, so people have time to read and act (WCAG 2.2.1).",
    "Use `duration: Infinity` for toasts with actions people must be able to reach, like Undo.",
    "Toasts disappear, so never put information only in a toast. Keep the result visible on the page too.",
  ],
};
