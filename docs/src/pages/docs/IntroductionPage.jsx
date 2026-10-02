import { Link } from "react-router";
import packageJson from "../../../../package.json";
import { CodeBlock } from "../../components/CodeBlock.jsx";
import { CategoryIcon } from "../../components/componentIcons.jsx";
import { HelpCallout } from "../../components/HelpCallout.jsx";
import { AtomIcon } from "../../components/icons.jsx";
import { PackageManagerTabs } from "../../components/PackageManagerTabs.jsx";
import {
  categories,
  componentDocs,
  getComponentsInCategory,
} from "../../content/components/index.js";
import { introductionPage } from "../../content/docsPages.js";
import { DocsPageNav, PageHeader } from "../../layout/PageParts.jsx";
import { useDocumentTitle } from "../../lib/document.js";

const peerDependencies = Object.entries(packageJson.peerDependencies);

const setupCode = `// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastProvider } from "@codecps/ui";
import "@codecps/ui/styles.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
);`;

export function IntroductionPage() {
  useDocumentTitle("Documentation");

  return (
    <article className="docs-article">
      <PageHeader
        title="Introduction"
        lead={`CodeCPS UI is an accessible React component library from CodeCPS Technologies: ${componentDocs.length} components in plain JavaScript and JSX, styled with design tokens you can override. Get it running in a few minutes.`}
      />

      <h2 id="quick-install" className="docs-h2">
        Quick install
      </h2>
      <PackageManagerTabs />

      <h2 id="peer-dependencies" className="docs-h2">
        Peer dependencies
      </h2>
      <p className="docs-text">
        CodeCPS UI uses your app's React, so make sure you have these installed:
      </p>
      <div className="docs-table-wrap">
        <table className="docs-table docs-table--compact">
          <thead>
            <tr>
              <th scope="col">Package</th>
              <th scope="col">Version</th>
            </tr>
          </thead>
          <tbody>
            {peerDependencies.map(([name, range]) => (
              <tr key={name}>
                <th scope="row">
                  <span className="docs-package-name">
                    <AtomIcon />
                    <code className="docs-table__name">{name}</code>
                  </span>
                </th>
                <td>
                  <code>{range}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="docs-text">
        There are no other runtime dependencies, and no CSS framework is required.
      </p>

      <h2 id="import-styles" className="docs-h2">
        Import styles
      </h2>
      <p className="docs-text">Add the stylesheet once, in your app's entry file:</p>
      <CodeBlock code={'import "@codecps/ui/styles.css";'} />

      <h2 id="basic-setup" className="docs-h2">
        Basic setup
      </h2>
      <p className="docs-text">
        Components work without a provider. Wrap your app in <code>ToastProvider</code> only if you
        show toasts with <code>useToast()</code>:
      </p>
      <CodeBlock code={setupCode} title="main.jsx" />

      <h2 id="whats-included" className="docs-h2">
        What's included
      </h2>
      <ul className="docs-category-list">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              to={`/components?category=${category.slug}`}
              className="docs-category-list__link"
              data-category={category.slug}
            >
              <span className="docs-category-tile__icon">
                <CategoryIcon slug={category.slug} />
              </span>
              <span>
                <span className="docs-category-list__name">
                  {category.name}{" "}
                  <span className="docs-muted">
                    ({getComponentsInCategory(category.name).length})
                  </span>
                </span>
                <span className="docs-category-list__text">{category.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <HelpCallout />
      <DocsPageNav page={introductionPage} />
    </article>
  );
}
