import { Button, Drawer } from "shelf-ui-react";
import { useState } from "react";

const links = [
  { href: "#overview", label: "Overview" },
  { href: "#projects", label: "Projects" },
  { href: "#deployments", label: "Deployments" },
  { href: "#team", label: "Team" },
  { href: "#billing", label: "Billing" },
  { href: "#settings", label: "Settings" },
];

export default function DrawerNavigation() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("#projects");

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open menu
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="left"
        size="sm"
        title="Acme"
        description="Priya Sharma · Pro plan"
      >
        <nav aria-label="Main">
          <ul style={{ display: "grid", gap: 4, margin: 0, padding: 0, listStyle: "none" }}>
            {links.map((link) => {
              const isCurrent = link.href === current;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={() => {
                      setCurrent(link.href);
                      setOpen(false);
                    }}
                    style={{
                      display: "block",
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: isCurrent ? "var(--shelf-color-primary-subtle)" : "transparent",
                      color: isCurrent
                        ? "var(--shelf-color-primary-text)"
                        : "var(--shelf-color-text)",
                      fontWeight: 500,
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </Drawer>
    </>
  );
}
