import { Sidebar } from "@codecps/ui";
import { definePlayground } from "../../components/LivePlayground.jsx";
import AdminLayout from "../../examples/sidebar/AdminLayout.jsx";
import adminLayoutCode from "../../examples/sidebar/AdminLayout.jsx?raw";
import CollapsedRail from "../../examples/sidebar/CollapsedRail.jsx";
import collapsedRailCode from "../../examples/sidebar/CollapsedRail.jsx?raw";
import MobileDrawer from "../../examples/sidebar/MobileDrawer.jsx";
import mobileDrawerCode from "../../examples/sidebar/MobileDrawer.jsx?raw";
import RouterLinks from "../../examples/sidebar/RouterLinks.jsx";
import routerLinksCode from "../../examples/sidebar/RouterLinks.jsx?raw";

const widths = ["14rem", "16rem", "18rem"];

function Glyph({ d }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const glyphs = {
  dashboard: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z",
  orders: "M6 7h12l1 13H5L6 7ZM9 7V6a3 3 0 0 1 6 0v1",
  products: "M21 8 12 3 3 8v8l9 5 9-5V8ZM3 8l9 5 9-5M12 13v8",
  customers: "M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
};

const frameStyle = {
  display: "flex",
  width: "100%",
  overflow: "hidden",
  border: "1px solid var(--cps-color-border)",
  borderRadius: "var(--cps-radius-lg)",
  backgroundColor: "var(--cps-color-bg)",
};

const compactItem = { minHeight: 28, paddingBlock: 4 };

function SidebarThumbnail() {
  return (
    <div style={{ ...frameStyle, maxWidth: 280, height: 120 }}>
      <Sidebar label="Preview" width="9.5rem">
        <Sidebar.Content style={{ padding: 6, gap: 4 }}>
          <Sidebar.Section>
            <Sidebar.Item
              href="#dashboard"
              icon={<Glyph d={glyphs.dashboard} />}
              active
              style={compactItem}
            >
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item
              href="#orders"
              icon={<Glyph d={glyphs.orders} />}
              badge={12}
              style={compactItem}
            >
              Orders
            </Sidebar.Item>
            <Sidebar.Item href="#products" icon={<Glyph d={glyphs.products} />} style={compactItem}>
              Products
            </Sidebar.Item>
          </Sidebar.Section>
        </Sidebar.Content>
      </Sidebar>
      <div style={{ display: "grid", flex: 1, alignContent: "start", gap: 6, padding: 10 }}>
        {[70, 100, 85].map((width) => (
          <span
            key={width}
            style={{
              width: `${width}%`,
              height: 8,
              borderRadius: "var(--cps-radius-full)",
              backgroundColor: "var(--cps-color-surface-hover)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PlaygroundSidebar(values) {
  return (
    <div style={{ ...frameStyle, height: 400 }}>
      {/* Remounts when the control changes, so the toggle keeps working inside. */}
      <Sidebar
        key={String(values.defaultCollapsed)}
        label="Admin"
        defaultCollapsed={values.defaultCollapsed}
        width={values.width}
      >
        <Sidebar.Header>
          <Sidebar.Toggle />
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Section title={values.sectionTitles ? "Store" : undefined}>
            <Sidebar.Item href="#dashboard" icon={<Glyph d={glyphs.dashboard} />} active>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item
              href="#orders"
              icon={<Glyph d={glyphs.orders} />}
              badge={values.badges ? 12 : undefined}
            >
              Orders
            </Sidebar.Item>
            <Sidebar.Group label="Products" icon={<Glyph d={glyphs.products} />}>
              <Sidebar.Item href="#products">All products</Sidebar.Item>
              <Sidebar.Item href="#products/new">Add product</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Section>
          <Sidebar.Section title={values.sectionTitles ? "People" : undefined}>
            <Sidebar.Item href="#customers" icon={<Glyph d={glyphs.customers} />}>
              Customers
            </Sidebar.Item>
          </Sidebar.Section>
        </Sidebar.Content>
      </Sidebar>
      <p style={{ flex: 1, margin: 0, padding: 24, color: "var(--cps-color-text-muted)" }}>
        Page content
      </p>
    </div>
  );
}

function playgroundCode(values) {
  const rootProps = ['label="Admin"'];
  if (values.defaultCollapsed) rootProps.push("defaultCollapsed");
  if (values.width !== "16rem") rootProps.push(`width="${values.width}"`);
  const title = (text) => (values.sectionTitles ? ` title="${text}"` : "");
  const badge = values.badges ? " badge={12}" : "";

  return `import { Sidebar } from "@codecps/ui";

<Sidebar ${rootProps.join(" ")}>
  <Sidebar.Header>
    <Sidebar.Toggle />
  </Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Section${title("Store")}>
      <Sidebar.Item href="/dashboard" icon={<DashboardIcon />} active>
        Dashboard
      </Sidebar.Item>
      <Sidebar.Item href="/orders" icon={<OrdersIcon />}${badge}>
        Orders
      </Sidebar.Item>
      <Sidebar.Group label="Products" icon={<BoxIcon />}>
        <Sidebar.Item href="/products">All products</Sidebar.Item>
        <Sidebar.Item href="/products/new">Add product</Sidebar.Item>
      </Sidebar.Group>
    </Sidebar.Section>
    <Sidebar.Section${title("People")}>
      <Sidebar.Item href="/customers" icon={<UsersIcon />}>
        Customers
      </Sidebar.Item>
    </Sidebar.Section>
  </Sidebar.Content>
</Sidebar>`;
}

export const sidebarDoc = {
  slug: "sidebar",
  name: "Sidebar",
  category: "Navigation",
  summary: "Collapsible side navigation for dashboards and admin panels.",
  description:
    "The side menu of a dashboard or admin panel: sections of links with icons and counts, expandable groups, and a toggle that collapses it to an icon rail. It fills the height of its container and scrolls on its own. On phones, put the same content in a `Drawer`.",
  keywords: [
    "side nav",
    "sidenav",
    "navigation",
    "menu",
    "admin",
    "dashboard",
    "drawer",
    "rail",
    "collapsible",
    "app shell",
  ],
  imports: ["Sidebar"],
  Thumbnail: SidebarThumbnail,
  Playground: definePlayground({
    defaults: {
      defaultCollapsed: false,
      width: "16rem",
      sectionTitles: true,
      badges: true,
    },
    controls: {
      defaultCollapsed: { type: "boolean", label: "Collapsed" },
      width: { type: "select", label: "Width", options: widths },
      sectionTitles: { type: "boolean", label: "Section titles" },
      badges: { type: "boolean", label: "Badges" },
    },
    render: (values) => <PlaygroundSidebar {...values} />,
    code: playgroundCode,
  }),
  examples: [
    {
      id: "admin-layout",
      title: "Admin dashboard",
      description:
        "A full layout: brand and toggle in `Sidebar.Header`, sections of items with icons and a count badge, an expandable Products group, and the signed-in user in `Sidebar.Footer`. The collapsed state is controlled here, so the header and footer can hide their text in the rail.",
      Component: AdminLayout,
      code: adminLayoutCode,
    },
    {
      id: "collapsed-rail",
      title: "Collapsed rail",
      description:
        "`defaultCollapsed` starts as an icon rail. Labels stay the accessible names and show in a tooltip on hover or keyboard focus. Groups show their icon; pressing one expands the sidebar with the group open.",
      Component: CollapsedRail,
      code: collapsedRailCode,
    },
    {
      id: "router-links",
      title: "With React Router",
      description:
        "`asChild` renders your router's `NavLink` with the item's styling, icon and badge. `NavLink` marks the current page itself, so `active` isn't needed.",
      Component: RouterLinks,
      code: routerLinksCode,
    },
    {
      id: "mobile-drawer",
      title: "Mobile drawer",
      description:
        'On small screens, open the same items in a `Drawer` with `side="left"` from a menu button, and close it when an item is chosen.',
      Component: MobileDrawer,
      code: mobileDrawerCode,
    },
  ],
  api: [
    {
      title: "Sidebar",
      description:
        'Renders a `<nav>` with `data-state="expanded"` or `"collapsed"` for your own styles. Other props and the `ref` go to it. Also exported parts: `SidebarHeader`, `SidebarContent`, `SidebarSection`, `SidebarItem`, `SidebarGroup`, `SidebarFooter`, `SidebarToggle`.',
      props: [
        {
          name: "label",
          type: "string",
          default: '"Sidebar"',
          description: "Accessible name of the `<nav>` landmark, like “Admin”.",
        },
        {
          name: "collapsed",
          type: "boolean",
          description: "Whether it is collapsed to an icon rail (controlled).",
        },
        {
          name: "defaultCollapsed",
          type: "boolean",
          default: "false",
          description: "Initial collapsed state (uncontrolled).",
        },
        {
          name: "onCollapsedChange",
          type: "function(collapsed)",
          description: "Called when `Sidebar.Toggle` (or a group in the rail) changes the state.",
        },
        {
          name: "width",
          type: "string | number",
          default: '"16rem"',
          description: "Width while expanded: a CSS length, or a number of pixels.",
        },
        {
          name: "collapsedWidth",
          type: "string | number",
          default: '"4rem"',
          description: "Width of the icon rail.",
        },
      ],
    },
    {
      title: "Sidebar.Header, Sidebar.Content, Sidebar.Footer",
      description:
        "Layout areas, each a `<div>`: the header for the brand and the toggle, the scrolling content for sections, and the footer for the user or settings. While collapsed, the header and footer stack their children in the middle of the rail.",
      props: [{ name: "children", type: "node", description: "The area's content." }],
    },
    {
      title: "Sidebar.Section",
      description: "A list of items with an optional heading. Other props go to its `<div>`.",
      props: [
        {
          name: "title",
          type: "node",
          description:
            "Visible heading; the section becomes a group named by it. Visually hidden while collapsed.",
        },
        {
          name: "children",
          type: "node",
          description: "`Sidebar.Item` and `Sidebar.Group` elements.",
        },
      ],
    },
    {
      title: "Sidebar.Item",
      description:
        "Renders `<li>` with an `<a>` (with `href`), the child element (with `asChild`) or a `<button>`. Other props and the `ref` go to that element.",
      props: [
        {
          name: "children",
          type: "node",
          description: "The label. While collapsed, it is visually hidden and shown in a tooltip.",
        },
        {
          name: "icon",
          type: "node",
          description: "Decorative icon. Top-level items need one: it's all the rail shows.",
        },
        { name: "href", type: "string", description: "Link target. Without it, a button." },
        {
          name: "active",
          type: "boolean",
          default: "false",
          description: 'Marks the current page (`aria-current="page"`).',
        },
        {
          name: "badge",
          type: "node",
          description:
            "Shown after the label, like a count. Strings and numbers get a pill; in the rail it sits on the icon's corner.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description:
            "Disables a button; a link loses its `href` and gets `aria-disabled`. Clicks do nothing.",
        },
        {
          name: "asChild",
          type: "boolean",
          default: "false",
          description:
            "Renders the child element (e.g. a router `NavLink`) with the item's props, icon and badge. Function `className`, `style` and `children` are supported.",
        },
        {
          name: "tooltip",
          type: "node",
          description: "Tooltip content while collapsed. Defaults to the label.",
        },
        { name: "onClick", type: "function(event)", description: "Called when it is clicked." },
      ],
    },
    {
      title: "Sidebar.Group",
      description:
        "An `<li>` with a disclosure button and a nested list of `Sidebar.Item`s. Other props and the `ref` go to the `<li>`.",
      props: [
        { name: "label", type: "node", required: true, description: "Text of the group's button." },
        { name: "icon", type: "node", description: "Decorative icon before the label." },
        { name: "open", type: "boolean", description: "Whether the group is open (controlled)." },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          description: "Initial state (uncontrolled).",
        },
        {
          name: "onOpenChange",
          type: "function(open)",
          description: "Called when the group opens or closes.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "The group can't be opened.",
        },
      ],
    },
    {
      title: "Sidebar.Toggle",
      description:
        "A `<button>` that collapses and expands the sidebar. Other props and the `ref` go to it.",
      props: [
        {
          name: "collapseLabel",
          type: "string",
          default: '"Collapse sidebar"',
          description: "Accessible name while expanded.",
        },
        {
          name: "expandLabel",
          type: "string",
          default: '"Expand sidebar"',
          description: "Accessible name while collapsed.",
        },
        {
          name: "children",
          type: "node",
          description: "Replaces the default panel icon.",
        },
      ],
    },
  ],
  keyboard: [
    {
      keys: ["Tab", "Shift + Tab"],
      description:
        "Moves through the toggle, items and group buttons in order. Items of closed groups are skipped.",
    },
    {
      keys: ["Enter"],
      description: "Follows the focused link, or presses the focused button.",
    },
    {
      keys: ["Space"],
      description: "Presses the focused button: opens or closes a group, or toggles the sidebar.",
    },
    {
      keys: ["Escape"],
      description: "Hides the tooltip of a focused item in the collapsed rail.",
    },
  ],
  accessibility: [
    "Renders a `<nav>` landmark named by `label`. Give each navigation landmark on a page a distinct name, like “Admin” next to the header's “Main”.",
    'The active item has `aria-current="page"`. React Router\'s `NavLink` sets it itself when used with `asChild`.',
    "Sections with a `title` are groups named by it, so screen readers announce “Store, group” before its items.",
    "`Sidebar.Toggle` and group buttons expose `aria-expanded` and `aria-controls`. Items inside a closed group are hidden from everyone.",
    "In the collapsed rail, labels are only visually hidden, so every item keeps its accessible name; tooltips show them on hover and keyboard focus. Badges stay in the accessible name (“Orders 12”).",
    "Focus rings are drawn inside the items, so the scrolling content never clips them. In forced-colors mode, the current page uses the system highlight colors.",
  ],
};
