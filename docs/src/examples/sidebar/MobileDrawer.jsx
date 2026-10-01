import { Button, Drawer, Sidebar } from "@codecps/ui";
import { useState } from "react";

const pages = [
  { href: "#dashboard", label: "Dashboard" },
  { href: "#orders", label: "Orders", badge: 12 },
  { href: "#products", label: "Products" },
  { href: "#customers", label: "Customers" },
  { href: "#reports", label: "Reports" },
];

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export default function SidebarMobileDrawer() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState("#orders");
  const current = pages.find((item) => item.href === page);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 375,
        height: 320,
        overflow: "hidden",
        border: "1px solid var(--cps-color-border)",
        borderRadius: "var(--cps-radius-lg)",
        backgroundColor: "var(--cps-color-bg)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderBottom: "1px solid var(--cps-color-border)",
        }}
      >
        <Button variant="ghost" size="sm" aria-label="Open menu" onClick={() => setOpen(true)}>
          <MenuIcon />
        </Button>
        <strong>ShopKart Admin</strong>
      </div>
      <p style={{ margin: 0, padding: 16 }}>{current.label}</p>

      {/* On phones, show the same sidebar content in a Drawer. */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="left"
        size="sm"
        title="ShopKart Admin"
      >
        <Sidebar label="Admin" width="100%" style={{ border: 0 }}>
          <Sidebar.Content style={{ padding: 0 }}>
            <Sidebar.Section>
              {pages.map((item) => (
                <Sidebar.Item
                  key={item.href}
                  href={item.href}
                  badge={item.badge}
                  active={item.href === page}
                  onClick={() => {
                    setPage(item.href);
                    setOpen(false);
                  }}
                >
                  {item.label}
                </Sidebar.Item>
              ))}
            </Sidebar.Section>
          </Sidebar.Content>
        </Sidebar>
      </Drawer>
    </div>
  );
}
