/**
 * Blog posts, newest first. Each post is `{ slug, title, excerpt, category,
 * date, cover, body }`:
 *
 * - `category`: one of `blogCategories`.
 * - `date`: ISO date (YYYY-MM-DD).
 * - `cover`: the `BlogCover` artwork to show.
 * - `body`: blocks — `{ type: "p", text }`, `{ type: "h2", text }`,
 *   `{ type: "list", items }` (inline markdown) or `{ type: "code", code, language, title }`.
 */
export const blogCategories = ["Tutorials", "Guides", "Tips", "Updates"];

export const blogPosts = [
  {
    slug: "whats-new-in-0-3-0",
    title: "What's new in Shelf UI 0.3.0",
    excerpt:
      "A new npm package, one prefix for everything and a fresh violet look, for the same 50 components.",
    category: "Updates",
    date: "2026-10-13",
    cover: "shelf",
    body: [
      {
        type: "p",
        text: "Shelf UI 0.3.0 is out. It's the first release of the `@shelf-ui/react` package: the same 50 components, with new names for their classes and tokens and a new default look.",
      },
      { type: "h2", text: "Install" },
      { type: "code", language: "bash", title: "terminal", code: "npm install @shelf-ui/react" },
      {
        type: "code",
        title: "main.jsx",
        code: `import "@shelf-ui/react/styles.css";`,
      },
      { type: "h2", text: "Why Shelf" },
      {
        type: "p",
        text: "A good component library works like a well-kept shelf: everything has its place, and you pick up what you need. The components are ready off the shelf, and design tokens make each one fit your brand.",
      },
      { type: "h2", text: "One prefix: shelf" },
      {
        type: "list",
        items: [
          "**Design tokens** start with `--shelf-`, like `--shelf-color-primary` and `--shelf-radius-md`.",
          "**Class names** start with `shelf-`, like `.shelf-button` and `.shelf-card`.",
          '**Dark mode** is `data-shelf-theme="dark"` on `<html>`.',
        ],
      },
      {
        type: "p",
        text: "If you've styled an earlier version, the [changelog](/changelog) lists what to rename.",
      },
      { type: "h2", text: "A fresh look" },
      {
        type: "list",
        items: [
          "**A new default palette.** The primary color is violet `#6938ef`, with matching neutrals and a violet-black dark theme, and every text color meets WCAG AA contrast.",
          "**A brand token.** `--shelf-brand-primary` is the color the primary and focus colors follow. Override it, or any other token, to use your own.",
          "**A redesigned documentation site**, with new typefaces for headings and code.",
        ],
      },
      {
        type: "p",
        text: "Every token is listed on the [design tokens](/docs/design-tokens) page, and the [theme builder](/docs/theming) writes overrides for any color you pick.",
      },
    ],
  },
  {
    slug: "whats-new-in-0-2-0",
    title: "What's new in Shelf UI 0.2.0",
    excerpt:
      "23 new components take the library to 50, with tables, date pickers, file uploads and a command palette for e-commerce and admin screens.",
    category: "Updates",
    date: "2026-10-02",
    cover: "release",
    body: [
      {
        type: "p",
        text: "Shelf UI 0.2.0 is out. It adds 23 components, taking the library from 27 to 50, with a focus on the screens we build most often: online stores and admin dashboards.",
      },
      { type: "h2", text: "23 new components" },
      {
        type: "list",
        items: [
          "**Actions:** `IconButton`, an icon-only button with a required `label`, an optional tooltip and a toggle (`pressed`) mode.",
          "**Forms:** `Combobox`, `Calendar`, `DatePicker`, `NumberInput`, `PinInput`, `FileUpload`, `Rating` and `ToggleGroup`.",
          "**Data display:** `Table` (sorting, row selection, loading and empty states), `Tag`, `Divider`, `Stat`, `Timeline`, `EmptyState`, `DescriptionList` and `Kbd`.",
          "**Feedback:** `Banner`, a full-width announcement bar.",
          "**Overlays:** `AlertDialog`, which can wait for an async `onConfirm`, and `CommandPalette`, a Ctrl + K (⌘ K) command menu.",
          "**Navigation:** `Stepper`, `Sidebar` (collapsible to an icon rail) and `Link`.",
        ],
      },
      {
        type: "p",
        text: "Every new component has a [documentation page](/components) with a live preview, examples to copy, an API reference and keyboard and accessibility notes.",
      },
      { type: "h2", text: "Form components that submit and reset" },
      {
        type: "p",
        text: "The new form components work with plain HTML forms. Give them a `name` and they submit with their form; reset the form and they reset too, just like native inputs.",
      },
      {
        type: "code",
        title: "FeedbackForm.jsx",
        code: `import { Button, DatePicker, Rating } from "@shelf-ui/react";

export function FeedbackForm() {
  return (
    <form action="/feedback">
      <Rating name="rating" label="How was your order?" />
      <DatePicker name="deliveredOn" label="Delivered on" />
      <Button type="submit">Send feedback</Button>
    </form>
  );
}`,
      },
      { type: "h2", text: "Fixes" },
      {
        type: "list",
        items: [
          "`Button` no longer drops an `aria-disabled` passed to it while it isn't loading.",
          "`Modal` and `Drawer` with `closeOnEscape={false}` no longer let Escape close a dialog they're nested in.",
        ],
      },
      {
        type: "p",
        text: "There are no breaking changes. The full list is in the [changelog](/changelog).",
      },
    ],
  },
  {
    slug: "sign-in-screen-with-vite",
    title: "Build a sign-in screen with Shelf UI and Vite",
    excerpt:
      "From an empty folder to an accessible sign-in form with validation and a success toast, in four steps.",
    category: "Tutorials",
    date: "2026-10-02",
    cover: "tutorial",
    body: [
      {
        type: "p",
        text: "In this tutorial you'll create a Vite app, add Shelf UI and build a sign-in card with labelled fields, an error message and a toast when the form is sent.",
      },
      { type: "h2", text: "1. Create the app" },
      {
        type: "code",
        language: "bash",
        title: "terminal",
        code: `npm create vite@latest my-app -- --template react
cd my-app
npm install @shelf-ui/react`,
      },
      { type: "h2", text: "2. Load the styles and toasts" },
      {
        type: "p",
        text: "Import the stylesheet once, and wrap the app in `ToastProvider` so any component can show a toast:",
      },
      {
        type: "code",
        title: "src/main.jsx",
        code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastProvider } from "@shelf-ui/react";
import "@shelf-ui/react/styles.css";
import { SignIn } from "./SignIn.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <SignIn />
    </ToastProvider>
  </StrictMode>,
);`,
      },
      { type: "h2", text: "3. Build the form" },
      {
        type: "p",
        text: "`Input` renders a real `<label>` from its `label` prop and marks required fields, so there's no extra wiring:",
      },
      {
        type: "code",
        title: "src/SignIn.jsx",
        code: `import { Button, Card, Checkbox, Input, useToast } from "@shelf-ui/react";

export function SignIn() {
  const { toast } = useToast();

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    toast({ variant: "success", title: "Signed in", message: \`Welcome back, \${email}.\` });
  };

  return (
    <Card title="Sign in" description="Use your work email.">
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
        <Input name="email" type="email" label="Email" autoComplete="email" required />
        <Input
          name="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          required
        />
        <Checkbox name="remember" label="Remember me" />
        <Button type="submit" fullWidth>
          Sign in
        </Button>
      </form>
    </Card>
  );
}`,
      },
      { type: "h2", text: "4. Show an error" },
      {
        type: "p",
        text: "Pass `error` to show a message under a field. `Input` marks the field invalid and links the message to it with `aria-describedby`, so screen readers read it with the field:",
      },
      {
        type: "code",
        code: `<Input
  name="email"
  type="email"
  label="Email"
  error="We couldn't find an account with this email."
/>`,
      },
      { type: "h2", text: "Next steps" },
      {
        type: "list",
        items: [
          "Match your brand by [overriding design tokens](/docs/theming).",
          "Browse [all components](/components) for the rest of your app.",
        ],
      },
    ],
  },
  {
    slug: "accessible-forms",
    title: "Five habits for accessible forms",
    excerpt:
      "Labels, hints, errors, groups and loading states: small habits that make forms work for everyone, and how Shelf UI helps.",
    category: "Guides",
    date: "2026-10-02",
    cover: "accessibility",
    body: [
      {
        type: "p",
        text: "Forms are where most people get stuck. These five habits cover the problems we see most often in reviews, and each one takes a single prop with Shelf UI.",
      },
      { type: "h2", text: "1. Give every field a visible label" },
      {
        type: "p",
        text: "Placeholders disappear as soon as someone types, and screen readers may not read them. Use the `label` prop instead; it renders a real `<label>` tied to the field.",
      },
      {
        type: "code",
        code: `<Input label="Phone number" type="tel" placeholder="98765 43210" />`,
      },
      { type: "h2", text: "2. Put hints in helper text" },
      {
        type: "p",
        text: "`helperText` shows under the field and is linked to it with `aria-describedby`, so the hint is read when the field gets focus.",
      },
      { type: "h2", text: "3. Say what went wrong, next to the field" },
      {
        type: "p",
        text: "Pass the message as `error`. The field is marked `aria-invalid` and the message is linked to it, so it's both visible and announced. Tell people how to fix it, not just that it's wrong.",
      },
      {
        type: "code",
        code: `<Input label="PIN code" error="Enter a 6-digit PIN code, like 201009." />`,
      },
      { type: "h2", text: "4. Group related choices" },
      {
        type: "p",
        text: "`RadioGroup` renders a `<fieldset>` whose `label` becomes the `<legend>`, so every option is announced with its question.",
      },
      {
        type: "code",
        code: `<RadioGroup label="Delivery speed" name="delivery" defaultValue="standard">
  <Radio value="standard" label="Standard (3–5 days)" />
  <Radio value="express" label="Express (next day)" />
</RadioGroup>`,
      },
      { type: "h2", text: "5. Keep submit buttons focusable while saving" },
      {
        type: "p",
        text: "A disabled button drops out of the Tab order, so keyboard users lose their place. `Button` with `loading` shows a spinner and ignores clicks, but keeps focus and is announced as busy.",
      },
      {
        type: "code",
        code: `<Button type="submit" loading={saving}>
  Save address
</Button>`,
      },
      {
        type: "p",
        text: "More in the [accessibility guide](/docs/accessibility).",
      },
    ],
  },
  {
    slug: "theming-with-design-tokens",
    title: "Theming Shelf UI with design tokens",
    excerpt:
      "Change one variable and every button, tab, focus ring and link follows. Here's how the tokens fit together.",
    category: "Guides",
    date: "2026-10-01",
    cover: "theming",
    body: [
      {
        type: "p",
        text: "Every Shelf UI component reads its colors, radii, font sizes and control heights from CSS custom properties prefixed with `--shelf-`. Change a token and everything that uses it follows.",
      },
      { type: "h2", text: "Start with the primary color" },
      {
        type: "p",
        text: "The primary color drives buttons, selected tabs, focus rings, links and info alerts. Set it, plus its hover and active shades, on `:root`:",
      },
      {
        type: "code",
        language: "css",
        title: "theme.css",
        code: `:root {
  --shelf-color-primary: #0f766e;
  --shelf-color-primary-hover: color-mix(in srgb, #0f766e 88%, black);
  --shelf-color-primary-active: color-mix(in srgb, #0f766e 76%, black);
  --shelf-color-primary-subtle: color-mix(in srgb, #0f766e 10%, white);
  --shelf-color-primary-text: color-mix(in srgb, #0f766e 78%, black);
  --shelf-color-focus: #0f766e;
}`,
      },
      {
        type: "p",
        text: "`color-mix()` derives the shades from one color, so you only pick the brand color. The [theme builder](/docs/theming) generates this CSS for you.",
      },
      { type: "h2", text: "Then the shape" },
      {
        type: "p",
        text: "`--shelf-radius-sm`, `--shelf-radius-md` and `--shelf-radius-lg` set the corners of small controls, fields and cards. Sharper corners feel more technical; rounder ones feel friendlier.",
      },
      { type: "h2", text: "Dark mode comes free" },
      {
        type: "p",
        text: 'Set `data-shelf-theme="dark"` on `<html>` and the dark values apply. If you change the primary color, also set the dark versions of the subtle and text shades under `[data-shelf-theme="dark"]`, since they sit on a dark background.',
      },
      {
        type: "p",
        text: "Every token and its light and dark value is listed on the [design tokens](/docs/design-tokens) page.",
      },
    ],
  },
  {
    slug: "shelf-ui-with-tailwind",
    title: "Using Shelf UI with Tailwind CSS",
    excerpt:
      "Why Tailwind utilities can't override the components out of the box, and the one-line import that fixes it.",
    category: "Tips",
    date: "2026-10-01",
    cover: "layers",
    body: [
      {
        type: "p",
        text: "Shelf UI and Tailwind CSS work well together: the library gives you accessible components, and Tailwind lays out the page around them. One detail needs care: the order of the CSS.",
      },
      { type: "h2", text: "The problem" },
      {
        type: "p",
        text: 'Tailwind puts its utilities in a cascade layer. CSS outside any layer always beats layered CSS, whatever its specificity. So if you import `@shelf-ui/react/styles.css` normally, `<Button className="rounded-full">` keeps the button\'s own corners.',
      },
      { type: "h2", text: "The fix" },
      {
        type: "p",
        text: "Import the library into Tailwind's `components` layer. Utilities come after components, so they win:",
      },
      {
        type: "code",
        language: "css",
        title: "src/index.css",
        code: `@import "tailwindcss";
@import "@shelf-ui/react/styles.css" layer(components);`,
      },
      { type: "h2", text: "Tokens still work" },
      {
        type: "p",
        text: "Design tokens are custom properties, so layers don't affect them. Override `--shelf-` tokens on `:root` as usual, or use them in Tailwind with arbitrary values like `bg-[var(--shelf-color-primary)]`.",
      },
    ],
  },
  {
    slug: "introducing-shelf-ui",
    title: "Introducing Shelf UI",
    excerpt:
      "An accessible, themeable React component library, now on npm: 27 components to start with.",
    category: "Updates",
    date: "2026-09-30",
    cover: "launch",
    body: [
      {
        type: "p",
        text: "Today we're releasing Shelf UI 0.1.0, an accessible React component library for the products we build. It's on npm as `@shelf-ui/react`.",
      },
      { type: "h2", text: "Why we built it" },
      {
        type: "p",
        text: "Our projects kept needing the same buttons, forms, dialogs and navigation. Building them once, testing them once and theming them per brand gives every product the same accessible foundation, and lets each project start with the parts that make it different.",
      },
      { type: "h2", text: "What's in 0.1.0" },
      {
        type: "list",
        items: [
          "27 components for actions, forms, data display, feedback, overlays and navigation.",
          "Design tokens as CSS custom properties, with light and dark themes.",
          "Plain JavaScript and JSX, with no runtime dependencies besides React.",
          'ES modules that ship `"use client"`, for the Next.js App Router.',
        ],
      },
      { type: "h2", text: "Try it" },
      {
        type: "code",
        title: "terminal",
        language: "bash",
        code: "npm install @shelf-ui/react",
      },
      {
        type: "p",
        text: "Then follow the [installation guide](/docs/installation). We'd love to hear what you build, and what's missing: open an issue on GitHub.",
      },
    ],
  },
];

export function getBlogPost(slug) {
  return blogPosts.find((post) => post.slug === slug);
}

/** Estimated reading time in minutes, at 200 words per minute. */
export function readingTime(post) {
  const words = post.body
    .flatMap((block) => (block.type === "list" ? block.items : [block.text ?? block.code]))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
