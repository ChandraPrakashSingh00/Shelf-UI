import { Link } from "react-router";
import { repositoryUrl } from "../content/site.js";

export function SiteFooter() {
  return (
    <footer className="docs-footer">
      <div className="docs-container docs-footer__inner">
        <p>© {new Date().getFullYear()} CodeCPS Technologies. Released under the MIT License.</p>
        <nav aria-label="Footer" className="docs-footer__links">
          <Link to="/docs/installation">Installation</Link>
          <Link to="/components">Components</Link>
          <Link to="/changelog">Changelog</Link>
          <Link to="/about">About</Link>
          <a href={repositoryUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
