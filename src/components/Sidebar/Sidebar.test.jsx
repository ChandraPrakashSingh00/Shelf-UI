import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, forwardRef, useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
  SidebarToggle,
} from "./Sidebar.jsx";

// jsdom's `:focus-visible` heuristic isn't reliable: treat the focused element as
// focus-visible, so keyboard focus opens tooltips (as in the Tooltip tests).
beforeEach(() => {
  const matches = Element.prototype.matches;
  vi.spyOn(Element.prototype, "matches").mockImplementation(function (selector) {
    if (selector === ":focus-visible") return this === document.activeElement;
    return matches.call(this, selector);
  });
});

const Icon = () => <svg data-testid="icon" />;

function AdminSidebar({ onLogout, ...props }) {
  return (
    <Sidebar label="Admin" {...props}>
      <Sidebar.Header>
        ShopKart
        <Sidebar.Toggle />
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Section title="Store">
          <Sidebar.Item href="#dashboard" icon={<Icon />} active>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="#orders" icon={<Icon />} badge={12}>
            Orders
          </Sidebar.Item>
          <Sidebar.Group label="Products" icon={<Icon />}>
            <Sidebar.Item href="#products">All products</Sidebar.Item>
            <Sidebar.Item href="#products/new">Add product</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar.Section>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Section>
          <Sidebar.Item icon={<Icon />} onClick={onLogout}>
            Log out
          </Sidebar.Item>
        </Sidebar.Section>
      </Sidebar.Footer>
    </Sidebar>
  );
}

const getNav = () => screen.getByRole("navigation");

describe("Sidebar", () => {
  it("renders a navigation landmark named “Sidebar” by default", () => {
    render(
      <Sidebar>
        <Sidebar.Content />
      </Sidebar>,
    );
    expect(screen.getByRole("navigation", { name: "Sidebar" })).toHaveClass("shelf-sidebar");
  });

  it("renders links, a named section group and list items", () => {
    render(<AdminSidebar />);

    expect(screen.getByRole("navigation", { name: "Admin" })).toBeInTheDocument();
    const store = screen.getByRole("group", { name: "Store" });
    expect(within(store).getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "#dashboard",
    );
    expect(within(store).getAllByRole("list")[0]?.tagName).toBe("UL");
  });

  it("renders a section without a title as a plain list", () => {
    render(<AdminSidebar />);
    const footer = getNav().querySelector(".shelf-sidebar__footer");
    const section = footer?.querySelector(".shelf-sidebar__section");
    expect(section).not.toHaveAttribute("role");
    expect(section?.querySelector(".shelf-sidebar__section-title")).toBeNull();
  });

  it("marks the active item as the current page", () => {
    render(<AdminSidebar />);
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /^Orders/ })).not.toHaveAttribute("aria-current");
  });

  it("includes the badge in the item's name, as a count pill for numbers", () => {
    render(<AdminSidebar />);
    const orders = screen.getByRole("link", { name: "Orders 12" });
    expect(orders.querySelector(".shelf-sidebar__badge")).toHaveClass(
      "shelf-sidebar__badge--count",
    );
  });

  it("renders a node badge without the count pill", () => {
    render(
      <Sidebar>
        <Sidebar.Section>
          <Sidebar.Item href="#reports" badge={<em>New</em>}>
            Reports
          </Sidebar.Item>
        </Sidebar.Section>
      </Sidebar>,
    );
    const badge = screen
      .getByRole("link", { name: "Reports New" })
      .querySelector(".shelf-sidebar__badge");
    expect(badge).not.toHaveClass("shelf-sidebar__badge--count");
  });

  it("renders a button for items without href, calling onClick", async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();
    render(<AdminSidebar onLogout={onLogout} />);

    const logout = screen.getByRole("button", { name: "Log out" });
    expect(logout).toHaveAttribute("type", "button");
    await user.click(logout);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("hides icons from assistive technology", () => {
    render(<AdminSidebar />);
    const icon = screen
      .getByRole("link", { name: "Dashboard" })
      .querySelector(".shelf-sidebar__icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("disables button and link items", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Sidebar>
        <Sidebar.Section>
          <Sidebar.Item disabled onClick={onClick}>
            Export
          </Sidebar.Item>
          <Sidebar.Item href="#payouts" disabled onClick={onClick}>
            Payouts
          </Sidebar.Item>
        </Sidebar.Section>
      </Sidebar>,
    );

    expect(screen.getByRole("button", { name: "Export" })).toBeDisabled();
    const payouts = screen.getByRole("link", { name: "Payouts" });
    expect(payouts).not.toHaveAttribute("href");
    expect(payouts).toHaveAttribute("aria-disabled", "true");

    await user.click(payouts);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders router links with asChild, including function className, style and children", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const onItemClick = vi.fn();
    // A stand-in for React Router's NavLink.
    const FakeNavLink = forwardRef(function FakeNavLink(
      { to, className, style, children, ...props },
      ref,
    ) {
      const state = { isActive: to === "#orders" };
      return (
        <a
          {...props}
          ref={ref}
          href={to}
          aria-current={state.isActive ? "page" : undefined}
          className={className(state)}
          style={style(state)}
        >
          {children(state)}
        </a>
      );
    });

    const linkRef = createRef();
    render(
      <Sidebar>
        <Sidebar.Section>
          <Sidebar.Item
            asChild
            icon={<Icon />}
            badge="3"
            onClick={onItemClick}
            style={{ order: 1 }}
          >
            <FakeNavLink
              ref={linkRef}
              to="#orders"
              onClick={onNavigate}
              className={({ isActive }) => (isActive ? "is-active" : "")}
              style={({ isActive }) => ({ fontStyle: isActive ? "italic" : "normal" })}
            >
              {({ isActive }) => (isActive ? "Orders (current)" : "Orders")}
            </FakeNavLink>
          </Sidebar.Item>
        </Sidebar.Section>
      </Sidebar>,
    );

    const link = screen.getByRole("link", { name: "Orders (current) 3" });
    expect(link).toBe(linkRef.current);
    expect(link).toHaveAttribute("href", "#orders");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("shelf-sidebar__item", "is-active");
    expect(link).toHaveStyle({ fontStyle: "italic", order: "1" });
    expect(link.querySelector(".shelf-sidebar__icon")).not.toBeNull();

    await user.click(link);
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });

  it("merges plain asChild children like Slot", () => {
    render(
      <Sidebar>
        <Sidebar.Section>
          <Sidebar.Item asChild active className="item">
            <a href="#customers" className="router-link">
              Customers
            </a>
          </Sidebar.Item>
        </Sidebar.Section>
      </Sidebar>,
    );
    const link = screen.getByRole("link", { name: "Customers" });
    expect(link).toHaveClass("shelf-sidebar__item", "item", "router-link");
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("prevents navigation of a disabled asChild link", () => {
    const onClick = vi.fn();
    render(
      <Sidebar>
        <Sidebar.Section>
          <Sidebar.Item asChild disabled onClick={onClick}>
            <a href="#reports">Reports</a>
          </Sidebar.Item>
        </Sidebar.Section>
      </Sidebar>,
    );
    const link = screen.getByRole("link", { name: "Reports" });
    expect(link).toHaveAttribute("aria-disabled", "true");

    // `fireEvent` returns false when the default action was prevented.
    expect(fireEvent.click(link)).toBe(false);
    expect(onClick).not.toHaveBeenCalled();
  });

  describe("collapsing", () => {
    it("toggles between expanded and collapsed with Sidebar.Toggle", async () => {
      const user = userEvent.setup();
      const onCollapsedChange = vi.fn();
      render(<AdminSidebar onCollapsedChange={onCollapsedChange} />);

      const nav = getNav();
      const toggle = screen.getByRole("button", { name: "Collapse sidebar" });
      expect(nav).toHaveAttribute("data-state", "expanded");
      expect(toggle).toHaveAttribute("aria-expanded", "true");
      expect(toggle).toHaveAttribute("aria-controls", nav.id);

      await user.click(toggle);
      expect(onCollapsedChange).toHaveBeenLastCalledWith(true);
      expect(nav).toHaveAttribute("data-state", "collapsed");
      expect(nav).toHaveClass("shelf-sidebar--collapsed");
      expect(toggle).toHaveAccessibleName("Expand sidebar");
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      expect(toggle).toHaveFocus();

      await user.click(toggle);
      expect(onCollapsedChange).toHaveBeenLastCalledWith(false);
      expect(nav).toHaveAttribute("data-state", "expanded");
    });

    it("uses custom toggle labels and icon", () => {
      render(
        <Sidebar defaultCollapsed>
          <Sidebar.Toggle collapseLabel="Hide menu" expandLabel="Show menu">
            <span data-testid="custom-icon" />
          </Sidebar.Toggle>
        </Sidebar>,
      );
      expect(screen.getByRole("button", { name: "Show menu" })).toBeInTheDocument();
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("keeps the labels as accessible names while collapsed", () => {
      render(<AdminSidebar defaultCollapsed />);
      expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
      expect(screen.getByRole("group", { name: "Store" })).toBeInTheDocument();
    });

    it("supports a controlled collapsed state", async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [collapsed, setCollapsed] = useState(true);
        return (
          <>
            <button onClick={() => setCollapsed(false)}>Open menu</button>
            <AdminSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
          </>
        );
      }
      render(<Controlled />);
      expect(getNav()).toHaveAttribute("data-state", "collapsed");

      await user.click(screen.getByRole("button", { name: "Open menu" }));
      expect(getNav()).toHaveAttribute("data-state", "expanded");

      await user.click(screen.getByRole("button", { name: "Collapse sidebar" }));
      expect(getNav()).toHaveAttribute("data-state", "collapsed");
    });

    it("stays collapsed when controlled without an onCollapsedChange that updates it", async () => {
      const user = userEvent.setup();
      render(<AdminSidebar collapsed onCollapsedChange={vi.fn()} />);
      await user.click(screen.getByRole("button", { name: "Expand sidebar" }));
      expect(getNav()).toHaveAttribute("data-state", "collapsed");
    });

    it("shows an item's label in a tooltip on keyboard focus only while collapsed", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<AdminSidebar />);

      act(() => screen.getByRole("link", { name: "Dashboard" }).focus());
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

      rerender(<AdminSidebar collapsed />);
      await user.tab();
      await user.tab({ shift: true });
      const dashboard = screen.getByRole("link", { name: "Dashboard" });
      expect(dashboard).toHaveFocus();
      expect(screen.getByRole("tooltip")).toHaveTextContent("Dashboard");
      // The tooltip repeats the name, so it isn't read again as the description.
      expect(dashboard).toHaveAccessibleName("Dashboard");
      expect(dashboard).toHaveAccessibleDescription("");

      await user.keyboard("{Escape}");
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("uses the tooltip prop as the tooltip content", () => {
      render(
        <Sidebar collapsed>
          <Sidebar.Section>
            <Sidebar.Item href="#orders" icon={<Icon />} tooltip="Orders (12 new)">
              Orders
            </Sidebar.Item>
          </Sidebar.Section>
        </Sidebar>,
      );
      const orders = screen.getByRole("link", { name: "Orders" });
      act(() => orders.focus());
      expect(screen.getByRole("tooltip")).toHaveTextContent("Orders (12 new)");
      expect(orders).toHaveAccessibleDescription("Orders (12 new)");
    });

    it("sets the widths as CSS variables, in pixels for numbers", () => {
      render(<Sidebar width={280} collapsedWidth="5rem" style={{ height: 400 }} />);
      const nav = getNav();
      expect(nav.style.getPropertyValue("--shelf-sidebar-width")).toBe("280px");
      expect(nav.style.getPropertyValue("--shelf-sidebar-collapsed-width")).toBe("5rem");
      expect(nav).toHaveStyle({ height: "400px" });
    });
  });

  describe("groups", () => {
    it("expands and collapses nested items as a disclosure", async () => {
      const user = userEvent.setup();
      render(<AdminSidebar />);

      const products = screen.getByRole("button", { name: "Products" });
      const list = document.getElementById(products.getAttribute("aria-controls") ?? "");
      expect(products).toHaveAttribute("aria-expanded", "false");
      expect(list).not.toBeVisible();
      expect(screen.queryByRole("link", { name: "All products" })).not.toBeInTheDocument();

      await user.click(products);
      expect(products).toHaveAttribute("aria-expanded", "true");
      expect(list).toBeVisible();
      expect(screen.getByRole("link", { name: "All products" })).toBeInTheDocument();

      await user.keyboard("{Enter}");
      expect(products).toHaveAttribute("aria-expanded", "false");
    });

    it("opens by default with defaultOpen and supports a controlled open state", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const { rerender } = render(
        <Sidebar>
          <Sidebar.Section>
            <Sidebar.Group label="Reports" defaultOpen onOpenChange={onOpenChange}>
              <Sidebar.Item href="#sales">Sales</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Section>
        </Sidebar>,
      );
      expect(screen.getByRole("link", { name: "Sales" })).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Reports" }));
      expect(onOpenChange).toHaveBeenLastCalledWith(false);

      rerender(
        <Sidebar>
          <Sidebar.Section>
            <Sidebar.Group label="Reports" open onOpenChange={onOpenChange}>
              <Sidebar.Item href="#sales">Sales</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Section>
        </Sidebar>,
      );
      await user.click(screen.getByRole("button", { name: "Reports" }));
      expect(screen.getByRole("button", { name: "Reports" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("hides nested items while collapsed, and expands the sidebar with the group open when pressed", async () => {
      const user = userEvent.setup();
      render(<AdminSidebar defaultCollapsed />);

      const products = screen.getByRole("button", { name: "Products" });
      expect(products).toHaveAttribute("aria-expanded", "false");

      await user.click(products);
      expect(getNav()).toHaveAttribute("data-state", "expanded");
      expect(products).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByRole("link", { name: "All products" })).toBeVisible();
    });

    it("can be disabled", () => {
      render(
        <Sidebar>
          <Sidebar.Section>
            <Sidebar.Group label="Marketing" disabled>
              <Sidebar.Item href="#coupons">Coupons</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Section>
        </Sidebar>,
      );
      expect(screen.getByRole("button", { name: "Marketing" })).toBeDisabled();
    });
  });

  it("moves through the items with Tab, skipping closed groups' items", async () => {
    const user = userEvent.setup();
    render(<AdminSidebar />);

    await user.tab();
    expect(screen.getByRole("button", { name: "Collapse sidebar" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "Orders 12" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Products" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Log out" })).toHaveFocus();
  });

  it("forwards refs and props to each part", () => {
    const refs = {
      root: createRef(),
      header: createRef(),
      content: createRef(),
      section: createRef(),
      item: createRef(),
      group: createRef(),
      footer: createRef(),
      toggle: createRef(),
    };
    render(
      <Sidebar ref={refs.root} className="app-sidebar" id="main-sidebar" data-testid="root">
        <SidebarHeader ref={refs.header} className="brand">
          <SidebarToggle ref={refs.toggle} className="toggle" />
        </SidebarHeader>
        <SidebarContent ref={refs.content} data-testid="content">
          <SidebarSection ref={refs.section} title="Store" className="section">
            <SidebarItem ref={refs.item} href="#orders" className="orders" data-id="orders">
              Orders
            </SidebarItem>
            <SidebarGroup ref={refs.group} label="Products" className="group" />
          </SidebarSection>
        </SidebarContent>
        <SidebarFooter ref={refs.footer} className="footer" />
      </Sidebar>,
    );

    const nav = screen.getByRole("navigation");
    expect(refs.root.current).toBe(nav);
    expect(nav).toHaveAttribute("id", "main-sidebar");
    expect(nav).toHaveClass("shelf-sidebar", "app-sidebar");
    expect(screen.getByRole("button", { name: "Collapse sidebar" })).toHaveAttribute(
      "aria-controls",
      "main-sidebar",
    );
    expect(refs.header.current).toHaveClass("shelf-sidebar__header", "brand");
    expect(refs.content.current).toHaveClass("shelf-sidebar__content");
    expect(refs.section.current).toHaveClass("shelf-sidebar__section", "section");
    expect(refs.item.current).toBe(screen.getByRole("link", { name: "Orders" }));
    expect(refs.item.current).toHaveClass("shelf-sidebar__item", "orders");
    expect(refs.item.current).toHaveAttribute("data-id", "orders");
    expect(refs.group.current?.tagName).toBe("LI");
    expect(refs.group.current).toHaveClass("shelf-sidebar__group", "group");
    expect(refs.footer.current).toHaveClass("shelf-sidebar__footer", "footer");
    expect(refs.toggle.current).toHaveClass("shelf-sidebar__toggle", "toggle");
  });

  it("exposes the parts on Sidebar", () => {
    expect(Sidebar.Header).toBe(SidebarHeader);
    expect(Sidebar.Content).toBe(SidebarContent);
    expect(Sidebar.Section).toBe(SidebarSection);
    expect(Sidebar.Item).toBe(SidebarItem);
    expect(Sidebar.Group).toBe(SidebarGroup);
    expect(Sidebar.Footer).toBe(SidebarFooter);
    expect(Sidebar.Toggle).toBe(SidebarToggle);
  });

  it("throws a helpful error when a part is used outside Sidebar", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<SidebarToggle />)).toThrow(
      "<Sidebar.Toggle> must be rendered inside <Sidebar>.",
    );
    expect(() =>
      render(
        <ul>
          <SidebarItem href="#">Orders</SidebarItem>
        </ul>,
      ),
    ).toThrow("<Sidebar.Item> must be rendered inside <Sidebar>.");
  });
});
