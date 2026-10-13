import { Tabs } from "@shelf-ui/react";
import { useLocation, useNavigate, useParams } from "react-router";
import { CodeBlock, CopyButton } from "../components/CodeBlock.jsx";
import { ExampleBlock, preventPlaceholderNavigation } from "../components/ExampleBlock.jsx";
import { InlineMarkdown } from "../components/InlineMarkdown.jsx";
import { KeyboardTable, PropsTable } from "../components/PropsTable.jsx";
import { componentDocs, getCategoryByName, getComponentDoc } from "../content/components/index.js";
import { PageHero, PageNav } from "../layout/PageParts.jsx";
import { useDocumentTitle } from "../lib/document.js";
import { NotFoundContent } from "./NotFoundPage.jsx";

const TABS = [
  { value: "usage", label: "Usage" },
  { value: "props", label: "Props" },
  { value: "examples", label: "Examples" },
  { value: "accessibility", label: "Accessibility" },
];

/**
 * The open tab lives in the URL hash, so tabs can be linked to. Deep links
 * into a tab (an example, a props table, the keyboard table) open that tab.
 */
function tabForHash(hash, doc) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (TABS.some((tab) => tab.value === id)) return id;
  if (doc.examples.some((example) => example.id === id)) return "examples";
  if (id === "api" || id.startsWith("api-")) return "props";
  if (id === "keyboard") return "accessibility";
  return "usage";
}

function UsagePanel({ doc, importCode, usageCode }) {
  const { Playground } = doc;

  return (
    <>
      <h2 className="docs-h2">Import</h2>
      <CodeBlock code={importCode} />
      <h2 className="docs-h2">Usage</h2>
      <p className="docs-text">The code for the preview above.</p>
      <CodeBlock code={usageCode} />
      {Playground && (
        <>
          <h2 id="playground" className="docs-h2">
            Playground
          </h2>
          <p className="docs-text">Change the props to see the component and its code update.</p>
          <Playground />
        </>
      )}
    </>
  );
}

function PropsPanel({ doc }) {
  return (
    <>
      <h2 id="api" className="docs-h2">
        API reference
      </h2>
      {doc.api.map((group) => (
        <PropsTable key={group.title} group={group} />
      ))}
    </>
  );
}

function ExamplesPanel({ doc }) {
  return (
    <>
      <h2 className="docs-visually-hidden">Examples</h2>
      {doc.examples.map((example) => (
        <section key={example.id} aria-labelledby={example.id} className="docs-example-section">
          <h3 id={example.id} className="docs-h3">
            {example.title}
          </h3>
          {example.description && (
            <p className="docs-text">
              <InlineMarkdown text={example.description} />
            </p>
          )}
          <ExampleBlock example={example} />
        </section>
      ))}
    </>
  );
}

function AccessibilityPanel({ doc }) {
  return (
    <>
      {doc.keyboard && (
        <>
          <h2 id="keyboard" className="docs-h2">
            Keyboard interactions
          </h2>
          <KeyboardTable keys={doc.keyboard} />
        </>
      )}
      <h2 className="docs-h2">Accessibility notes</h2>
      <ul className="docs-list">
        {doc.accessibility.map((note) => (
          <li key={note}>
            <InlineMarkdown text={note} />
          </li>
        ))}
      </ul>
    </>
  );
}

export function ComponentPage() {
  const { slug = "" } = useParams();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const doc = getComponentDoc(slug);
  useDocumentTitle(doc?.name ?? "Page not found");

  if (!doc) {
    return (
      <div className="docs-container">
        <NotFoundContent />
      </div>
    );
  }

  const index = componentDocs.indexOf(doc);
  const previous = componentDocs[index - 1];
  const next = componentDocs[index + 1];
  const category = getCategoryByName(doc.category);
  const [firstExample] = doc.examples;
  const { Component: Preview } = firstExample;
  const importCode = `import { ${doc.imports.join(", ")} } from "@shelf-ui/react";`;
  const tab = tabForHash(hash, doc);

  const selectTab = (value) =>
    navigate({ hash: value === "usage" ? "" : value }, { replace: true, preventScrollReset: true });

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Components", to: "/components" },
          { label: category.name, to: `/components?category=${category.slug}` },
          { label: doc.name },
        ]}
        title={doc.name}
        lead={doc.description}
        actions={
          <CopyButton text={firstExample.code} className="docs-copy--primary">
            Copy code
          </CopyButton>
        }
      />

      <div className="docs-container docs-component-page">
        <section className="docs-showcase" aria-label={`${doc.name} preview`}>
          <div className="docs-showcase__header">
            <span>{firstExample.title}</span>
          </div>
          <div
            className={firstExample.minHeight ? "docs-preview docs-preview--top" : "docs-preview"}
            style={firstExample.minHeight ? { minHeight: firstExample.minHeight } : undefined}
            onClick={preventPlaceholderNavigation}
          >
            <div className="docs-preview__frame">
              <Preview />
            </div>
          </div>
        </section>

        <Tabs value={tab} onValueChange={selectTab} className="docs-component-tabs">
          <Tabs.List aria-label={`${doc.name} documentation`}>
            {TABS.map((item) => (
              <Tabs.Tab key={item.value} value={item.value}>
                {item.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panel value="usage">
            <UsagePanel doc={doc} importCode={importCode} usageCode={firstExample.code} />
          </Tabs.Panel>
          <Tabs.Panel value="props">
            <PropsPanel doc={doc} />
          </Tabs.Panel>
          <Tabs.Panel value="examples">
            <ExamplesPanel doc={doc} />
          </Tabs.Panel>
          <Tabs.Panel value="accessibility">
            <AccessibilityPanel doc={doc} />
          </Tabs.Panel>
        </Tabs>

        <PageNav
          previous={previous && { to: `/components/${previous.slug}`, label: previous.name }}
          next={next && { to: `/components/${next.slug}`, label: next.name }}
        />
      </div>
    </>
  );
}
