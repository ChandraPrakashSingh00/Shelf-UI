import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb.jsx";

function renderTrail(props = {}) {
  return render(
    <Breadcrumb {...props}>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="/projects">Projects</Breadcrumb.Item>
      <Breadcrumb.Item current>storefront-web</Breadcrumb.Item>
    </Breadcrumb>,
  );
}

const listChildren = (container) =>
  Array.from(container.querySelector("ol").children, (child) => child.className);

describe("Breadcrumb", () => {
  it("renders a labelled navigation landmark with an ordered list of items", () => {
    renderTrail();

    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav).toHaveClass("shelf-breadcrumb");
    const list = within(nav).getByRole("list");
    expect(list.tagName).toBe("OL");
    // Separators are hidden from assistive technology, so only the 3 items count.
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
  });

  it("links to each level and marks the current page, which is not a link", () => {
    renderTrail();

    const home = screen.getByRole("link", { name: "Home" });
    expect(home).toHaveAttribute("href", "/");
    expect(home).toHaveClass("shelf-breadcrumb__link");
    expect(home).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/projects");

    const current = screen.getByText("storefront-web");
    expect(current.tagName).toBe("SPAN");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveClass("shelf-breadcrumb__current");
    expect(screen.queryByRole("link", { name: "storefront-web" })).not.toBeInTheDocument();
  });

  it("puts a decorative separator between items only", () => {
    const { container } = renderTrail();

    expect(listChildren(container)).toEqual([
      "shelf-breadcrumb__item",
      "shelf-breadcrumb__separator",
      "shelf-breadcrumb__item",
      "shelf-breadcrumb__separator",
      "shelf-breadcrumb__item",
    ]);
    for (const separator of container.querySelectorAll(".shelf-breadcrumb__separator")) {
      expect(separator.tagName).toBe("LI");
      expect(separator).toHaveAttribute("aria-hidden", "true");
      expect(separator.querySelector("svg")).toBeInTheDocument();
    }
  });

  it("renders a custom separator", () => {
    const { container } = renderTrail({ separator: "/" });
    const separators = container.querySelectorAll(".shelf-breadcrumb__separator");
    expect(separators).toHaveLength(2);
    for (const separator of separators) expect(separator).toHaveTextContent("/");
  });

  it("ignores children that aren't elements", () => {
    const { container } = render(
      <Breadcrumb>
        {"Stray text"}
        {null}
        {false}
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>{" "}
        <Breadcrumb.Item current>Settings</Breadcrumb.Item>
      </Breadcrumb>,
    );

    expect(listChildren(container)).toEqual([
      "shelf-breadcrumb__item",
      "shelf-breadcrumb__separator",
      "shelf-breadcrumb__item",
    ]);
    expect(screen.getByRole("navigation")).not.toHaveTextContent("Stray text");
  });

  it("lets keyboard users Tab through the links but not the current page", async () => {
    const user = userEvent.setup();
    renderTrail();

    await user.tab();
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "Projects" })).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it("renders router links through asChild, merging classes and handlers", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn((event) => event.preventDefault());
    const onItemClick = vi.fn();
    function RouterLink({ to, ...props }) {
      return <a href={to} {...props} />;
    }

    render(
      <Breadcrumb>
        <Breadcrumb.Item asChild onClick={onItemClick}>
          <RouterLink to="/projects" className="router-link" onClick={onNavigate}>
            Projects
          </RouterLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item asChild current>
          <RouterLink to="/projects/storefront-web">storefront-web</RouterLink>
        </Breadcrumb.Item>
      </Breadcrumb>,
    );

    const link = screen.getByRole("link", { name: "Projects" });
    expect(link).toHaveAttribute("href", "/projects");
    expect(link).toHaveClass("shelf-breadcrumb__link", "router-link");
    expect(link).not.toHaveAttribute("aria-current");
    expect(link.parentElement).toHaveClass("shelf-breadcrumb__item");

    await user.click(link);
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onItemClick).toHaveBeenCalledTimes(1);

    const current = screen.getByRole("link", { name: "storefront-web" });
    expect(current).toHaveAttribute("href", "/projects/storefront-web");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveClass("shelf-breadcrumb__current");
  });

  it("uses label as the landmark's accessible name", () => {
    renderTrail({ label: "Project location" });
    expect(screen.getByRole("navigation", { name: "Project location" })).toBeInTheDocument();
  });

  it("forwards refs, merges className and passes other props", () => {
    const navRef = createRef();
    const linkRef = createRef();
    const currentRef = createRef();
    render(
      <Breadcrumb ref={navRef} className="trail" data-testid="trail">
        <BreadcrumbItem ref={linkRef} href="/" className="home-link" title="Acme home">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem ref={currentRef} current href="/settings" className="here">
          Settings
        </BreadcrumbItem>
      </Breadcrumb>,
    );

    expect(navRef.current).toBe(screen.getByRole("navigation"));
    expect(navRef.current).toHaveClass("shelf-breadcrumb", "trail");
    expect(navRef.current).toHaveAttribute("data-testid", "trail");

    expect(linkRef.current).toBe(screen.getByRole("link", { name: "Home" }));
    expect(linkRef.current).toHaveClass("shelf-breadcrumb__link", "home-link");
    expect(linkRef.current).toHaveAttribute("title", "Acme home");

    expect(currentRef.current).toBe(screen.getByText("Settings"));
    expect(currentRef.current).toHaveClass("shelf-breadcrumb__current", "here");
    expect(currentRef.current).not.toHaveAttribute("href");
    expect(Breadcrumb.Item).toBe(BreadcrumbItem);
  });
});
