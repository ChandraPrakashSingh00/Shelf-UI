import { Tabs } from "@codecps/ui";
import { CodeBlock } from "../components/CodeBlock.jsx";
import { ThemeBuilder } from "../components/ThemeBuilder.jsx";
import { PageHeader, PageNav, TableOfContents } from "../layout/PageParts.jsx";
import { useDocumentTitle } from "../lib/document.js";

const packageManagers = [
  { id: "npm", command: "npm install @codecps/ui" },
  { id: "pnpm", command: "pnpm add @codecps/ui" },
  { id: "yarn", command: "yarn add @codecps/ui" },
  { id: "bun", command: "bun add @codecps/ui" },
];

const sections = [
  { id: "requirements", label: "Requirements" },
  { id: "install", label: "Install" },
  { id: "styles", label: "Import the styles" },
  { id: "font", label: "Add the font" },
  { id: "usage", label: "Use a component" },
  { id: "toasts", label: "Set up toasts" },
  { id: "wrapping", label: "Wrap a component" },
  { id: "theming", label: "Theming" },
  { id: "dark-mode", label: "Dark mode" },
  { id: "nextjs", label: "Next.js" },
];

const usageCode = `import { Button, Card, Input } from "@codecps/ui";

export function StartProject() {
  return (
    <Card title="Start a project" description="We'll reply within one business day.">
      <Input label="Email" type="email" placeholder="you@company.com" required />
      <Button>Start Project</Button>
    </Card>
  );
}`;

const toastCode = `import { ToastProvider } from "@codecps/ui";

export function Root() {
  return (
    <ToastProvider position="bottom-right">
      <App />
    </ToastProvider>
  );
}`;

const wrapperCode = `import { Button } from "@codecps/ui";

// Pass every other prop through, so the wrapper keeps Button's full API.
// \`type\` comes last, so callers can't override it.
export function SubmitButton(props) {
  return <Button {...props} type="submit" />;
}`;

const fontCode = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
  rel="stylesheet"
/>`;

const darkModeCode = `// Switch the whole app (including modals and toasts) to the dark theme.
document.documentElement.dataset.cpsTheme = "dark";

// …and back.
document.documentElement.dataset.cpsTheme = "light";`;

const nextLayoutCode = `// app/layout.js
import "@codecps/ui/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-cps-theme="light">
      <body>{children}</body>
    </html>
  );
}`;

const nextServerCode = `// app/page.js — a Server Component
import { Card, CardContent, CardHeader, CardTitle } from "@codecps/ui";

export default function Page() {
  return (
    <Card>
      {/* Use named parts here: dotted names like Card.Header can't cross the server boundary. */}
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>Rendered on the server.</CardContent>
    </Card>
  );
}`;

export function InstallationPage() {
  useDocumentTitle("Installation");

  return (
    <div className="docs-with-toc">
      <article className="docs-article">
        <PageHeader
          eyebrow="Getting started"
          title="Installation"
          lead="Add CodeCPS UI to a React 18 or 19 project in a few minutes."
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

        <h2 id="install" className="docs-h2">
          Install
        </h2>
        <Tabs defaultValue="npm" className="docs-install-tabs">
          <Tabs.List aria-label="Package manager">
            {packageManagers.map((manager) => (
              <Tabs.Tab key={manager.id} value={manager.id}>
                {manager.id}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {packageManagers.map((manager) => (
            <Tabs.Panel key={manager.id} value={manager.id}>
              <CodeBlock code={manager.command} language="bash" />
            </Tabs.Panel>
          ))}
        </Tabs>

        <h2 id="styles" className="docs-h2">
          Import the styles
        </h2>
        <p className="docs-text">
          Import the stylesheet once, in your app's entry file (for example <code>main.jsx</code>).
          It holds the design tokens and the styles for every component, about 4 kB gzipped.
        </p>
        <CodeBlock code={'import "@codecps/ui/styles.css";'} />

        <h2 id="font" className="docs-h2">
          Add the font
        </h2>
        <p className="docs-text">
          Components use Inter when it's available and fall back to the system font. Load it in your{" "}
          <code>&lt;head&gt;</code> for the intended look:
        </p>
        <CodeBlock code={fontCode} language="jsx" title="html" />

        <h2 id="usage" className="docs-h2">
          Use a component
        </h2>
        <CodeBlock code={usageCode} title="StartProject.jsx" />

        <h2 id="toasts" className="docs-h2">
          Set up toasts
        </h2>
        <p className="docs-text">
          To show toasts with <code>useToast()</code>, wrap your app in <code>ToastProvider</code>{" "}
          once:
        </p>
        <CodeBlock code={toastCode} />

        <h2 id="wrapping" className="docs-h2">
          Wrap a component
        </h2>
        <p className="docs-text">
          Most components pass the props they don't use on to their underlying element (
          <code>Button</code> accepts every native <code>&lt;button&gt;</code> attribute, for
          example), so your own wrappers can spread props through and keep the full API:
        </p>
        <CodeBlock code={wrapperCode} title="SubmitButton.jsx" />

        <h2 id="theming" className="docs-h2">
          Theming
        </h2>
        <p className="docs-text">
          Colors, radii, font sizes and control heights are CSS custom properties prefixed with{" "}
          <code>--cps-</code>. Override them on <code>:root</code> to theme the whole app. Try it:
          pick a color and copy the CSS.
        </p>
        <ThemeBuilder />
        <p className="docs-text">
          The full list of tokens is in <code>src/styles/tokens.css</code>. You can also set tokens
          on a single container; tokens defined in terms of others (like{" "}
          <code>--cps-color-info</code>, which follows the primary color) then need to be set there
          too.
        </p>

        <h2 id="dark-mode" className="docs-h2">
          Dark mode
        </h2>
        <p className="docs-text">
          Add <code>data-cps-theme="dark"</code> to the <code>&lt;html&gt;</code> element. Setting
          it on <code>&lt;html&gt;</code> (not a nested element) makes sure modals and toasts, which
          render into <code>document.body</code>, use the same theme. This site's toggle in the
          header works this way.
        </p>
        <CodeBlock code={darkModeCode} />

        <h2 id="nextjs" className="docs-h2">
          Next.js
        </h2>
        <p className="docs-text">
          CodeCPS UI works with the App Router. Every module ships with <code>"use client"</code>,
          so you can render components from Server Components. Import the styles in your root
          layout:
        </p>
        <CodeBlock code={nextLayoutCode} title="app/layout.js" />
        <p className="docs-text">
          In Server Components, use the named parts of compound components (<code>CardHeader</code>,{" "}
          <code>TabList</code>, <code>NavbarLink</code>, …) instead of dot notation:
        </p>
        <CodeBlock code={nextServerCode} title="app/page.js" />

        <PageNav next={{ to: "/components", label: "Components" }} />
      </article>
      <TableOfContents items={sections} />
    </div>
  );
}
