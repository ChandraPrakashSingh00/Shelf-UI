import { Avatar, Sidebar } from "@codecps/ui";
import { useState } from "react";

const iconPaths = {
  dashboard: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z",
  orders: "M6 7h12l1 13H5L6 7ZM9 7V6a3 3 0 0 1 6 0v1",
  products: "M21 8 12 3 3 8v8l9 5 9-5V8ZM3 8l9 5 9-5M12 13v8",
  customers:
    "M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 20v-1a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  reports: "M3 3v18h18M8 17v-5M13 17V8M18 17v-9",
  settings: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
};

function Icon({ name }) {
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
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

const pageTitles = {
  "#dashboard": "Dashboard",
  "#orders": "Orders",
  "#products": "All products",
  "#products/new": "Add product",
  "#categories": "Categories",
  "#customers": "Customers",
  "#reports": "Reports",
  "#settings": "Settings",
};

const highlights = ["Today's sales: ₹48,250", "12 new orders", "3 products low on stock"];

export default function SidebarAdminLayout() {
  const [page, setPage] = useState("#dashboard");
  const [collapsed, setCollapsed] = useState(false);

  // Marks the current page and switches to it on click (a router does this for you).
  const link = (href) => ({ href, active: page === href, onClick: () => setPage(href) });

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: 560,
        overflow: "hidden",
        border: "1px solid var(--cps-color-border)",
        borderRadius: "var(--cps-radius-lg)",
        backgroundColor: "var(--cps-color-bg)",
      }}
    >
      <Sidebar label="Admin" collapsed={collapsed} onCollapsedChange={setCollapsed}>
        <Sidebar.Header>
          <span
            aria-hidden="true"
            style={{
              display: "grid",
              flexShrink: 0,
              placeItems: "center",
              width: 32,
              height: 32,
              borderRadius: "var(--cps-radius-md)",
              backgroundColor: "var(--cps-color-primary)",
              color: "var(--cps-color-on-primary)",
            }}
          >
            S
          </span>
          {/* The rail has no room for the name: show it only while expanded. */}
          {!collapsed && <span>ShopKart Admin</span>}
          <Sidebar.Toggle />
        </Sidebar.Header>

        <Sidebar.Content>
          <Sidebar.Section title="Store">
            <Sidebar.Item icon={<Icon name="dashboard" />} {...link("#dashboard")}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item icon={<Icon name="orders" />} badge={12} {...link("#orders")}>
              Orders
            </Sidebar.Item>
            <Sidebar.Group icon={<Icon name="products" />} label="Products" defaultOpen>
              <Sidebar.Item {...link("#products")}>All products</Sidebar.Item>
              <Sidebar.Item {...link("#products/new")}>Add product</Sidebar.Item>
              <Sidebar.Item {...link("#categories")}>Categories</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Item icon={<Icon name="customers" />} {...link("#customers")}>
              Customers
            </Sidebar.Item>
          </Sidebar.Section>
          <Sidebar.Section title="Business">
            <Sidebar.Item icon={<Icon name="reports" />} {...link("#reports")}>
              Reports
            </Sidebar.Item>
            <Sidebar.Item icon={<Icon name="settings" />} {...link("#settings")}>
              Settings
            </Sidebar.Item>
          </Sidebar.Section>
        </Sidebar.Content>

        <Sidebar.Footer>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            {/* Named only in the rail, where the name next to it is hidden. */}
            <Avatar name="Aarti Verma" alt={collapsed ? undefined : ""} size="sm" />
            {!collapsed && (
              <div style={{ display: "grid", minWidth: 0, lineHeight: 1.3 }}>
                <strong>Aarti Verma</strong>
                <small style={{ color: "var(--cps-color-text-muted)" }}>Store owner, Mumbai</small>
              </div>
            )}
          </div>
        </Sidebar.Footer>
      </Sidebar>

      <div style={{ flex: 1, minWidth: 0, padding: 24, overflowY: "auto" }}>
        <p style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 600 }}>{pageTitles[page]}</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(9rem, 1fr))",
            gap: 12,
          }}
        >
          {highlights.map((text) => (
            <div
              key={text}
              style={{
                padding: 16,
                border: "1px solid var(--cps-color-border)",
                borderRadius: "var(--cps-radius-md)",
                color: "var(--cps-color-text-muted)",
              }}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
