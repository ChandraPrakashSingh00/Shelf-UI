import { Link } from "react-router";
import tokensSource from "../../../../src/styles/tokens.css?raw";
import { toAnchorId } from "../../components/PropsTable.jsx";
import { designTokensPage } from "../../content/docsPages.js";
import { DocsPageNav, PageHeader } from "../../layout/PageParts.jsx";
import { useDocumentTitle } from "../../lib/document.js";
import { isColorValue, parseTokens } from "../../lib/tokens.js";

const groups = parseTokens(tokensSource);
const tokenCount = groups.reduce((count, group) => count + group.tokens.length, 0);

function TokenValue({ value }) {
  if (value === undefined) return <span className="docs-muted">Same</span>;
  return (
    <span className="docs-token-value">
      {isColorValue(value) && (
        <span className="docs-token-swatch" style={{ background: value }} aria-hidden="true" />
      )}
      <code>{value}</code>
    </span>
  );
}

export function DesignTokensPage() {
  useDocumentTitle("Design tokens");

  return (
    <article className="docs-article docs-article--wide">
      <PageHeader
        title="Design tokens"
        lead={`All ${tokenCount} \`--shelf-\` custom properties, read straight from the library's stylesheet. The dark column shows the value under \`data-shelf-theme="dark"\`.`}
      />
      <p className="docs-text">
        Override any of them on <code>:root</code> to theme your app; see{" "}
        <Link to="/docs/theming">Theming</Link> for how.
      </p>

      {groups.map((group) => {
        const id = `tokens-${toAnchorId(group.title)}`;
        return (
          <section key={group.title} aria-labelledby={id}>
            <h2 id={id} className="docs-h2">
              {group.title}
            </h2>
            <div className="docs-table-wrap" role="region" aria-labelledby={id} tabIndex={0}>
              <table className="docs-table docs-table--tokens">
                <thead>
                  <tr>
                    <th scope="col">Token</th>
                    <th scope="col">Light</th>
                    <th scope="col">Dark</th>
                  </tr>
                </thead>
                <tbody>
                  {group.tokens.map((token) => (
                    <tr key={token.name}>
                      <th scope="row">
                        <code className="docs-table__name">{token.name}</code>
                      </th>
                      <td>
                        <TokenValue value={token.light} />
                      </td>
                      <td>
                        <TokenValue value={token.dark} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <DocsPageNav page={designTokensPage} />
    </article>
  );
}
