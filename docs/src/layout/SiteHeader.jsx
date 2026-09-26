import { Badge, Button, Navbar } from "@codecps/ui";
import { Link, useLocation } from "react-router";
import packageJson from "../../../package.json";
import { Logo, SearchIcon } from "../components/icons.jsx";
import { ThemeToggle } from "../components/ThemeToggle.jsx";
import { isApplePlatform } from "../lib/document.js";

const primaryLinks = [
  { to: "/", label: "Home", isActive: (pathname) => pathname === "/" },
  { to: "/components", label: "Components", isActive: (pathname) => pathname.startsWith("/components") },
  { to: "/docs/installation", label: "Documentation", isActive: (pathname) => pathname.startsWith("/docs") },
  { to: "/changelog", label: "Changelog", isActive: (pathname) => pathname === "/changelog" },
];

export function SiteHeader({ onOpenSearch }) {
  const { pathname } = useLocation();
  const shortcut = isApplePlatform() ? "⌘ K" : "Ctrl K";

  return (
    <Navbar sticky className="docs-header">
      <Navbar.Brand asChild>
        <Link to="/">
          <Logo className="docs-logo" />
          CodeCPS UI
          <Badge variant="primary" size="sm">
            v{packageJson.version}
          </Badge>
        </Link>
      </Navbar.Brand>
      <Navbar.Menu>
        <Navbar.Links>
          {primaryLinks.map((link) => (
            <Navbar.Link key={link.to} asChild active={link.isActive(pathname)}>
              <Link to={link.to}>{link.label}</Link>
            </Navbar.Link>
          ))}
        </Navbar.Links>
        <Navbar.Actions>
          <button
            type="button"
            className="docs-search-trigger"
            aria-label="Search documentation"
            aria-keyshortcuts="Control+K Meta+K"
            onClick={onOpenSearch}
          >
            <SearchIcon />
            <span className="docs-search-trigger__text">Search docs…</span>
            <kbd className="docs-kbd">{shortcut}</kbd>
          </button>
          <ThemeToggle />
          <Button asChild size="sm">
            <Link to="/docs/installation">Get Started</Link>
          </Button>
        </Navbar.Actions>
      </Navbar.Menu>
    </Navbar>
  );
}
