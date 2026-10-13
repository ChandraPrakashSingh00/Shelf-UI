import { Button } from "shelf-ui-react";
import { Link, Navigate, useLocation } from "react-router";
import { Callout } from "../../components/Callout.jsx";
import { CodeBlock } from "../../components/CodeBlock.jsx";
import { CheckCircleIcon } from "../../components/icons.jsx";
import { PackageManagerTabs } from "../../components/PackageManagerTabs.jsx";
import { installationPage } from "../../content/docsPages.js";
import { DocsPageNav, PageHeader } from "../../layout/PageParts.jsx";
import { useDocumentTitle } from "../../lib/document.js";

// Sections that used to live on this page, so old links still land in the right place.
const movedSections = {
  toasts: "/docs/setup#toasts",
  nextjs: "/docs/setup#nextjs",
  wrapping: "/docs/customization#wrapping",
  theming: "/docs/theming",
  "dark-mode": "/docs/theming#dark-mode",
};

const fontCode = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
  rel="stylesheet"
/>`;

const usageCode = `import { Button, Card, Input } from "shelf-ui-react";

export function StartProject() {
  return (
    <Card title="Start a project" description="We'll reply within one business day.">
      <Input label="Email" type="email" placeholder="you@company.com" required />
      <Button>Start Project</Button>
    </Card>
  );
}`;

export function InstallationPage() {
  const { hash } = useLocation();
  useDocumentTitle("Installation");

  const moved = movedSections[hash.slice(1)];
  if (moved) return <Navigate to={moved} replace />;

  return (
    <article className="docs-article">
      <PageHeader
        title="Installation"
        lead="Get started with Shelf UI in your React project in four steps."
      />

      <h2 id="requirements" className="docs-h2">
        Requirements
      </h2>
      <ul className="docs-list">
        <li>React and React DOM 18 or 19.</li>
        <li>
          A bundler that understands ES modules and CSS imports, such as Vite, Next.js or webpack.
        </li>
      </ul>

      <ol className="docs-steps">
        <li className="docs-step">
          <h2 id="install" className="docs-step__title">
            Install the package
          </h2>
          <p className="docs-text">Install Shelf UI with your favorite package manager.</p>
          <PackageManagerTabs />
        </li>
        <li className="docs-step">
          <h2 id="styles" className="docs-step__title">
            Import the styles
          </h2>
          <p className="docs-text">
            Add the stylesheet once, in your app's entry file (for example <code>main.jsx</code>).
            It holds the design tokens and every component's styles, about 19 kB gzipped.
          </p>
          <CodeBlock code={'import "shelf-ui-react/styles.css";'} />
        </li>
        <li className="docs-step">
          <h2 id="font" className="docs-step__title">
            Add the font <span className="docs-step__optional">Optional</span>
          </h2>
          <p className="docs-text">
            Components use Inter when it's available and fall back to the system font. Load it in
            your <code>&lt;head&gt;</code> for the intended look:
          </p>
          <CodeBlock code={fontCode} language="jsx" title="index.html" />
        </li>
        <li className="docs-step">
          <h2 id="usage" className="docs-step__title">
            Use a component
          </h2>
          <p className="docs-text">Import components by name and render them:</p>
          <CodeBlock code={usageCode} title="StartProject.jsx" />
        </li>
      </ol>

      <Callout
        icon={CheckCircleIcon}
        tone="success"
        title="You're all set!"
        actions={
          <>
            <Button asChild size="sm">
              <Link to="/components">Browse components</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/docs/setup">Set up toasts and Next.js</Link>
            </Button>
          </>
        }
      >
        You can now use every Shelf UI component in your project.
      </Callout>

      <DocsPageNav page={installationPage} />
    </article>
  );
}
