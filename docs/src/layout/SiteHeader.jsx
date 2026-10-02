import { Button, Navbar } from "@codecps/ui";
import { Link, useLocation } from "react-router";
import { SearchIcon } from "../components/icons.jsx";
import { BrandLogo } from "../components/Logo.jsx";
import { ThemeToggle } from "../components/ThemeToggle.jsx";
import { isApplePlatform } from "../lib/document.js";

const primaryLinks = [
  { to: "/", label: "Home", isActive: (pathname) => pathname === "/" },
  {
    to: "/components",
    label: "Components",
    isActive: (pathname) => pathname.startsWith("/components"),
  },
  {
    to: "/docs",
    label: "Docs",
    isActive: (pathname) => pathname.startsWith("/docs") || pathname === "/changelog",
  },
  { to: "/blog", label: "Blog", isActive: (pathname) => pathname.startsWith("/blog") },
  { to: "/about", label: "About", isActive: (pathname) => pathname === "/about" },
];

export function SiteHeader({ onOpenSearch }) {
  const { pathname } = useLocation();
  const shortcut = isApplePlatform() ? "⌘ K" : "Ctrl K";

  return (
    <Navbar sticky className="docs-header">
      <Navbar.Brand asChild>
        <Link to="/" aria-label="CodeCPS UI home">
          <BrandLogo />
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
            className="docs-header__search"
            aria-label="Search documentation"
            aria-keyshortcuts="Control+K Meta+K"
            title={`Search (${shortcut})`}
            onClick={onOpenSearch}
          >
            <SearchIcon />
            <span className="docs-header__search-text" aria-hidden="true">
              Search
            </span>
          </button>
          <ThemeToggle />
          <Button asChild size="sm" className="docs-header__cta">
            <Link to="/docs/installation">Get Started</Link>
          </Button>
        </Navbar.Actions>
      </Navbar.Menu>
    </Navbar>
  );
}
