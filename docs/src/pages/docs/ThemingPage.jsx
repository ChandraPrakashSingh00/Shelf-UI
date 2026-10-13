import { Link } from "react-router";
import { CodeBlock } from "../../components/CodeBlock.jsx";
import { ThemeBuilder } from "../../components/ThemeBuilder.jsx";
import { themingPage } from "../../content/docsPages.js";
import { DocsPageNav, PageHeader } from "../../layout/PageParts.jsx";
import { useDocumentTitle } from "../../lib/document.js";

const overrideCode = `/* theme.css — load it after shelf-ui-react/styles.css */
:root {
  --shelf-color-primary: #0f766e;
  --shelf-color-primary-hover: #115e59;
  --shelf-color-primary-active: #134e4a;
  --shelf-radius-md: 10px;
}`;

const darkModeCode = `// Switch the whole app (including modals and toasts) to the dark theme.
document.documentElement.dataset.shelfTheme = "dark";

// …and back.
document.documentElement.dataset.shelfTheme = "light";`;

const noFlashCode = `<!-- index.html, in <head>: apply the saved or system theme before first paint -->
<script>
  (function () {
    var theme = "light";
    try {
      var saved = localStorage.getItem("theme");
      var dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      theme = dark ? "dark" : "light";
    } catch (error) {
      // Storage can be blocked (private mode); fall back to light.
    }
    document.documentElement.dataset.shelfTheme = theme;
  })();
</script>`;

export function ThemingPage() {
  useDocumentTitle("Theming");

  return (
    <article className="docs-article">
      <PageHeader
        title="Theming"
        lead="Colors, radii, font sizes and control heights are CSS custom properties prefixed with `--shelf-`. Override a few to match your brand."
      />

      <h2 id="override-tokens" className="docs-h2">
        Override tokens
      </h2>
      <p className="docs-text">
        Set tokens on <code>:root</code> to theme the whole app. Load your overrides after the
        library's stylesheet:
      </p>
      <CodeBlock code={overrideCode} language="css" title="theme.css" />
      <p className="docs-text">
        Every token, with its light and dark value, is listed in{" "}
        <Link to="/docs/design-tokens">Design tokens</Link>.
      </p>

      <h2 id="theme-builder" className="docs-h2">
        Theme builder
      </h2>
      <p className="docs-text">
        Pick a primary color and a corner radius to preview them on real components, then copy the
        CSS. Hover, active and subtle shades are derived from your color with{" "}
        <code>color-mix()</code>.
      </p>
      <ThemeBuilder />

      <h2 id="scoped-themes" className="docs-h2">
        Scoped themes
      </h2>
      <p className="docs-text">
        You can also set tokens on a single container to theme one part of a page. Tokens defined in
        terms of others (like <code>--shelf-color-info</code>, which follows the primary color)
        resolve where they're declared, so redeclare them on that container too.
      </p>

      <h2 id="dark-mode" className="docs-h2">
        Dark mode
      </h2>
      <p className="docs-text">
        Add <code>data-shelf-theme="dark"</code> to the <code>&lt;html&gt;</code> element. Setting
        it on <code>&lt;html&gt;</code> (not a nested element) makes sure modals and toasts, which
        render into <code>document.body</code>, use the same theme. This site's theme toggle works
        this way.
      </p>
      <CodeBlock code={darkModeCode} />
      <p className="docs-text">
        To follow the reader's system setting without a flash of the wrong theme, set the attribute
        before the page paints:
      </p>
      <CodeBlock code={noFlashCode} language="jsx" title="index.html" />

      <DocsPageNav page={themingPage} />
    </article>
  );
}
