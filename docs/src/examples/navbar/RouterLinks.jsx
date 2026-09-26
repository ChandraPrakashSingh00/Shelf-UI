import { Button, Navbar } from "@codecps/ui";
import { Link, useLocation } from "react-router";

export default function NavbarRouterLinks() {
  const { pathname } = useLocation();

  return (
    <Navbar label="Documentation">
      <Navbar.Brand asChild>
        <Link to="/">CodeCPS UI</Link>
      </Navbar.Brand>
      <Navbar.Menu>
        <Navbar.Links>
          <Navbar.Link asChild active={pathname.startsWith("/components")}>
            <Link to="/components">Components</Link>
          </Navbar.Link>
          <Navbar.Link asChild active={pathname.startsWith("/docs")}>
            <Link to="/docs/installation">Installation</Link>
          </Navbar.Link>
        </Navbar.Links>
        <Navbar.Actions>
          <Button asChild size="sm">
            <Link to="/docs/installation">Get Started</Link>
          </Button>
        </Navbar.Actions>
      </Navbar.Menu>
    </Navbar>
  );
}
