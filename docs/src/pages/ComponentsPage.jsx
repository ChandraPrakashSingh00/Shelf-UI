import { ComponentCard } from "../components/ComponentCard.jsx";
import { toAnchorId } from "../components/PropsTable.jsx";
import { categoryOrder, componentDocs } from "../content/components/index.js";
import { PageHeader } from "../layout/PageParts.jsx";
import { useDocumentTitle } from "../lib/document.js";

export function ComponentsPage() {
  useDocumentTitle("Components");

  return (
    <article className="docs-article docs-article--wide">
      <PageHeader
        eyebrow="Components"
        title="Components"
        lead={`${componentDocs.length} accessible, themeable components. Each page has a live preview, examples you can copy, an API reference and keyboard support notes.`}
      />
      {categoryOrder.map((category) => {
        const docs = componentDocs.filter((doc) => doc.category === category);
        if (docs.length === 0) return null;
        const id = toAnchorId(category);
        return (
          <section key={category} aria-labelledby={id}>
            <h2 id={id} className="docs-h2">
              {category}
            </h2>
            <div className="docs-grid">
              {docs.map((doc) => (
                <ComponentCard key={doc.slug} doc={doc} />
              ))}
            </div>
          </section>
        );
      })}
    </article>
  );
}
