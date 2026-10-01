import { Sidebar } from "@codecps/ui";
import { NavLink } from "react-router";

const pages = [
  { to: "/components/sidebar", label: "Sidebar" },
  { to: "/components/navbar", label: "Navbar" },
  { to: "/components/breadcrumb", label: "Breadcrumb" },
  { to: "/components/pagination", label: "Pagination" },
];

export default function SidebarRouterLinks() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: 280,
        overflow: "hidden",
        border: "1px solid var(--cps-color-border)",
        borderRadius: "var(--cps-radius-lg)",
        backgroundColor: "var(--cps-color-bg)",
      }}
    >
      <Sidebar label="Navigation components" width="14rem">
        <Sidebar.Content>
          <Sidebar.Section title="Navigation">
            {pages.map((page) => (
              // NavLink sets aria-current="page" on the active link by itself.
              <Sidebar.Item key={page.to} asChild>
                <NavLink to={page.to} end>
                  {page.label}
                </NavLink>
              </Sidebar.Item>
            ))}
          </Sidebar.Section>
        </Sidebar.Content>
      </Sidebar>
      <p style={{ flex: 1, margin: 0, padding: 24, color: "var(--cps-color-text-muted)" }}>
        These links are real: they navigate these docs.
      </p>
    </div>
  );
}
