import { Button, CommandPalette } from "@codecps/ui";
import { useState } from "react";

function Icon({ children }) {
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
      {children}
    </svg>
  );
}

const HomeIcon = () => (
  <Icon>
    <path d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z" />
  </Icon>
);
const BoxIcon = () => (
  <Icon>
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
    <path d="m3 8 9 5 9-5M12 13v8" />
  </Icon>
);
const UsersIcon = () => (
  <Icon>
    <circle cx="9" cy="8" r="4" />
    <path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3" />
  </Icon>
);
const PlusIcon = () => (
  <Icon>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
const RefundIcon = () => (
  <Icon>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
  </Icon>
);
const DownloadIcon = () => (
  <Icon>
    <path d="M12 4v11M7 10l5 5 5-5M4 20h16" />
  </Icon>
);

const commands = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Today's sales, orders and visitors",
    group: "Go to",
    icon: <HomeIcon />,
    shortcut: ["G", "D"],
  },
  {
    id: "orders",
    label: "Orders",
    description: "18 orders waiting to be packed",
    group: "Go to",
    icon: <BoxIcon />,
    shortcut: ["G", "O"],
  },
  {
    id: "customers",
    label: "Customers",
    description: "12,480 customers across India",
    group: "Go to",
    icon: <UsersIcon />,
    shortcut: ["G", "C"],
  },
  {
    id: "new-product",
    label: "Add a product",
    description: "List a new item in your catalogue",
    group: "Actions",
    icon: <PlusIcon />,
    shortcut: ["N"],
  },
  {
    id: "refund",
    label: "Issue a refund",
    description: "Needs the Finance role",
    group: "Actions",
    icon: <RefundIcon />,
    disabled: true,
  },
  {
    id: "gst-report",
    label: "Download GST report",
    description: "GSTR-1 summary for September, as CSV",
    group: "Reports",
    icon: <DownloadIcon />,
    keywords: ["tax", "invoice", "gstr"],
  },
];

const hintStyle = { display: "inline-flex", alignItems: "center", gap: 4 };

export default function CommandPaletteIconsAndShortcuts() {
  const [open, setOpen] = useState(false);
  const [lastCommand, setLastCommand] = useState(null);

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
      <Button onClick={() => setOpen(true)}>Search admin</Button>
      <p style={{ margin: 0, fontSize: 14 }}>
        {lastCommand ? `Opened “${lastCommand}”` : "Try typing “tax” or “packed”."}
      </p>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        hotkey={null}
        label="Admin search"
        placeholder="Search pages and actions…"
        items={commands}
        onSelect={(item) => setLastCommand(item.label)}
        footer={
          <>
            <span style={hintStyle}>↑ ↓ to move</span>
            <span style={hintStyle}>Enter to open</span>
            <span style={hintStyle}>Esc to close</span>
          </>
        }
      />
    </div>
  );
}
