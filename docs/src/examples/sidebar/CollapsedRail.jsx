import { Sidebar } from "shelf-ui-react";

const iconPaths = {
  dashboard: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z",
  orders: "M6 7h12l1 13H5L6 7ZM9 7V6a3 3 0 0 1 6 0v1",
  products: "M21 8 12 3 3 8v8l9 5 9-5V8ZM3 8l9 5 9-5M12 13v8",
  customers:
    "M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 20v-1a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01",
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

export default function SidebarCollapsedRail() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: 380,
        overflow: "hidden",
        border: "1px solid var(--shelf-color-border)",
        borderRadius: "var(--shelf-radius-lg)",
        backgroundColor: "var(--shelf-color-bg)",
      }}
    >
      <Sidebar label="Seller" defaultCollapsed>
        <Sidebar.Header>
          <Sidebar.Toggle />
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Section title="Store">
            <Sidebar.Item href="#dashboard" icon={<Icon name="dashboard" />}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item href="#orders" icon={<Icon name="orders" />} badge={4} active>
              Orders
            </Sidebar.Item>
            <Sidebar.Group label="Products" icon={<Icon name="products" />}>
              <Sidebar.Item href="#products">All products</Sidebar.Item>
              <Sidebar.Item href="#products/new">Add product</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Item href="#customers" icon={<Icon name="customers" />}>
              Customers
            </Sidebar.Item>
          </Sidebar.Section>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Section>
            <Sidebar.Item href="#help" icon={<Icon name="help" />}>
              Help and support
            </Sidebar.Item>
          </Sidebar.Section>
        </Sidebar.Footer>
      </Sidebar>
      <p style={{ flex: 1, margin: 0, padding: 24, color: "var(--shelf-color-text-muted)" }}>
        Hover or focus an icon to see its label. Pressing Products expands the sidebar with the
        group open.
      </p>
    </div>
  );
}
