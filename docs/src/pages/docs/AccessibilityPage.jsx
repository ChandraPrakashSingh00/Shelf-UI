import { Link } from "react-router";
import { InlineMarkdown } from "../../components/InlineMarkdown.jsx";
import { accessibilityPage } from "../../content/docsPages.js";
import { DocsPageNav, PageHeader } from "../../layout/PageParts.jsx";
import { useDocumentTitle } from "../../lib/document.js";

const handled = [
  {
    title: "Native elements first",
    text: "Buttons render `<button>`, links render `<a>`, and form controls like `Checkbox`, `Switch` and `RadioGroup` are built on native inputs, so they work with the keyboard, autofill and form submission out of the box.",
  },
  {
    title: "WAI-ARIA patterns",
    text: "Interactive widgets such as `Tabs`, `Dropdown`, `Combobox`, `Accordion` and `Tooltip` follow the WAI-ARIA Authoring Practices for roles, states and keyboard support.",
  },
  {
    title: "Focus management",
    text: "`Modal`, `Drawer` and `AlertDialog` move focus inside when they open, keep Tab and Shift + Tab within the dialog, close with Escape and return focus to the element that opened them.",
  },
  {
    title: "Visible focus",
    text: "Every interactive element shows a focus ring for keyboard users, colored by the `--shelf-color-focus` token.",
  },
  {
    title: "Reduced motion",
    text: "Transitions and animations are reduced when the reader's system asks for less motion (`prefers-reduced-motion`).",
  },
  {
    title: "Translatable labels",
    text: "Built-in text that assistive tech reads, like `closeLabel`, `dismissLabel` or `previousLabel`, is a prop, so you can translate it.",
  },
];

const yourPart = [
  "Give every form field a visible `label` (or an `aria-label` when a visible label isn't possible).",
  "Name icon-only buttons: `IconButton` requires a `label`, and a `Button` with only an icon needs an `aria-label`.",
  "Use links for navigation and buttons for actions. With `asChild`, a router `Link` keeps its link semantics.",
  "Check color contrast when you change color tokens.",
  "Test your screens with a keyboard and a screen reader.",
];

export function AccessibilityPage() {
  useDocumentTitle("Accessibility");

  return (
    <article className="docs-article">
      <PageHeader
        title="Accessibility"
        lead="Shelf UI handles the hard parts of accessible widgets, so your app starts from a solid base. Here's what the components do for you, and what's still up to you."
      />

      <h2 id="what-components-handle" className="docs-h2">
        What the components handle
      </h2>
      <ul className="docs-feature-list">
        {handled.map((item) => (
          <li key={item.title}>
            <h3 className="docs-feature-list__title">{item.title}</h3>
            <p className="docs-text">
              <InlineMarkdown text={item.text} />
            </p>
          </li>
        ))}
      </ul>

      <h2 id="what-you-provide" className="docs-h2">
        What your app provides
      </h2>
      <ul className="docs-list">
        {yourPart.map((item) => (
          <li key={item}>
            <InlineMarkdown text={item} />
          </li>
        ))}
      </ul>

      <h2 id="per-component" className="docs-h2">
        Per-component notes
      </h2>
      <p className="docs-text">
        Each component page has an <strong>Accessibility</strong> tab with its keyboard interactions
        and notes, for example <Link to="/components/modal#accessibility">Modal</Link> or{" "}
        <Link to="/components/combobox#accessibility">Combobox</Link>.
      </p>

      <DocsPageNav page={accessibilityPage} />
    </article>
  );
}
