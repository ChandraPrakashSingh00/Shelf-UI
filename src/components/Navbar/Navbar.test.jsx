import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../Button/Button.jsx";
import { Navbar } from "./Navbar.jsx";

function renderNavbar(props = {}) {
  const user = userEvent.setup();
  render(
    <Navbar {...props}>
      <Navbar.Brand href="#home">Shelf UI</Navbar.Brand>
      <Navbar.Menu>
        <Navbar.Links>
          <Navbar.Link href="#home" active>
            Home
          </Navbar.Link>
          <Navbar.Link href="#components">Components</Navbar.Link>
          <Navbar.Link href="#docs">Documentation</Navbar.Link>
        </Navbar.Links>
        <Navbar.Actions>
          <Button variant="ghost">Login</Button>
          <Button>Get Started</Button>
        </Navbar.Actions>
      </Navbar.Menu>
    </Navbar>,
  );
  const toggle = screen.getByRole("button", { name: "Toggle navigation" });
  return { user, toggle };
}

const menuState = (toggle) =>
  document.getElementById(toggle.getAttribute("aria-controls") ?? "")?.dataset.state;

describe("Navbar", () => {
  it("renders banner and navigation landmarks with a list of links", () => {
    renderNavbar();

    expect(screen.getByRole("banner")).toHaveClass("shelf-navbar");
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(nav).toContainElement(screen.getByRole("link", { name: "Shelf UI" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("marks the active link as the current page", () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Components" })).not.toHaveAttribute("aria-current");
  });

  it("toggles the mobile menu and reflects it in aria-expanded", async () => {
    const { user, toggle } = renderNavbar();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(menuState(toggle)).toBe("closed");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(menuState(toggle)).toBe("open");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the open menu on Escape and returns focus to the toggle", async () => {
    const { user, toggle } = renderNavbar();
    await user.click(toggle);

    screen.getByRole("link", { name: "Components" }).focus();
    await user.keyboard("{Escape}");

    expect(menuState(toggle)).toBe("closed");
    expect(toggle).toHaveFocus();
  });

  it("closes the open menu on Escape while the toggle has focus", async () => {
    const { user, toggle } = renderNavbar();
    await user.click(toggle);
    expect(toggle).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(menuState(toggle)).toBe("closed");
  });

  it("closes the open menu when the page outside the navbar is pressed", async () => {
    const { user, toggle } = renderNavbar();
    await user.click(toggle);
    expect(menuState(toggle)).toBe("open");

    await user.click(document.body);
    expect(menuState(toggle)).toBe("closed");
  });

  it("closes the menu after a link is chosen", async () => {
    const { user, toggle } = renderNavbar();
    await user.click(toggle);
    await user.click(screen.getByRole("link", { name: "Documentation" }));
    expect(menuState(toggle)).toBe("closed");
  });

  it("renders router links through asChild, merging classes and handlers", async () => {
    const onNavigate = vi.fn();
    function RouterLink({ to, ...props }) {
      return <a href={to} {...props} />;
    }

    const user = userEvent.setup();
    render(
      <Navbar defaultMenuOpen>
        <Navbar.Menu>
          <Navbar.Links>
            <Navbar.Link asChild active>
              <RouterLink to="#docs" className="router-link" onClick={onNavigate}>
                Docs
              </RouterLink>
            </Navbar.Link>
          </Navbar.Links>
        </Navbar.Menu>
      </Navbar>,
    );

    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "#docs");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("shelf-navbar__link", "router-link");

    await user.click(link);
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(menuState(screen.getByRole("button", { name: "Toggle navigation" }))).toBe("closed");
  });

  it("supports a controlled menu, sticky positioning and a custom landmark label", async () => {
    const onMenuOpenChange = vi.fn();
    const { user, toggle } = renderNavbar({
      menuOpen: false,
      onMenuOpenChange,
      sticky: true,
      label: "Documentation",
    });

    expect(screen.getByRole("banner")).toHaveClass("shelf-navbar--sticky");
    expect(screen.getByRole("navigation", { name: "Documentation" })).toBeInTheDocument();

    await user.click(toggle);
    expect(onMenuOpenChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
