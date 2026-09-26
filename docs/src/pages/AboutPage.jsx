import { Button } from "@codecps/ui";
import { Link } from "react-router";
import packageJson from "../../../package.json";
import { GitHubIcon } from "../components/icons.jsx";
import { InlineMarkdown } from "../components/InlineMarkdown.jsx";
import { issuesUrl, licenseUrl, repositoryUrl } from "../content/site.js";
import { PageHeader } from "../layout/PageParts.jsx";
import { useDocumentTitle } from "../lib/document.js";

const principles = [
  "**Accessible by default.** Keyboard support, focus management and ARIA wiring follow the WAI-ARIA Authoring Practices.",
  "**Themeable.** Design tokens are CSS custom properties, with light and dark themes.",
  "**Lightweight.** No runtime dependencies besides React: tree-shakeable ES modules and a single ~4 kB stylesheet.",
  '**Framework-friendly.** SSR-safe, and every module ships `"use client"` for the Next.js App Router.',
  "**Plain JavaScript.** Written in JavaScript and JSX, with sensible defaults and every prop documented.",
];

const stack = [
  "React 18 or 19 (a peer dependency, so your app's React is used).",
  "JavaScript and JSX, built with Vite into ES modules and one stylesheet.",
  "Vitest and Testing Library for tests, ESLint and Prettier for code quality.",
  "GitHub Actions to test every change and publish this documentation site.",
];

export function AboutPage() {
  useDocumentTitle("About");

  return (
    <article className="docs-article">
      <PageHeader
        eyebrow="About"
        title="About CodeCPS UI"
        lead="The shared React component library for CodeCPS Technologies products: the same buttons, forms, overlays and navigation in every project, built once, tested once and styled with the CodeCPS design system."
      />

      <h2 className="docs-h2">Principles</h2>
      <ul className="docs-list">
        {principles.map((item) => (
          <li key={item}>
            <InlineMarkdown text={item} />
          </li>
        ))}
      </ul>

      <h2 className="docs-h2">Project status</h2>
      <p className="docs-text">
        <InlineMarkdown
          text={`The current version is \`${packageJson.version}\`, a pre-release: the API may still change before \`1.0\`. Every change is listed in the changelog.`}
        />
      </p>
      <div className="docs-actions">
        <Button asChild variant="outline" size="sm">
          <Link to="/changelog">Read the changelog</Link>
        </Button>
      </div>

      <h2 className="docs-h2">Built with</h2>
      <ul className="docs-list">
        {stack.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className="docs-h2">Source code and contributing</h2>
      <p className="docs-text">
        The source code is on GitHub. Report a bug or suggest a component by opening an issue. The
        README explains how to set up the project, run the tests and add a new component.
      </p>
      <div className="docs-actions">
        <Button asChild size="sm">
          <a href={repositoryUrl} target="_blank" rel="noreferrer">
            <GitHubIcon />
            View on GitHub
          </a>
        </Button>
        <Button asChild variant="outline" size="sm">
          <a href={issuesUrl} target="_blank" rel="noreferrer">
            Open an issue
          </a>
        </Button>
      </div>

      <h2 className="docs-h2">License</h2>
      <p className="docs-text">
        Released under the{" "}
        <a href={licenseUrl} target="_blank" rel="noreferrer">
          MIT License
        </a>
        . © {new Date().getFullYear()} CodeCPS Technologies.
      </p>
    </article>
  );
}
