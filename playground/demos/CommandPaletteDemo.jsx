import { Button, CommandPalette } from "shelf-ui-react";
import { useState } from "react";

const commands = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Today's sales and orders",
    group: "Go to",
    shortcut: ["G", "D"],
  },
  {
    id: "orders",
    label: "Orders",
    description: "18 waiting to be packed",
    group: "Go to",
    shortcut: ["G", "O"],
    keywords: ["sales", "shipments"],
  },
  { id: "customers", label: "Customers", group: "Go to", keywords: ["buyers", "users"] },
  { id: "new-product", label: "Add a product", group: "Actions", shortcut: ["N"] },
  {
    id: "refund",
    label: "Issue a refund",
    description: "Needs the Finance role",
    group: "Actions",
    disabled: true,
  },
  {
    id: "gst",
    label: "Download GST report",
    description: "GSTR-1 for September",
    group: "Reports",
    keywords: ["tax", "invoice"],
  },
];

export function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState(null);

  return (
    <div className="pg-row">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command palette
      </Button>
      <span className="pg-muted" role="status">
        {last ? `Ran “${last}”` : "Or press Ctrl + K (⌘ K on a Mac)."}
      </span>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={commands}
        onSelect={(item) => setLast(item.label)}
        footer="↑ ↓ to move · Enter to run · Esc to close"
      />
    </div>
  );
}
