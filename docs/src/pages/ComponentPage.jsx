import { useParams } from "react-router";
import { CodeBlock } from "../components/CodeBlock.jsx";
import { ExampleBlock } from "../components/ExampleBlock.jsx";
import { InlineMarkdown } from "../components/InlineMarkdown.jsx";
import { KeyboardTable, PropsTable } from "../components/PropsTable.jsx";
import { componentDocs, getComponentDoc } from "../content/components/index.js";
import { PageHeader, PageNav, TableOfContents } from "../layout/PageParts.jsx";
import { useDocumentTitle } from "../lib/document.js";
import { NotFoundContent } from "./NotFoundPage.jsx";

function tableOfContents(doc) {
  return [
    ...(doc.Playground ? [{ id: "playground", label: "Live preview" }] : []),
    { id: "examples", label: "Examples" },
    ...doc.examples.map((example) => ({ id: example.id, label: example.title, nested: true })),
    { id: "api", label: "API reference" },
    ...(doc.keyboard ? [{ id: "keyboard", label: "Keyboard" }] : []),
    { id: "accessibility", label: "Accessibility" },
  ];
}

export function ComponentPage() {
  const { slug = "" } = useParams();
  const doc = getComponentDoc(slug);
  useDocumentTitle(doc?.name ?? "Page not found");

  if (!doc) return <NotFoundContent />;

  const index = componentDocs.indexOf(doc);
  const previous = componentDocs[index - 1];
  const next = componentDocs[index + 1];
  const { Playground } = doc;

  return (
    <div className="docs-with-toc">
      <article className="docs-article">
        <PageHeader eyebrow={doc.category} title={doc.name} lead={doc.description}>
          <CodeBlock code={`import { ${doc.imports.join(", ")} } from "@codecps/ui";`} />
        </PageHeader>

        {Playground && (
          <section aria-labelledby="playground">
            <h2 id="playground" className="docs-h2">
              Live preview
            </h2>
            <p className="docs-text">Change the props to see the component and its code update.</p>
            <Playground />
          </section>
        )}

        <section aria-labelledby="examples">
          <h2 id="examples" className="docs-h2">
            Examples
          </h2>
          {doc.examples.map((example) => (
            <section key={example.id} aria-labelledby={example.id}>
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
        </section>

        <section aria-labelledby="api">
          <h2 id="api" className="docs-h2">
            API reference
          </h2>
          {doc.api.map((group) => (
            <PropsTable key={group.title} group={group} />
          ))}
        </section>

        {doc.keyboard && (
          <section aria-labelledby="keyboard">
            <h2 id="keyboard" className="docs-h2">
              Keyboard interactions
            </h2>
            <KeyboardTable keys={doc.keyboard} />
          </section>
        )}

        <section aria-labelledby="accessibility">
          <h2 id="accessibility" className="docs-h2">
            Accessibility
          </h2>
          <ul className="docs-list">
            {doc.accessibility.map((note) => (
              <li key={note}>
                <InlineMarkdown text={note} />
              </li>
            ))}
          </ul>
        </section>

        <PageNav
          previous={previous && { to: `/components/${previous.slug}`, label: previous.name }}
          next={next && { to: `/components/${next.slug}`, label: next.name }}
        />
      </article>
      <TableOfContents items={tableOfContents(doc)} />
    </div>
  );
}
