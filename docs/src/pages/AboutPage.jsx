import { Button } from "@shelf-ui/react";
import { Link } from "react-router";
import {
  GitHubIcon,
  LightbulbIcon,
  ShieldCheckIcon,
  TargetIcon,
  UsersIcon,
} from "../components/icons.jsx";
import { BrandLogo } from "../components/Logo.jsx";
import { SocialLinks } from "../components/SocialLinks.jsx";
import { StatList } from "../components/StatList.jsx";
import {
  issuesUrl,
  licenseUrl,
  packageName,
  productName,
  repositoryUrl,
  version,
} from "../content/site.js";
import { PageHero } from "../layout/PageParts.jsx";
import { useDocumentTitle } from "../lib/document.js";

const values = [
  {
    title: "Quality",
    text: "Every component ships with tests, documentation and keyboard support, and CI checks every change before it's released.",
    Icon: ShieldCheckIcon,
  },
  {
    title: "Community",
    text: "Open source under the MIT License. Anyone can read the code, report a bug or suggest a component on GitHub.",
    Icon: UsersIcon,
  },
  {
    title: "Innovation",
    text: "Modern by default: React 18 and 19, design tokens, color-mix() theming and the Next.js App Router.",
    Icon: LightbulbIcon,
  },
  {
    title: "Impact",
    text: "One library across every project means faster builds and an accessible, consistent experience for everyone.",
    Icon: TargetIcon,
  },
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
    <>
      <PageHero
        breadcrumbs={[{ label: "About" }]}
        title="About Us"
        lead="We're on a mission to make UI development simpler, faster and more enjoyable."
      />

      <div className="docs-container docs-about">
        <section className="docs-about__intro" aria-label={`About ${productName}`}>
          <div className="docs-about__logo" role="img" aria-label={productName}>
            <BrandLogo size="lg" byline />
          </div>
          <div className="docs-about__text">
            <p>
              {productName} is an open-source React component library, published on npm as{" "}
              <code>{packageName}</code>.
            </p>
            <p>
              It's a shared foundation for your products: the same buttons, forms, overlays and
              navigation in every project, built once, tested once and styled with design tokens.
              Everything is accessible, customizable and free to use.
            </p>
            <p>
              We named it {productName} because a component library should work like a well-kept
              shelf: everything in its place, ready to pick up and make your own.
            </p>
          </div>
        </section>

        <StatList className="docs-about__stats" />

        <section aria-labelledby="values-title" className="docs-about__section">
          <h2 id="values-title" className="docs-section__title">
            Our Values
          </h2>
          <ul className="docs-values">
            {values.map(({ title, text, Icon }) => (
              <li key={title} className="docs-value">
                <span className="docs-icon-tile docs-icon-tile--lg">
                  <Icon />
                </span>
                <h3 className="docs-value__title">{title}</h3>
                <p className="docs-value__text">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="docs-about__columns">
          <section aria-labelledby="status-title">
            <h2 id="status-title" className="docs-section__title">
              Project status
            </h2>
            <p className="docs-text">
              The current version is <code>{version}</code>, a pre-release: the API may still change
              before <code>1.0</code>. Every change is listed in the changelog.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/changelog">Read the changelog</Link>
            </Button>
          </section>
          <section aria-labelledby="stack-title">
            <h2 id="stack-title" className="docs-section__title">
              Built with
            </h2>
            <ul className="docs-list">
              {stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="docs-community" aria-labelledby="community-title">
          <h2 id="community-title" className="docs-community__title">
            Join Our Community
          </h2>
          <p className="docs-community__text">
            Follow along, report issues and share what you build with Shelf UI.
          </p>
          <SocialLinks className="docs-social--light" />
          <div className="docs-community__actions">
            <Button asChild size="sm">
              <a href={repositoryUrl} target="_blank" rel="noreferrer">
                <GitHubIcon />
                View on GitHub
              </a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={issuesUrl} target="_blank" rel="noreferrer">
                Open an issue
              </a>
            </Button>
          </div>
          <p className="docs-community__license">
            Released under the{" "}
            <a href={licenseUrl} target="_blank" rel="noreferrer">
              MIT License
            </a>
            . © {new Date().getFullYear()} {productName} contributors.
          </p>
        </section>
      </div>
    </>
  );
}
