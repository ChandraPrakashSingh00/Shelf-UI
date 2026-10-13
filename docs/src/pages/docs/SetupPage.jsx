import { CodeBlock } from "../../components/CodeBlock.jsx";
import { setupPage } from "../../content/docsPages.js";
import { DocsPageNav, PageHeader } from "../../layout/PageParts.jsx";
import { useDocumentTitle } from "../../lib/document.js";

const viteCode = `// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "shelf-ui-react/styles.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`;

const nextLayoutCode = `// app/layout.js
import "shelf-ui-react/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-shelf-theme="light">
      <body>{children}</body>
    </html>
  );
}`;

const nextServerCode = `// app/page.js — a Server Component
import { Card, CardContent, CardHeader, CardTitle } from "shelf-ui-react";

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

const toastProviderCode = `import { ToastProvider } from "shelf-ui-react";

export function Root() {
  return (
    <ToastProvider position="bottom-right">
      <App />
    </ToastProvider>
  );
}`;

const toastUsageCode = `import { Button, useToast } from "shelf-ui-react";

export function SaveButton() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => toast({ variant: "success", title: "Saved", message: "Your changes are live." })}
    >
      Save
    </Button>
  );
}`;

export function SetupPage() {
  useDocumentTitle("Setup");

  return (
    <article className="docs-article">
      <PageHeader
        title="Setup"
        lead="Framework setup for Vite and the Next.js App Router, plus the one provider you may need: `ToastProvider`."
      />

      <h2 id="vite" className="docs-h2">
        Vite
      </h2>
      <p className="docs-text">
        Import the stylesheet in your entry file, before your own styles, so your CSS can override
        it:
      </p>
      <CodeBlock code={viteCode} title="src/main.jsx" />

      <h2 id="nextjs" className="docs-h2">
        Next.js
      </h2>
      <p className="docs-text">
        Shelf UI works with the App Router. Every module ships with <code>"use client"</code>, so
        you can render components from Server Components. Import the styles in your root layout:
      </p>
      <CodeBlock code={nextLayoutCode} title="app/layout.js" />
      <p className="docs-text">
        In Server Components, use the named parts of compound components (<code>CardHeader</code>,{" "}
        <code>TabList</code>, <code>NavbarLink</code>, …) instead of dot notation:
      </p>
      <CodeBlock code={nextServerCode} title="app/page.js" />

      <h2 id="toasts" className="docs-h2">
        Toasts
      </h2>
      <p className="docs-text">
        To show toasts with <code>useToast()</code>, wrap your app in <code>ToastProvider</code>{" "}
        once. No other component needs a provider.
      </p>
      <CodeBlock code={toastProviderCode} />
      <p className="docs-text">
        Then call <code>toast()</code> from any component inside it:
      </p>
      <CodeBlock code={toastUsageCode} title="SaveButton.jsx" />

      <DocsPageNav page={setupPage} />
    </article>
  );
}
