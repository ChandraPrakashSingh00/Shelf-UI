import { Rating } from "@codecps/ui";
import { definePlayground } from "../../components/LivePlayground.jsx";
import Basic from "../../examples/rating/Basic.jsx";
import basicCode from "../../examples/rating/Basic.jsx?raw";
import Labels from "../../examples/rating/Labels.jsx";
import labelsCode from "../../examples/rating/Labels.jsx?raw";
import ReadOnly from "../../examples/rating/ReadOnly.jsx";
import readOnlyCode from "../../examples/rating/ReadOnly.jsx?raw";
import ReviewForm from "../../examples/rating/ReviewForm.jsx";
import reviewFormCode from "../../examples/rating/ReviewForm.jsx?raw";
import States from "../../examples/rating/States.jsx";
import statesCode from "../../examples/rating/States.jsx?raw";
import { formatJsx, withImport } from "../../lib/jsx.js";

const sizes = ["sm", "md", "lg"];

function RatingThumbnail() {
  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
      <Rating aria-label="Rate this product" size="lg" defaultValue={4} />
      <Rating readOnly size="sm" value={4.3} showValue count={1284} />
    </div>
  );
}

export const ratingDoc = {
  slug: "rating",
  name: "Rating",
  category: "Forms",
  summary: "Star rating input for reviews, and a read-only display for average ratings.",
  description:
    "Collects a star rating, like a product review, or displays one, like the average rating on a product card. The interactive rating is a group of native radio buttons, so it works with the keyboard and in forms; `readOnly` shows fractional averages such as 4.3 with partly filled stars and an optional review count.",
  keywords: [
    "stars",
    "star rating",
    "review",
    "feedback",
    "score",
    "average rating",
    "reviews count",
    "form",
  ],
  imports: ["Rating"],
  Thumbnail: RatingThumbnail,
  Playground: definePlayground({
    defaults: {
      size: "md",
      label: "Rate this product",
      helperText: "",
      readOnly: false,
      disabled: false,
    },
    controls: {
      size: { type: "select", label: "Size", options: sizes },
      label: { type: "text", label: "Label" },
      helperText: { type: "text", label: "Helper text" },
      readOnly: { type: "boolean", label: "Read-only" },
      disabled: { type: "boolean", label: "Disabled" },
    },
    render: (values) =>
      values.readOnly ? (
        <Rating readOnly size={values.size} value={4.3} showValue count={1284} />
      ) : (
        <Rating
          size={values.size}
          label={values.label || undefined}
          aria-label={values.label ? undefined : "Rate this product"}
          helperText={values.helperText || undefined}
          disabled={values.disabled}
          defaultValue={4}
        />
      ),
    code: (values) =>
      withImport(
        ["Rating"],
        values.readOnly
          ? formatJsx(
              "Rating",
              { readOnly: true, value: 4.3, showValue: true, count: 1284, size: values.size },
              undefined,
              { defaults: { size: "md" } },
            )
          : formatJsx(
              "Rating",
              {
                label: values.label || undefined,
                "aria-label": values.label ? undefined : "Rate this product",
                defaultValue: 4,
                size: values.size,
                helperText: values.helperText || undefined,
                disabled: values.disabled,
              },
              undefined,
              { defaults: { size: "md" } },
            ),
      ),
  }),
  examples: [
    {
      id: "basic",
      title: "Basic",
      description:
        "Click a star, or Tab to the stars and use the arrow keys. Hovering with a mouse previews the rating; clicking the selected star again clears it.",
      Component: Basic,
      code: basicCode,
    },
    {
      id: "read-only",
      title: "Average rating",
      description:
        "`readOnly` displays a rating, fractions included, as an image named “Rated 4.3 out of 5, 1,28,400 ratings”. `showValue` and `count` add the numbers next to the stars.",
      Component: ReadOnly,
      code: readOnlyCode,
    },
    {
      id: "labels",
      title: "Star labels",
      description:
        "`getLabel` names each star for screen readers. Here it adds a word like “Very good”, which is also shown under the stars for the chosen rating.",
      Component: Labels,
      code: labelsCode,
    },
    { id: "states", title: "Sizes and states", Component: States, code: statesCode },
    {
      id: "review-form",
      title: "In a review form",
      description:
        "With `name`, the chosen star is submitted like any radio button. Show a missing rating with `error`.",
      Component: ReviewForm,
      code: reviewFormCode,
    },
  ],
  api: [
    {
      title: "Rating",
      description:
        'Other props (and the `ref`) go to the root: a `<fieldset role="radiogroup">`, or a `<span role="img">` when `readOnly`.',
      props: [
        {
          name: "value",
          type: "number",
          description: "Current rating (controlled), from 0 (none) to `max`.",
        },
        {
          name: "defaultValue",
          type: "number",
          default: "0",
          description: "Initial rating (uncontrolled).",
        },
        {
          name: "onValueChange",
          type: "function(value)",
          description: "Called with the chosen number of stars, or 0 when the rating is cleared.",
        },
        { name: "max", type: "number", default: "5", description: "Number of stars." },
        {
          name: "label",
          type: "node",
          description:
            "Visible label, rendered as the group's `<legend>`. Without it, pass `aria-label`.",
        },
        {
          name: "helperText",
          type: "node",
          description: "Hint below the stars, exposed as the group's accessible description.",
        },
        {
          name: "error",
          type: "node",
          description:
            "Error message. Replaces `helperText` and sets `aria-invalid` on the group. Pass `true` to mark it invalid without a message.",
        },
        {
          name: "getLabel",
          type: "function(value)",
          description: 'Returns the accessible name of a star. Defaults to "1 star", "2 stars", …',
        },
        {
          name: "clearable",
          type: "boolean",
          default: "true",
          description:
            "Clicking the selected star again, or pressing Backspace or Delete, clears the rating.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Star size.",
        },
        {
          name: "name",
          type: "string",
          description:
            "Form field name of the radios. Defaults to a generated name. Resetting the form restores `defaultValue`.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          description: "A star must be chosen to submit the form. Adds an asterisk to the label.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Prevents changes.",
        },
        {
          name: "readOnly",
          type: "boolean",
          default: "false",
          description:
            'Displays the rating, fractions included, as an image named "Rated 4.3 out of 5" (plus the count). Pass `aria-label` to change it.',
        },
        {
          name: "showValue",
          type: "boolean",
          default: "false",
          description: 'Read-only: shows the value next to the stars, e.g. "4.3".',
        },
        {
          name: "count",
          type: "number",
          description: 'Read-only: number of ratings, shown as "(1,284)".',
        },
        {
          name: "formatCount",
          type: "function(count)",
          description:
            'Returns the text of the count. Defaults to Indian digit grouping, e.g. "1,28,400".',
        },
        {
          name: "className",
          type: "string",
          description: "Class for the root element. `style` goes there too.",
        },
      ],
    },
  ],
  keyboard: [
    { keys: ["Tab"], description: "Moves focus to the selected star (or the first one)." },
    { keys: ["→", "↓"], description: "Selects the next star, wrapping to the first." },
    { keys: ["←", "↑"], description: "Selects the previous star, wrapping to the last." },
    { keys: ["Space"], description: "Selects the focused star." },
    {
      keys: ["Backspace", "Delete"],
      description: "Clears the rating, when `clearable`.",
    },
  ],
  accessibility: [
    'The interactive rating is a `<fieldset role="radiogroup">` of native radio buttons, one per star: browsers provide the arrow-key behavior and form submission, and each star is named “3 stars” (or by `getLabel`).',
    "The group is named by its `<legend>` and described by `helperText` or `error`; `required` sets `aria-required`.",
    'A read-only rating is a single `role="img"` element with a text alternative such as “Rated 4.3 out of 5, 1,284 ratings”, so screen readers don\'t read five separate stars.',
    "The rating isn't shown by color alone: filled and empty stars differ in shape fill, and in forced-colors mode empty stars are drawn as outlines.",
    "The focused star has a visible focus ring, and hover previews are only visual.",
  ],
};
