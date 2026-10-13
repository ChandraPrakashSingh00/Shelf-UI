import { Button, Kbd } from "shelf-ui-react";
import { Link } from "react-router";
import { CodeBlock, CopyButton } from "../components/CodeBlock.jsx";
import { ComponentCard } from "../components/ComponentCard.jsx";
import { HeroShowcase } from "../components/HeroShowcase.jsx";
import { ShelfArt } from "../components/ShelfArt.jsx";
import {
  AccessibleIcon,
  ArrowRightIcon,
  FeatherIcon,
  LayersIcon,
  MoonIcon,
  PaletteIcon,
  SparklesIcon,
  SunIcon,
} from "../components/icons.jsx";
import { StatList } from "../components/StatList.jsx";
import { componentDocs, getComponentDoc } from "../content/components/index.js";
import { packageName, productName, version } from "../content/site.js";
import { useDocumentTitle } from "../lib/document.js";

const popularSlugs = ["button", "card", "input", "modal", "dropdown", "table"];

const installCommand = `npm install ${packageName}`;

const swatches = ["#6938ef", "#2970ff", "#0f766e", "#e11d48", "#ea580c"];

const steps = [
  {
    title: "Install the package",
    text: `Add ${productName} to any React 18 or 19 project.`,
    code: installCommand,
    language: "bash",
    fileName: "terminal",
  },
  {
    title: "Import the styles",
    text: "Load the stylesheet once, in your app's entry file.",
    code: `import "${packageName}/styles.css";`,
    language: "jsx",
    fileName: "main.jsx",
  },
  {
    title: "Use a component",
    text: "Import components by name and render them.",
    code: `import { Button } from "${packageName}";\n\n<Button>Get started</Button>`,
    language: "jsx",
    fileName: "App.jsx",
  },
];

function Features() {
  return (
    <ul className="docs-bento">
      <li className="docs-bento__card docs-bento__card--wide">
        <span className="docs-icon-tile">
          <AccessibleIcon />
        </span>
        <h3 className="docs-bento__title">Accessible by default</h3>
        <p className="docs-bento__text">
          Keyboard support, focus management and ARIA wiring follow the WAI-ARIA Authoring
          Practices, and every component page documents its keys.
        </p>
        <div className="docs-bento__keys" aria-hidden="true">
          <Kbd>Tab</Kbd>
          <Kbd keys={["Shift", "Tab"]} />
          <Kbd>Enter</Kbd>
          <Kbd>Esc</Kbd>
          <Kbd>←</Kbd>
          <Kbd>→</Kbd>
        </div>
      </li>
      <li className="docs-bento__card">
        <span className="docs-icon-tile">
          <MoonIcon />
        </span>
        <h3 className="docs-bento__title">Light and dark themes</h3>
        <p className="docs-bento__text">One attribute on {"<html>"} switches the whole app.</p>
        <div className="docs-bento__themes" aria-hidden="true">
          <span className="docs-bento__theme docs-bento__theme--light">
            <SunIcon />
          </span>
          <span className="docs-bento__theme docs-bento__theme--dark">
            <MoonIcon />
          </span>
        </div>
      </li>
      <li className="docs-bento__card">
        <span className="docs-icon-tile">
          <PaletteIcon />
        </span>
        <h3 className="docs-bento__title">Design tokens</h3>
        <p className="docs-bento__text">Override a few CSS variables to match any brand.</p>
        <div className="docs-bento__swatches" aria-hidden="true">
          {swatches.map((color) => (
            <span key={color} style={{ backgroundColor: color }} />
          ))}
        </div>
      </li>
      <li className="docs-bento__card">
        <span className="docs-icon-tile">
          <FeatherIcon />
        </span>
        <h3 className="docs-bento__title">Lightweight</h3>
        <p className="docs-bento__text">No runtime dependencies besides React.</p>
        <p className="docs-bento__metric">
          ~19 kB <span>of CSS, gzipped</span>
        </p>
      </li>
      <li className="docs-bento__card">
        <span className="docs-icon-tile">
          <LayersIcon />
        </span>
        <h3 className="docs-bento__title">Framework-ready</h3>
        <p className="docs-bento__text">SSR-safe, with “use client” for the App Router.</p>
        <ul className="docs-bento__chips" aria-label="Works with">
          <li>Vite</li>
          <li>Next.js</li>
          <li>React 18</li>
          <li>React 19</li>
        </ul>
      </li>
    </ul>
  );
}

export function HomePage() {
  useDocumentTitle();

  return (
    <div className="docs-home">
      <section className="docs-hero" aria-labelledby="hero-title">
        <div className="docs-container docs-hero__inner">
          <Link to="/blog/whats-new-in-0-3-0" className="docs-hero__pill">
            <span className="docs-hero__pill-version">v{version}</span>
            New package, new look
            <ArrowRightIcon className="docs-hero__pill-arrow" />
          </Link>
          <h1 id="hero-title" className="docs-hero__title">
            Off-the-shelf components, <br className="docs-hero__break" />
            <span>made to fit</span> your brand
          </h1>
          <p className="docs-hero__lead">
            {productName} is an accessible, open-source React component library:{" "}
            {componentDocs.length} components, light and dark themes, and design tokens that make
            every piece your own.
          </p>
          <div className="docs-hero__actions">
            <Button asChild size="lg">
              <Link to="/components">
                Browse Components <ArrowRightIcon />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/docs">View Documentation</Link>
            </Button>
          </div>
          <div className="docs-hero__install">
            <code>
              <span className="docs-hero__prompt" aria-hidden="true">
                $
              </span>{" "}
              {installCommand}
            </code>
            <CopyButton
              text={installCommand}
              label="Copy install command"
              className="docs-copy--light"
            />
          </div>
        </div>
        <div className="docs-container">
          <HeroShowcase />
        </div>
      </section>

      <section className="docs-stats">
        <div className="docs-container">
          <StatList />
        </div>
      </section>

      <section className="docs-container docs-section" aria-labelledby="features-title">
        <div className="docs-section__header docs-section__header--center">
          <p className="docs-section__eyebrow">
            <SparklesIcon /> Why {productName}
          </p>
          <h2 id="features-title" className="docs-section__title">
            Everything you need, nothing you don't
          </h2>
          <p className="docs-section__lead">
            Components that look good out of the box and work for everyone who uses them.
          </p>
        </div>
        <Features />
      </section>

      <section className="docs-container docs-section" aria-labelledby="popular-title">
        <div className="docs-section__header">
          <div>
            <h2 id="popular-title" className="docs-section__title">
              Popular on the shelf
            </h2>
            <p className="docs-section__lead">The components teams reach for first.</p>
          </div>
          <Link to="/components" className="docs-arrow-link">
            View all {componentDocs.length} components <ArrowRightIcon />
          </Link>
        </div>
        <div className="docs-card-grid">
          {popularSlugs.map((slug) => (
            <ComponentCard key={slug} doc={getComponentDoc(slug)} />
          ))}
        </div>
      </section>

      <section className="docs-container docs-section" aria-labelledby="steps-title">
        <div className="docs-section__header docs-section__header--center">
          <h2 id="steps-title" className="docs-section__title">
            Start building in minutes
          </h2>
          <p className="docs-section__lead">
            Three steps from an empty project to your first screen.
          </p>
        </div>
        <ol className="docs-home-steps">
          {steps.map((step) => (
            <li key={step.title} className="docs-home-step">
              <h3 className="docs-home-step__title">{step.title}</h3>
              <p className="docs-home-step__text">{step.text}</p>
              <CodeBlock code={step.code} language={step.language} title={step.fileName} />
            </li>
          ))}
        </ol>
        <p className="docs-home-steps__more">
          <Link to="/docs/installation" className="docs-arrow-link">
            Read the full installation guide <ArrowRightIcon />
          </Link>
        </p>
      </section>

      <section className="docs-container docs-section docs-section--last">
        <div className="docs-cta">
          <h2 className="docs-cta__title">Your next screen is already on the shelf</h2>
          <p className="docs-cta__text">
            Pick from {componentDocs.length} components and start building your next project today.
          </p>
          <Link to="/components" className="docs-cta__button">
            Browse All Components <ArrowRightIcon />
          </Link>
          <ShelfArt className="docs-cta__shelf" />
        </div>
      </section>
    </div>
  );
}
