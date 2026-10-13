import { Link } from "react-router";
import { CodeBlock } from "../../components/CodeBlock.jsx";
import { customizationPage } from "../../content/docsPages.js";
import { DocsPageNav, PageHeader } from "../../layout/PageParts.jsx";
import { useDocumentTitle } from "../../lib/document.js";

const classNameCode = `import { Button, Input } from "@shelf-ui/react";

// className is added to the component's own classes, never replaces them.
<Button className="checkout-button">Pay now</Button>

// Fields take className for the wrapper and inputClassName for the <input> itself.
<Input label="Coupon" className="coupon-field" inputClassName="coupon-input" />`;

const wrapperCode = `import { Button } from "@shelf-ui/react";

// Pass every other prop through, so the wrapper keeps Button's full API.
// \`type\` comes last, so callers can't override it.
export function SubmitButton(props) {
  return <Button {...props} type="submit" />;
}`;

const asChildCode = `import { Button } from "@shelf-ui/react";
import { Link } from "react-router";

// Renders the router's <a>, styled as a button. It stays a real link.
<Button asChild variant="outline">
  <Link to="/pricing">See pricing</Link>
</Button>`;

const tailwindCode = `/* src/index.css */
@import "tailwindcss";
@import "@shelf-ui/react/styles.css" layer(components);`;

export function CustomizationPage() {
  useDocumentTitle("Customization");

  return (
    <article className="docs-article">
      <PageHeader
        title="Customization"
        lead="Change how components look and behave without forking them: class names, wrapper components, `asChild` and Tailwind CSS."
      />

      <h2 id="class-names" className="docs-h2">
        Class names
      </h2>
      <p className="docs-text">
        Components accept <code>className</code>, which is added to their root element's classes.
        Form fields also take a class for the native control inside them (for example{" "}
        <code>inputClassName</code> on <code>Input</code>).
      </p>
      <CodeBlock code={classNameCode} />
      <p className="docs-text">
        For brand-wide changes (colors, radius, font sizes), override{" "}
        <Link to="/docs/theming">design tokens</Link> instead of restyling each component.
      </p>

      <h2 id="wrapping" className="docs-h2">
        Wrap a component
      </h2>
      <p className="docs-text">
        Most components pass the props they don't use on to their underlying element (
        <code>Button</code> accepts every native <code>&lt;button&gt;</code> attribute, for
        example), so your own wrappers can spread props through and keep the full API:
      </p>
      <CodeBlock code={wrapperCode} title="SubmitButton.jsx" />

      <h2 id="as-child" className="docs-h2">
        Render as another element
      </h2>
      <p className="docs-text">
        Components with an <code>asChild</code> prop (<code>Button</code>, <code>IconButton</code>,{" "}
        <code>Link</code>, <code>Breadcrumb.Item</code>, <code>Navbar.Link</code> and{" "}
        <code>Sidebar.Item</code>, among others) render their single child with their styles and
        behavior instead of their default element. Use it for router links:
      </p>
      <CodeBlock code={asChildCode} />

      <h2 id="tailwind" className="docs-h2">
        Tailwind CSS
      </h2>
      <p className="docs-text">
        Tailwind puts its utilities in a cascade layer, and styles outside any layer always win over
        layered ones. Import the library's stylesheet into Tailwind's <code>components</code> layer
        so utilities like <code>mt-4</code> can still override component styles:
      </p>
      <CodeBlock code={tailwindCode} language="css" title="src/index.css" />

      <DocsPageNav page={customizationPage} />
    </article>
  );
}
