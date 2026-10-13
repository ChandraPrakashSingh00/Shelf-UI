import { CodeBlock } from "../../components/CodeBlock.jsx";
import { componentApiPage } from "../../content/docsPages.js";
import { DocsPageNav, PageHeader } from "../../layout/PageParts.jsx";
import { useDocumentTitle } from "../../lib/document.js";

const refCode = `import { Input } from "shelf-ui-react";
import { useRef } from "react";

export function SearchField() {
  const inputRef = useRef(null);

  return (
    <>
      {/* The ref points to the native <input>, not the wrapper. */}
      <Input ref={inputRef} label="Search" />
      <button onClick={() => inputRef.current?.focus()}>Focus search</button>
    </>
  );
}`;

const stateCode = `import { Tabs } from "shelf-ui-react";
import { useState } from "react";

// Uncontrolled: the component keeps its own state.
<Tabs defaultValue="orders">…</Tabs>

// Controlled: you own the state and update it in onValueChange.
function Orders() {
  const [tab, setTab] = useState("orders");
  return (
    <Tabs value={tab} onValueChange={setTab}>
      …
    </Tabs>
  );
}`;

const eventsCode = `<Tabs.Tab
  value="billing"
  onClick={(event) => {
    if (!canLeaveForm()) event.preventDefault(); // the tab doesn't switch
  }}
>
  Billing
</Tabs.Tab>`;

const compoundCode = `import { Card, CardContent, CardHeader, CardTitle } from "shelf-ui-react";

// Both are the same component:
<Card.Header>…</Card.Header>
<CardHeader>…</CardHeader>`;

const formCode = `<form action="/checkout">
  <Select name="city" label="City" options={["Delhi", "Mumbai", "Pune"]} />
  <Switch name="gift" label="Gift wrap" />
  <Button type="submit">Place order</Button>
</form>`;

export function ComponentApiPage() {
  useDocumentTitle("Component API");

  return (
    <article className="docs-article">
      <PageHeader
        title="Component API"
        lead="Every component follows the same conventions, so once you know one, you know them all."
      />

      <h2 id="props" className="docs-h2">
        Props and native attributes
      </h2>
      <p className="docs-text">
        Components pass the props they don't use to their main element, so native attributes like{" "}
        <code>id</code>, <code>data-*</code>, <code>aria-*</code> and event handlers work as usual.
        Each component's <strong>Props</strong> tab lists its own props and says which element
        receives the rest.
      </p>

      <h2 id="refs" className="docs-h2">
        Refs
      </h2>
      <p className="docs-text">
        Components forward <code>ref</code> to their main DOM element: the{" "}
        <code>&lt;button&gt;</code> for <code>Button</code>, the native <code>&lt;input&gt;</code>{" "}
        for <code>Input</code>, and so on.
      </p>
      <CodeBlock code={refCode} title="SearchField.jsx" />

      <h2 id="state" className="docs-h2">
        Controlled and uncontrolled state
      </h2>
      <p className="docs-text">
        Stateful components work both ways. Pass a <code>default…</code> prop and let the component
        keep its state, or pass the value and a change handler to control it yourself:
      </p>
      <ul className="docs-list">
        <li>
          <code>value</code> / <code>defaultValue</code> / <code>onValueChange</code> for most
          inputs, tabs and pickers.
        </li>
        <li>
          <code>checked</code> / <code>defaultChecked</code> / <code>onCheckedChange</code> for{" "}
          <code>Checkbox</code> and <code>Switch</code>.
        </li>
        <li>
          <code>open</code> and <code>onClose</code> for <code>Modal</code>, <code>Drawer</code> and{" "}
          <code>AlertDialog</code>.
        </li>
      </ul>
      <CodeBlock code={stateCode} />

      <h2 id="events" className="docs-h2">
        Event handlers
      </h2>
      <p className="docs-text">
        When you pass a handler the component also uses internally, yours runs first. Call{" "}
        <code>event.preventDefault()</code> to skip the built-in behavior:
      </p>
      <CodeBlock code={eventsCode} />

      <h2 id="compound-components" className="docs-h2">
        Compound components
      </h2>
      <p className="docs-text">
        Components with parts expose them both as properties and as named exports. Use the named
        exports in React Server Components, where dot notation can't cross the server boundary.
      </p>
      <CodeBlock code={compoundCode} />

      <h2 id="forms" className="docs-h2">
        Forms
      </h2>
      <p className="docs-text">
        Form components submit with their form when you give them a <code>name</code>, and reset
        with it, including custom ones like <code>Combobox</code>, <code>DatePicker</code> and{" "}
        <code>Rating</code>.
      </p>
      <CodeBlock code={formCode} />

      <h2 id="labels" className="docs-h2">
        Labels and translations
      </h2>
      <p className="docs-text">
        Text that only assistive tech reads (close buttons, pagination arrows, remove buttons) has
        English defaults and a prop to change it, like <code>closeLabel</code>,{" "}
        <code>previousLabel</code> or <code>getPageLabel</code>. Pass your own strings to translate
        a component.
      </p>

      <DocsPageNav page={componentApiPage} />
    </article>
  );
}
