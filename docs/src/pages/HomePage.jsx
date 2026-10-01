import { Alert, Badge, Button, Card, Input, Tabs, useToast } from "@codecps/ui";
import { Link } from "react-router";
import packageJson from "../../../package.json";
import { CodeBlock } from "../components/CodeBlock.jsx";
import { ComponentCard } from "../components/ComponentCard.jsx";
import {
  AccessibleIcon,
  ArrowRightIcon,
  CodeIcon,
  FeatherIcon,
  LayersIcon,
  PaletteIcon,
  ServerIcon,
} from "../components/icons.jsx";
import { componentDocs } from "../content/components/index.js";
import { useDocumentTitle } from "../lib/document.js";

const features = [
  {
    title: "Accessible by default",
    text: "Keyboard support, focus management and ARIA wiring follow the WAI-ARIA Authoring Practices.",
    Icon: AccessibleIcon,
  },
  {
    title: "Simple to use",
    text: "Plain JavaScript and JSX with sensible defaults. Every prop is documented, with examples to copy.",
    Icon: CodeIcon,
  },
  {
    title: "Themeable",
    text: "Design tokens are CSS variables. Override a few to match a brand, or switch to dark mode.",
    Icon: PaletteIcon,
  },
  {
    title: "Lightweight",
    text: "No runtime dependencies besides React. Tree-shakeable ES modules and a ~18 kB stylesheet (gzipped).",
    Icon: FeatherIcon,
  },
  {
    title: "Framework-ready",
    text: "SSR-safe, with “use client” built in for the Next.js App Router.",
    Icon: ServerIcon,
  },
  {
    title: "One design language",
    text: "The same components across CodeCPS products, from marketing sites to dashboards.",
    Icon: LayersIcon,
  },
];

const highlighted = [
  "button",
  "input",
  "slider",
  "modal",
  "drawer",
  "carousel",
  "dropdown",
  "tabs",
  "toast",
];

const deployments = [
  { name: "codecps-web", time: "2m ago", status: "success", label: "Ready" },
  { name: "codecps-api", time: "8m ago", status: "warning", label: "Building" },
  { name: "codecps-docs", time: "1h ago", status: "danger", label: "Failed" },
];

function Showcase() {
  const { toast } = useToast();

  const createProject = (event) => {
    event.preventDefault();
    toast({ variant: "success", title: "Project created", message: "It's ready to deploy." });
  };

  return (
    <div className="docs-showcase">
      <Card
        title="Create a project"
        description="Everything on this panel is a live CodeCPS UI component."
      >
        <form className="docs-showcase__form" onSubmit={createProject}>
          <Input label="Project name" defaultValue="codecps-web" required />
          <Input
            label="Repository"
            defaultValue="github.com/codecps/web"
            helperText="We'll deploy every push to main."
          />
          <div className="docs-showcase__actions">
            <Button type="submit">Create project</Button>
            <Button type="reset" variant="ghost">
              Reset
            </Button>
          </div>
        </form>
      </Card>
      <div className="docs-showcase__column">
        <Alert
          variant="warning"
          title="Usage at 90%"
          description="Upgrade before the end of the month to avoid rate limits."
        />
        <Card>
          <Tabs defaultValue="deployments">
            <Tabs.List aria-label="Project activity">
              <Tabs.Tab value="deployments">Deployments</Tabs.Tab>
              <Tabs.Tab value="domains">Domains</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="deployments">
              <ul className="docs-showcase__list">
                {deployments.map((deployment) => (
                  <li key={deployment.name}>
                    <span>
                      <strong>{deployment.name}</strong>
                      <span className="docs-muted"> · {deployment.time}</span>
                    </span>
                    <Badge variant={deployment.status}>{deployment.label}</Badge>
                  </li>
                ))}
              </ul>
            </Tabs.Panel>
            <Tabs.Panel value="domains">
              <ul className="docs-showcase__list">
                <li>
                  codecps.com <Badge variant="success">Valid</Badge>
                </li>
                <li>
                  docs.codecps.com <Badge variant="neutral">Pending DNS</Badge>
                </li>
              </ul>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export function HomePage() {
  useDocumentTitle();

  return (
    <div className="docs-home">
      <section className="docs-hero docs-container">
        <Link to="/changelog" className="docs-hero__release">
          <Badge variant="primary" size="sm">
            New
          </Badge>
          v{packageJson.version}: the first release is here
          <ArrowRightIcon />
        </Link>
        <h1 className="docs-hero__title">
          The React component library for <span>CodeCPS</span> products
        </h1>
        <p className="docs-hero__lead">
          Accessible, themeable components, so every CodeCPS product looks consistent and works for
          everyone.
        </p>
        <div className="docs-hero__actions">
          <Button asChild size="lg">
            <Link to="/docs/installation">Get started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/components">Browse components</Link>
          </Button>
        </div>
        <CodeBlock code="npm install @codecps/ui" language="bash" className="docs-hero__install" />
      </section>

      <section className="docs-container docs-home__section" aria-labelledby="showcase-title">
        <h2 id="showcase-title" className="docs-h2 docs-home__heading">
          Built from real components
        </h2>
        <p className="docs-home__intro">
          Try it: submit the form, switch tabs, or tab through with the keyboard.
        </p>
        <Showcase />
      </section>

      <section className="docs-container docs-home__section" aria-labelledby="features-title">
        <h2 id="features-title" className="docs-h2 docs-home__heading">
          Why CodeCPS UI
        </h2>
        <ul className="docs-features">
          {features.map(({ title, text, Icon }) => (
            <li key={title} className="docs-feature">
              <span className="docs-feature__icon">
                <Icon />
              </span>
              <h3 className="docs-feature__title">{title}</h3>
              <p className="docs-feature__text">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="docs-container docs-home__section" aria-labelledby="components-title">
        <div className="docs-home__section-header">
          <h2 id="components-title" className="docs-h2 docs-home__heading">
            Components
          </h2>
          <Link to="/components" className="docs-arrow-link">
            All {componentDocs.length} components <ArrowRightIcon />
          </Link>
        </div>
        <div className="docs-grid">
          {componentDocs
            .filter((doc) => highlighted.includes(doc.slug))
            .map((doc) => (
              <ComponentCard key={doc.slug} doc={doc} />
            ))}
        </div>
      </section>

      <section className="docs-container docs-home__section">
        <div className="docs-cta">
          <h2 className="docs-cta__title">Start building</h2>
          <p className="docs-cta__text">
            Install the package, import the styles, and render your first component.
          </p>
          <Button asChild size="lg">
            <Link to="/docs/installation">Read the installation guide</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
